// server.js
// Servidor Express robusto para servir el build de Vite (dist/).
// Usamos app.use(...) como fallback para evitar problemas con la libería de rutas.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir assets estáticos desde /dist
app.use(express.static(path.join(__dirname, "dist")));

// Health check (útil para la PaaS)
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// Fallback SPA (catch-all) — usar app.use para evitar que '*' sea parseado por path-to-regexp
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Puerto que provee la plataforma, fallback 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor Express en http://0.0.0.0:${PORT}`);
});