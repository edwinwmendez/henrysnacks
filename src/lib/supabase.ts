import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Gracefully handle missing env vars instead of crashing at module load
export const supabase: SupabaseClient = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as SupabaseClient, {
      get() {
        console.warn('Supabase not configured: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
        return () => ({ data: null, error: new Error('Supabase not configured') });
      },
    });

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
