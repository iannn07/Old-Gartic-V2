'use client'

import { ROOMS } from '@/types/Rooms'
import RoomBoxComponent from './RoomBoxComponent'

interface RoomComponentProps {
  rooms: ROOMS[]
}

function RoomComponent({ rooms }: RoomComponentProps) {
  return (
    <div className='flex w-full flex-col gap-20 justify-start items-center mt-24'>
      <h1 className='text-5xl font-bold drop-shadow-[0_0_5px_yellow] blinking text-yellow'>
        SELECT A ROOM TO START
      </h1>
      <div className='flex gap-5 items-center justify-evenly w-full'>
        {rooms.length > 0 ? (
          rooms.map((room) => <RoomBoxComponent key={room.id} rooms={room} />)
        ) : (
          <p className='text-xl font-medium'>No rooms available</p>
        )}
      </div>
    </div>
  )
}

export default RoomComponent
