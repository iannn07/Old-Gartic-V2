'use server'

import { GAME } from '@/types/Game'
import { PAINTING } from '@/types/Painting'
import { ROOMS_USER } from '@/types/Relationship'
import { ROOMS } from '@/types/Rooms'
import { USER } from '@/types/User'
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
 * * Get a single room from the database
 * @param roomId
 * @returns
 */
export async function getSingleRoom(roomId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single()

    if (error) {
      console.error('An error occurred while fetching room:', error)

      return { data: null, error: error }
    }

    const iconImage = await getPublicStorageURL(data.icon, 'room_icon')

    const roomData: ROOMS = {
      ...data,
      icon: iconImage,
    }

    return { data: roomData, error: null }
  } catch (error) {
    console.error('An unexpected error occurred while fetching room:', error)

    return { data: null, error: error }
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
 * * Remove a user from a room
 * @param roomId
 * @returns
 */
export async function removeUserFromRoom(roomId: string) {
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

    const { error } = await supabase
      .from('room_user')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', currentUser.id)

    if (error) {
      console.error('An error occurred while exiting room:', error)

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

    const updatedActivePlayer = roomData.active_player - 1

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
    revalidatePath(`/rooms/${roomId}`)
  } catch (error) {
    console.error('An unexpected error occurred while exiting room:', error)

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

/**
 * * Assign the first user as the host
 * @param roomId
 * @returns
 */
export async function assignFirstUserAsHost(roomId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data: currentHost, error: hostError } = await supabase
      .from('room_user')
      .select('*, user(*)')
      .eq('room_id', roomId)
      .eq('is_host', true)
      .single()

    if (hostError && hostError.code !== 'PGRST116') {
      console.error('An error occurred while fetching host:', hostError)

      return { ableToStart: false, data: null, error: hostError }
    }

    if (currentHost)
      return { ableToStart: true, data: currentHost.user as USER, error: null }

    const { data: players, error: playersError } = await supabase
      .from('room_user')
      .select('*, user(*)')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true })

    if (playersError || !players) {
      console.error('An error occurred while fetching players:', playersError)

      return { ableToStart: false, data: null, error: playersError }
    }

    if (!players || players.length < 2) {
      return { ableToStart: false, data: null, error: null }
    }

    const host = players[0]
    const { error: updateHostError } = await supabase
      .from('room_user')
      .update({ is_host: true })
      .eq('id', host.id)

    if (updateHostError) {
      console.error('An error occurred while assigning host:', updateHostError)

      return { ableToStart: false, data: null, error: updateHostError }
    }

    return { ableToStart: true, data: host.user as USER, error: null }
  } catch (error) {
    console.error('An unexpected error occurred while assigning host:', error)

    return { ableToStart: false, data: null, error: error }
  }
}

/**
 * * Check if the game has started
 * @param roomId
 * @returns
 */
export async function checkIfTheGameStarted(roomId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data, error } = await supabase
      .from('room_user')
      .select('*')
      .not('game_id', 'is', null)
      .eq('room_id', roomId)

    if ((error && error.code === 'PGRST116') || data?.length === 0) {
      console.error('The game has not started yet:', error)

      return { ableToStart: true, data: null, error: null }
    }

    if (error) {
      console.error('An error occurred while checking game:', error)

      return { ableToStart: false, data: null, error: error }
    }

    const { data: gameData, error: gameError } = await supabase
      .from('game')
      .select('*')
      .eq('id', data[0].game_id)
      .single()

    if (gameError) {
      console.error('An error occurred while fetching game:', gameError)

      return { ableToStart: false, data: null, error: gameError }
    }

    console.log('The game has started:', data)

    return { ableToStart: false, data: gameData as GAME, error: null }
  } catch (error) {
    console.error('An unexpected error occurred while checking game:', error)

    return { ableToStart: false, data: null, error: error }
  }
}

/**
 * * Start the game
 * @param roomId
 * @param hostId
 * @returns
 */
export async function startGame(roomId: string, hostId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data: gameData, error: gameError } = await supabase
      .from('game')
      .insert({
        current_turn: hostId,
        updated_at: new Date().toLocaleString(),
      })
      .select('*')
      .single()

    if (gameError) {
      console.error('An error occurred while starting game:', gameError)

      return { data: null, error: gameError }
    }

    const newGame: GAME = gameData

    const { error } = await supabase
      .from('room_user')
      .update({ game_id: newGame.id })
      .eq('room_id', roomId)

    if (error) {
      console.error('An error occurred while updating room:', error)

      return { data: null, error: error }
    }

    revalidatePath(`/rooms/${roomId}`)

    return { data: gameData, error: null }
  } catch (error) {
    console.error('An unexpected error occurred while starting game:', error)

    return { data: null, error: error }
  }
}

/**
 * * End the game
 * @param roomId
 * @returns
 */
