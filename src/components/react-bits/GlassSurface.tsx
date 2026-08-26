import { ReactNode } from 'react'

interface GlassSurfaceProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'strong' | 'dark'
}

export default function GlassSurface({
  children,
  className = '',
  variant = 'default',
}: GlassSurfaceProps) {
  const styles = {
    default: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    strong: {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    dark: {
      background: 'linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(14,14,14,0.95) 100%)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
  }

  return (
    <div className={`rounded-2xl ${className}`} style={styles[variant]}>
      {children}
    </div>
  )
}
