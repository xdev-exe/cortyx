import { type User, type InsertUser, type Module, type Field, type Document } from "@shared/schema";
import { randomUUID } from "crypto";
import { executeQuery, executeWriteQuery } from "./neo4j";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User | undefined>;
  
  getModules(): Promise<Module[]>;
  getDocTypeSchema(docTypeName: string): Promise<Field[] | undefined>;
  getDocuments(docTypeName: string, page: number, pageSize: number): Promise<{ data: Document[]; total: number }>;
  getDocument(docTypeName: string, id: string): Promise<Document | undefined>;
  createDocument(docTypeName: string, data: Record<string, any>): Promise<Document | undefined>;
  updateDocument(docTypeName: string, id: string, data: Record<string, any>): Promise<Document | undefined>;
  deleteDocument(docTypeName: string, id: string): Promise<boolean>;
}

export class Neo4jStorage implements IStorage {
  // User management is not fully implemented in this version as it's not the focus.
  // A proper implementation would handle password hashing and sessions.
  
  constructor() {
  }

  async getUser(id: string): Promise<User | undefined> {
    const query = `
      MATCH (u:User {id: $id})
      RETURN u {.*} AS user
    `;
    const results = await executeQuery<{ user: User }>(query, { id });
    return results?.user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const query = `
      MATCH (u:User {username: $username})
      RETURN u {.*} AS user
    `;
    const results = await executeQuery<{ user: User }>(query, { username });
    return results?.user;
  }

  async createUser(insertUser: InsertUser): Promise<User | undefined> {
    const id = randomUUID();
    // NOTE: In a real app, hash the password before storing it.
    const query = `
      CREATE (u:User {id: $id, username: $username, password: $password})
      RETURN u {.*} AS user
    `;
    const results = await executeWriteQuery<{ user: User }>(query, { id, ...insertUser });
    return results?.user;
  }

  async getModules(): Promise<Module[]> {
    const query = `
      MATCH (dt:DocType)
      WHERE dt.module IS NOT NULL
      UNWIND dt.module as moduleName
      WITH moduleName, COLLECT(DISTINCT dt.name) as docTypeNames
      RETURN moduleName, docTypeNames
      ORDER BY moduleName ASC
    `;
    const results = await executeQuery<Module>(query);
    return results;
  }

  async getDocTypeSchema(docTypeName: string): Promise<Field[] | undefined> {
    // First check if the DocType exists
    const doctypeCheckQuery = `
      MATCH (d:DocType {name: $docTypeName})
      RETURN d.name as name
      LIMIT 1
    `;
    
    console.log(`[Storage] Checking if DocType exists: "${docTypeName}"`);
    const doctypeExists = await executeQuery<{ name: string }>(doctypeCheckQuery, { docTypeName });
    
    if (doctypeExists.length === 0) {
      console.log(`[Storage] DocType not found: "${docTypeName}"`);
      return undefined;
    }
    
    // Query DocType and its fields using field_order array for correct sequence
    const query = `
      MATCH (d:DocType {name: $docTypeName})
      UNWIND d.field_order AS ordered_fieldname
      MATCH (d)-[:HAS_FIELD]->(f:Field {fieldname: ordered_fieldname})
      RETURN f.fieldname as fieldname,
             COALESCE(f.label, f.fieldname) as label,
             f.fieldtype as fieldtype,
             f.options as options,
             toInteger(COALESCE(f.reqd, 0)) as reqd,
             toInteger(COALESCE(f.in_list_view, 0)) as in_list_view,
             f.description as description,
             f.default as default,
             toInteger(COALESCE(f.hidden, 0)) as hidden,
             toInteger(COALESCE(f.read_only, 0)) as read_only
    `;
    
    console.log(`[Storage] Fetching fields for DocType: "${docTypeName}"`);
    const results = await executeQuery<Field>(query, { docTypeName });
    
    console.log(`[Storage] Found ${results.length} fields for "${docTypeName}"`);
    
    // Convert Neo4j Integer objects {low: n, high: 0} to JavaScript numbers
    const normalizedResults = results.map(field => ({
      ...field,
      reqd: typeof field.reqd === 'object' && 'low' in field.reqd ? field.reqd.low : field.reqd,
      in_list_view: typeof field.in_list_view === 'object' && 'low' in field.in_list_view ? field.in_list_view.low : field.in_list_view,
      hidden: typeof field.hidden === 'object' && 'low' in field.hidden ? field.hidden.low : field.hidden,
      read_only: typeof field.read_only === 'object' && 'low' in field.read_only ? field.read_only.low : field.read_only,
    }));
    
    // Return empty array if no fields (DocType exists but has no fields yet)
    return normalizedResults;
  }