export async function endGame(roomId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data: roomUserData, error: roomUserDataError } = await supabase
      .from('room_user')
      .select('*')
      .not('game_id', 'is', null)
      .eq('room_id', roomId)

    if (roomUserDataError) {
      console.error(
        'An error occurred while fetching ongoing game:',
        roomUserDataError
      )

      return { success: false, error: roomUserDataError }
    }

    const { error: gameError } = await supabase
      .from('game')
      .delete()
      .eq('id', roomUserData[0].game_id)
      .single()

    if (gameError) {
      console.error('An error occurred while ending game:', gameError)

      return { success: false, error: gameError }
    }

    const { error: updateRoomUserDataError } = await supabase
      .from('room_user')
      .delete()
      .eq('room_id', roomId)

    if (updateRoomUserDataError) {
      console.error(
        'An error occurred while updating room user data after ending game:',
        updateRoomUserDataError
      )

      return { success: false, error: updateRoomUserDataError }
    }

    const { error: updateRoomDataError } = await supabase
      .from('rooms')
      .update({ active_player: 0 })
      .eq('id', roomId)

    if (updateRoomDataError) {
      console.error(
        'An error occurred while updating room data after ending game:',
        updateRoomDataError
      )

      return { success: false, error: updateRoomDataError }
    }

    revalidatePath(`/rooms`)
    revalidatePath(`/rooms/${roomId}`)

    return { success: true, error: null }
  } catch (error) {
    console.error('An unexpected error occurred while ending game:', error)

    return { success: false, error: error }
  }
}

/**
 * * Submit a painting
 * @param painting
 * @returns
 */
export async function submitPaintingAnswer(painting: {
  game_id: string
  answer: string
  painting: string
}) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data: userData, error: userDataError } = await getCurrentUser()

    if (userDataError || !userData) {
      return { success: false, error: userDataError }
    }

    const userId = userData.id

    const paintObject = {
      game_id: painting.game_id,
      user_id: userId,
      answer: painting.answer,
      painting: painting.painting,
    }

    const { error: paintingError } = await supabase
      .from('painting')
      .insert(paintObject)
      .select('*')
      .single()

    if (paintingError) {
      console.error(
        'An error occurred while submitting painting:',
        paintingError
      )

      return { success: false, error: paintingError }
    }

    const { data: roomUserData, error: roomUserDataError } = await supabase
      .from('room_user')
      .select('*')
      .eq('game_id', painting.game_id)
      .single()

    if (roomUserDataError) {
      console.error(
        'An error occurred while fetching room user data:',
        roomUserDataError
      )
    }

    revalidatePath(`/rooms/${roomUserData.room_id}`)

    return { success: true, error: null }
  } catch (error) {
    console.error(
      'An unexpected error occurred while submitting painting:',
      error
    )

    return { success: false, error: error }
  }
}

/**
 * * Get the submitted painting
 * @param gameId
 * @returns
 */
export async function getSubmittedPainting(gameId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data, error } = await supabase
      .from('painting')
      .select('*')
      .eq('game_id', gameId)
      .single()

    if (error) {
      console.error('An error occurred while fetching painting:', error)

      return { data: null, error: error }
    }

    const paintingImage = await getPublicStorageURL(data.painting, 'painting')

    const dataWithImage: PAINTING = {
      ...data,
      painting: paintingImage,
    }

    return { data: dataWithImage as PAINTING, error: null }
  } catch (error) {
    console.error(
      'An unexpected error occurred while fetching painting:',
      error
    )

    return { data: null, error: error }
  }
}

/**
 * * Submit an answer
 * @param answer
 * @param gameId
 * @returns
 */
export async function submitAnswer(answer: string, gameId: string) {
  unstable_noStore()

  const supabase = await createSupabaseServer()

  try {
    const { data: userData, error: userDataError } = await getCurrentUser()

    if (userDataError || !userData) {
      return {
        success: false,
        error: userDataError,
        answer: null,
        message: null,
      }
    }

    const userId = userData.id

    const { data: answerData, error: answerError } = await supabase
      .from('answer')
      .insert({
        game_id: gameId,
        user_id: userId,
        answer: answer.trim(),
      })
      .select('*')
      .single()

    if (answerError) {
      return { success: false, error: answerError, answer: null, message: null }
    }

    const { data: paintingData, error: paintingError } = await supabase
      .from('painting')
      .select('*')
      .eq('game_id', gameId)
      .single()

    if (paintingError) {
      return {
        success: false,
        error: paintingError,
        answer: null,
        message: null,
      }
    }

    const currentPainting: PAINTING = paintingData

    if (currentPainting.answer.toLowerCase() === answer.toLowerCase()) {
      const { data: allPlayers, error: allPlayersError } = await supabase
        .from('room_user')
        .select('*')
        .eq('game_id', gameId)

      if (allPlayersError) {
        return {
          success: false,
          error: allPlayersError,
          answer: null,
          message: null,
        }
      }

      const randomPlayer = Math.floor(Math.random() * allPlayers.length)
      const nextTurn = allPlayers[randomPlayer].user_id

      const { error: gameError } = await supabase.from('game').update({
        current_turn: nextTurn,
      })

      if (gameError) {
        return { success: false, error: gameError, answer: null, message: null }
      }

      revalidatePath(`/rooms/${allPlayers[randomPlayer].room_id}`)

      return {
        success: true,
        error: null,
        answer: answerData,
        message: 'Correct answer!',
      }
    }

    return {
      success: true,
      error: null,
      answer: answerData,
      message: 'Incorrect answer!',
    }
  } catch (error) {
    console.error(
      'An unexpected error occurred while submitting answer:',
      error
    )

    return { success: false, error: error, answer: null, message: null }
  }
}
