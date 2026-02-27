import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ComboDetailPage } from './pages/ComboDetailPage';
import { FAQPage } from './pages/FAQPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { HistoriaPage } from './pages/HistoriaPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { CombosPage } from './pages/admin/CombosPage';
import { UsersPage } from './pages/admin/UsersPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tienda" element={<StorePage />} />
              <Route path="/producto/:slug" element={<ProductDetailPage />} />
              <Route path="/combo/:slug" element={<ComboDetailPage />} />
              <Route path="/preguntas-frecuentes" element={<FAQPage />} />
              <Route path="/como-funciona" element={<HowItWorksPage />} />
              <Route path="/nuestra-historia" element={<HistoriaPage />} />

              {/* Admin Routes - Protected */}
              <Route path="/admin" element={<Navigate to="/admin/orders" replace />} />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requireAdmin>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute requireAdmin>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/combos"
                element={
                  <ProtectedRoute requireAdmin>
                    <CombosPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute requireAdmin>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requireAdmin>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;