import { forwardRef } from 'react'

const Input = forwardRef(({
  label, error, helperText, className = '',
  containerClassName = '', required, ...props
}, ref) => (
  <div className={`w-full ${containerClassName}`}>
    {label && (
      <label className="label">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
    )}
    <input
      ref={ref}
      className={`
        input-field
        ${error ? '!border-red-400 !bg-red-50 focus:!ring-red-400' : ''}
        ${className}
      `}
      {...props}
    />
    {error     && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    {helperText && !error && <p className="mt-1.5 text-xs text-gray-400">{helperText}</p>}
  </div>
))
Input.displayName = 'Input'
export default Input
