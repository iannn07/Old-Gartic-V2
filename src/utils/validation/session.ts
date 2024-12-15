import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

/**
 * * Validate the current session with the last session stored in the browser
 * @param supabase
 * @param request
 * @returns
 */
export async function validateSession(
  supabase: ReturnType<typeof createServerClient>,
  request: NextRequest
) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // If error exists, session might be invalid or expired
  if (error || !user) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))

    return { isValid: false, response }
  }

  return { isValid: true, user }
}
