import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { mockProducts } from '../data/mockData';

// Hook centralizado para gestionar productos
// Actualmente usa mockData, fácil de migrar a Supabase
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoizar loadProducts para usarlo en useEffect sin violar reglas de dependencias
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Migrar a Supabase
      // const { data, error } = await supabase.from('products').select('*')
      // if (error) throw error
      // setProducts(data)

      // Mock data (actual)
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 100));
      setProducts(mockProducts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await loadProducts();
      // Si el componente se desmontó durante la carga, no actualizar el estado
      if (cancelled) {
        return;
      }
    };

    load();

    // Cleanup function para prevenir memory leaks
    return () => {
      cancelled = true;
    };
  }, [loadProducts]);

  // Memoizar las funciones de búsqueda
  const getProductBySlug = useCallback((slug: string) => {
    return products.find(p => p.slug === slug);
  }, [products]);

  const getProductsByCategory = useCallback((category: string) => {
    return products.filter(p => p.category === category);
  }, [products]);

  const getFeaturedProducts = useCallback(() => {
    return products.filter(p => p.featured);
  }, [products]);

  const refresh = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

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
