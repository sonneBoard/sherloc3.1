import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL='https://blzxxascontlfeocjepb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsenh4YXNjb250bGZlb2NqZXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NjcyMTUsImV4cCI6MjA3MjM0MzIxNX0.1mSsCGIn8Nbd1BnSNzx9d6NJHJ_Yn5EoDcIeHdDekns'

// --- MUDANÇA AQUI ---
// Adicionamos um objeto de opções para configurar o Realtime
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})
// --------------------