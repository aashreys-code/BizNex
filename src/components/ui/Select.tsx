import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`input-field appearance-none cursor-pointer ${error ? 'border-red-500/50' : ''} ${className}`}
          style={{ colorScheme: 'dark' }}
          {...props}
        >
          <option value="" className="bg-charcoal-900">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-charcoal-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
