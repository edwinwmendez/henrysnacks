import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Search, CreditCard as Edit, Trash2, X, Save, Trash } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProducts } from '../../hooks/useProducts';
import { Product, ProductOption } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { useToast } from '../../contexts/ToastContext';

export function ProductsPage() {
  const { toast, confirm: confirmDialog } = useToast();
  const { products, loading, refresh } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleCreateProduct = () => {
    setEditingProduct({
      id: '',
      name: '',
      slug: '',
      category: 'chifles-verde',
      description: '',
      price: 0,
      basePrice: 0,
      images: [],
      options: [],
      tags: [],
      ingredients: [],
      featured: false,
      available: true,
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    try {
      const productData = {
        ...editingProduct,
        updated_at: new Date().toISOString(),
      };

      if (editingProduct.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      }

      refresh();
      setShowModal(false);
      setEditingProduct(null);
      toast('Producto guardado exitosamente');
    } catch (error) {
      console.error('Error saving product:', error);
      toast('Error al guardar el producto', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = await confirmDialog('¿Estás seguro de eliminar este producto?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      refresh();
      toast('Producto eliminado');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast('Error al eliminar el producto', 'error');
    }
  };

  return (
    <AdminLayout currentPage="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600 mt-1">Administra el catálogo de productos</p>
          </div>
          <Button onClick={handleCreateProduct} className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="chifles-verde">Chifles Verde</option>
              <option value="chifles-maduro">Chifles Maduro</option>
              <option value="yuca">Yuca</option>
              <option value="camote">Camote</option>
              <option value="combo">Combos</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 flex flex-col items-center gap-3 text-gray-500">
              <Spinner />
              <span>Cargando productos...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No se encontraron productos</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destacado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{product.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.available
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.available ? 'Disponible' : 'No disponible'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.featured ? 'Sí' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-[#0B8A5F] hover:text-[#0B8A5F]/80 transition-colors inline-flex items-center"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product edit modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
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
                    Nombre del producto
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                  >
                    <option value="chifles-verde">Chifles Verde</option>
                    <option value="chifles-maduro">Chifles Maduro</option>
                    <option value="yuca">Yuca</option>
                    <option value="camote">Camote</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Base
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.basePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Display
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
              </div>

              {/* Imágenes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Imágenes
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({
                      ...editingProduct,
                      images: [...editingProduct.images, '']
                    })}
                    className="text-sm text-[#0B8A5F] hover:text-[#0B8A5F]/80"
                  >
                    + Agregar imagen
                  </button>
                </div>
                <div className="space-y-3">
                  {editingProduct.images.map((url, imgIndex) => (
                    <div key={imgIndex} className="flex items-start gap-3">
                      {url && (
                        <img
                          src={url}
                          alt={`Imagen ${imgIndex + 1}`}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200 shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => {
                          const newImages = [...editingProduct.images];
                          newImages[imgIndex] = e.target.value;
                          setEditingProduct({ ...editingProduct, images: newImages });
                        }}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = editingProduct.images.filter((_, i) => i !== imgIndex);
                          setEditingProduct({ ...editingProduct, images: newImages });
                        }}
                        className="text-red-500 hover:text-red-700 p-2 shrink-0"
                        aria-label="Eliminar imagen"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {editingProduct.images.length === 0 && (
                    <p className="text-sm text-gray-400 py-2">No hay imágenes. Agrega al menos una.</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (separados por coma)
                </label>
                <input
                  type="text"
                  value={editingProduct.tags.join(', ')}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
                  placeholder="tradicional, crujiente, sin gluten"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
              </div>

              {/* Ingredientes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredientes (separados por coma)
                </label>
                <textarea
                  value={editingProduct.ingredients.join(', ')}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    ingredients: e.target.value.split(',').map(ing => ing.trim()).filter(ing => ing)
                  })}
                  rows={2}
                  placeholder="Plátano verde, Aceite vegetal, Sal marina"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B8A5F] focus:border-transparent"
                />
              </div>

              {/* Opciones del Producto */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Opciones del Producto</h4>
                  <Button
                    onClick={() => {
                      const newOption: ProductOption = {
                        id: `option-${Date.now()}`,
                        name: 'Nueva Opción',
                        type: 'size',
                        options: []
                      };
                      setEditingProduct({
                        ...editingProduct,
                        options: [...editingProduct.options, newOption]
                      });
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Opción
                  </Button>
                </div>

                <div className="space-y-6">
                  {editingProduct.options.map((option, optionIndex) => (
                    <div key={option.id} className="bg-gray-50 rounded-lg p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                          <input
                            type="text"
                            value={option.id}
                            onChange={(e) => {
                              const newOptions = [...editingProduct.options];
                              newOptions[optionIndex].id = e.target.value;
                              setEditingProduct({ ...editingProduct, options: newOptions });
                            }}
                            placeholder="ID (ej: size, protein)"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) => {
                              const newOptions = [...editingProduct.options];
                              newOptions[optionIndex].name = e.target.value;
                              setEditingProduct({ ...editingProduct, options: newOptions });
                            }}
                            placeholder="Nombre (ej: Tamaño)"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <select
                            value={option.type}
                            onChange={(e) => {
                              const newOptions = [...editingProduct.options];
                              newOptions[optionIndex].type = e.target.value as any;
                              setEditingProduct({ ...editingProduct, options: newOptions });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="size">Tamaño</option>
                            <option value="protein">Proteína</option>
                            <option value="topping">Topping</option>
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            const newOptions = editingProduct.options.filter((_, i) => i !== optionIndex);
                            setEditingProduct({ ...editingProduct, options: newOptions });
                          }}
                          className="ml-3 text-red-600 hover:text-red-800"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Sub-opciones */}
                      <div className="ml-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Variantes</span>
                          <button
                            onClick={() => {
                              const newOptions = [...editingProduct.options];
                              newOptions[optionIndex].options.push({
                                id: `choice-${Date.now()}`,
                                name: 'Nueva Variante',
                                priceDelta: 0
                              });
                              setEditingProduct({ ...editingProduct, options: newOptions });
                            }}
                            className="text-sm text-[#0B8A5F] hover:text-[#0B8A5F]/80"
                          >
                            + Agregar Variante
                          </button>
                        </div>

                        {option.options.map((choice, choiceIndex) => (
                          <div key={choice.id} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={choice.id}
                              onChange={(e) => {
                                const newOptions = [...editingProduct.options];
                                newOptions[optionIndex].options[choiceIndex].id = e.target.value;
                                setEditingProduct({ ...editingProduct, options: newOptions });
                              }}
                              placeholder="ID"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="text"
                              value={choice.name}
                              onChange={(e) => {
                                const newOptions = [...editingProduct.options];
                                newOptions[optionIndex].options[choiceIndex].name = e.target.value;
                                setEditingProduct({ ...editingProduct, options: newOptions });
                              }}
                              placeholder="Nombre"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="number"
                              step="0.01"
                              value={choice.priceDelta}
                              onChange={(e) => {
                                const newOptions = [...editingProduct.options];
                                newOptions[optionIndex].options[choiceIndex].priceDelta = parseFloat(e.target.value);
                                setEditingProduct({ ...editingProduct, options: newOptions });
                              }}
                              placeholder="Precio"
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <button
                              onClick={() => {
                                const newOptions = [...editingProduct.options];
                                newOptions[optionIndex].options = newOptions[optionIndex].options.filter((_, i) => i !== choiceIndex);
                                setEditingProduct({ ...editingProduct, options: newOptions });
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-6 border-t">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.available}
                    onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                    className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                  />
                  <span className="text-sm text-gray-700">Disponible</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="rounded border-gray-300 text-[#0B8A5F] focus:ring-[#0B8A5F]"
                  />
                  <span className="text-sm text-gray-700">Destacado</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveProduct} className="flex items-center space-x-2">
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
