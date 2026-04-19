import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Robust URL check: Must be a string starting with http
const isValidUrl = (url) => {
  try {
    return url && typeof url === 'string' && url.startsWith('http');
  } catch (e) {
    return false;
  }
};

// Initialize Supabase only if URL is valid. 
// Otherwise, use a mock object to prevent the "White Screen" crash.
export const supabase = isValidUrl(supabaseUrl)
  ? createClient(supabaseUrl, supabaseKey)
  : { 
      auth: { 
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), 
        getSession: async () => ({ data: { session: null } }),
        signInWithPassword: async () => ({ error: { message: 'Supabase URL not configured' } }),
        signUp: async () => ({ error: { message: 'Supabase URL not configured' } }),
        signOut: async () => ({ error: null })
      }, 
      from: () => ({ 
        select: () => ({ 
          eq: () => ({ 
            single: () => ({ data: null, error: null }) 
          }) 
        }),
        upsert: async () => ({ error: { message: 'Supabase not configured' } })
      }) 
    };
