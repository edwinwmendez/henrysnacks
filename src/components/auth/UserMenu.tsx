import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, ShoppingBag, Settings, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { state, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!state.isAuthenticated || !state.user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-[#0B8A5F] to-[#F3C64B] rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {state.user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden sm:block">{state.user.name.split(' ')[0]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-medium text-[#5C3A21]">{state.user.name}</p>
            <p className="text-sm text-gray-500">{state.user.email}</p>
            {state.user.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-1 !bg-[#F3C64B] !text-[#5C3A21] text-xs rounded-full font-bold shadow-sm">
                Administrador
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Admin Panel - Solo para administradores */}
            {state.user.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 text-left hover:bg-[#0B8A5F]/10 flex items-center space-x-3 text-[#0B8A5F] font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Panel de Administración</span>
                </Link>
                <div className="border-t border-gray-100 my-2"></div>
              </>
            )}

            {/* Opciones comunes */}
            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
              <User className="w-4 h-4" />
              <span>Mi Perfil</span>
            </button>

            {/* Mis Pedidos - Solo para clientes */}
            {state.user.role === 'customer' && (
              <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
                <ShoppingBag className="w-4 h-4" />
                <span>Mis Pedidos</span>
              </button>
            )}

            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}