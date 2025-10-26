import type { Express } from "express";

export function registerAuthRoutes(app: Express): void {
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
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
}

