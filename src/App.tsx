import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { CombosPage } from './pages/admin/CombosPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/producto/:slug" element={<ProductDetailPage />} />
              <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/combos" element={<CombosPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/reports" element={<ReportsPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;