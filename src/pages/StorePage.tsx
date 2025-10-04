import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Button } from '../components/ui/Button';
import { Search, X, Package, Star, Plus, Tag, ChevronRight, Filter, Grid3x3, Flame, Sparkles, TrendingUp } from 'lucide-react';
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

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name';

export function StorePage() {
  const { addToCart, addComboToCart } = useCart();
  const { products } = useProducts();
  const { combos } = useCombos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Funciones auxiliares
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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Calcular rango de precios dinámicamente
  const { minPrice, maxPrice } = useMemo(() => {
    const allPrices = [
      ...products.map(p => p.price),
      ...combos.filter(c => c.available).map(c => calculateComboPrice(c))
    ];
    return {
      minPrice: Math.floor(Math.min(...allPrices)),
      maxPrice: Math.ceil(Math.max(...allPrices))
    };
  }, [products, combos]);

  // Obtener todas las tags disponibles
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    [...products, ...combos].forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [products, combos]);

  const filteredItems = useMemo(() => {
    let items: CatalogItem[] = [];

    // Filtrar por categoría
    if (selectedCategory === 'combos') {
      items = combos.filter(c => c.available).map(c => ({ type: 'combo' as const, item: c }));
    } else if (selectedCategory === 'all') {
      items = [
        ...products.map(p => ({ type: 'product' as const, item: p })),
        ...combos.filter(c => c.available).map(c => ({ type: 'combo' as const, item: c }))
      ];
    } else {
      items = products
        .filter(p => p.category === selectedCategory)
        .map(p => ({ type: 'product' as const, item: p }));
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(item => {
        const name = item.item.name.toLowerCase();
        const description = item.item.description.toLowerCase();
        const tags = item.item.tags.some(tag => tag.toLowerCase().includes(term));
        return name.includes(term) || description.includes(term) || tags;
      });
    }

    // Filtrar por tags
    if (selectedTags.length > 0) {
      items = items.filter(item =>
        selectedTags.some(tag => item.item.tags.includes(tag))
      );
    }

    // Filtrar por rango de precio
    items = items.filter(item => {
      const price = item.type === 'combo'
        ? calculateComboPrice(item.item as Combo)
        : (item.item as Product).price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Ordenar
    items.sort((a, b) => {
      const priceA = a.type === 'combo' ? calculateComboPrice(a.item as Combo) : (a.item as Product).price;
      const priceB = b.type === 'combo' ? calculateComboPrice(b.item as Combo) : (b.item as Product).price;

      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'name':
          return a.item.name.localeCompare(b.item.name);
        case 'featured':
        default:
          // Destacados primero
          const featuredA = a.item.featured ? 1 : 0;
          const featuredB = b.item.featured ? 1 : 0;
          return featuredB - featuredA;
      }
    });

    return items;
  }, [searchTerm, selectedCategory, products, combos, selectedTags, priceRange, sortBy]);

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

  // Contar productos por categoría
  const getCategoryCount = (categoryValue: string) => {
    if (categoryValue === 'all') {
      return products.length + combos.filter(c => c.available).length;
    }
    if (categoryValue === 'combos') {
      return combos.filter(c => c.available).length;
    }
    return products.filter(p => p.category === categoryValue).length;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FBFAF7]">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <Link to="/" className="hover:text-[#0B8A5F] transition-colors">
                Inicio
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-[#5C3A21] font-medium">Tienda</span>
              {selectedCategory !== 'all' && (
                <>
                  <ChevronRight className="w-4 h-4 mx-2" />
                  <span className="text-[#5C3A21] font-medium">
                    {categories.find(c => c.value === selectedCategory)?.label}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#5C3A21] mb-2">
              Tienda HenrySnacks
            </h1>
            <p className="text-gray-600">
              Descubre todos nuestros productos amazónicos
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos, combos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent outline-none shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Layout: Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Filtros */}
            <aside className="lg:w-64 flex-shrink-0">
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full mb-4 lg:hidden flex items-center justify-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categorías */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-[#5C3A21] mb-3 flex items-center">
                    <Grid3x3 className="w-4 h-4 mr-2" />
                    Categorías
                  </h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                          selectedCategory === cat.value
                            ? 'bg-[#0B8A5F] text-white font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedCategory === cat.value
                            ? 'bg-white/20'
                            : 'bg-gray-200'
                        }`}>
                          {getCategoryCount(cat.value)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rango de Precio */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-[#5C3A21] mb-3">Precio</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-[#0B8A5F]"
                    />
                    <div className="text-xs text-gray-500">
                      Rango: {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-bold text-[#5C3A21] mb-3">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedTags.includes(tag)
                            ? '!bg-[#0B8A5F] !text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Limpiar Filtros */}
                {(selectedTags.length > 0 || priceRange[1] < maxPrice) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTags([]);
                      setPriceRange([minPrice, maxPrice]);
                    }}
                    className="w-full"
                  >
                    Limpiar Filtros
                  </Button>
                )}
              </div>
            </aside>

            {/* Contenido Principal */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-[#5C3A21]">{filteredItems.length}</span> {filteredItems.length === 1 ? 'producto' : 'productos'}
                    {selectedTags.length > 0 && (
                      <span className="ml-2">
                        • {selectedTags.length} {selectedTags.length === 1 ? 'filtro' : 'filtros'} activo{selectedTags.length === 1 ? '' : 's'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label className="text-sm text-gray-600 whitespace-nowrap">Ordenar por:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="flex-1 sm:flex-initial px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent outline-none bg-white text-sm"
                    >
                      <option value="featured">Destacados</option>
                      <option value="price-asc">Precio: Menor a Mayor</option>
                      <option value="price-desc">Precio: Mayor a Menor</option>
                      <option value="name">Nombre A-Z</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              {filteredItems.length === 0 ? (
                <div className="bg-white rounded-xl p-16 text-center shadow-sm">
                  <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No se encontraron productos
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Intenta con otros términos de búsqueda o ajusta los filtros
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedTags([]);
                      setPriceRange([minPrice, maxPrice]);
                    }}
                  >
                    Ver Todos los Productos
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredItems.map(catalogItem => {
                    const isCombo = catalogItem.type === 'combo';
                    const item = catalogItem.item;

                    return (
                      <div
                        key={`${catalogItem.type}-${item.id}`}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <Link
                          to={isCombo ? `/combo/${item.slug}` : `/producto/${item.slug}`}
                          className="block relative aspect-[4/3] overflow-hidden bg-gray-50"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                            {item.featured && (
                              <span className="!bg-[#F3C64B] !text-[#5C3A21] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center w-fit shadow-lg">
                                <Star className="w-3 h-3 mr-1 fill-current" />
                                Destacado
                              </span>
                            )}
                            {isCombo && (
                              <span className="!bg-[#0B8A5F] !text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center w-fit shadow-lg">
                                <Package className="w-3 h-3 mr-1 fill-current" />
                                COMBO
                              </span>
                            )}
                            {item.tags.includes('nuevo') && (
                              <span className="!bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center w-fit shadow-lg">
                                <Sparkles className="w-3 h-3 mr-1 fill-current" />
                                NUEVO
                              </span>
                            )}
                            {item.tags.includes('popular') && (
                              <span className="!bg-gradient-to-r !from-orange-500 !to-red-500 !text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center w-fit shadow-lg">
                                <Flame className="w-3 h-3 mr-1 fill-current" />
                                Popular
                              </span>
                            )}
                          </div>

                          {/* Discount Badge for Combos */}
                          {isCombo && (
                            <div className="absolute top-2.5 right-2.5">
                              <span className="!bg-red-600 !text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center shadow-lg">
                                <Tag className="w-3 h-3 mr-1 fill-current" />
                                -{(item as Combo).discount_percentage}%
                              </span>
                            </div>
                          )}

                          {/* Quick Add - Desktop */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                isCombo ? handleAddCombo(item as Combo) : handleAddProduct(item as Product);
                              }}
                              className="!bg-white !text-[#0B8A5F] hover:!bg-gray-100 shadow-xl"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Agregar al Carrito
                            </Button>
                          </div>
                        </Link>

                        <div className="p-4">
                          <div className="mb-2">
                            <span className="text-[#F48C42] text-xs font-bold uppercase tracking-wider">
                              {isCombo ? 'Combo Especial' : (item as Product).category.replace('-', ' ')}
                            </span>
                          </div>

                          <Link to={isCombo ? `/combo/${item.slug}` : `/producto/${item.slug}`}>
                            <h3 className="text-base font-bold text-[#5C3A21] hover:text-[#0B8A5F] transition-colors line-clamp-2 mb-2 min-h-[3rem]">
                              {item.name}
                            </h3>
                          </Link>

                          {isCombo ? (
                            <div className="text-xs text-gray-600 mb-3 bg-[#0B8A5F]/5 rounded-lg p-2">
                              <p className="font-semibold text-[#0B8A5F] mb-1.5 flex items-center">
                                <Package className="w-3 h-3 mr-1" />
                                Incluye:
                              </p>
                              <div className="space-y-0.5">
                                {(item as Combo).items.slice(0, 2).map((comboItem, idx) => (
                                  <p key={idx} className="flex items-center">
                                    <span className="w-1 h-1 bg-[#0B8A5F] rounded-full mr-1.5"></span>
                                    {comboItem.quantity}x {getProductName(comboItem.product_id)}
                                  </p>
                                ))}
                                {(item as Combo).items.length > 2 && (
                                  <p className="text-gray-500 font-medium">
                                    + {(item as Combo).items.length - 2} producto{(item as Combo).items.length - 2 > 1 ? 's' : ''} más
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3 min-h-[2.5rem]">
                              {item.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex flex-col">
                              {isCombo && (
                                <span className="text-xs text-gray-400 line-through mb-0.5">
                                  {formatPrice(
                                    (item as Combo).items.reduce((sum, comboItem) => {
                                      const product = products.find(p => p.id === comboItem.product_id);
                                      return sum + (product?.basePrice || 0) * comboItem.quantity;
                                    }, 0)
                                  )}
                                </span>
                              )}
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-[#0B8A5F]">
                                  {isCombo
                                    ? formatPrice(calculateComboPrice(item as Combo))
                                    : formatPrice((item as Product).price)
                                  }
                                </span>
                                {!isCombo && <span className="text-xs text-gray-500">desde</span>}
                              </div>
                              {isCombo && (
                                <span className="text-xs text-green-600 font-medium flex items-center mt-0.5">
                                  <TrendingUp className="w-3 h-3 mr-0.5" />
                                  Ahorra {(item as Combo).discount_percentage}%
                                </span>
                              )}
                            </div>

                            <Button
                              size="sm"
                              onClick={() => isCombo ? handleAddCombo(item as Combo) : handleAddProduct(item as Product)}
                              className="!bg-[#0B8A5F] hover:!bg-[#0B8A5F]/90 !text-white sm:hidden"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => isCombo ? handleAddCombo(item as Combo) : handleAddProduct(item as Product)}
                              className="hover:bg-[#0B8A5F] hover:text-white hover:border-[#0B8A5F] hidden sm:flex"
                            >
                              <Plus className="w-4 h-4 mr-1" />
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
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
