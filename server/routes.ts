import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRainfallSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all rainfall records
  app.get("/api/rainfall", async (req, res) => {
    try {
      const records = await storage.getAllRainfall();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rainfall records" });
    }
  });

  // Get monthly totals
  app.get("/api/rainfall/monthly", async (req, res) => {
    try {
      const totals = await storage.getMonthlyTotals();
      res.json(totals);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate monthly totals" });
    }
  });

  // Add a new rainfall record
  app.post("/api/rainfall", async (req, res) => {
    try {
      const parsed = insertRainfallSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0].message });
      }
      const record = await storage.addRainfall(parsed.data);
      res.status(201).json(record);
    } catch (error) {
      res.status(500).json({ error: "Failed to save rainfall record" });
    }
  });

  return httpServer;
}
