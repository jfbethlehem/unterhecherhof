import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "src", "data");

app.use(express.json());

// Helper to check credentials
async function checkAuth(username?: string, password?: string) {
  const envUsername = process.env.ADMIN_USERNAME || "admin";
  const envPassword = process.env.ADMIN_PASSWORD || "password123";
  return !!(username && password && username === envUsername && password === envPassword);
}

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (await checkAuth(username, password)) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

app.get("/api/files", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  const [username, password] = Buffer.from(authHeader.split(" ")[1] || "", "base64").toString().split(":");
  if (!(await checkAuth(username, password))) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  try {
    const files = await fs.readdir(DATA_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'admin.json');
    res.json(jsonFiles);
  } catch (err) {
    res.status(500).json({ message: "Error reading data directory" });
  }
});

app.get("/api/files/:filename", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  // Simplified basic auth reading for testing
  const [username, password] = Buffer.from(authHeader.split(" ")[1] || "", "base64").toString().split(":");
  if (!(await checkAuth(username, password))) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const filename = req.params.filename;
  if (!filename.endsWith('.json') || filename === 'admin.json' || filename.includes('..')) {
     res.status(400).json({ message: "Invalid filename" });
     return;
  }

  try {
    const content = await fs.readFile(path.join(DATA_DIR, filename), "utf-8");
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(500).json({ message: "Error reading file" });
  }
});

app.put("/api/files/:filename", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }
  const [username, password] = Buffer.from(authHeader.split(" ")[1] || "", "base64").toString().split(":");
  if (!(await checkAuth(username, password))) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const filename = req.params.filename;
  if (!filename.endsWith('.json') || filename === 'admin.json' || filename.includes('..')) {
     res.status(400).json({ message: "Invalid filename" });
     return;
  }

  try {
    const formattedJson = JSON.stringify(req.body, null, 2);
    await fs.writeFile(path.join(DATA_DIR, filename), formattedJson, "utf-8");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error writing file" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express v4:
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
