import type { Metadata } from 'next'
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
      <body className='font-pixelifySans text-lg mx-20 my-10 antialiased bg-pattern'>
        <div className='mb-5 flex justify-between items-center'>
          <h1 className='font-bold font-main text-5xl'>Old Gartic.io</h1>
        </div>
        {children}
      </body>
    </html>
  )
}
