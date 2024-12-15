'use client'

import { signInWithEmail } from '@/app/auth/action'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import GarticButton from '@/components/Buttons/GarticButtons'

function LoginComponent() {
  const router = useRouter()
  const [showError, setShowError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (form: FormData) => {
    const email = form.get('email') as string
    const password = form.get('password') as string

    const { success, message } = await signInWithEmail({
      email,
      password,
    })

    if (!success && message) {
      setShowError(true)
      setErrorMessage(message)

      setTimeout(() => {
        setShowError(false)
        setErrorMessage('')
      }, 15000)

      return
    }

    router.push('/home')
  }

  return (
    <form
      className='flex flex-col w-full justify-start items-center gap-10'
      action={handleSubmit}
    >
      <div className='flex gap-2'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            id='email'
            required
            className='border border-black px-1 text-black'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            id='password'
            required
            className='border border-black px-1 text-black'
          />
        </div>
      </div>
      {showError && <p className='text-red'>{errorMessage}</p>}
      <GarticButton type='submit' label='Login' variant='main' />
    </form>
  )
}

export default LoginComponent
