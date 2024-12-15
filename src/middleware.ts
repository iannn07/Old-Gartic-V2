import { type NextRequest } from 'next/server'

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { validateSession } from './utils/validation/session'

/**
 * * Check if the pathname matches any guest page pattern
 * @param pathname
 * @returns
 */
function isGuestPage(pathname: string): boolean {
  const guestPages = ['/']

  if (guestPages.includes(pathname)) return true

  return false
}

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isGuestPage(pathname)) return NextResponse.next()

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { isValid, user, response } = await validateSession(supabase, request)

  if (!isValid || !user) {
    console.error('Session is invalid:', { isValid, user, response })

    if (
      ['/auth/login', '/auth/register'].some((authPath) =>
        pathname.startsWith(authPath)
      )
    )
      return NextResponse.next()

    return response
  }

  if (
    (pathname.startsWith('/auth/login') ||
      pathname.startsWith('/auth/register')) &&
    isValid
  ) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  const userValidity = {
    Valid: isValid,
    User: user.email,
  }

  console.dir(userValidity, { depth: null, colors: true })

  return supabaseResponse
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
