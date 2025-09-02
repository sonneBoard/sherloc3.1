import { createClient } from '@supabase/supabase-js'

// Acessa as variáveis de ambiente que criamos no arquivo .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Cria e exporta o cliente Supabase para ser usado em outras partes do projeto
export const supabase = createClient(supabaseUrl, supabaseAnonKey)