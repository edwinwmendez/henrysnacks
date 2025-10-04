import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Search, CreditCard as Edit, Trash2, X, Save, Package, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProducts } from '../../hooks/useProducts';
import { useCombos } from '../../hooks/useCombos';
import { Combo } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

export function CombosPage() {
  const { products } = useProducts();
  const { combos, loading, refresh } = useCombos();
  const [filteredCombos, setFilteredCombos] = useState<Combo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    filterCombos();
  }, [combos, searchTerm]);

  const filterCombos = () => {
    let filtered = [...combos];

    if (searchTerm) {
      filtered = filtered.filter(combo =>
        combo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        combo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCombos(filtered);
  };

  const handleCreateCombo = () => {
    setEditingCombo({
      id: '',
      name: '',
      slug: '',
      description: '',
      images: [],
      tags: [],
      items: [],
      discount_percentage: 10,
      featured: false,
      available: true,
      createdAt: new Date().toISOString()
    });
    setShowModal(true);
  };

  const handleEditCombo = (combo: Combo) => {
    setEditingCombo(combo);
    setShowModal(true);
  };

  const handleSaveCombo = async () => {
    if (!editingCombo) return;

    try {
      const comboData = {
        ...editingCombo,
        updatedAt: new Date().toISOString(),
      };

      if (editingCombo.id) {
        const { error } = await supabase
          .from('combos')
          .update(comboData)
          .eq('id', editingCombo.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('combos')
          .insert([comboData]);

        if (error) throw error;
      }

      refresh();
      setShowModal(false);
      setEditingCombo(null);
    } catch (error) {
      console.error('Error saving combo:', error);
      alert('Error al guardar el combo');
    }
  };

  const handleDeleteCombo = async (comboId: string) => {
    if (!confirm('¿Estás seguro de eliminar este combo?')) return;

    try {
      const { error } = await supabase
        .from('combos')
        .delete()
        .eq('id', comboId);

      if (error) throw error;
      refresh();
    } catch (error) {
      console.error('Error deleting combo:', error);
      alert('Error al eliminar el combo');
    }
  };

  const toggleProductInCombo = (productId: string) => {
    if (!editingCombo) return;

    const existingItem = editingCombo.items.find(item => item.product_id === productId);

    if (existingItem) {
      // Remover producto
      setEditingCombo({
        ...editingCombo,
        items: editingCombo.items.filter(item => item.product_id !== productId)
      });
    } else {
      // Agregar producto con quantity 1
      setEditingCombo({
        ...editingCombo,
        items: [...editingCombo.items, { product_id: productId, quantity: 1 }]
      });
    }
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (!editingCombo || quantity < 1) return;

    setEditingCombo({
      ...editingCombo,
      items: editingCombo.items.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    });
  };

  const calculateRegularPrice = () => {
    if (!editingCombo) return 0;
    return editingCombo.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.product_id);
      return sum + (product?.basePrice || 0) * item.quantity;
    }, 0);
  };

  const calculateDiscountedPrice = () => {
    if (!editingCombo) return 0;
    const regular = calculateRegularPrice();
    return regular * (1 - editingCombo.discount_percentage / 100);
  };

  return (
    <AdminLayout currentPage="combos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Combos</h1>
            <p className="text-gray-600 mt-1">Crea y administra paquetes especiales de productos</p>
          </div>
          <Button onClick={handleCreateCombo} className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Combo</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar combos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
            />
          </div>
        </div>

        {/* Combos grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full p-8 text-center text-gray-500">Cargando combos...</div>
          ) : filteredCombos.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500">No se encontraron combos</div>
          ) : (
            filteredCombos.map((combo) => {
              const regularPrice = combo.items.reduce((sum, item) => {
                const product = products.find(p => p.id === item.product_id);
                return sum + (product?.basePrice || 0) * item.quantity;
              }, 0);
              const discountedPrice = regularPrice * (1 - combo.discount_percentage / 100);
              const savings = regularPrice - discountedPrice;

              return (
                <div key={combo.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  {combo.images.length > 0 && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={combo.images[0]}
                        alt={combo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{combo.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{combo.description}</p>
                      </div>
                      <div className="ml-2 flex flex-col gap-1">
                        {combo.featured && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          combo.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {combo.available ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>

                    {combo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {combo.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{combo.items.reduce((sum, item) => sum + item.quantity, 0)} productos</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-2xl font-bold text-[#0B8A5F]">
                            {formatPrice(discountedPrice)}
                          </p>
                          {savings > 0 && (
                            <p className="text-sm text-gray-500">
                              Antes: <span className="line-through">{formatPrice(regularPrice)}</span>
                            </p>
                          )}
                        </div>
                        {savings > 0 && (
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-600">
                              Ahorras {formatPrice(savings)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {combo.discount_percentage}% desc.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <button
                        onClick={() => handleEditCombo(combo)}
                        className="flex-1 px-4 py-2 bg-[#0B8A5F] text-white rounded-lg hover:bg-[#0B8A5F]/90 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCombo(combo.id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Combo edit modal */}
      {showModal && editingCombo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingCombo.id ? 'Editar Combo' : 'Nuevo Combo'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del combo
                  </label>
                  <input
                    type="text"
                    value={editingCombo.name}
                    onChange={(e) => setEditingCombo({ ...editingCombo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={editingCombo.slug}
                    onChange={(e) => setEditingCombo({ ...editingCombo, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editingCombo.description}
                  onChange={(e) => setEditingCombo({ ...editingCombo, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imágenes (URLs separadas por coma)
                </label>
                <textarea
                  value={editingCombo.images.join(', ')}
                  onChange={(e) => setEditingCombo({
                    ...editingCombo,
                    images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  rows={2}
                  placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (separados por coma)
                </label>
                <input
                  type="text"
                  value={editingCombo.tags.join(', ')}
                  onChange={(e) => setEditingCombo({
                    ...editingCombo,
                    tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="familiar, económico, popular"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingCombo.discount_percentage}
                  onChange={(e) => setEditingCombo({ ...editingCombo, discount_percentage: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Precio regular: {formatPrice(calculateRegularPrice())} •
                  Precio con descuento: {formatPrice(calculateDiscountedPrice())} •
                  Ahorro: {formatPrice(calculateRegularPrice() - calculateDiscountedPrice())}
                </p>
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Productos incluidos
                </label>
                <div className="space-y-2 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {products.map((product) => {
                    const item = editingCombo.items.find(i => i.product_id === product.id);
                    const isIncluded = !!item;

                    return (
                      <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={() => toggleProductInCombo(product.id)}
                          className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-sm text-gray-500">{formatPrice(product.basePrice)}</p>
                        </div>
                        {isIncluded && (
                          <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-600">Cantidad:</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(product.id, parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingCombo.featured}
                    onChange={(e) => setEditingCombo({ ...editingCombo, featured: e.target.checked })}
                    className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                  />
                  <span className="text-sm text-gray-700">Destacado</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingCombo.available}
                    onChange={(e) => setEditingCombo({ ...editingCombo, available: e.target.checked })}
                    className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                  />
                  <span className="text-sm text-gray-700">Disponible</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCombo} className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
