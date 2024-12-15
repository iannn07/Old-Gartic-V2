'use client'

import { logOut } from '@/app/auth/action'
import GarticButton from './GarticButtons'

function LogoutButton() {
  const handleLogout = async () => await logOut()

  return (
    <GarticButton label='LOG OUT' variant='secondary' onClick={handleLogout} />
  )
}

export default LogoutButton
