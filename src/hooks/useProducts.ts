import { useState, useEffect } from 'react';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';

// Hook centralizado para gestionar productos
// Actualmente usa mockData, fácil de migrar a Supabase
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Migrar a Supabase
      // const { data, error } = await supabase.from('products').select('*')
      // if (error) throw error
      // setProducts(data)

      // Mock data (actual)
      setProducts(mockProducts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const getProductBySlug = (slug: string) => {
    return products.find(p => p.slug === slug);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category);
  };

  const getFeaturedProducts = () => {
    return products.filter(p => p.featured);
  };

  const refresh = () => {
    loadProducts();
  };

  return {
    products,
    loading,
    error,
    getProductBySlug,
    getProductsByCategory,
    getFeaturedProducts,
    refresh
  };
}
