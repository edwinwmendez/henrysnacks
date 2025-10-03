import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Star, ShoppingCart, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { mockProducts } from '../../data/mockData';

export function Hero() {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('medium');
  const [selectedProtein, setSelectedProtein] = useState('mixto');
  const [isAdding, setIsAdding] = useState(false);

  // Producto destacado: Combo Selva (el más vendido)
  const featuredProduct = mockProducts.find(p => p.id === '5') || mockProducts[4];

  const handleAddToCart = () => {
    setIsAdding(true);
    const selectedOptions = {
      protein: selectedProtein
    };
    addToCart(featuredProduct, 1, selectedOptions);

    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  return (
    <section className="relative bg-gradient-to-br from-[#0B8A5F] via-[#0B8A5F] to-[#074d3a] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B8A5F]/90 via-[#0B8A5F]/85 to-[#074d3a]/90"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">

          {/* Content Side */}
          <div className="text-white space-y-4 lg:space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              <Leaf className="w-4 h-4 text-[#F3C64B]" />
              <span className="text-sm font-medium text-[#F3C64B]">
                Auténticos sabores de la Amazonía
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Sabores que cuentan
                <span className="text-[#F3C64B] block mt-2">historias</span>
              </h1>
              <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl">
                Descubre la tradición culinaria amazónica en cada bocado.
                Chifles, yuca y camote preparados con recetas ancestrales.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-lg">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-0.5 text-[#F3C64B] mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs text-white/70">500+ clientes</p>
              </div>
              <div className="text-center border-x border-white/20">
                <p className="text-2xl font-bold text-[#F3C64B]">45min</p>
                <p className="text-xs text-white/70">Entrega</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#F3C64B]">100%</p>
                <p className="text-xs text-white/70">Natural</p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link to="/catalogo">
                <Button
                  size="lg"
                  className="group bg-[#F3C64B] text-[#5C3A21] hover:bg-[#F3C64B]/90 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-[#F3C64B]/20 transition-all"
                >
                  Explorar Catálogo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Card Side */}
          <div className="relative">
            {/* Main Product Card */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Product Image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                <img
                  src={featuredProduct.images[0]}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Best Seller Badge */}
                <div className="absolute top-4 left-4 bg-[#F48C42] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  🔥 Más Vendido
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 lg:p-6 space-y-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[#5C3A21] mb-1.5">
                    {featuredProduct.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {featuredProduct.description}
                  </p>
                </div>

                {/* Options */}
                {featuredProduct.options && featuredProduct.options.length > 0 && (
                  <div className="space-y-3">
                    {featuredProduct.options.find(opt => opt.id === 'protein') && (
                      <div>
                        <label className="block text-sm font-semibold text-[#5C3A21] mb-2">
                          Proteína Principal
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {featuredProduct.options
                            .find(opt => opt.id === 'protein')
                            ?.options.map(option => (
                              <button
                                key={option.id}
                                onClick={() => setSelectedProtein(option.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                  selectedProtein === option.id
                                    ? 'bg-[#0B8A5F] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {option.name}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-2xl font-bold text-[#0B8A5F]">
                      S/ {featuredProduct.price}
                    </p>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                      isAdding
                        ? 'bg-green-500 text-white'
                        : 'bg-[#0B8A5F] text-white hover:bg-[#0B8A5F]/90'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        ¡Agregado!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Agregar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div className="absolute -top-3 -right-3 bg-white rounded-xl p-3 shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#0B8A5F] rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#5C3A21]">Envío Gratis</p>
                  <p className="text-xs text-gray-600">Compras +S/50</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
