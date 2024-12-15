import { getCurrentUser } from '@/utils/auth/session'
import { redirect } from 'next/navigation'
import HomeComponent from './components/HomeComponent'

async function Homepage() {
  const { data, error } = await getCurrentUser()

  if (error || !data) redirect('/auth/login')

  return <HomeComponent currentUser={data} />
}

export default Homepage
