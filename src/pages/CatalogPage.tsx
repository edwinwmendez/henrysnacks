import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Button } from '../components/ui/Button';
import { Search, SlidersHorizontal, X, Package, Star, Plus, Tag } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useCombos } from '../hooks/useCombos';
import { Product, Combo } from '../types';

const categories = [
  { id: 'all', label: 'Todos', value: 'all' },
  { id: 'chifles-verde', label: 'Chifles Verde', value: 'chifles-verde' },
  { id: 'chifles-maduro', label: 'Chifles Maduro', value: 'chifles-maduro' },
  { id: 'yuca', label: 'Yuca', value: 'yuca' },
  { id: 'camote', label: 'Camote', value: 'camote' },
  { id: 'combos', label: 'Combos', value: 'combos' },
];

type CatalogItem =
  | { type: 'product'; item: Product }
  | { type: 'combo'; item: Combo };

export function CatalogPage() {
  const { addToCart, addComboToCart } = useCart();
  const { products } = useProducts();
  const { combos } = useCombos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let items: CatalogItem[] = [];

    // Si es categoría "combos", mostrar solo combos
    if (selectedCategory === 'combos') {
      items = combos.filter(c => c.available).map(c => ({ type: 'combo' as const, item: c }));
    }
    // Si es "all", mostrar productos y combos
    else if (selectedCategory === 'all') {
      items = [
        ...products.map(p => ({ type: 'product' as const, item: p })),
        ...combos.filter(c => c.available).map(c => ({ type: 'combo' as const, item: c }))
      ];
    }
    // Si es una categoría específica, mostrar solo productos de esa categoría
    else {
      items = products
        .filter(p => p.category === selectedCategory)
        .map(p => ({ type: 'product' as const, item: p }));
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(item => {
        const name = item.item.name.toLowerCase();
        const description = item.item.description.toLowerCase();
        const tags = item.item.tags.some(tag => tag.toLowerCase().includes(term));
        return name.includes(term) || description.includes(term) || tags;
      });
    }

    return items;
  }, [searchTerm, selectedCategory, products, combos]);

  const handleAddProduct = (product: Product) => {
    const defaultOptions: Record<string, string> = {};
    product.options.forEach(option => {
      if (option.options.length > 0) {
        defaultOptions[option.id] = option.options[0].id;
      }
    });
    addToCart(product, 1, defaultOptions);
  };

  const handleAddCombo = (combo: Combo) => {
    addComboToCart(combo, 1);
  };

  const calculateComboPrice = (combo: Combo) => {
    const regularPrice = combo.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + (product?.basePrice || 0) * item.quantity;
    }, 0);
    return regularPrice * (1 - combo.discount_percentage / 100);
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Producto';
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FBFAF7] py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-4">
              Tienda HenrySnacks
            </h1>
            <p className="text-xl text-gray-600">
              Descubre todos nuestros productos amazónicos
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Categories Filter */}
            <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat.value
                        ? 'bg-[#0B8A5F] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredItems.length} {filteredItems.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda o filtros
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(catalogItem => {
                const isCombo = catalogItem.type === 'combo';
                const item = catalogItem.item;

                return (
                  <div
                    key={`${catalogItem.type}-${item.id}`}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="block relative aspect-square overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.featured && (
                          <span className="bg-[#F3C64B] text-[#5C3A21] px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </span>
                        )}
                        {isCombo && (
                          <span className="bg-[#0B8A5F] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                            <Package className="w-3 h-3 mr-1" />
                            COMBO
                          </span>
                        )}
                      </div>

                      {/* Discount Badge for Combos */}
                      {isCombo && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                            <Tag className="w-3 h-3 mr-1" />
                            -{(item as Combo).discount_percentage}%
                          </span>
                        </div>
                      )}

                      {/* Quick Add */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            isCombo ? handleAddCombo(item as Combo) : handleAddProduct(item as Product);
                          }}
                          className="rounded-full w-10 h-10 p-0 shadow-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <span className="text-[#F48C42] text-xs font-medium uppercase tracking-wide">
                        {isCombo ? 'Combo' : (item as Product).category.replace('-', ' ')}
                      </span>

                      <h3 className="text-lg font-bold text-[#5C3A21] line-clamp-2">
                        {item.name}
                      </h3>

                      {isCombo ? (
                        <div className="text-xs text-gray-600">
                          <p className="font-medium text-[#0B8A5F] mb-1">Incluye:</p>
                          {(item as Combo).items.slice(0, 2).map((comboItem, idx) => (
                            <p key={idx}>• {comboItem.quantity}x {getProductName(comboItem.product_id)}</p>
                          ))}
                          {(item as Combo).items.length > 2 && (
                            <p className="text-gray-500 mt-1">+ {(item as Combo).items.length - 2} más</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-xl font-bold text-[#0B8A5F]">
                            {isCombo
                              ? formatPrice(calculateComboPrice(item as Combo))
                              : formatPrice((item as Product).price)
                            }
                          </span>
                          {!isCombo && <span className="text-xs text-gray-500 ml-1">desde</span>}
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => isCombo ? handleAddCombo(item as Combo) : handleAddProduct(item as Product)}
                          className="hover:bg-[#0B8A5F] hover:text-white hover:border-[#0B8A5F]"
                        >
                          Agregar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
