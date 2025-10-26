import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });

  app.get("/api/doctypes/:doctype", async (req, res) => {
    try {
      const { doctype } = req.params;
      const schema = await storage.getDocTypeSchema(doctype);
      
      if (!schema) {
        return res.status(404).json({ error: "DocType not found" });
      }

      res.json(schema);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schema" });
    }
  });

  app.get("/api/docs/:doctype", async (req, res) => {
    try {
      const { doctype } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;

      const result = await storage.getDocuments(doctype, page, pageSize);
      const totalPages = Math.ceil(result.total / pageSize);

      res.json({
        data: result.data,
        total: result.total,
        page,
        pageSize,
        totalPages
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/docs/:doctype/:id", async (req, res) => {
    try {
      const { doctype, id } = req.params;
      const document = await storage.getDocument(doctype, id);

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.post("/api/docs/:doctype", async (req, res) => {
    try {
      const { doctype } = req.params;
      const document = await storage.createDocument(doctype, req.body);
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.put("/api/docs/:doctype/:id", async (req, res) => {
    try {
      const { doctype, id } = req.params;
      const document = await storage.updateDocument(doctype, id, req.body);

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/docs/:doctype/:id", async (req, res) => {
    try {
      const { doctype, id } = req.params;
      const success = await storage.deleteDocument(doctype, id);

      if (!success) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password || password.length < 6) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      res.json({ 
        success: true, 
        user: { email } 
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
