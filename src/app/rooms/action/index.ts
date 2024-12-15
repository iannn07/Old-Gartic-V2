'use server'

import { ROOMS_USER } from '@/types/Relationship'
import { ROOMS } from '@/types/Rooms'
import { getCurrentUser } from '@/utils/auth/session'
import createSupabaseServer from '@/utils/supabase/server'
import { getPublicStorageURL } from '@/utils/supabase/storage'
import { revalidatePath, unstable_noStore } from 'next/cache'

/**
 * * Get all rooms from the database
 * @returns
 */
export async function getAllRooms() {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data, error } = await supabase.from('rooms').select('*')

    if (error) {
      console.error('An error occurred while fetching rooms:', error)

      return { data: [], error: error }
    }

    const roomsIcons = await Promise.all(
      data.map(async (room) => {
        const iconImage = await getPublicStorageURL(room.icon, 'room_icon')

        const iconData: ROOMS = {
          ...room,
          icon: iconImage,
        }

        return iconData
      })
    )

    const sortedRooms = roomsIcons.sort((a, b) => {
      const order = ['Germany', 'USSR', 'United States', 'Japan']
      return order.indexOf(a.name) - order.indexOf(b.name)
    })

    return { data: sortedRooms, error: null }
  } catch (error) {
    console.error('An unexpected error occurred while fetching rooms', error)

    return { data: [], error: error }
  }
}

/**
 * * Assign a user to a room
 * @param roomId
 * @returns
 */
export async function assignUserToRoom(roomId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data: currentUser, error: currentUserError } =
      await getCurrentUser()

    if (currentUserError || !currentUser) {
      console.error(
        'An error occurred while fetching current user:',
        currentUserError
      )

      return { data: null, error: currentUserError }
    }

    const { error } = await supabase.from('room_user').insert({
      room_id: roomId,
      user_id: currentUser.id,
    })

    if (error) {
      console.error('An error occurred while assigning user to room:', error)

      return { data: null, error: error }
    }

    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (roomError || !roomData) {
      console.error('An error occurred while fetching room:', roomError)

      return { data: null, error: roomError }
    }

    const updatedActivePlayer = roomData.active_player + 1

    const { data: updatedRoomData, error: updatedRoomError } = await supabase
      .from('rooms')
      .update({ active_player: updatedActivePlayer })
      .eq('id', roomId)
      .single()

    if (updatedRoomError || !updatedRoomData) {
      console.error('An error occurred while updating room:', updatedRoomError)

      return { data: null, error: updatedRoomError }
    }

    revalidatePath('/rooms')

    return { data: updatedRoomData, error: null }
  } catch (error) {
    console.error(
      'An unexpected error occurred while assigning user to room:',
      error
    )

    return { data: null, error: error }
  }
}

/**
 * * Get all users in a room
 * @param roomId
 * @returns
 */
export async function getAllUsersInRoom(roomId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data, error } = await supabase
      .from('room_user')
      .select('*, user(*), rooms(*)')
      .eq('room_id', roomId)

    if (error) {
      console.error('An error occurred while fetching users in room:', error)

      return { data: [], error: error }
    }

    const mappedData: ROOMS_USER[] = data.map((user) => {
      return {
        ...user,
        user: { ...user.user },
        room: { ...user.room },
      }
    })

    return { data: mappedData as ROOMS_USER[], error: null }
  } catch (error) {
    console.error(
      'An unexpected error occurred while fetching users in room:',
      error
    )

    return { data: [], error: error }
  }
}
