import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Optimización para producción
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
    // Tamaño de chunk para warnings
    chunkSizeWarningLimit: 1000,
  },
  // Configuración para preview en Vercel
  preview: {
    port: 4173,
    strictPort: false,
  },
});
