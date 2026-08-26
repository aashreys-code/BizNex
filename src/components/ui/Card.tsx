import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className = '', hover = true, glow = false }: CardProps) {
  return (
    <div
      className={`
        glass rounded-2xl p-6
        ${hover ? 'hover:bg-white/10 transition-all duration-300' : ''}
        ${glow ? 'hover:shadow-lg hover:shadow-primary-500/10' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
