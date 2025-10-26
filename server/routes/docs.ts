import type { Express } from "express";
import { storage } from "../storage";

export function registerDocRoutes(app: Express): void {
  // GET /api/docs/:doctype - List documents of a specific doctype
  // Supports pagination with ?page=1&pageSize=20
  app.get("/api/docs/:doctype", async (req, res) => {
    try {
      // URL decode to handle spaces and special characters (e.g., "CRM%20Note" -> "CRM Note")
      const doctype = decodeURIComponent(req.params.doctype);
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;

      console.log(`[Docs List] Fetching documents for doctype: "${doctype}", page: ${page}, pageSize: ${pageSize}`);

      const result = await storage.getDocuments(doctype, page, pageSize);
      const totalPages = Math.ceil(result.total / pageSize);

      console.log(`[Docs List] Found ${result.data.length} documents (total: ${result.total}) for "${doctype}"`);

      res.json({
        data: result.data,
        total: result.total,
        page,
        pageSize,
        totalPages
      });
    } catch (error) {
      console.error(`[Docs List] Error:`, error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // GET /api/docs/:doctype/:id - Get a specific document
  app.get("/api/docs/:doctype/:id", async (req, res) => {
    try {
      // URL decode both doctype and id to handle spaces and special characters
      const doctype = decodeURIComponent(req.params.doctype);
      const id = decodeURIComponent(req.params.id);
      
      console.log(`[Doc Detail] Fetching document: doctype="${doctype}", id="${id}"`);
      
      const document = await storage.getDocument(doctype, id);

      if (!document) {
        console.log(`[Doc Detail] Document not found: doctype="${doctype}", id="${id}"`);
        return res.status(404).json({ error: "Document not found" });
      }

      console.log(`[Doc Detail] Found document: "${document.name}" in "${doctype}"`);
      res.json(document);
    } catch (error) {
      console.error(`[Doc Detail] Error:`, error);
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  // POST /api/docs/:doctype - Create a new document
  app.post("/api/docs/:doctype", async (req, res) => {
    try {
      const doctype = decodeURIComponent(req.params.doctype);
      
      console.log(`[Doc Create] Creating document in "${doctype}":`, req.body);
      
      const document = await storage.createDocument(doctype, req.body);
      
      console.log(`[Doc Create] Created document: "${document?.name}" in "${doctype}"`);
      res.status(201).json(document);
    } catch (error) {
      console.error(`[Doc Create] Error:`, error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  // PUT /api/docs/:doctype/:id - Update a document
  app.put("/api/docs/:doctype/:id", async (req, res) => {
    try {
      const doctype = decodeURIComponent(req.params.doctype);
      const id = decodeURIComponent(req.params.id);
      
      console.log(`[Doc Update] Updating document: doctype="${doctype}", id="${id}"`, req.body);
      
      const document = await storage.updateDocument(doctype, id, req.body);

      if (!document) {
        console.log(`[Doc Update] Document not found: doctype="${doctype}", id="${id}"`);
        return res.status(404).json({ error: "Document not found" });
      }

      console.log(`[Doc Update] Updated document: "${document.name}" in "${doctype}"`);
      res.json(document);
    } catch (error) {
      console.error(`[Doc Update] Error:`, error);
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  // DELETE /api/docs/:doctype/:id - Delete a document
  app.delete("/api/docs/:doctype/:id", async (req, res) => {
    try {
      const doctype = decodeURIComponent(req.params.doctype);
      const id = decodeURIComponent(req.params.id);
      
      console.log(`[Doc Delete] Deleting document: doctype="${doctype}", id="${id}"`);
      
      const success = await storage.deleteDocument(doctype, id);

      if (!success) {
        console.log(`[Doc Delete] Document not found: doctype="${doctype}", id="${id}"`);
        return res.status(404).json({ error: "Document not found" });
      }

      console.log(`[Doc Delete] Deleted document: id="${id}" from "${doctype}"`);
      res.json({ success: true });
    } catch (error) {
      console.error(`[Doc Delete] Error:`, error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });
}

