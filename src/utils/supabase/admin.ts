import { createClient } from '@supabase/supabase-js'

/**
 * * Get the admin auth client
 * @returns
 */
export async function createSupabaseAdmin() {
  const supabaseAdminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  return supabaseAdminClient.auth.admin
}
