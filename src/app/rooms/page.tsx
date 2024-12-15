import { getAllRooms } from './action'
import RoomComponent from './components/RoomComponent'

async function RoomPage() {
  const { data, error } = await getAllRooms()

  if (error || !data) return <div>Error loading rooms</div>

  return <RoomComponent rooms={data} />
}

export default RoomPage
