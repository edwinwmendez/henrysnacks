import { useState } from 'react';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';

export function Header() {
  const { state, toggleCart } = useCart();
  const { state: authState } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-[#0B8A5F]/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0B8A5F] to-[#F3C64B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AC</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#0B8A5F] to-[#F48C42] bg-clip-text text-transparent">
              Amazonía Crujiente
            </h1>
          </div>
          
          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors">
              Inicio
            </a>
            <a href="#productos" className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors">
              Productos
            </a>
            <a href="#combos" className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors">
              Combos
            </a>
            <a href="#historia" className="text-[#5C3A21] hover:text-[#0B8A5F] transition-colors">
              Nuestra Historia
            </a>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="w-4 h-4 mr-2" />
              Buscar
            </Button>
            
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
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      </header>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}