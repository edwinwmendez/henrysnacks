// server.js
// Servidor Express robusto para producción que sirve el build de Vite (/dist).
// - Usa app.use(...) como fallback para evitar problemas con path-to-regexp
// - Añade health-check
// - Maneja señales SIGTERM/SIGINT para shutdown ordenado y logging claro
// - Verifica existencia de index.html y devuelve 404 si falta (útil para debugging)

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ruta al directorio de archivos estáticos (build de Vite)
const DIST_DIR = path.join(__dirname, "dist");
const INDEX_HTML = path.join(DIST_DIR, "index.html");

// --- Middleware: servir assets estáticos desde /dist ---
app.use(express.static(DIST_DIR));

// --- Health check (útil para la PaaS) ---
app.get("/healthz", (req, res) => {
  // Respuesta rápida para que la plataforma marque el servicio como listo
  res.status(200).send("ok");
});

// --- Opcional: log simple de peticiones (muy útil en debugging) ---
app.use((req, res, next) => {
  // No abuses del logging en producción; esto ayuda a ver actividad en EasyPanel logs
  console.log(`[req] ${req.method} ${req.url}`);
  next();
});

// --- Fallback SPA (catch-all) ---
// Usamos app.use para evitar parsing de rutas problemático.
// Además validamos que index.html exista antes de enviarlo.
app.use((req, res) => {
  if (!fs.existsSync(INDEX_HTML)) {
    // Si falta el build, devolvemos 500 con mensaje claro para debugging
    console.error(`❌ index.html no encontrado en ${INDEX_HTML}. ¿Ejecutaste 'npm run build'?`);
    return res.status(500).send("Error: build no encontrado. Ejecuta `npm run build` y redeploy.");
  }

  // Enviar index.html para rutas de la SPA
  res.sendFile(INDEX_HTML, (err) => {
    if (err) {
      console.error("Error enviando index.html:", err);
      // Si hay error al enviar (I/O), devolver 500
      res.status(500).end();
    }
  });
});

// --- Start server: puerto desde la PaaS o 3000 localmente ---
const PORT = Number(process.env.PORT || 3000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor Express corriendo en http://0.0.0.0:${PORT}`);
  // Información útil a buscar en logs
  console.log(`ℹ️ Proc PID: ${process.pid} | NODE_ENV: ${process.env.NODE_ENV || "undefined"}`);
});

// --- Graceful shutdown: loguear SIGTERM/SIGINT y cerrar servidor ---
function shutdown(signal) {
  console.log(`⚠️ ${signal} recibido — cerrando servidor de forma ordenada...`);
  // Cerrar server y luego salir
  server.close((err) => {
    if (err) {
      console.error("Error cerrando servidor:", err);
      process.exit(1);
    }
    console.log("Servidor cerrado correctamente.");
    process.exit(0);
  });

  // Si tarda más de X ms forzamos exit (evita colgados)
  setTimeout(() => {
    console.warn("Forzando shutdown porque close tomó demasiado tiempo.");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Capturar errores no manejados para evitar crash silencioso
process.on("uncaughtException", (err) => {
  console.error("uncaughtException:", err);
  // Intentamos salir limpiamente (la PaaS debería reiniciar)
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection:", reason);
  // No siempre obligatorio salir; aquí salimos para forzar un restart controlado.
  process.exit(1);
});