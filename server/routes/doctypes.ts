import type { Express } from "express";
import { storage } from "../storage";

export function registerDocTypeRoutes(app: Express): void {
  // GET /api/doctypes/:doctype - Get schema for a specific doctype
  // Supports both URL-encoded and regular doctype names (e.g., "CRM Note" or "CRM%20Note")
  app.get("/api/doctypes/:doctype", async (req, res) => {
    try {
      // URL decode the doctype parameter to handle spaces and special characters
      const doctype = decodeURIComponent(req.params.doctype);
      
      console.log(`[DocType Schema] Fetching schema for: "${doctype}"`);
      
      const schema = await storage.getDocTypeSchema(doctype);
      
      if (!schema || schema.length === 0) {
        console.log(`[DocType Schema] Not found: "${doctype}"`);
        return res.status(404).json({ error: "DocType not found" });
      }

      console.log(`[DocType Schema] Found ${schema.length} fields for "${doctype}"`);
      res.json(schema);
    } catch (error) {
      console.error(`[DocType Schema] Error:`, error);
      res.status(500).json({ error: "Failed to fetch schema" });
    }
  });
}

