import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';

export function Header() {
  const { state, toggleCart } = useCart();
  const { state: authState } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (hash: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      // Si estamos en home, hacer scroll
      const element = document.querySelector(hash);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Si estamos en otra página, navegar a home con hash
      navigate('/' + hash);
      // Después de navegar, hacer scroll
      setTimeout(() => {
        const element = document.querySelector(hash);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };
  
  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-[#0B8A5F]/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0B8A5F] to-[#F3C64B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#0B8A5F] to-[#F48C42] bg-clip-text text-transparent">
              Amazonía Crujiente
            </h1>
          </Link>
          
          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors">
              Inicio
            </Link>
            <button
              onClick={() => handleNavClick('#productos')}
              className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors"
            >
              Productos
            </button>
            <button
              onClick={() => handleNavClick('#combos')}
              className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors"
            >
              Combos
            </button>
            <button
              onClick={() => handleNavClick('#historia')}
              className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors"
            >
              Nuestra Historia
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Special CTA */}
            <Link
              to="/catalogo"
              className="px-4 py-2 border-2 border-[#0B8A5F] text-[#0B8A5F] rounded-lg hover:bg-[#0B8A5F] hover:text-white transition-all font-medium"
            >
              Tienda
            </Link>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={() => setShowAuthModal(true)}
              >
                <User className="w-4 h-4 mr-2" />
                Cuenta
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Carrito
              {state.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F48C42] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#5C3A21] hover:text-[#0B8A5F] transition-colors"
              >
                Inicio
              </Link>
              <button
                onClick={() => handleNavClick('#productos')}
                className="block w-full text-left py-2 text-[#5C3A21] hover:text-[#0B8A5F] transition-colors"
              >
                Productos
              </button>
              <button
                onClick={() => handleNavClick('#combos')}
                className="block w-full text-left py-2 text-[#5C3A21] hover:text-[#0B8A5F] transition-colors"
              >
                Combos
              </button>
              <button
                onClick={() => handleNavClick('#historia')}
                className="block w-full text-left py-2 text-[#5C3A21] hover:text-[#0B8A5F] transition-colors"
              >
                Nuestra Historia
              </button>

              {/* Separator */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Special CTA */}
              <Link
                to="/catalogo"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 border-2 border-[#0B8A5F] text-[#0B8A5F] rounded-lg hover:bg-[#0B8A5F] hover:text-white transition-all font-medium"
              >
                Tienda
              </Link>
            </nav>
          </div>
        )}
      </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}