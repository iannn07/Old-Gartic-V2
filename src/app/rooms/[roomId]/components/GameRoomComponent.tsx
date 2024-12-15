/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import GarticButton from '@/components/Buttons/GarticButtons'
import { ROOMS_USER } from '@/types/Relationship'
import { ROOMS } from '@/types/Rooms'
import { USER } from '@/types/User'
import { getCurrentUser } from '@/utils/auth/session'
import { createSupabaseClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import {
  assignFirstUserAsHost,
  checkIfTheGameStarted,
  endGame,
  getAllUsersInRoom,
  getSingleRoom,
  removeUserFromRoom,
  startGame,
} from '../../action'
import CanvasComponent from './CanvasComponent'
import SendAnswerComponent from './SendAnswerComponent'

interface GameRoomComponentProps {
  roomId: string
}

function GameRoomComponent({ roomId }: GameRoomComponentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<USER | null>(null)
  const [currentRoom, setCurrentRoom] = useState<ROOMS | null>(null)
  const [roomUser, setRoomUser] = useState<ROOMS_USER[] | null>(null)
  const [isHost, setIsHost] = useState<boolean>(false)
  const [ableToStart, setAbleToStart] = useState<boolean>(false)
  const [isTheGameStarted, setIsTheGameStarted] = useState<boolean>(false)

  const handleExitRoom = async () => {
    await removeUserFromRoom(roomId)

    router.replace('/rooms')
  }

  const handleStartGame = async () => {
    if (isHost && ableToStart && currentUser) {
      await startGame(roomId, currentUser.id)
      setIsTheGameStarted(true)
    }
  }

  const handleEndGame = useCallback(async () => {
    await endGame(roomId)

    router.replace('/rooms')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch the current user
  useSWR('currentUser', getCurrentUser, {
    onSuccess: (data) => {
      const { data: userData, error } = data
      if (error) return
      setCurrentUser(userData)
    },
  })

  // Fetch the current room
  useSWR('currentRoom', async () => await getSingleRoom(roomId), {
    onSuccess: (data) => {
      const { data: roomData, error } = data
      if (error) return
      setCurrentRoom(roomData)
    },
  })

  // Check if the game has started
  useSWR('isTheGameStarted', async () => checkIfTheGameStarted(roomId), {
    onSuccess: (data) => {
      const { ableToStart, data: gameStartedData, error } = data
      if (error) return

      if (ableToStart) setAbleToStart(ableToStart)

      if (gameStartedData) setIsTheGameStarted(true)
    },
  })

  // Check if the user is the host of the room
  useSWR(
    roomId,
    async () => {
      const { data } = await assignFirstUserAsHost(roomId)

      const canStart = (roomUser?.length ?? 0) >= 2

      return { data, ableToStart: canStart }
    },
    {
      onSuccess: (data) => {
        const { data: hostId, ableToStart } = data

        setIsHost(hostId?.id === currentUser?.id)
        setAbleToStart(ableToStart)
      },
    }
  )

  // Handle user leaving the room
  useEffect(() => {
    const handlePopState = async () => {
      await removeUserFromRoom(roomId)
    }

    const handleBeforeUnload = async () => {
      await removeUserFromRoom(roomId)
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [roomId])

  // Update ableToStart state
  useEffect(() => {
    if (roomUser && roomUser.length >= 2) {
      setAbleToStart(true)
    } else {
      setAbleToStart(false)
    }
  }, [roomUser])

  // isTheGameEnded update
  useEffect(() => {
    const supabase = createSupabaseClient()

    const subscription = supabase
      .channel('public:game')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'game' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            router.replace('/rooms')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [router])

  // Fetch all users in the room
  useSWR('roomUser', () => {
    let subscription: any

    const supabase = createSupabaseClient()

    const updateRoomActivePlayers = async (roomId: string) => {
      const { data, error } = await supabase
        .from('room_user')
        .select('id')
        .eq('room_id', roomId)

      if (error) return

      const activePlayerCount = data?.length || 0
      const { error: updateError } = await supabase
        .from('rooms')
        .update({ total_active_player: activePlayerCount })
        .eq('id', roomId)

      if (updateError) return
    }

    const fetchRoomUser = async () => {
      const { data, error } = await getAllUsersInRoom(roomId)

      if (error) return

      setRoomUser(data)
      setLoading(false)

      subscription = supabase
        .channel('public:room_user')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'room_user' },
          async (payload) => {
            if (payload.eventType === 'DELETE') {
              setRoomUser(
                (prevUsers) =>
                  prevUsers?.filter((user) => user.id !== payload.old.id) || []
              )
            }

            if (
              payload.eventType === 'INSERT' ||
              payload.eventType === 'UPDATE'
            ) {
              const newUser = payload.new as ROOMS_USER

              setRoomUser((prevUsers) => {
                // Check if user already exists
                const existingIndex =
                  prevUsers?.findIndex((user) => user.id === newUser.id) ?? -1

                if (existingIndex !== -1) {
                  const updatedUsers = [...(prevUsers || [])]
                  updatedUsers[existingIndex] = newUser
                  return updatedUsers
                } else {
                  return [...(prevUsers || []), newUser]
                }
              })
              await updateRoomActivePlayers(newUser.room_id)
            }
          }
        )
        .subscribe()
    }

    fetchRoomUser()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  })

  console.log({ isTheGameStarted, isHost })

  return loading && !(roomUser && currentRoom) ? (
    <div className='w-full h-screen text-5xl font-bold'>Loading...</div>
  ) : !ableToStart ? (
    <div className='w-full h-screen text-5xl font-bold'>
      Please wait for other players to join...
    </div>
  ) : (
    <div className='flex flex-col gap-10 w-full h-screen mt-20'>
      <div className='flex w-full justify-between items-center'>
        <h1 className='text-5xl font-bold'>{currentRoom?.name}</h1>
        <div className='flex gap-4'>
          {isHost && (
            <>
              {isTheGameStarted ? (
                <GarticButton
                  label='End Game'
                  variant='danger'
                  onClick={handleEndGame}
                />
              ) : (
                <GarticButton
                  label='Start Game'
                  variant='main'
                  onClick={handleStartGame}
                  disabled={!ableToStart}
                />
              )}
            </>
          )}
          {!isHost && !isTheGameStarted && (
            <GarticButton
              label='Waiting for host...'
              variant='danger'
              disabled
            />
          )}
          <GarticButton
            label='Exit Room'
            variant='danger'
            onClick={handleExitRoom}
          />
        </div>
      </div>
      <div className='grid grid-cols-[1fr,2fr] w-full h-full gap-x-10'>
        <div className='h-full border-8 border-main'>
          <div className='w-full text-center font-bold text-2xl bg-main pb-2'>
            Players
          </div>
          <div className='p-5 h-full'>
            {roomUser?.map((user, index) => (
              <div
                className='flex flex-col gap-2 p-2 border-b border-white'
                key={user?.id}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <h1 className='text-xl font-semibold'>{index + 1}.</h1>
                    <h1 className='text-xl'>{user?.user?.name}</h1>
                    {user?.is_host && (
                      <span className='text-xl text-red-500 font-bold'>
                        (Host)
                      </span>
                    )}
                  </div>
                  <h1 className='text-xl'>Score: {user?.score}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col col-span-1 gap-10'>
          <CanvasComponent />
          <SendAnswerComponent />
        </div>
      </div>
    </div>
  )
}

export default GameRoomComponent
