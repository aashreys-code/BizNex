import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'characters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  stepDuration?: number
}

export default function BlurText({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: rootMargin as `${number}px` | `${number}px ${number}px ${number}px ${number}px` })

  const totalDuration = stepDuration * 2
  const times = [0, 0.5, 1]

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => {
        const fromY = direction === 'top' ? -50 : 50
        const midY = direction === 'top' ? 5 : -5

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={{ filter: 'blur(10px)', opacity: 0, y: fromY }}
            animate={
              isInView
                ? { filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'], opacity: [0, 0.5, 1], y: [fromY, midY, 0] }
                : { filter: 'blur(10px)', opacity: 0, y: fromY }
            }
            transition={{
              duration: totalDuration,
              times,
              delay: (index * delay) / 1000,
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        )
      })}
    </p>
  )
}
