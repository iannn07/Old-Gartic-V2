'use server'

import createSupabaseServer from './server'

/**
 * * Get public URL of a file in storage
 * @param filename
 * @param source
 * @returns
 */
export async function getPublicStorageURL(filename: string, source: string) {
  const supabase = await createSupabaseServer()

  try {
    const { data } = supabase.storage.from(source).getPublicUrl(filename)

    if (!data) {
      console.error(
        'An error occurred while fetching public storage URL:',
        data
      )

      return { error: 'No data' }
    }

    return data.publicUrl
  } catch (error) {
    console.error(
      'An unexpected error occurred while fetching public storage URL:',
      error
    )

    return error
  }
}
