'use client'

import { useState } from 'react'
import GarticButton from '../../../components/Buttons/GarticButtons'
import { registerWithEmail } from '@/app/auth/action'
import { useRouter } from 'next/navigation'

function RegisterComponent() {
  const router = useRouter()
  const [showError, setShowError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (form: FormData) => {
    const fullName = form.get('fullName') as string
    const email = form.get('email') as string
    const password = form.get('password') as string
    const confirmPassword = form.get('confirmPassword')

    if (password !== confirmPassword) {
      setShowError(true)
      setErrorMessage('Passwords do not match')
      return
    }

    const { success, message } = await registerWithEmail({
      fullName,
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
      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='fullName'>Full Name</label>
            <input
              type='text'
              name='fullName'
              id='fullName'
              required
              className='border border-black px-1 text-black'
            />
          </div>
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
        </div>
        <div className='grid grid-cols-2 gap-4'>
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
          <div className='flex flex-col gap-2'>
            <label htmlFor='confirmPassword'>Confirm Password</label>
            <input
              type='password'
              name='confirmPassword'
              id='confirmPassword'
              required
              className='border border-black px-1 text-black'
            />
          </div>
        </div>
      </div>
      {showError && <p className='text-red'>{errorMessage}</p>}
      <GarticButton type='submit' label='Register' variant='secondary' />
    </form>
  )
}

export default RegisterComponent
