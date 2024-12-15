/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ROOMS_USER } from '@/types/Relationship'
import React, { useState } from 'react'
import useSWR from 'swr'
import { getAllUsersInRoom } from '../../action'
import { createSupabaseClient } from '@/utils/supabase/client'

interface GameRoomComponentProps {
  roomId: string
}

function GameRoomComponent({ roomId }: GameRoomComponentProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [roomUser, setRoomUser] = useState<ROOMS_USER[] | null>(null)

  useSWR('roomUser', () => {
    let subscription: any

    const supabase = createSupabaseClient()

    const fetchRoomUser = async () => {
      const { data, error } = await getAllUsersInRoom(roomId)

      if (error) {
        return
      }

      setRoomUser(data)
      setLoading(false)

      subscription = supabase
        .channel('public:room_user')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'room_user' },
          (payload) => {
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
            }
          }
        )
        .subscribe()
    }

    // Fetch initial data and set up the listener
    fetchRoomUser()

    // Cleanup on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  })

  return loading ? (
    <div className='w-full h-screen text-5xl font-bold'>Loading...</div>
  ) : (
    <div className='grid-cols-3 w-full h-screen grid'>
      <div className='w-full h-full'>
        <div className='w-full text-center font-bold'>Players</div>
        <div className='bg-white text-black h-full'>
          {roomUser?.map((user) => (
            <div key={user.id} className='flex justify-between'>
              <div>{user.user.id}</div>
              <div>{user.user.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex flex-col w-full gap-10'>
        <div className='bg-purple-500'>CANVAS</div>
        <div className='bg-blue-500'>ANSWER SUBMISSION</div>
      </div>
      <div className='flex flex-col justify-between h-full w-full'>
        <div className='w-full text-center font-bold'>Chats</div>
        <div className='bg-white text-black h-full'>CHAT CONTENTS</div>
        <div className='w-full'>SEND SECTION</div>
      </div>
    </div>
  )
}

export default GameRoomComponent
