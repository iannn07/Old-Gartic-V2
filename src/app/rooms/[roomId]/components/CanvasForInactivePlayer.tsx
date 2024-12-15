import { PAINTING } from '@/types/Painting'
import React, { useState } from 'react'
import useSWR from 'swr'
import { getSubmittedPainting } from '../../action'
import Image from 'next/image'

interface CanvasForInactivePlayerProps {
  gameId: string
}

function CanvasForInactivePlayer({ gameId }: CanvasForInactivePlayerProps) {
  const [waitingForImage, setWaitingForImage] = useState<boolean>(true)
  const [image, setImage] = useState<PAINTING | null>(null)

  useSWR('image', async () => getSubmittedPainting(gameId), {
    onSuccess: (data) => {
      const { data: painting } = data

      if (!painting) return

      setImage(painting)
      setWaitingForImage(false)
    },
  })

  return waitingForImage ? (
    <div>Waiting for image...</div>
  ) : (
    <Image src={image?.painting || ''} alt='image' width={400} height={400} />
  )
}

export default CanvasForInactivePlayer
