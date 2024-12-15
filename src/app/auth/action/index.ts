'use server'

import { createSupabaseAdmin } from '@/utils/supabase/admin'
import createSupabaseServer from '@/utils/supabase/server'
import { unstable_noStore } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * * Delete a user from Supabase
 * @param user_id
 * @returns
 */
export async function deleteUser(user_id: string) {
  unstable_noStore()

  const supabaseAdmin = await createSupabaseAdmin()

  try {
    const { error } = await supabaseAdmin.deleteUser(user_id)
    if (error) {
      console.error('Error deleting user:', error.message)

      return null
    }

    return true
  } catch (error) {
    console.error('Error in deleteUser:', error)

    return null
  }
}

/**
 * * Handle user logout
 */
export async function logOut() {
  unstable_noStore()

  console.log('Logging out...')

  // Sign out locally (One Device)
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut({ scope: 'local' })

  console.log('Local signout successful. Redirecting to /auth/login...')

  redirect('/auth/login')
}

/**
 * * Sign in with email and password
 * @param form
 * @returns
 */
export async function signInWithEmail(form: {
  email: string
  password: string
}): Promise<{ success: boolean; message?: string; data?: { userId: string } }> {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  const { email, password } = form

  try {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError || !authData.user) {
      console.error('Error while registering user: ', authError)

      if (authError?.status === 404) {
        return {
          success: false,
          message:
            'User with this email does not exist. Please try to register instead.',
        }
      }

      return { success: false, message: 'Failed to register user' }
    }

    const userId = authData.user?.id

    return { success: true, data: { userId: userId } }
  } catch (error) {
    console.error('An unexpected error during authentication process', error)

    return {
      success: false,
      message: 'An unexpected error occurred during sign in process',
    }
  }
}

/**
 * * Register a user with email and password
 * @param form
 * @returns
 */
export async function registerWithEmail(form: {
  fullName: string
  email: string
  password: string
}): Promise<{ success: boolean; message?: string; data?: { userId: string } }> {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  const { fullName, email, password } = form

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      console.error('Error while registering user: ', authError)

      if (
        authError?.status === 422 ||
        authError?.code === 'user_already_exists'
      ) {
        return {
          success: false,
          message:
            'User with this email already exists. Please try to login instead.',
        }
      }

      return { success: false, message: 'Failed to register user' }
    }

    const userId = authData.user?.id

    const newUserData = {
      name: fullName,
      email: email,
      user_id: userId,
    }

    const { error: userError } = await supabase.from('user').insert(newUserData)

    if (userError) {
      console.error('Error while registering user: ', userError)

      await deleteUser(userId)

      return { success: false, message: 'Failed to register user' }
    }

    return { success: true, data: { userId: userId } }
  } catch (error) {
    console.error('An unexpected error during authentication process', error)

    return {
      success: false,
      message: 'An unexpected error occurred during registration process',
    }
  }
}
