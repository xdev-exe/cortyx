import type { Express } from "express";
import { storage } from "../storage";

export function registerModuleRoutes(app: Express): void {
  // GET /api/modules - List all modules with their doctypes
  app.get("/api/modules", async (req, res) => {
    try {
      const modules = await storage.getModules();
      res.json(modules);
    } catch (error) {
      console.error("Failed to fetch modules:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });
}

