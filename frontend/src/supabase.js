import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if we have real credentials. 
// Otherwise return a dummy object to prevent the entire app from crashing (White Screen fix)
export const supabase = (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL') 
  ? createClient(supabaseUrl, supabaseKey)
  : { auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), getSession: async () => ({ data: { session: null } }) }, from: () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }) }) };
