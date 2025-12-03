
import { createClient } from '@supabase/supabase-js';

// Acesso seguro às variáveis de ambiente.
// Em alguns ambientes, import.meta.env pode ser undefined, então verificamos antes.
const env = (import.meta as any).env || {};

const envUrl = env.VITE_SUPABASE_URL;
const envKey = env.VITE_SUPABASE_ANON_KEY;

// Valores de Fallback (Reserva) para garantir que o preview funcione
// mesmo se o arquivo .env não for carregado corretamente pelo ambiente de sandbox.
const FALLBACK_URL = "https://lmbevoblimlwqkbubdwx.supabase.co";
const FALLBACK_KEY = "sb_publishable_SXLQnwzjM_2_SizZQYCUkg_NwBeyZKT";

const supabaseUrl = envUrl || FALLBACK_URL;
const supabaseKey = envKey || FALLBACK_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ As chaves do Supabase não foram encontradas. O login não funcionará.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
