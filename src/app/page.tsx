import Image from 'next/image'
import Link from 'next/link'

export default async function Rootpage() {
  return (
    <div className='w-full text-neonGreen'>
      {/* Header */}
      <div className='flex flex-col items-center mt-10'>
        <h1 className='text-9xl text-yellow drop-shadow-[0_0_5px_yellow] track blinking'>
          DRAW, GUESS, WIN
        </h1>
      </div>

      <div className='flex justify-center mt-20'>
        <Link href='/auth/login'>
          <p className='text-5xl text-neonGreen underline hover:text-neonPink cursor-pointer transition-colors duration-300'>
            &gt; Click here to start playing
          </p>
        </Link>
      </div>

      <div className='flex justify-around items-center mt-32'>
        <Image
          priority
          src='https://media.giphy.com/media/VWR9XJBYxpXR4EiqLQ/giphy.gif?cid=790b7611jxv4f8ebv89nh60votn7b1ss00f9f2v7fqwjfmdv&ep=v1_gifs_search&rid=giphy.gif&ct=g'
          width={250}
          height={250}
          alt='Drawing'
          className='pixelated'
        />
        <Image
          priority
          src='https://media.giphy.com/media/d2Z7NqwF3yImFNHW/giphy.gif?cid=ecf05e47ythy5wqtib4ggxptn9x216tr9c89oh39ow1e250e&ep=v1_gifs_search&rid=giphy.gif&ct=g'
          width={200}
          height={200}
          alt='Guess'
          className='pixelated'
        />
        <Image
          priority
          src='https://media.giphy.com/media/RG01kHJGpCAY8/giphy.gif?cid=ecf05e47ythy5wqtib4ggxptn9x216tr9c89oh39ow1e250e&ep=v1_gifs_search&rid=giphy.gif&ct=g'
          width={250}
          height={250}
          alt='Win'
          className='pixelated'
        />
      </div>
    </div>
  )
}
