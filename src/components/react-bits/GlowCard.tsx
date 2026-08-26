import { useRef, useState, ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export default function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(43, 238, 52, 0.12)',
}: GlowCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={divRef}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
      style={{
        background: 'var(--bg-card)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: isHovered ? '1px solid var(--accent)' : '1px solid var(--border-strong)',
        boxShadow: isHovered
          ? `0 8px 32px 0 var(--accent-dim), inset 0 1px 1px 0 var(--bg-card)`
          : `0 8px 32px 0 var(--shadow), inset 0 1px 1px 0 var(--bg-card)`,
        transition: 'all 0.3s',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
