import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Old School Gartic.io',
  description: 'A clone of the Gartic.io game but with old school graphics.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='font-main text-lg mx-20 my-10 antialiased'>
        <div className='mb-5 flex justify-between items-center'>
          <Link href={'/'}>
            <h1 className='font-bold text-5xl'>Old Gartic.io</h1>
          </Link>
          <div className='flex gap-5'>
            <Link href={'/auth/login'}>
              <h1 className='text-xl'>Start Game</h1>
            </Link>
          </div>
        </div>
        {children}
      </body>
    </html>
  )
}
