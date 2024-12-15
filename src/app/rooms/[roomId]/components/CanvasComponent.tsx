'use client'

import GarticButton from '@/components/Buttons/GarticButtons'
import { createSupabaseClient } from '@/utils/supabase/client'
import React, { useEffect, useRef, useState } from 'react'

interface CanvasComponentProps {
  roomId: string
}

const CanvasComponent = ({ roomId }: CanvasComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [color, setColor] = useState<string>('#000000')
  const [brushSize, setBrushSize] = useState<number>(2)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createSupabaseClient()

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

  const handleSubmit = async () => {}

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
  }

  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrushSize(parseInt(e.target.value, 10))
  }

  return (
    <div className='border-8 border-secondary p-5 h-3/4 text-2xl flex flex-col items-center'>
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
        className='mb-4 border border-gray-300 cursor-crosshair'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawingTouch}
        onTouchMove={drawTouch}
        onTouchEnd={endDrawingTouch}
      />
      <div className='flex gap-4 mb-4'>
        <GarticButton
          label='Clear'
          variant='danger'
          onClick={handleClear}
          disabled={loading}
        />
      </div>
      <GarticButton
        label={loading ? 'Submitting...' : 'Submit Painting'}
        variant='main'
        onClick={handleSubmit}
        disabled={loading}
      />
      {error && <p className='text-red mt-2'>{error}</p>}
      {success && <p className='text-main mt-2'>{success}</p>}
    </div>
  )
}

export default CanvasComponent
