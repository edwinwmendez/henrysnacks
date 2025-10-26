import { useState, useEffect, useCallback } from 'react';
import { Combo } from '../types';
import { mockCombos } from '../data/mockData';

// Hook centralizado para gestionar combos
// Actualmente usa mockData, fácil de migrar a Supabase
export function useCombos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoizar loadCombos para usarlo en useEffect sin violar reglas de dependencias
  const loadCombos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Migrar a Supabase
      // const { data, error } = await supabase.from('combos').select('*')
      // if (error) throw error
      // setCombos(data)

      // Mock data (actual)
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 100));
      setCombos(mockCombos);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      await loadCombos();
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
  }, [loadCombos]);

  // Memoizar las funciones de búsqueda
  const getComboBySlug = useCallback((slug: string) => {
    return combos.find(c => c.slug === slug);
  }, [combos]);

  const getFeaturedCombos = useCallback(() => {
    return combos.filter(c => c.featured && c.available);
  }, [combos]);

  const refresh = useCallback(() => {
    loadCombos();
  }, [loadCombos]);

  return {
    combos,
    loading,
    error,
    getComboBySlug,
    getFeaturedCombos,
    refresh
  };
}
