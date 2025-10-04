# Guía de Despliegue en Vercel

Este documento describe cómo desplegar el proyecto HenrySnacks (Henry Snacks) en Vercel.

## Requisitos Previos

1. Una cuenta en [Vercel](https://vercel.com)
2. Un proyecto en [Supabase](https://supabase.com) configurado
3. Git instalado en tu máquina local
4. Node.js 18+ instalado

## Método 1: Despliegue mediante Git (Recomendado)

### Paso 1: Preparar el Repositorio

1. Asegúrate de que tu código esté en un repositorio Git (GitHub, GitLab, o Bitbucket)
2. Haz commit de todos los cambios:
   ```bash
   git add .
   git commit -m "Preparar proyecto para despliegue en Vercel"
   git push
   ```

### Paso 2: Importar Proyecto en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio Git
3. Vercel detectará automáticamente que es un proyecto Vite

### Paso 3: Configurar Variables de Entorno

En la sección "Environment Variables" de Vercel, agrega las siguientes variables:

| Variable | Descripción | Valor |
|----------|-------------|-------|
| `VITE_SUPABASE_URL` | URL de tu proyecto Supabase | `https://[tu-proyecto].supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima de Supabase | Tu clave anónima desde el dashboard de Supabase |

**Importante:** Estas variables deben estar disponibles en los ambientes:
- Production
- Preview
- Development

### Paso 4: Configuración del Build

Vercel debería detectar automáticamente la configuración, pero verifica que tenga:

- **Framework Preset:** Vite
- **Build Command:** `npm run build` o `vite build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Paso 5: Desplegar

1. Haz clic en "Deploy"
2. Espera a que termine el proceso de build (generalmente 1-3 minutos)
3. Una vez completado, recibirás una URL de producción

## Método 2: Despliegue mediante CLI

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Login en Vercel

```bash
vercel login
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.production.local` (no lo subas a Git):

```env
VITE_SUPABASE_URL=https://[tu-proyecto].supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

### Paso 4: Desplegar

Para producción:
```bash
vercel --prod
```

Para preview:
```bash
vercel
```

## Configuración de Dominios Personalizados

1. Ve a tu proyecto en el dashboard de Vercel
2. Ve a "Settings" → "Domains"
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar los DNS

## Actualizaciones Automáticas

Con la integración Git de Vercel:

- Cada `push` a la rama principal despliega a producción
- Cada `push` a otras ramas crea un preview deployment
- Cada Pull Request obtiene su propia URL de preview

## Verificación Post-Despliegue

Después del despliegue, verifica:

1. ✅ Las rutas funcionan correctamente (`/`, `/tienda`, `/producto/:slug`, `/combo/:slug`)
2. ✅ La conexión con Supabase funciona
3. ✅ El carrito de compras funciona
4. ✅ Las imágenes se cargan correctamente
5. ✅ No hay errores en la consola del navegador

## Solución de Problemas

### Error 404 en rutas

Si obtienes error 404 al navegar directamente a una ruta (ej: `/tienda`), verifica que el archivo `vercel.json` esté presente en la raíz del proyecto.

### Variables de entorno no definidas

Asegúrate de que todas las variables comiencen con `VITE_` y estén configuradas en el dashboard de Vercel.

### Error de build

Revisa los logs de build en Vercel para identificar el problema. Comunes:
- Dependencias faltantes
- Errores de TypeScript
- Problemas con node_modules

### Problemas con Supabase

Verifica que:
- La URL de Supabase sea correcta
- La clave anónima esté actualizada
- Las políticas RLS (Row Level Security) estén configuradas correctamente

## Optimización de Performance

El proyecto ya incluye:

- ✅ Code splitting automático
- ✅ Lazy loading de componentes
- ✅ Caché de assets estáticos (1 año)
- ✅ Compresión de chunks

## Monitoreo

Puedes monitorear el despliegue en:

- Dashboard de Vercel: Métricas de rendimiento, logs, analytics
- Vercel Speed Insights: Performance metrics
- Vercel Web Analytics: Analytics sin cookies

## Enlaces Útiles

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Vite](https://vitejs.dev/guide/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Solución de problemas Vite + Vercel](https://vercel.com/docs/frameworks/vite)

---

**¿Necesitas ayuda?** Consulta los logs de despliegue en el dashboard de Vercel o contacta al equipo de desarrollo.
