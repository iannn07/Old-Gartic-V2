'use client'

import GarticButton from '@/components/Buttons/GarticButtons'
import { prepareFileBeforeUpload } from '@/utils/supabase/client_storage'
import React, { useEffect, useRef, useState } from 'react'
import { submitPaintingAnswer } from '../../action'

interface CanvasComponentProps {
  gameId: string
}

const CanvasComponent = ({ gameId }: CanvasComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [color, setColor] = useState<string>('#000000')
  const [brushSize, setBrushSize] = useState<number>(2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = 600
      canvas.height = 400
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.lineWidth = brushSize
        ctx.strokeStyle = color
        setContext(ctx)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (context) {
      context.lineWidth = brushSize
      context.strokeStyle = color
    }
  }, [brushSize, color, context])

  const startDrawing = (e: React.MouseEvent) => {
    if (context) {
      context.beginPath()
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      setIsDrawing(true)
    }
  }

  const draw = (e: React.MouseEvent) => {
    if (isDrawing && context) {
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
      context.stroke()
    }
  }

  const endDrawing = () => {
    if (isDrawing) {
      context?.closePath()
      setIsDrawing(false)
    }
  }

  const startDrawingTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    const rect = (
      canvasRef.current as HTMLCanvasElement
    ).getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    if (context) {
      context.beginPath()
      context.moveTo(x, y)
      setIsDrawing(true)
    }
  }

  const drawTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing || !context) return
    const touch = e.touches[0]
    const rect = (
      canvasRef.current as HTMLCanvasElement
    ).getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    context.lineTo(x, y)
    context.stroke()
  }

  const endDrawingTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    if (isDrawing) {
      context?.closePath()
      setIsDrawing(false)
    }
  }

  const handleClear = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const handleSubmit = async (form: FormData) => {
    const canvas = canvasRef.current
    if (!canvas) {
      throw new Error('Canvas not available.')
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png')
    })

    if (!blob) {
      throw new Error('Failed to convert canvas to blob.')
    }

    const file = new File([blob], `painting_${Date.now()}.png`, {
      type: 'image/png',
    })

    const paintingPath = await prepareFileBeforeUpload('painting', file)

    if (!paintingPath) {
      return
    }

    const painting = {
      game_id: gameId,
      painting: paintingPath,
      answer: form.get('answer') as string,
    }

    await submitPaintingAnswer(painting)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(parseInt(e.target.value, 10))
  }

  return (
    <form
      className='border-8 border-secondary gap-10 p-5 h-3/4 text-2xl flex flex-col items-center'
      action={handleSubmit}
    >
      <div className='flex gap-4 mb-2'>
        <label>
          Color:
          <input
            type='color'
            value={color}
            onChange={handleColorChange}
            className='ml-2'
          />
        </label>
        <label>
          Brush Size:
          <input
            type='range'
            min='1'
            max='10'
            value={brushSize}
            onChange={handleBrushSizeChange}
            className='ml-2'
          />
        </label>
      </div>
      <canvas
        ref={canvasRef}
        className='mb-4 border bg-white cursor-crosshair'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawingTouch}
        onTouchMove={drawTouch}
        onTouchEnd={endDrawingTouch}
      />
      <div className='flex flex-col gap-2'>
        <label>Answer:</label>
        <input type='text' name='answer' className='px-1 text-black' />
      </div>
      <div className='flex gap-4 mb-4'>
        <GarticButton label='Clear' variant='danger' onClick={handleClear} />
        <GarticButton label='Submit Drawing' variant='main' type='submit' />
      </div>
    </form>
  )
}

export default CanvasComponent
