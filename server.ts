import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // API routes can go here if needed in the future
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const isDev = process.env.NODE_ENV === "development";
  console.log(`Starting server in ${isDev ? "development" : "production"} mode`);

  if (!isDev) {
    const distPath = path.join(__dirname, "dist");
    console.log(`Serving static files from: ${distPath}`);
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      console.log(`Handling request for: ${req.url}`);
      const indexPath = path.join(distPath, "index.html");
      
      import("fs").then(fs => {
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          console.error(`Error: index.html not found at ${indexPath}`);
          res.status(404).send("Application build not found. Please ensure 'npm run build' was executed.");
        }
      });
    });
  } else {
    // Vite middleware for development
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
