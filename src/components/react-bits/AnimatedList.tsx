import { motion } from 'motion/react'
import { ReactNode } from 'react'

interface AnimatedListProps {
  children: ReactNode[]
  className?: string
  delay?: number
}

export default function AnimatedList({
  children,
  className = '',
  delay = 0.1,
}: AnimatedListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: index * delay,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
