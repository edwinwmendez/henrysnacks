import { Link } from 'react-router-dom';
import { Package, Plus, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { mockProducts } from '../../data/mockData';
import { useCart } from '../../contexts/CartContext';
import { Product } from '../../types';

interface ComboCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ComboCard({ product, onAddToCart }: ComboCardProps) {
  return (
    <div className="group bg-gradient-to-br from-white to-[#FBFAF7] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-[#F3C64B]/30">
      <Link to={`/producto/${product.slug}`} className="block relative aspect-[16/9] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Combo Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#F3C64B] text-[#5C3A21] px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <Package className="w-4 h-4 mr-1" />
            COMBO
          </span>
        </div>

        {/* Add Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="rounded-full w-10 h-10 p-0 shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Link>

      <div className="p-6 space-y-4">
        <Link to={`/producto/${product.slug}`}>
          <h3 className="text-xl font-bold text-[#5C3A21] hover:text-[#0B8A5F] transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[#0B8A5F]/10">
          <div>
            <span className="text-2xl font-bold text-[#0B8A5F]">
              {formatPrice(product.price)}
            </span>
            {product.tags.includes('familiar') && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Users className="w-3 h-3 mr-1" />
                2-3 personas
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            className="bg-[#F3C64B] hover:bg-[#F3C64B]/90 text-[#5C3A21]"
          >
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Combos() {
  const { addToCart } = useCart();
  const combos = mockProducts.filter(product => product.category === 'combo');

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
    <section id="combos" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 text-[#F3C64B] mb-4">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Mejor valor
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#5C3A21] mb-6">
            Combos Especiales
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nuestras combinaciones favoritas para compartir.
            Ahorra más disfrutando de lo mejor de la Amazonía en un solo pedido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {combos.map(product => (
            <ComboCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
