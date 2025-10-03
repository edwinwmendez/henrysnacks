# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos de Desarrollo

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Preview del build
npm preview

# Linting
npm run lint

# Type checking
npm run typecheck
```

## Arquitectura de la Aplicación

### Stack Tecnológico
- **Frontend**: React 19.2 + TypeScript 5.9 + Vite 7
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Backend**: Supabase (configurado pero actualmente con datos mock)
- **State Management**: React Context API con useReducer

### Características de React 19 Disponibles
- **Actions**: Funciones async en transiciones para manejar estados pendientes y errores
- **Nuevos Hooks**: `useActionState`, `useFormStatus`, `useOptimistic`, `use`
- **ref como prop**: Ya no se necesita `forwardRef` en componentes funcionales
- **Server Components**: Estables y disponibles (actualmente no se usan en este proyecto)
- **Mejores errores de hidratación**: Mensajes de error más claros y útiles

### Estructura de Contextos Globales

La aplicación utiliza dos contextos principales que envuelven toda la app:

1. **AuthContext** (`src/contexts/AuthContext.tsx`):
   - Maneja autenticación de usuarios (customer/admin)
   - Estado: user, isAuthenticated, isLoading, error
   - Actualmente usa datos mock con localStorage
   - Usuarios de prueba: `maria@example.com`, `admin@amazoniacrujiente.pe`

2. **CartContext** (`src/contexts/CartContext.tsx`):
   - Maneja el carrito de compras
   - Calcula precios dinámicamente según opciones seleccionadas
   - Estado: items, isOpen, total
   - Implementa lógica para agregar/eliminar items y actualizar cantidades

### Sistema de Tipos

El archivo `src/types/index.ts` define las interfaces principales:
- **Product**: Productos con opciones configurables (size, protein, topping)
- **CartItem**: Items en el carrito con opciones seleccionadas
- **Order**: Pedidos con información de cliente y estado
- **User**: Usuarios con roles (customer, admin, rider)

Los productos tienen `basePrice` y `price`, donde el precio final se calcula sumando el basePrice + los priceDelta de las opciones seleccionadas.

### Estructura de Rutas

- `/` - HomePage (landing page con productos destacados)
- `/catalogo` - CatalogPage (catálogo completo con buscador y filtros)
- `/producto/:slug` - ProductDetailPage (detalle de producto individual)
- `/admin/*` - Panel administrativo (requiere autenticación)
  - `/admin/orders` - Gestión de pedidos
  - `/admin/products` - Gestión de productos
  - `/admin/combos` - Gestión de combos
  - `/admin/users` - Gestión de usuarios
  - `/admin/reports` - Reportes
  - `/admin/settings` - Configuración

### Organización de Componentes

```
src/components/
├── admin/       # Componentes del panel admin
├── auth/        # AuthModal, UserMenu
├── cart/        # CartDrawer
├── layout/      # Header, Footer
├── sections/    # Hero, FeaturedProducts, Testimonials, CulturalSection
└── ui/          # Componentes reutilizables (Button, etc)
```

### Variables de Entorno

El proyecto requiere configuración de Supabase en `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Actualmente la app funciona con datos mock, pero está preparada para migrar a Supabase.

## Notas de Desarrollo

- La aplicación es un e-commerce de productos amazónicos crujientes (chifles, yuca, camote)
- El sistema de opciones de productos es flexible: cada producto puede tener múltiples opciones (tamaño, proteína, toppings) que modifican el precio base
- Los productos tienen categorías: 'chifles-verde', 'chifles-maduro', 'yuca', 'camote', 'combo'
- El carrito compara items por producto ID + opciones seleccionadas (JSON.stringify) para detectar duplicados
