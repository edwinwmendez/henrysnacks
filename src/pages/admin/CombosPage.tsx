import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Search, CreditCard as Edit, Trash2, X, Save, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';

interface Combo {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_percentage: number;
  product_ids: string[];
  images: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredCombos, setFilteredCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCombos();
  }, [combos, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [combosRes, productsRes] = await Promise.all([
        supabase.from('combos').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*')
      ]);

      if (combosRes.error) throw combosRes.error;
      if (productsRes.error) throw productsRes.error;

      setCombos(combosRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

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
      price: 0,
      discount_percentage: 0,
      product_ids: [],
      images: [],
      active: true,
      created_at: '',
      updated_at: '',
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
        updated_at: new Date().toISOString(),
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

      await loadData();
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
      await loadData();
    } catch (error) {
      console.error('Error deleting combo:', error);
      alert('Error al eliminar el combo');
    }
  };

  const toggleProductInCombo = (productId: string) => {
    if (!editingCombo) return;

    const productIds = editingCombo.product_ids.includes(productId)
      ? editingCombo.product_ids.filter(id => id !== productId)
      : [...editingCombo.product_ids, productId];

    setEditingCombo({ ...editingCombo, product_ids: productIds });
  };

  const calculateRegularPrice = () => {
    if (!editingCombo) return 0;
    return editingCombo.product_ids.reduce((sum, id) => {
      const product = products.find(p => p.id === id);
      return sum + (product?.price || 0);
    }, 0);
  };

  return (
    <AdminLayout currentPage="combos">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Combos</h1>
            <p className="text-gray-600 mt-1">Crea y administra paquetes especiales</p>
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
              const regularPrice = combo.product_ids.reduce((sum, id) => {
                const product = products.find(p => p.id === id);
                return sum + (product?.price || 0);
              }, 0);
              const savings = regularPrice - combo.price;

              return (
                <div key={combo.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{combo.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{combo.description}</p>
                      </div>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        combo.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {combo.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{combo.product_ids.length} productos</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <p className="text-2xl font-bold text-[#0B8A5F]">
                            {formatPrice(combo.price)}
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
                              {Math.round((savings / regularPrice) * 100)}% desc.
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio del combo
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingCombo.price}
                  onChange={(e) => setEditingCombo({ ...editingCombo, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
                {editingCombo.product_ids.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Precio regular: {formatPrice(calculateRegularPrice())} •
                    Ahorro: {formatPrice(Math.max(0, calculateRegularPrice() - editingCombo.price))}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Productos incluidos
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={editingCombo.product_ids.includes(product.id)}
                        onChange={() => toggleProductInCombo(product.id)}
                        className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editingCombo.active}
                  onChange={(e) => setEditingCombo({ ...editingCombo, active: e.target.checked })}
                  className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                />
                <label className="text-sm text-gray-700">Combo activo</label>
              </div>

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
