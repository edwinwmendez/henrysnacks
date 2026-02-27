import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingCart, Package, Sparkles, Tag } from 'lucide-react';
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

  if (!mostSoldItem) {
    return (
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#5C3A21] via-[#5C3A21] to-[#3d2616]">
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-6">
              <div className="h-8 w-64 bg-white/10 rounded-full animate-pulse" />
              <div className="h-16 w-3/4 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-6 w-1/2 bg-white/10 rounded animate-pulse" />
              <div className="h-14 w-48 bg-white/10 rounded-xl animate-pulse" />
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md h-96 bg-white/10 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const isCombo = mostSoldItem.type === 'combo';
  const item = mostSoldItem.item;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#5C3A21] via-[#5C3A21] to-[#3d2616]">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
          alt="Productos amazónicos crujientes de la selva peruana"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5C3A21]/90 via-[#5C3A21]/80 to-[#5C3A21]/90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">

          {/* Left Column - Main Message */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center bg-[#F3C64B]/20 backdrop-blur-sm text-white border border-[#F3C64B]/30 rounded-full px-5 py-2.5 mb-6">
              <Sparkles className="w-4 h-4 mr-2 text-[#F3C64B]" />
              <span className="text-sm font-semibold">Auténtico sabor de la Amazonía</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              Tradición crujiente
              <br />
              <span className="text-[#F3C64B]">desde la selva</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Chifles, yuca y camote directo del corazón de la Amazonía.
              <span className="font-semibold text-[#F3C64B]"> 100% natural</span>, sin conservantes.
            </p>

            {/* Single CTA */}
            <Link to="/tienda">
              <Button
                size="lg"
                className="bg-[#F3C64B] hover:bg-[#F3C64B]/90 text-[#5C3A21] text-lg px-10 py-6 rounded-xl shadow-2xl group"
              >
                Explorar Catálogo Completo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Right Column - Featured Product */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative max-w-md w-full">
              {/* Best Seller Badge */}
              <div className="absolute -top-4 -left-4 z-20">
                <div className="bg-[#F3C64B] text-[#5C3A21] rounded-full p-4 shadow-xl border-4 border-white animate-pulse">
                  <div className="text-center">
                    <Star className="w-6 h-6 mx-auto mb-1 fill-current" />
                    <div className="text-xs font-bold uppercase">
                      {isCombo ? 'COMBO' : 'Más Vendido'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5C3A21]/50 to-transparent"></div>

                  {/* Discount Badge for Combos */}
                  {isCombo && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center shadow-lg">
                        <Tag className="w-4 h-4 mr-1 fill-current" />
                        -{(item as Combo).discount_percentage}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-2xl text-[#5C3A21] mb-2">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#0B8A5F]/10 text-[#0B8A5F] text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Combo Items or Product Options */}
                  {isCombo ? (
                    <div className="bg-[#0B8A5F]/5 rounded-lg p-3 mb-4">
                      <p className="text-sm font-semibold text-[#0B8A5F] mb-2 flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Incluye:
                      </p>
                      <ul className="space-y-1">
                        {(item as Combo).items.map((comboItem, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <span className="w-1.5 h-1.5 bg-[#F3C64B] rounded-full mr-2"></span>
                            {comboItem.quantity}x {getProductName(comboItem.product_id)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    (item as Product).options?.find(opt => opt.id === 'protein') && (
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-[#5C3A21] mb-2">
                          Acompañamiento:
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
                    )
                  )}

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Desde</div>
                      <div className="text-3xl font-bold text-[#0B8A5F]">
                        {formatPrice(calculatePrice())}
                      </div>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className={`text-base px-6 py-6 h-auto shadow-lg ${
                        isAdding
                          ? 'bg-green-500 text-white'
                          : 'bg-[#F48C42] hover:bg-[#F48C42]/90 text-white'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {isAdding ? '¡Agregado!' : 'Agregar'}
                    </Button>
                  </div>

                  {/* Quick Link to Product */}
                  <Link to={isCombo ? `/combo/${item.slug}` : `/producto/${item.slug}`}>
                    <Button
                      variant="ghost"
                      className="w-full mt-3 text-[#0B8A5F] hover:text-[#0B8A5F]/80 hover:bg-[#0B8A5F]/5"
                    >
                      Ver detalles del producto
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
