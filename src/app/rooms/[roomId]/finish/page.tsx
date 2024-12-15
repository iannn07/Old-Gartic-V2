import Link from 'next/link'
import React from 'react'

function FinishPage() {
  return (
    <div className='w-full mt-20'>
      <div className='flex flex-col justify-center items-center p-8'>
        <h1 className='text-6xl md:text-8xl lg:text-9xl font-bold text-yellow text-center track blinking drop-shadow-[0_0_5px_yellow]'>
          CONGRATS YOU GUESSED THE WORD!
        </h1>
        <p className='mt-8 text-2xl md:text-4xl lg:text-5xl text-center text-neonGreen drop-shadow-[0_0_5px_green]'>
          As I said tho, DRAW, GUESS, WIN. No turns.
        </p>
        <Link href='/'>
          <p className='mt-12 text-xl md:text-3xl lg:text-5xl text-neonPink underline hover:text-blue-500 cursor-pointer transition-colors duration-300 drop-shadow-[0_0_2px_pink]'>
            &gt; Let&apos;s play again!
          </p>
        </Link>
      </div>
    </div>
  )
}

export default FinishPage
