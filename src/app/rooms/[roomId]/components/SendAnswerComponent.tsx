'use client'

import React, { useState } from 'react'
import { submitAnswer } from '../../action'
import GarticButton from '@/components/Buttons/GarticButtons'

interface SendAnswerComponentProps {
  gameId: string
}

const SendAnswerComponent: React.FC<SendAnswerComponentProps> = ({
  gameId,
}) => {
  const [answer, setAnswer] = useState<string>('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const answer = formData.get('answer') as string

    const { success, error, message } = await submitAnswer(gameId, answer)

    if (error) {
      setError('Failed to submit answer')
    }

    if (success) {
      setError(null)
      setMessage(message)
      setAnswer('')
    }
  }

  return (
    <div className='border-8 border-secondary p-5 h-3/4 text-2xl flex flex-col items-center'>
      <form action={handleSubmit} className='flex flex-col items-center w-full'>
        <input
          type='text'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder='Enter your guess...'
          className='w-full p-2 border border-gray-300 rounded mb-4'
        />
        {error && <p className='text-red'>{error}</p>}
        {message && (
          <p
            className={`${
              message.toLowerCase().includes('correct')
                ? 'text-green-500'
                : 'text-red'
            }`}
          >
            {message}
          </p>
        )}
        <GarticButton type='submit' label='Submit Answer' variant='main' />
      </form>
    </div>
  )
}

export default SendAnswerComponent
