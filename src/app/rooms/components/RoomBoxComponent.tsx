'use client'

import GarticButton from '@/components/Buttons/GarticButtons'
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
    <div className='border-4 border-main text-main p-6 w-full flex flex-col items-center justify-center gap-6 bg-black shadow-[0_4px_15px_rgba(255,221,0,0.6)]'>
      <h1 className='text-3xl font-medium uppercase tracking-widest'>
        {rooms.name}
      </h1>
      <div className='w-52 h-32'>
        <Image
          src={rooms.icon}
          alt={`${rooms.name} Room Icon`}
          width={192}
          height={144}
          className='object-fill h-full w-full'
        />
      </div>
      <p className='text-lg'>Active Players: {rooms.active_player ?? 0}</p>
      <GarticButton
        onClick={async () => await handleJoinRoom()}
        label='Join Room'
        variant='mainOutlined'
      />
    </div>
  )
}

export default RoomBoxComponent