  async getDocuments(docTypeName: string, page: number = 1, pageSize: number = 20): Promise<{ data: Document[]; total: number }> {
    const offset = (page - 1) * pageSize;
    
    // Escape backticks in the label name for Cypher query
    const escapedLabel = docTypeName.replace(/`/g, '``');
    
    const query = `
      MATCH (doc:\`${escapedLabel}\`)
      RETURN doc { .*, name: COALESCE(doc.name, elementId(doc)) } AS data
      ORDER BY COALESCE(doc.modified, doc.creation, datetime()) DESC
      SKIP toInteger($offset)
      LIMIT toInteger($pageSize)
    `;

    console.log(`[Storage] Querying documents for label: "${docTypeName}"`);
    const results = await executeQuery<{ data: Document }>(query, { offset, pageSize });
    console.log(`[Storage] Found ${results.length} documents`);

    // Count total documents with this label
    const countQuery = `
      MATCH (doc:\`${escapedLabel}\`)
      RETURN count(doc) as total
    `;
    const countResults = await executeQuery<{ total: number | { low: number, high: number } }>(countQuery, {});
    
    let total = 0;
    if (countResults.length > 0) {
        const countResult = countResults[0].total;
        if (typeof countResult === 'number') {
            total = countResult;
        } else if (countResult && typeof countResult === 'object' && 'low' in countResult) {
            total = countResult.low; // Neo4j integers can be large
        }
    }

    console.log(`[Storage] Total count: ${total}`);

    return {
      data: results.map(r => r.data),
      total
    };
  }

  async getDocument(docTypeName: string, id: string): Promise<Document | undefined> {
    // Escape backticks in the label name for Cypher query
    const escapedLabel = docTypeName.replace(/`/g, '``');
    
    const query = `
      MATCH (doc:\`${escapedLabel}\`)
      WHERE doc.name = $id OR elementId(doc) = $id
      RETURN doc { .*, name: COALESCE(doc.name, elementId(doc)) } AS doc
      LIMIT 1
    `;
    
    console.log(`[Storage] Querying document: label="${docTypeName}", id="${id}"`);
    const results = await executeQuery<{ doc: Document }>(query, { id });
    
    if (results.length > 0) {
      console.log(`[Storage] Found document: "${results[0].doc?.name}"`);
      return results[0].doc;
    }
    
    console.log(`[Storage] Document not found`);
    return undefined;
  }

  async createDocument(docTypeName: string, data: Record<string, any>): Promise<Document | undefined> {
    const name = data.name || randomUUID();
    const escapedLabel = docTypeName.replace(/`/g, '``');
    
    const query = `
      CREATE (doc:\`${escapedLabel}\` $props)
      SET doc.creation = datetime(), doc.modified = datetime(), doc.name = $name
      RETURN doc { .*, name: doc.name } AS doc
    `;
    const props = { ...data, name };
    
    console.log(`[Storage] Creating document in "${docTypeName}" with name "${name}"`);
    const results = await executeWriteQuery<{ doc: Document }>(query, { props, name });
    
    if (results.length > 0) {
      console.log(`[Storage] Created document successfully`);
      return results[0].doc;
    }
    
    return undefined;
  }

  async updateDocument(docTypeName: string, id: string, data: Record<string, any>): Promise<Document | undefined> {
    const escapedLabel = docTypeName.replace(/`/g, '``');
    
    const query = `
      MATCH (doc:\`${escapedLabel}\`)
      WHERE doc.name = $id OR elementId(doc) = $id
      SET doc += $data, doc.modified = datetime()
      RETURN doc { .*, name: COALESCE(doc.name, elementId(doc)) } AS doc
      LIMIT 1
    `;
    
    console.log(`[Storage] Updating document: label="${docTypeName}", id="${id}"`);
    const results = await executeWriteQuery<{ doc: Document }>(query, { id, data });
    
    if (results.length > 0) {
      console.log(`[Storage] Updated document successfully`);
      return results[0].doc;
    }
    
    return undefined;
  }

  async deleteDocument(docTypeName: string, id: string): Promise<boolean> {
    const escapedLabel = docTypeName.replace(/`/g, '``');
    
    const query = `
      MATCH (doc:\`${escapedLabel}\`)
      WHERE doc.name = $id OR elementId(doc) = $id
      WITH count(doc) as c
      OPTIONAL MATCH (d:\`${escapedLabel}\`)
      WHERE d.name = $id OR elementId(d) = $id
      DETACH DELETE d
      RETURN c > 0 as deleted
    `;
    
    console.log(`[Storage] Deleting document: label="${docTypeName}", id="${id}"`);
    const results = await executeWriteQuery<{ deleted: boolean }>(query, { id });
    
    const deleted = results.length > 0 ? results[0].deleted : false;
    console.log(`[Storage] Delete ${deleted ? 'successful' : 'failed'}`);
    
    return deleted;
  }
}

export const storage = new Neo4jStorage();
