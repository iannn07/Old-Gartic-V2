import GarticButton from '@/components/Buttons/GarticButtons'
import LogoutButton from '@/components/Buttons/LogoutButton'
import { USER } from '@/types/User'
import Image from 'next/image'
import Link from 'next/link'

interface HomeComponentProps {
  currentUser: USER
}

function HomeComponent({ currentUser }: HomeComponentProps) {
  return (
    <>
      {/* Main Container */}
      <div className='w-full mt-20'>
        {/* Inner Box */}
        <div className='flex flex-col items-center gap-10'>
          {/* Welcome Header */}
          <h1 className='text-5xl text-center text-yellow drop-shadow-[0_0_5px_yellow]'>
            Welcome to Old Gartic.io!
          </h1>

          {/* User Greeting and Prompt */}
          <div className='flex flex-col items-center gap-5 w-full'>
            <h1
              className='text-4xl text-center text-neonGreen
              hover:text-blue-500 cursor-pointer transition-colors duration-300'
            >
              Hi, {currentUser.name}! Are you ready to DRAW, GUESS, and WIN?
            </h1>
          </div>

          {/* Decorative Arrows */}
          <div className='flex justify-center items-center gap-10 mt-5 w-full'>
            <Image
              priority
              src={'/images/pink-arrow.gif'}
              alt='Left Arrow'
              height={175}
              width={175}
              className='animate-pulse rotate-45'
            />
            <Image
              priority
              src={
                'https://media.giphy.com/media/K34P4lmirzFTc889hQ/giphy.gif?cid=790b76119p7zj8ezaq8ryrg03xh3oaohl76prx0w1z1fmyzn&ep=v1_gifs_search&rid=giphy.gif&ct=g'
              }
              alt='Cross Icon'
              height={100}
              width={200}
            />
            <Image
              priority
              src={'/images/pink-arrow.gif'}
              alt='Right Arrow'
              height={175}
              width={175}
              className='animate-pulse rotate-[125deg]'
            />
          </div>

          {/* Action Buttons */}
          <div className='flex items-center justify-center gap-10 w-full'>
            <LogoutButton />
            <Link href='/rooms'>
              <GarticButton label='SELECT ROOM' variant='main' />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeComponent
