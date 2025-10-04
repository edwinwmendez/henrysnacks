import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Star, ShoppingCart, Check, Package, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { useCombos } from '../../hooks/useCombos';
import { mockOrders } from '../../data/mockData';
import { formatPrice } from '../../lib/utils';
import { Product, Combo } from '../../types';

type FeaturedItem =
  | { type: 'product'; item: Product; sales: number }
  | { type: 'combo'; item: Combo; sales: number };

export function Hero() {
  const { addToCart, addComboToCart } = useCart();
  const { products } = useProducts();
  const { combos } = useCombos();
  const [selectedProtein, setSelectedProtein] = useState('none');
  const [isAdding, setIsAdding] = useState(false);

  // Calcular dinámicamente el item más vendido (producto o combo)
  const mostSoldItem: FeaturedItem | null = useMemo(() => {
    const productCount: Record<string, number> = {};
    const comboCount: Record<string, number> = {};

    // Contar ventas de productos y combos
    mockOrders.forEach(order => {
      order.items.forEach(item => {
        if (item.type === 'product') {
          productCount[item.product.id] = (productCount[item.product.id] || 0) + item.quantity;
        } else if (item.type === 'combo') {
          comboCount[item.combo.id] = (comboCount[item.combo.id] || 0) + item.quantity;
        }
      });
    });

    // Encontrar el producto más vendido
    const topProductEntry = Object.entries(productCount).sort((a, b) => b[1] - a[1])[0];
    const topProduct = topProductEntry
      ? products.find(p => p.id === topProductEntry[0])
      : null;

    // Encontrar el combo más vendido
    const topComboEntry = Object.entries(comboCount).sort((a, b) => b[1] - a[1])[0];
    const topCombo = topComboEntry
      ? combos.find(c => c.id === topComboEntry[0])
      : null;

    // Comparar y retornar el más vendido entre ambos
    const productSales = topProductEntry?.[1] || 0;
    const comboSales = topComboEntry?.[1] || 0;

    if (productSales > comboSales && topProduct) {
      return { type: 'product', item: topProduct, sales: productSales };
    } else if (comboSales > 0 && topCombo) {
      return { type: 'combo', item: topCombo, sales: comboSales };
    }

    // Fallback: usar featured
    const featuredProduct = products.find(p => p.featured);
    if (featuredProduct) {
      return { type: 'product', item: featuredProduct, sales: 0 };
    }

    const featuredCombo = combos.find(c => c.featured);
    if (featuredCombo) {
      return { type: 'combo', item: featuredCombo, sales: 0 };
    }

    return null;
  }, [products, combos]);

  // Calcular precio según el tipo de item
  const calculatePrice = () => {
    if (!mostSoldItem) return 0;

    if (mostSoldItem.type === 'product') {
      const product = mostSoldItem.item as Product;
      let price = product.basePrice;

      const proteinOption = product.options?.find(opt => opt.id === 'protein');
      if (proteinOption && selectedProtein) {
        const choice = proteinOption.options.find(opt => opt.id === selectedProtein);
        if (choice) {
          price += choice.priceDelta;
        }
      }

      return price;
    } else {
      // Para combos, calcular precio con descuento
      const combo = mostSoldItem.item as Combo;
      const regularPrice = combo.items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.product_id);
        return sum + (product?.basePrice || 0) * item.quantity;
      }, 0);

      return regularPrice * (1 - combo.discount_percentage / 100);
    }
  };

  const handleAddToCart = () => {
    if (!mostSoldItem) return;
    setIsAdding(true);

    if (mostSoldItem.type === 'product') {
      const selectedOptions = {
        protein: selectedProtein
      };
      addToCart(mostSoldItem.item as Product, 1, selectedOptions);
    } else {
      addComboToCart(mostSoldItem.item as Combo, 1);
    }

    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Producto';
  };

  if (!mostSoldItem) return null;

  const isCombo = mostSoldItem.type === 'combo';
  const item = mostSoldItem.item;

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
              <Link to="/tienda">
                <Button
                  size="lg"
                  className="group bg-[#F3C64B] text-[#5C3A21] hover:bg-[#F3C64B]/90 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-[#F3C64B]/20 transition-all"
                >
                  Explorar Tienda
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Featured Item Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4 !bg-[#F48C42] !text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                  {isCombo ? <Package className="w-4 h-4 mr-1 fill-current" /> : '🔥'}
                  {isCombo ? 'COMBO' : 'Más Vendido'}
                </div>
                {isCombo && (
                  <div className="absolute top-4 right-4 !bg-red-600 !text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <Tag className="w-3 h-3 mr-1 fill-current" />
                    -{(item as Combo).discount_percentage}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 lg:p-6 space-y-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[#5C3A21] mb-1.5">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Combo Items or Product Options */}
                {isCombo ? (
                  <div className="bg-[#0B8A5F]/5 rounded-lg p-3">
                    <p className="text-xs font-semibold text-[#0B8A5F] mb-2">Incluye:</p>
                    <ul className="space-y-1">
                      {(item as Combo).items.map((comboItem, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#F3C64B] rounded-full mr-2"></span>
                          {comboItem.quantity}x {getProductName(comboItem.product_id)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  (item as Product).options && (item as Product).options.length > 0 && (
                    <div className="space-y-3">
                      {(item as Product).options.find(opt => opt.id === 'protein') && (
                        <div>
                          <label className="block text-sm font-semibold text-[#5C3A21] mb-2">
                            Acompañamiento
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {(item as Product).options
                              .find(opt => opt.id === 'protein')
                              ?.options.slice(0, 2).map(option => (
                                <button
                                  key={option.id}
                                  onClick={() => setSelectedProtein(option.id)}
                                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
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
                  )
                )}

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="text-2xl font-bold text-[#0B8A5F]">
                      {formatPrice(calculatePrice())}
                    </p>
                  </div>
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all text-sm ${
                      isAdding
                        ? 'bg-green-500 text-white'
                        : isCombo
                        ? 'bg-[#F3C64B] text-[#5C3A21] hover:bg-[#F3C64B]/90'
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
