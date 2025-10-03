import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';
import { Product } from '../types';
import {
  Star,
  Leaf,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  Heart
} from 'lucide-react';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { getProductBySlug, getProductsByCategory, loading: productsLoading } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProduct();
  }, [slug, productsLoading]);

  useEffect(() => {
    if (product) {
      calculatePrice();
    }
  }, [product, selectedOptions]);

  const loadProduct = () => {
    if (productsLoading) return;

    const foundProduct = getProductBySlug(slug || '');

    if (foundProduct) {
      setProduct(foundProduct);
      const defaultOptions: Record<string, string> = {};
      foundProduct.options.forEach(option => {
        if (option.options.length > 0) {
          defaultOptions[option.id] = option.options[0].id;
        }
      });
      setSelectedOptions(defaultOptions);

      // Cargar productos relacionados (misma categoría, excluyendo el actual)
      const related = getProductsByCategory(foundProduct.category)
        .filter(p => p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      setProduct(null);
    }
  };

  const calculatePrice = () => {
    if (!product) return;

    let price = product.basePrice;
    product.options.forEach(option => {
      const selectedValue = selectedOptions[option.id];
      if (selectedValue) {
        const choice = option.options.find(opt => opt.id === selectedValue);
        if (choice) {
          price += choice.priceDelta;
        }
      }
    });

    setCurrentPrice(price);
  };

  const handleOptionChange = (optionId: string, choiceId: string) => {
    setSelectedOptions({ ...selectedOptions, [optionId]: choiceId });
  };

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    addToCart(product, quantity, selectedOptions);

    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center text-gray-500">Cargando producto...</div>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
            <a href="/" className="text-[#0B8A5F] hover:underline">Volver al inicio</a>
          </div>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href="/" className="hover:text-[#0B8A5F] transition-colors">Inicio</a>
          <span>/</span>
          <a href="/#productos" className="hover:text-[#0B8A5F] transition-colors">Productos</a>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back button */}
        <a
          href="/#productos"
          className="inline-flex items-center space-x-2 text-[#0B8A5F] hover:text-[#0B8A5F]/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver a productos</span>
        </a>

        {/* Product details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-[#0B8A5F]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category and badges */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-[#F48C42] uppercase tracking-wide">
                {product.category.replace('-', ' ')}
              </span>
              {product.featured && (
                <span className="bg-[#F3C64B] text-[#5C3A21] px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Destacado
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#5C3A21] mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F3C64B] text-[#F3C64B]" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(48 valoraciones)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-[#FBFAF7] text-[#5C3A21] px-3 py-1 rounded-lg text-sm font-medium flex items-center"
                >
                  <Leaf className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ingredientes:</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm"
                  >
                    <Check className="w-3 h-3 inline mr-1" />
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {/* Options */}
            {product.options.map(option => (
              <div key={option.id} className="space-y-3">
                <h3 className="font-semibold text-gray-900">{option.name}:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {option.options.map(choice => {
                    const isSelected = selectedOptions[option.id] === choice.id;
                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleOptionChange(option.id, choice.id)}
                        className={`
                          p-3 rounded-lg border-2 text-left transition-all
                          ${isSelected
                            ? 'border-[#0B8A5F] bg-[#0B8A5F]/5'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{choice.name}</span>
                          {choice.priceDelta !== 0 && (
                            <span className="text-sm text-gray-600">
                              {choice.priceDelta > 0 ? '+' : ''}{formatPrice(choice.priceDelta)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Price and quantity */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Precio total:</p>
                  <p className="text-4xl font-bold text-[#0B8A5F]">
                    {formatPrice(currentPrice * quantity)}
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-2">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  size="lg"
                  className={`flex-1 flex items-center justify-center space-x-2 ${
                    isAdding ? 'bg-green-500 hover:bg-green-500' : ''
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>¡Agregado al Carrito!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      <span>Agregar al Carrito</span>
                    </>
                  )}
                </Button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`
                    w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all
                    ${isFavorite
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-gray-300 text-gray-400 hover:border-gray-400'
                    }
                  `}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2 text-sm">
              {product.available ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">Disponible para entrega inmediata</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">No disponible</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Productos Relacionados */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t pt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5C3A21] mb-8">
              Productos Relacionados
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/producto/${relatedProduct.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#0B8A5F] hover:shadow-lg transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#0B8A5F]">
                        {formatPrice(relatedProduct.price)}
                      </span>

                      {relatedProduct.featured && (
                        <span className="text-xs bg-[#F3C64B] text-[#5C3A21] px-2 py-1 rounded-full font-medium">
                          Destacado
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
