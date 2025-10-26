import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerDocRoutes } from "./docs";
import { registerDocTypeRoutes } from "./doctypes";
import { registerModuleRoutes } from "./modules";
import { registerAuthRoutes } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register all route modules
  registerModuleRoutes(app);
  registerDocTypeRoutes(app);
  registerDocRoutes(app);
  registerAuthRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}

