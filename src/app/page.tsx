import Image from 'next/image'
import Link from 'next/link'

export default async function Rootpage() {
  return (
    <div className='w-full mt-20'>
      <div className='flex w-full justify-center flex-col gap-28'>
        <h1 className='text-9xl font-honk text-center'>DRAW, GUESS, WIN</h1>
        <Link href='/auth/login'>
          <p className='text-5xl text-left'>&gt; Click here to start playing</p>
        </Link>
        <div className='flex justify-between w-full items-center'>
          <Image src='/images/child.gif' width={200} height={200} alt='Draw' />
          <Image
            src='/images/guess-what.gif'
            width={150}
            height={150}
            alt='Draw'
          />
          <Image src='/images/win.gif' width={200} height={200} alt='Draw' />
        </div>
      </div>
    </div>
  )
}
