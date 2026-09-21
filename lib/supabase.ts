import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Cache client instances
let supabaseAdminInstance: SupabaseClient | null = null;
let supabasePublicInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  if (!url || !key) return false;
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  if (url.includes('your-project') || url.includes('placeholder') || key.includes('your-') || key.includes('placeholder')) return false;
  return true;
};

/**
 * Returns the administrative Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 * Used in server-side Route Handlers and Server Components for authoritative operations.
 */
export const getSupabaseAdmin = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (supabaseAdminInstance) return supabaseAdminInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';

  if (!url || !key) return null;

  supabaseAdminInstance = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return supabaseAdminInstance;
};

/**
 * Returns the public Supabase client using NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export const getSupabasePublic = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) return null;
  if (supabasePublicInstance) return supabasePublicInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!url || !key) return null;

  supabasePublicInstance = createClient(url, key);
  return supabasePublicInstance;
};
