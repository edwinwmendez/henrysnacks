import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Package } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { useEffect, useState } from 'react';

export function CartDrawer() {
  const { state, closeCart, updateQuantity, removeFromCart } = useCart();
  const { products } = useProducts();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (state.isOpen) {
      setIsAnimating(true);
    }
  }, [state.isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      closeCart();
    }, 300); // Duración de la animación
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Producto';
  };

  if (!state.isOpen) return null;

  const deliveryFee = state.items.length > 0 ? 5 : 0;
  const total = state.total + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black backdrop-blur-sm transition-all duration-300 ${
          isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-all duration-300 ease-out ${
        isAnimating ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-[#5C3A21] flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Tu Carrito
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Carrito vacío</h3>
                <p className="text-gray-500">¡Agrega algunos productos deliciosos!</p>
                <Link to="/tienda" onClick={handleClose}>
                  <Button className="mt-4">
                    Ver Tienda
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {state.items.map((item, index) => {
                  if (item.type === 'product') {
                    // Render Product Item
                    return (
                      <div key={`product-${item.product.id}-${index}`} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex space-x-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-[#5C3A21] text-sm">
                              {item.product.name}
                            </h3>

                            {/* Selected Options */}
                            <div className="text-xs text-gray-500 mt-1 space-y-1">
                              {Object.entries(item.selectedOptions).map(([optionId, choiceId]) => {
                                const option = item.product.options.find(opt => opt.id === optionId);
                                const choice = option?.options.find(ch => ch.id === choiceId);
                                if (!option || !choice) return null;

                                return (
                                  <div key={optionId}>
                                    {option.name}: {choice.name}
                                    {choice.priceDelta > 0 && ` (+${formatPrice(choice.priceDelta)})`}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity('product', item.product.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-medium text-sm min-w-[2ch] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity('product', item.product.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full bg-white border flex items-center justify-center hover:bg-gray-50"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-[#0B8A5F]">
                                  {formatPrice(item.totalPrice * item.quantity)}
                                </p>
                                <button
                                  onClick={() => removeFromCart('product', item.product.id)}
                                  className="text-xs text-red-500 hover:text-red-600"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    // Render Combo Item
                    return (
                      <div key={`combo-${item.combo.id}-${index}`} className="bg-gradient-to-br from-[#F3C64B]/10 to-[#F3C64B]/5 rounded-lg p-4 border border-[#F3C64B]/30">
                        <div className="flex space-x-4">
                          <div className="relative">
                            <img
                              src={item.combo.images[0]}
                              alt={item.combo.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="absolute -top-1 -right-1 bg-[#F3C64B] rounded-full p-1">
                              <Package className="w-3 h-3 text-[#5C3A21]" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-[#5C3A21] text-sm">
                                {item.combo.name}
                              </h3>
                              <span className="text-xs bg-[#F3C64B] text-[#5C3A21] px-2 py-0.5 rounded-full font-medium">
                                -{item.combo.discount_percentage}%
                              </span>
                            </div>

                            {/* Included Products */}
                            <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                              {item.combo.items.map((comboItem, idx) => (
                                <div key={idx} className="flex items-center">
                                  <span className="w-1 h-1 bg-[#0B8A5F] rounded-full mr-1.5"></span>
                                  {comboItem.quantity}x {getProductName(comboItem.product_id)}
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity('combo', item.combo.id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full bg-white border border-[#F3C64B] flex items-center justify-center hover:bg-[#F3C64B]/10"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-medium text-sm min-w-[2ch] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity('combo', item.combo.id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full bg-white border border-[#F3C64B] flex items-center justify-center hover:bg-[#F3C64B]/10"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="font-bold text-[#0B8A5F]">
                                  {formatPrice(item.totalPrice * item.quantity)}
                                </p>
                                <button
                                  onClick={() => removeFromCart('combo', item.combo.id)}
                                  className="text-xs text-red-500 hover:text-red-600"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
              
              {/* Summary */}
              <div className="border-t p-6 space-y-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-[#0B8A5F]">{formatPrice(total)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full">
                    Proceder al Checkout
                  </Button>

                  <Link to="/tienda" onClick={handleClose}>
                    <Button variant="outline" size="lg" className="w-full">
                      Seguir Comprando
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Pago contra entrega • Efectivo o pago móvil
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}