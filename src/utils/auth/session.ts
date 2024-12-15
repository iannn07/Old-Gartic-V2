'use server'

import { USER } from '@/types/User'
import { unstable_noStore } from 'next/cache'
import createSupabaseServer from '../supabase/server'

export async function getCurrentUser() {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getUser()

    if (sessionError) {
      console.error(
        'An error occurred while fetching the current user:',
        sessionError
      )

      return { data: null, sessionError }
    }

    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('*')
      .eq('user_id', sessionData.user.id)
      .single()

    if (userError) {
      console.error(
        'An error occurred while fetching the current user:',
        userError
      )

      return { data: null, userError }
    }

    return { data: userData as USER, error: null }
  } catch (error) {
    console.error(
      'An unexpected error occurred during fetching the current user:',
      error
    )

    return { data: null, error }
  }
}
