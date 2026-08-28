import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <div
      className={`card ${hover ? 'card-interactive' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
