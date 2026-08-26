import { useState, useEffect, useRef } from 'react'

interface TextTypeProps {
  text: string[]
  speed?: number
  deleteSpeed?: number
  pauseTime?: number
  className?: string
  loop?: boolean
  onComplete?: () => void
}

export default function TextType({
  text,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className = '',
  loop = true,
}: TextTypeProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    const fullText = text[currentTextIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < fullText.length) {
            setCurrentText(fullText.slice(0, currentText.length + 1))
          } else {
            if (text.length === 1 && !loop) return
            setTimeout(() => setIsDeleting(true), pauseTime)
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentTextIndex((prev) => (prev + 1) % text.length)
          }
        }
      },
      isDeleting ? deleteSpeed : speed
    )

    timeoutRef.current = timeout
    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentTextIndex, text, speed, deleteSpeed, pauseTime, loop])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse text-primary-400">|</span>
    </span>
  )
}
