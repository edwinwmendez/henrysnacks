import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Boxes
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

const menuItems = [
  { id: 'orders', label: 'Pedidos', icon: ShoppingBag, path: '/admin/orders' },
  { id: 'products', label: 'Productos', icon: Package, path: '/admin/products' },
  { id: 'combos', label: 'Combos', icon: Boxes, path: '/admin/combos' },
  { id: 'users', label: 'Usuarios', icon: Users, path: '/admin/users' },
  { id: 'reports', label: 'Reportes', icon: BarChart3, path: '/admin/reports' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const { logout, state } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#0B8A5F]">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-[#0B8A5F] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {state.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {state.user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="ml-2 p-2 text-gray-400 hover:text-red-600 transition-colors"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find(item => item.id === currentPage)?.label}
          </h2>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-[#0B8A5F] transition-colors"
            >
              Ver sitio web
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
