import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`input-field min-h-[120px] resize-y ${error ? 'border-red-500/50' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
