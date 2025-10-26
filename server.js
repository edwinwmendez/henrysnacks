// server.js
// Servidor Express robusto para servir el build de Vite (dist/).
// Configuración mejorada para evitar conflictos de MIME type con archivos estáticos.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Deshabilitar X-Powered-By header por seguridad
app.disable('x-powered-by');

// Configurar headers de seguridad y caché
app.use((req, res, next) => {
  // Headers de seguridad básicos
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Caché agresivo para assets (tienen hash en el nombre)
  if (req.url.startsWith('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (req.url.endsWith('.html')) {
    // No cachear HTML para que siempre se recargue
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  next();
});

// Servir assets estáticos desde /dist con configuración mejorada
app.use(express.static(path.join(__dirname, "dist"), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Asegurar MIME types correctos para módulos ES
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
  }
}));

// Health check (útil para la PaaS)
app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Logging básico de peticiones en producción
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Fallback SPA (catch-all) SOLO para rutas que no son archivos
app.use((req, res, next) => {
  // Si la petición es para un archivo estático que no existe, devolver 404
  if (req.url.includes('.') && !req.url.endsWith('.html')) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }

  // Para el resto de rutas (SPA), servir index.html
  const indexPath = path.join(__dirname, "dist", "index.html");

  // Verificar que index.html exista antes de servirlo
  if (!fs.existsSync(indexPath)) {
    console.error('❌ ERROR: index.html no encontrado en dist/');
    return res.status(500).send('Error del servidor: Build no encontrado');
  }

  res.sendFile(indexPath);
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Puerto que provee la plataforma, fallback 3000
const PORT = process.env.PORT || 3000;

// Verificar que dist/ existe antes de iniciar el servidor
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ ERROR CRÍTICO: Directorio dist/ no encontrado');
  console.error('   Ejecuta "npm run build" antes de iniciar el servidor');
  process.exit(1);
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor Express corriendo en http://0.0.0.0:${PORT}`);
  console.log(`   Sirviendo archivos desde: ${distPath}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
});