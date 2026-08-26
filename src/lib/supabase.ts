import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let supabase: SupabaseClient

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn(
    '⚠️ Supabase credentials not configured. Auth features are disabled. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
  // Create a mock client that won't crash but won't work
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key')
}

export { supabase }
export default supabase
