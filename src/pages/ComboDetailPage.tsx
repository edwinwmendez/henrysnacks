import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useCombos } from '../hooks/useCombos';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { Combo } from '../types';
import {
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Package,
  Tag
} from 'lucide-react';

export function ComboDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addComboToCart } = useCart();
  const { products } = useProducts();
  const { getComboBySlug, combos, loading: combosLoading } = useCombos();
  const [combo, setCombo] = useState<Combo | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [relatedCombos, setRelatedCombos] = useState<Combo[]>([]);
  const [regularPrice, setRegularPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  useEffect(() => {
    loadCombo();
  }, [slug, combosLoading]);

  useEffect(() => {
    if (combo) {
      calculatePrice();
    }
  }, [combo, products]);

  const loadCombo = () => {
    if (combosLoading) return;

    const foundCombo = getComboBySlug(slug || '');

    if (foundCombo) {
      setCombo(foundCombo);

      // Cargar combos relacionados (excluyendo el actual)
      const related = combos
        .filter(c => c.id !== foundCombo.id && c.available)
        .slice(0, 4);
      setRelatedCombos(related);
    } else {
      setCombo(null);
    }
  };

  const calculatePrice = () => {
    if (!combo) return;

    const regular = combo.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + (product?.basePrice || 0) * item.quantity;
    }, 0);

    const discounted = regular * (1 - combo.discount_percentage / 100);

    setRegularPrice(regular);
    setDiscountedPrice(discounted);
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Producto';
  };

  const handleAddToCart = () => {
    if (!combo) return;
    setIsAdding(true);
    addComboToCart(combo, quantity);

    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  if (combosLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#FBFAF7] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B8A5F] mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando combo...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!combo) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#FBFAF7] py-16">
          <div className="container mx-auto px-4 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Combo no encontrado</h2>
            <p className="text-gray-600 mb-8">El combo que buscas no existe o no está disponible</p>
            <Link to="/tienda">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la Tienda
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FBFAF7] py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-[#0B8A5F]">Inicio</Link>
            <span>/</span>
            <Link to="/tienda" className="hover:text-[#0B8A5F]">Tienda</Link>
            <span>/</span>
            <span className="text-[#5C3A21] font-medium">{combo.name}</span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={combo.images[selectedImage]}
                  alt={combo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#F3C64B] text-[#5C3A21] px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <Package className="w-4 h-4 mr-1 fill-current" />
                    COMBO
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <Tag className="w-4 h-4 mr-1 fill-current" />
                    -{combo.discount_percentage}% OFF
                  </span>
                </div>
              </div>

              {combo.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {combo.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-[#0B8A5F]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={image} alt={`${combo.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#5C3A21] mb-2">
                  {combo.name}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {combo.description}
                </p>
              </div>

              {/* Tags */}
              {combo.tags && combo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {combo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#0B8A5F]/10 text-[#0B8A5F] rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Included Products */}
              <div className="bg-[#0B8A5F]/5 rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#5C3A21] mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-[#0B8A5F]" />
                  Este combo incluye:
                </h3>
                <ul className="space-y-3">
                  {combo.items.map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-[#0B8A5F] mr-3" />
                      <span className="font-medium">{item.quantity}x</span>
                      <span className="ml-2">{getProductName(item.product_id)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-3xl font-bold text-[#0B8A5F]">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(regularPrice)}
                  </span>
                </div>
                <p className="text-green-600 font-medium">
                  ¡Ahorras {formatPrice(regularPrice - discountedPrice)}!
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <label className="block text-sm font-semibold text-[#5C3A21] mb-3">
                  Cantidad
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-bold text-[#0B8A5F]">{formatPrice(discountedPrice * quantity)}</span>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full text-lg py-6 ${
                  isAdding
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-[#F3C64B] hover:bg-[#F3C64B]/90 text-[#5C3A21]'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    ¡Agregado al Carrito!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Agregar al Carrito
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Related Combos */}
          {relatedCombos.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl md:text-3xl font-bold text-[#5C3A21] mb-8">
                Otros Combos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCombos.map(relatedCombo => {
                  const relatedRegular = relatedCombo.items.reduce((sum, item) => {
                    const product = products.find(p => p.id === item.product_id);
                    return sum + (product?.basePrice || 0) * item.quantity;
                  }, 0);
                  const relatedDiscounted = relatedRegular * (1 - relatedCombo.discount_percentage / 100);

                  return (
                    <Link
                      key={relatedCombo.id}
                      to={`/combo/${relatedCombo.slug}`}
                      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={relatedCombo.images[0]}
                          alt={relatedCombo.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {relatedCombo.featured && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-[#F3C64B] text-[#5C3A21] px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-md">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Destacado
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-[#5C3A21] line-clamp-1 group-hover:text-[#0B8A5F] transition-colors">
                          {relatedCombo.name}
                        </h3>
                        <div className="flex items-baseline space-x-2 mt-2">
                          <span className="text-lg font-bold text-[#0B8A5F]">
                            {formatPrice(relatedDiscounted)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(relatedRegular)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
