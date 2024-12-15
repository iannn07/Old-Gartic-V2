import Link from 'next/link'
import React from 'react'

function FinishPage() {
  return (
    <div className='w-full mt-20'>
      <div className='flex w-full justify-center flex-col gap-28'>
        <h1 className='text-9xl font-main text-center'>
          CONGRATS YOU GUESSED THE WORD!
        </h1>
        <p className='text-5xl text-center'>
          As I said tho, DRAW, GUESS, WIN. No turns.
        </p>
        <Link href='/'>
          <p className='text-5xl text-left'>&gt; Let&apos;s play again!</p>
        </Link>
      </div>
    </div>
  )
}

export default FinishPage
