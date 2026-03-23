import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import aiCommentaryHandler from "./api/ai-commentary";
import ghlStartHandler from "./api/ghl-start";
import ghlCompleteHandler from "./api/ghl-complete";
import saveSessionHandler from "./api/save-session";
import updateSessionHandler from "./api/update-session";
import getSessionHandler from "./api/get-session";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Wire Vercel serverless functions to Express for local development
  app.post("/api/ai-commentary", (req, res) => aiCommentaryHandler(req as any, res as any));
  app.post("/api/ghl-start", (req, res) => ghlStartHandler(req as any, res as any));
  app.post("/api/ghl-complete", (req, res) => ghlCompleteHandler(req as any, res as any));
  app.post("/api/save-session", (req, res) => saveSessionHandler(req as any, res as any));
  app.post("/api/update-session", (req, res) => updateSessionHandler(req as any, res as any));
  app.get("/api/get-session", (req, res) => getSessionHandler(req as any, res as any));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
