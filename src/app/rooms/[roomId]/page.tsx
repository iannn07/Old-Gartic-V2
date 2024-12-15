import React from 'react'
import GameRoomComponent from './components/GameRoomComponent'

interface GamingRoomProps {
  params: {
    roomId: string
  }
}

function GamingRoom({ params }: GamingRoomProps) {
  return <GameRoomComponent roomId={params.roomId} />
}

export default GamingRoom
