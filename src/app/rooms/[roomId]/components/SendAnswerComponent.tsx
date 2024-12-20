'use client'

import GarticButton from '@/components/Buttons/GarticButtons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { submitAnswer } from '../../action'

interface SendAnswerComponentProps {
  gameId: string
  roomId: string
  handleEndGame: () => void
}

const SendAnswerComponent = ({
  gameId,
  roomId,
  handleEndGame,
}: SendAnswerComponentProps) => {
  const router = useRouter()
  const [answer, setAnswer] = useState<string>('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    const answer = formData.get('answer') as string

    const { success, error, message } = await submitAnswer(answer, gameId)

    if (error) {
      setError('Failed to submit answer')
    }

    if (success) {
      setError(null)
      if (message !== 'Incorrect answer!') {
        setTimeout(() => {
          setMessage(
            'Correct! You guessed the word! This game will end in 10 seconds.'
          )
        }, 10000)

        router.replace(`/rooms/${roomId}/finish`)

        setTimeout(() => {
          handleEndGame()
        }, 10000)
      }
      setMessage(message)
    }
  }

  return (
    <div className='border-8 border-secondary p-5 h-fit text-2xl flex flex-col items-center'>
      <form action={handleSubmit} className='flex flex-col items-center w-full'>
        <input
          type='text'
          name='answer'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder='Enter your guess...'
          className='w-full p-2 border border-gray-300 rounded mb-4 text-black'
        />
        {error && <p className='text-red'>{error}</p>}
        {message && (
          <p
            className={`${
              message !== 'Incorrect answer!' ? 'text-green-500' : 'text-red'
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
