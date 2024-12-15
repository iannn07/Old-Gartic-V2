'use client'

import { ROOMS } from '@/types/Rooms'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { assignUserToRoom } from '../action'

interface RoomBoxComponentProps {
  rooms: ROOMS
}

function RoomBoxComponent({ rooms }: RoomBoxComponentProps) {
  const router = useRouter()

  const handleJoinRoom = async () => {
    await assignUserToRoom(rooms.id)

    router.push(`/rooms/${rooms.id}`)
  }

  return (
    <button
      className='relative w-full p-5 border-4 border-main bg-gradient-to-r from-main to-yellow text-black flex flex-col items-center justify-center gap-6 rounded-lg shadow-lg shadow-main hover:shadow-green-700/70 transition duration-300 ease-in-out'
      onClick={async () => await handleJoinRoom()}
    >
      <h1 className='text-3xl font-medium uppercase tracking-widest'>
        {rooms.name === 'United States' ? 'US' : rooms.name}
      </h1>
      <div className='w-full max-w-64 h-32'>
        <Image
          priority
          src={rooms.icon}
          alt={`${rooms.name} Room Icon`}
          width={150}
          height={144}
          className='object-fill h-full w-full'
        />
      </div>
      <p className='text-lg'>Active Players: {rooms.active_player ?? 0}</p>
    </button>
  )
}

export default RoomBoxComponent
