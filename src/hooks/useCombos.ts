import { useState, useEffect } from 'react';
import { Combo } from '../types';
import { mockCombos } from '../data/mockData';

// Hook centralizado para gestionar combos
// Actualmente usa mockData, fácil de migrar a Supabase
export function useCombos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadCombos();
  }, []);

  const loadCombos = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Migrar a Supabase
      // const { data, error } = await supabase.from('combos').select('*')
      // if (error) throw error
      // setCombos(data)

      // Mock data (actual)
      setCombos(mockCombos);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const getComboBySlug = (slug: string) => {
    return combos.find(c => c.slug === slug);
  };

  const getFeaturedCombos = () => {
    return combos.filter(c => c.featured && c.available);
  };

  const refresh = () => {
    loadCombos();
  };

  return {
    combos,
    loading,
    error,
    getComboBySlug,
    getFeaturedCombos,
    refresh
  };
}
