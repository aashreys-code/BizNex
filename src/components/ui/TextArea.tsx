import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`input-field min-h-[100px] resize-y ${error ? 'border-[var(--danger)]' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-sm mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
