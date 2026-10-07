import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase para uso no servidor e client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Criar cliente apenas se variáveis estiverem disponíveis
export const supabaseServerClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// Exportar função para verificar configuração
export const isSupabaseServerConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
}