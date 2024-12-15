import { uuidv7 } from 'uuidv7'
import { createSupabaseClient } from './client'

/**
 * * Upload a file to Supabase storage.
 * @param storage
 * @param fileName
 * @param file
 * @returns
 */
async function uploadFileToStorage(
  storage: string,
  fileName: string,
  file: File
): Promise<string | undefined> {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase.storage
    .from(storage)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading file:', error.message)

    return undefined
  }

  return data.path
}

/**
 * * Prepare a file before uploading to Supabase storage.
 * This function will generates filename and uploads the file
 * @param storage
 * @param file
 * @returns
 */
export async function prepareFileBeforeUpload(
  storage: string,
  file: File
): Promise<string | undefined> {
  try {
    const name = uuidv7()
    const extension = file.name.split('.').pop()
    const fileName = `${name}_${Date.now()}.${extension}`

    const path = await uploadFileToStorage(storage, fileName, file)

    if (!path) {
      throw new Error('Failed to upload file')
    }

    return fileName
  } catch (error) {
    throw error
  }
}
