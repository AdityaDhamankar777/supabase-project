import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SUPABASE_URL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bHdpbm5haHV1Z3pydGN3eXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTkzNTQsImV4cCI6MjA3MzU5NTM1NH0.O74mjEkUiFdBrWaFU0dxFqrWHXoL5R-_yro-EPsBGX4'
const SUPABASE_KEY = 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

