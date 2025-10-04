import { Package, Plus, Users, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatPrice } from '../../lib/utils';
import { useProducts } from '../../hooks/useProducts';
import { useCombos } from '../../hooks/useCombos';
import { useCart } from '../../contexts/CartContext';
import { Combo } from '../../types';

interface ComboCardProps {
  combo: Combo;
  onAddToCart: (combo: Combo) => void;
  regularPrice: number;
  discountedPrice: number;
}

function ComboCard({ combo, onAddToCart, regularPrice, discountedPrice }: ComboCardProps) {
  const { products } = useProducts();

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Producto';
  };

  const savings = regularPrice - discountedPrice;

  return (
    <div className="group bg-gradient-to-br from-white to-[#FBFAF7] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-[#F3C64B]/30">
      <div className="block relative aspect-[16/9] overflow-hidden">
        <img
          src={combo.images[0]}
          alt={combo.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* Combo Badge */}
        <div className="absolute top-3 left-3">
          <span className="!bg-[#F3C64B] !text-[#5C3A21] px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
            <Package className="w-4 h-4 mr-1 fill-current" />
            COMBO
          </span>
        </div>

        {/* Discount Badge */}
        <div className="absolute top-3 right-3">
          <span className="!bg-red-600 !text-white px-3 py-1 rounded-full text-sm font-bold flex items-center shadow-lg">
            <Tag className="w-4 h-4 mr-1 fill-current" />
            -{combo.discount_percentage}%
          </span>
        </div>

        {/* Add Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(combo);
            }}
            className="rounded-full w-10 h-10 p-0 shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-[#5C3A21]">
            {combo.name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {combo.description}
        </p>

        {/* Included Products */}
        <div className="bg-[#0B8A5F]/5 rounded-lg p-3">
          <p className="text-xs font-semibold text-[#0B8A5F] mb-2">Incluye:</p>
          <ul className="space-y-1">
            {combo.items.map((item, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-[#F3C64B] rounded-full mr-2"></span>
                {item.quantity}x {getProductName(item.product_id)}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#0B8A5F]/10">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-[#0B8A5F]">
                {formatPrice(discountedPrice)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(regularPrice)}
              </span>
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              Ahorras {formatPrice(savings)}
            </div>
            {combo.tags.includes('familiar') && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Users className="w-3 h-3 mr-1" />
                2-3 personas
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => onAddToCart(combo)}
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
  const { addComboToCart } = useCart();
  const { combos } = useCombos();
  const { products } = useProducts();

  const calculateComboPrice = (combo: Combo) => {
    const regularPrice = combo.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + (product?.basePrice || 0) * item.quantity;
    }, 0);
    const discountedPrice = regularPrice * (1 - combo.discount_percentage / 100);
    return { regularPrice, discountedPrice };
  };

  const handleAddToCart = (combo: Combo) => {
    addComboToCart(combo, 1);
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
          {combos.filter(c => c.available).map(combo => {
            const { regularPrice, discountedPrice } = calculateComboPrice(combo);
            return (
              <ComboCard
                key={combo.id}
                combo={combo}
                onAddToCart={handleAddToCart}
                regularPrice={regularPrice}
                discountedPrice={discountedPrice}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
