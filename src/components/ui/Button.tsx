import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 hover:from-primary-500 hover:to-primary-400',
    secondary:
      'glass text-white hover:bg-white/10 hover:-translate-y-0.5',
    accent:
      'bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:-translate-y-0.5',
    danger:
      'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5',
    ghost:
      'text-gray-300 hover:text-white hover:bg-white/5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
