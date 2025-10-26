// server.js
// Servidor Express para servir el build de Vite en producción

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir archivos estáticos desde "dist"
app.use(express.static(path.join(__dirname, "dist")));

// Redirigir todas las rutas al index.html (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Escuchar en el puerto asignado por EasyPanel o 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en ejecución en http://0.0.0.0:${PORT}`);
});