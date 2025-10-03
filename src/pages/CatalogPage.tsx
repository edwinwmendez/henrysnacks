import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Button } from '../components/ui/Button';
import { Search, SlidersHorizontal, X, Package, Star, Plus } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import { formatPrice } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';

const categories = [
  { id: 'all', label: 'Todos', value: 'all' },
  { id: 'chifles-verde', label: 'Chifles Verde', value: 'chifles-verde' },
  { id: 'chifles-maduro', label: 'Chifles Maduro', value: 'chifles-maduro' },
  { id: 'yuca', label: 'Yuca', value: 'yuca' },
  { id: 'camote', label: 'Camote', value: 'camote' },
  { id: 'combo', label: 'Combos', value: 'combo' },
];

export function CatalogPage() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    const defaultOptions: Record<string, string> = {};
    product.options.forEach(option => {
      if (option.options.length > 0) {
        defaultOptions[option.id] = option.options[0].id;
      }
    });
    addToCart(product, 1, defaultOptions);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FBFAF7] py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-4">
              Tienda Amazonía Crujiente
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
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda o filtros
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <Link to={`/producto/${product.slug}`} className="block relative aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.featured && (
                        <span className="bg-[#F3C64B] text-[#5C3A21] px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </span>
                      )}
                      {product.category === 'combo' && (
                        <span className="bg-[#0B8A5F] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center w-fit">
                          <Package className="w-3 h-3 mr-1" />
                          Combo
                        </span>
                      )}
                    </div>

                    {/* Quick Add */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="rounded-full w-10 h-10 p-0 shadow-lg"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </Link>

                  <div className="p-4 space-y-3">
                    <span className="text-[#F48C42] text-xs font-medium uppercase tracking-wide">
                      {product.category.replace('-', ' ')}
                    </span>

                    <Link to={`/producto/${product.slug}`}>
                      <h3 className="text-lg font-bold text-[#5C3A21] hover:text-[#0B8A5F] transition-colors cursor-pointer line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-xl font-bold text-[#0B8A5F]">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">desde</span>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddToCart(product)}
                        className="hover:bg-[#0B8A5F] hover:text-white hover:border-[#0B8A5F]"
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
