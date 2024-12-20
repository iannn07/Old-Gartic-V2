import { ROOMS } from './Rooms'
import { USER } from './User'

export type ROOMS_USER = {
  id: string
  room_id: string
  user_id: string
  is_host: boolean
  score: number
  joined_at: string
  room: ROOMS
  user: USER
}
