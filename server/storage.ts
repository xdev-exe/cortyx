import { type User, type InsertUser, type Module, type Field, type Document } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getModules(): Promise<Module[]>;
  getDocTypeSchema(docTypeName: string): Promise<Field[] | undefined>;
  getDocuments(docTypeName: string, page: number, pageSize: number): Promise<{ data: Document[]; total: number }>;
  getDocument(docTypeName: string, id: string): Promise<Document | undefined>;
  createDocument(docTypeName: string, data: Record<string, any>): Promise<Document>;
  updateDocument(docTypeName: string, id: string, data: Record<string, any>): Promise<Document | undefined>;
  deleteDocument(docTypeName: string, id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private modules: Module[];
  private schemas: Map<string, Field[]>;
  private documents: Map<string, Map<string, Document>>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.initializeData();
  }

  private initializeData() {
    this.modules = [
      {
        moduleName: "Accounts",
        docTypeNames: ["Account", "Journal Entry", "Purchase Invoice", "Sales Invoice"]
      },
      {
        moduleName: "CRM",
        docTypeNames: ["Opportunity", "Customer", "Lead"]
      },
      {
        moduleName: "Assets",
        docTypeNames: ["Asset", "Asset Category", "Location"]
      },
      {
        moduleName: "Stock",
        docTypeNames: ["Item", "Warehouse", "Stock Entry", "Delivery Note"]
      }
    ];

    this.schemas = new Map();
    
    this.schemas.set("Opportunity", [
      { fieldname: "opportunity_name", label: "Opportunity Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "customer", label: "Customer", fieldtype: "Link", options: "Customer", reqd: 1, in_list_view: 1 },
      { fieldname: "status", label: "Status", fieldtype: "Select", options: "Open\nProspecting\nClosed Won\nClosed Lost", in_list_view: 1, reqd: 1 },
      { fieldname: "value", label: "Value", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "probability", label: "Probability %", fieldtype: "Int", description: "Likelihood of closing (0-100)" },
      { fieldname: "expected_close_date", label: "Expected Close Date", fieldtype: "Data", description: "Expected closing date" },
      { fieldname: "notes", label: "Notes", fieldtype: "Text Editor", in_list_view: 0 }
    ]);

    this.schemas.set("Customer", [
      { fieldname: "customer_name", label: "Customer Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "email", label: "Email", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "phone", label: "Phone", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "status", label: "Status", fieldtype: "Select", options: "Active\nInactive\nPotential", in_list_view: 1, reqd: 1 },
      { fieldname: "credit_limit", label: "Credit Limit", fieldtype: "Currency" },
      { fieldname: "billing_address", label: "Billing Address", fieldtype: "Text Editor" },
      { fieldname: "is_vip", label: "VIP Customer", fieldtype: "Check" }
    ]);

    this.schemas.set("Lead", [
      { fieldname: "lead_name", label: "Lead Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "email", label: "Email", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "phone", label: "Phone", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "source", label: "Source", fieldtype: "Select", options: "Website\nReferral\nAdvertisement\nCold Call\nTrade Show", in_list_view: 1 },
      { fieldname: "status", label: "Status", fieldtype: "Select", options: "New\nContacted\nQualified\nConverted\nLost", in_list_view: 1, reqd: 1 },
      { fieldname: "company_name", label: "Company Name", fieldtype: "Data" },
      { fieldname: "notes", label: "Notes", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Account", [
      { fieldname: "account_name", label: "Account Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "account_number", label: "Account Number", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "account_type", label: "Account Type", fieldtype: "Select", options: "Asset\nLiability\nEquity\nIncome\nExpense", reqd: 1, in_list_view: 1 },
      { fieldname: "balance", label: "Balance", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "is_active", label: "Active", fieldtype: "Check" },
      { fieldname: "description", label: "Description", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Journal Entry", [
      { fieldname: "entry_number", label: "Entry Number", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "posting_date", label: "Posting Date", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "account", label: "Account", fieldtype: "Link", options: "Account", reqd: 1, in_list_view: 1 },
      { fieldname: "debit", label: "Debit", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "credit", label: "Credit", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "reference", label: "Reference", fieldtype: "Data" },
      { fieldname: "remarks", label: "Remarks", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Purchase Invoice", [
      { fieldname: "invoice_number", label: "Invoice Number", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "supplier_name", label: "Supplier Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "invoice_date", label: "Invoice Date", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "total_amount", label: "Total Amount", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "status", label: "Status", fieldtype: "Select", options: "Draft\nSubmitted\nPaid\nCancelled", reqd: 1, in_list_view: 1 },
      { fieldname: "due_date", label: "Due Date", fieldtype: "Data" },
      { fieldname: "notes", label: "Notes", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Sales Invoice", [
      { fieldname: "invoice_number", label: "Invoice Number", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "customer", label: "Customer", fieldtype: "Link", options: "Customer", reqd: 1, in_list_view: 1 },
      { fieldname: "invoice_date", label: "Invoice Date", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "total_amount", label: "Total Amount", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "status", label: "Status", fieldtype: "Select", options: "Draft\nSubmitted\nPaid\nOverdue\nCancelled", reqd: 1, in_list_view: 1 },
      { fieldname: "due_date", label: "Due Date", fieldtype: "Data" },
      { fieldname: "notes", label: "Notes", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Asset", [
      { fieldname: "asset_name", label: "Asset Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "asset_category", label: "Asset Category", fieldtype: "Link", options: "Asset Category", reqd: 1, in_list_view: 1 },
      { fieldname: "location", label: "Location", fieldtype: "Link", options: "Location", in_list_view: 1 },
      { fieldname: "purchase_date", label: "Purchase Date", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "purchase_value", label: "Purchase Value", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "current_value", label: "Current Value", fieldtype: "Currency" },
      { fieldname: "status", label: "Status", fieldtype: "Select", options: "Active\nIn Maintenance\nRetired\nSold", reqd: 1 },
      { fieldname: "description", label: "Description", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Asset Category", [
      { fieldname: "category_name", label: "Category Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "depreciation_rate", label: "Depreciation Rate %", fieldtype: "Float", in_list_view: 1 },
      { fieldname: "useful_life_years", label: "Useful Life (Years)", fieldtype: "Int", in_list_view: 1 },
      { fieldname: "description", label: "Description", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Location", [
      { fieldname: "location_name", label: "Location Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "address", label: "Address", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "city", label: "City", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "country", label: "Country", fieldtype: "Data", in_list_view: 1 },
      { fieldname: "is_warehouse", label: "Is Warehouse", fieldtype: "Check" },
      { fieldname: "notes", label: "Notes", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Item", [
      { fieldname: "item_name", label: "Item Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "item_code", label: "Item Code", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "stock_uom", label: "Stock UOM", fieldtype: "Select", options: "Nos\nKg\nBox\nPcs\nLitre", reqd: 1, in_list_view: 1 },
      { fieldname: "standard_rate", label: "Standard Rate", fieldtype: "Currency", in_list_view: 1 },
      { fieldname: "is_stock_item", label: "Maintain Stock", fieldtype: "Check" },
      { fieldname: "description", label: "Description", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Warehouse", [
      { fieldname: "warehouse_name", label: "Warehouse Name", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "location", label: "Location", fieldtype: "Link", options: "Location", in_list_view: 1 },
      { fieldname: "warehouse_type", label: "Type", fieldtype: "Select", options: "Storage\nTransit\nRetail\nManufacturing", in_list_view: 1 },
      { fieldname: "capacity", label: "Capacity", fieldtype: "Float" },
      { fieldname: "is_active", label: "Active", fieldtype: "Check" }
    ]);

    this.schemas.set("Stock Entry", [
      { fieldname: "entry_number", label: "Entry Number", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "posting_date", label: "Posting Date", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "item", label: "Item", fieldtype: "Link", options: "Item", reqd: 1, in_list_view: 1 },
      { fieldname: "warehouse", label: "Warehouse", fieldtype: "Link", options: "Warehouse", reqd: 1, in_list_view: 1 },
      { fieldname: "quantity", label: "Quantity", fieldtype: "Float", in_list_view: 1 },
      { fieldname: "entry_type", label: "Entry Type", fieldtype: "Select", options: "Receipt\nIssue\nTransfer\nAdjustment", reqd: 1 },
      { fieldname: "remarks", label: "Remarks", fieldtype: "Text Editor" }
    ]);

    this.schemas.set("Delivery Note", [
      { fieldname: "delivery_number", label: "Delivery Number", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "customer", label: "Customer", fieldtype: "Link", options: "Customer", reqd: 1, in_list_view: 1 },
      { fieldname: "delivery_date", label: "Delivery Date", fieldtype: "Data", reqd: 1, in_list_view: 1 },
      { fieldname: "warehouse", label: "Warehouse", fieldtype: "Link", options: "Warehouse", in_list_view: 1 },
      { fieldname: "status", label: "Status", fieldtype: "Select", options: "Draft\nIn Transit\nDelivered\nReturned", reqd: 1, in_list_view: 1 },
      { fieldname: "notes", label: "Notes", fieldtype: "Text Editor" }
    ]);

    this.initializeSampleDocuments();
  }

  private initializeSampleDocuments() {
    const customers = [
      { name: "CUST-001", customer_name: "Acme Corporation", email: "contact@acme.com", phone: "+1-555-0100", status: "Active", credit_limit: 50000, is_vip: true },
      { name: "CUST-002", customer_name: "TechStart Inc", email: "info@techstart.io", phone: "+1-555-0101", status: "Active", credit_limit: 25000, is_vip: false },
      { name: "CUST-003", customer_name: "Global Systems", email: "sales@globalsys.com", phone: "+1-555-0102", status: "Active", credit_limit: 100000, is_vip: true },
    ];

    const opportunities = [
      { name: "OPP-001", opportunity_name: "Enterprise Software Deal", customer: "CUST-001", status: "Prospecting", value: 150000, probability: 60, expected_close_date: "2025-03-15", notes: "Initial discussions promising" },
      { name: "OPP-002", opportunity_name: "Cloud Migration Project", customer: "CUST-002", status: "Open", value: 75000, probability: 40, expected_close_date: "2025-04-01", notes: "Waiting for budget approval" },
      { name: "OPP-003", opportunity_name: "System Integration", customer: "CUST-003", status: "Closed Won", value: 250000, probability: 100, expected_close_date: "2025-01-20", notes: "Deal closed successfully" },
    ];

    const locations = [
      { name: "LOC-001", location_name: "Main Warehouse", address: "123 Industrial Ave", city: "New York", country: "USA", is_warehouse: true },
      { name: "LOC-002", location_name: "West Coast Facility", address: "456 Pacific Blvd", city: "Los Angeles", country: "USA", is_warehouse: true },
    ];

    const assetCategories = [
      { name: "CAT-001", category_name: "Computer Equipment", depreciation_rate: 20, useful_life_years: 5 },
      { name: "CAT-002", category_name: "Office Furniture", depreciation_rate: 10, useful_life_years: 10 },
      { name: "CAT-003", category_name: "Vehicles", depreciation_rate: 15, useful_life_years: 7 },
    ];

    this.documents.set("Customer", new Map(customers.map(c => [c.name, c])));
    this.documents.set("Opportunity", new Map(opportunities.map(o => [o.name, o])));
    this.documents.set("Location", new Map(locations.map(l => [l.name, l])));
    this.documents.set("Asset Category", new Map(assetCategories.map(a => [a.name, a])));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getModules(): Promise<Module[]> {
    return this.modules;
  }

  async getDocTypeSchema(docTypeName: string): Promise<Field[] | undefined> {
    return this.schemas.get(docTypeName);
  }

  async getDocuments(docTypeName: string, page: number = 1, pageSize: number = 20): Promise<{ data: Document[]; total: number }> {
    const docs = this.documents.get(docTypeName);
    if (!docs) {
      return { data: [], total: 0 };
    }

    const allDocs = Array.from(docs.values());
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      data: allDocs.slice(start, end),
      total: allDocs.length
    };
  }

  async getDocument(docTypeName: string, id: string): Promise<Document | undefined> {
    const docs = this.documents.get(docTypeName);
    return docs?.get(id);
  }

  async createDocument(docTypeName: string, data: Record<string, any>): Promise<Document> {
    if (!this.documents.has(docTypeName)) {
      this.documents.set(docTypeName, new Map());
    }

    const docs = this.documents.get(docTypeName)!;
    const prefix = docTypeName.substring(0, 3).toUpperCase().replace(/\s/g, "");
    const count = docs.size + 1;
    const name = `${prefix}-${String(count).padStart(3, "0")}`;
    
    const document: Document = {
      name,
      ...data
    };

    docs.set(name, document);
    return document;
  }

  async updateDocument(docTypeName: string, id: string, data: Record<string, any>): Promise<Document | undefined> {
    const docs = this.documents.get(docTypeName);
    const existing = docs?.get(id);
    
    if (!existing) {
      return undefined;
    }

    const updated: Document = {
      ...existing,
      ...data,
      name: id
    };

    docs!.set(id, updated);
    return updated;
  }

  async deleteDocument(docTypeName: string, id: string): Promise<boolean> {
    const docs = this.documents.get(docTypeName);
    if (!docs) {
      return false;
    }
    return docs.delete(id);
  }
}

export const storage = new MemStorage();
