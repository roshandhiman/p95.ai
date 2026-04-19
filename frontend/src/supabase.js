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

// Log environment status for debugging (browser console)
console.log('--- Supabase Config Check ---');
console.log('URL status:', isValidUrl(supabaseUrl) ? 'VALID' : 'INVALID/MISSING');
console.log('Key status:', supabaseKey ? 'PRESENT' : 'MISSING');

// The Mock Object (fallback for development/errors)
const mockSupabase = { 
  auth: { 
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), 
    getSession: async () => ({ 
      data: { 
        session: localStorage.getItem('demo_mode') === 'true' 
          ? { access_token: 'demo-token', user: { email: 'demo@p95.ai' } } 
          : null 
      } 
    }),
    signInWithPassword: async ({ email }) => ({ 
      data: { user: { email }, session: { access_token: 'demo-token' } },
      error: null 
    }),
    signUp: async () => ({ error: { message: 'Supabase URL not configured' } }),
    signOut: async () => {
      localStorage.removeItem('demo_mode');
      return { error: null };
    }
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

// Initialize Supabase with extreme safety to avoid "Blank Screen" crashes
export const supabase = (() => {
  if (!isValidUrl(supabaseUrl) || !supabaseKey) {
    console.warn("Supabase not configured. Falling back to mock.");
    return mockSupabase;
  }
  
  try {
    console.log("Connecting to Supabase production...");
    return createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Supabase Initialization Crash:", e.message);
    return mockSupabase;
  }
})();
