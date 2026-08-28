import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
