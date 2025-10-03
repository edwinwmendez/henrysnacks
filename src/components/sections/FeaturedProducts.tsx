import { Link } from 'react-router-dom';
import { Star, Plus, Leaf } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <Link to={`/producto/${product.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.featured && (
            <span className="bg-[#F3C64B] text-[#5C3A21] px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Destacado
            </span>
          )}
          {product.tags.includes('tradicional') && (
            <span className="bg-[#0B8A5F] text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Leaf className="w-3 h-3 mr-1" />
              Tradicional
            </span>
          )}
        </div>
        
        {/* Add to Cart Button - Floating */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button 
            size="sm" 
            onClick={() => onAddToCart(product)}
            className="rounded-full w-10 h-10 p-0 shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Link>
      
      <div className="p-6 space-y-4">
        {/* Category */}
        <span className="text-[#F48C42] text-sm font-medium uppercase tracking-wide">
          {product.category.replace('-', ' ')}
        </span>
        
        {/* Title */}
        <Link to={`/producto/${product.slug}`}>
          <h3 className="text-xl font-bold text-[#5C3A21] hover:text-[#0B8A5F] transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 2).map(tag => (
            <span key={tag} className="bg-[#FBFAF7] text-[#5C3A21] px-2 py-1 rounded-lg text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-[#0B8A5F]">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-gray-500 ml-1">desde</span>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAddToCart(product)}
            className="group-hover:bg-[#0B8A5F] group-hover:text-white group-hover:border-[#0B8A5F]"
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { addToCart } = useCart();
  const { getFeaturedProducts } = useProducts();
  const featuredProducts = getFeaturedProducts();
  
  const handleAddToCart = (product: Product) => {
    // Add with default options for quick add
    const defaultOptions: Record<string, string> = {};
    product.options.forEach(option => {
      if (option.options.length > 0) {
        defaultOptions[option.id] = option.options[0].id;
      }
    });
    
    addToCart(product, 1, defaultOptions);
  };
  
  return (
    <section id="productos" className="py-20 bg-[#FBFAF7]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-[#F48C42] mb-4">
            <Leaf className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Lo más popular
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-6">
            Productos Destacados
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestros sabores más queridos, preparados con ingredientes frescos 
            de la Amazonía y técnicas tradicionales transmitidas por generaciones.
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="group">
            Ver Todos los Productos
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}