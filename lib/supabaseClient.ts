import { createClient } from '@supabase/supabase-js';

// Tenta ler do ambiente (Vercel/Local)
// Em produção (Vercel), import.meta.env.VITE_... funcionará se configurado no painel.
// Cast import.meta to any to avoid "Property 'env' does not exist on type 'ImportMeta'" error
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Fallback APENAS para a chave pública (não tem problema grave de segurança expor a anon key e URL)
// Isso garante que o preview continue funcionando se a env falhar.
const FALLBACK_URL = "https://lmbevoblimlwqkbubdwx.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYmV2b2JsaW1sd3FrYnViZHd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MTk5OTQsImV4cCI6MjA4MDI5NTk5NH0.EYJM4-Qy7PG_joPnsGzhpCi988iZdXzXu08xDELbpbc";

const supabaseUrl = envUrl || FALLBACK_URL;
const supabaseKey = envKey || FALLBACK_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);