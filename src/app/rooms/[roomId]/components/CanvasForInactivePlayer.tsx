import { PAINTING } from '@/types/Painting'
import { createSupabaseClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getSubmittedPainting } from '../../action'

interface CanvasForInactivePlayerProps {
  gameId: string
}

function CanvasForInactivePlayer({ gameId }: CanvasForInactivePlayerProps) {
  const [waitingForImage, setWaitingForImage] = useState<boolean>(true)
  const [image, setImage] = useState<PAINTING | null>(null)

  useEffect(() => {
    const fetchPainting = async () => {
      const { data } = await getSubmittedPainting(gameId)
      if (data) {
        const supabase = createSupabaseClient()
        const bucket = 'painting'
        const fullUrl = supabase.storage
          .from(bucket)
          .getPublicUrl(data.painting).data.publicUrl
        setImage({ ...data, painting: fullUrl })
        setWaitingForImage(false)
      }
    }

    fetchPainting()

    const supabase = createSupabaseClient()
    const bucket = 'painting'

    const subscription = supabase
      .channel('public:painting')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'painting' },
        (payload) => {
          if (payload.new.game_id === gameId) {
            // Construct full URL for the painting
            const fullUrl = supabase.storage
              .from(bucket)
              .getPublicUrl(payload.new.painting).data.publicUrl
            setImage({ ...payload.new, painting: fullUrl } as PAINTING)
            setWaitingForImage(false)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [gameId])

  return waitingForImage ? (
    <div>Waiting for image...</div>
  ) : (
    <Image
      src={image?.painting || ''}
      alt='image'
      width={400}
      height={400}
      className='bg-white w-full'
    />
  )
}

export default CanvasForInactivePlayer
