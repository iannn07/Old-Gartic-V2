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
      {/* BODY */}
      <div className='w-full p-20'>
        <div className='flex justify-center gap-5 w-full'>
          <div className='flex flex-col gap-10 items-center justify-center w-full'>
            <h1 className='text-5xl font-bold text-center'>
              Welcome to Old Gartic.io!
            </h1>

            <div className='flex gap-10 flex-col items-center justify-between w-full'>
              <h1 className='text-3xl'>
                Hi, {currentUser.name}! Are you ready to DRAW, GUESS, and WIN?
              </h1>
              <h3 className='text-2xl'>Choose your path</h3>
            </div>

            <div className='flex justify-center gap-[150px] w-full'>
              <Image
                src={'/images/pink-arrow.gif'}
                alt='Arrow'
                height={175}
                width={175}
                className='rotate-[80deg]'
              />
              <Image
                src={'/images/left-right.gif'}
                alt='Cruz'
                height={175}
                width={400}
              />
              <Image
                src={'/images/pink-arrow.gif'}
                alt='Arrow'
                height={175}
                width={175}
                className='rotate-[90deg]'
              />
            </div>

            <div className='flex items-center justify-center w-full gap-[650px] mt-10'>
              <LogoutButton />
              <Link href='/rooms'>
                <GarticButton label='SELECT ROOM' variant='main' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeComponent
