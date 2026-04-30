import { FiLoader } from 'react-icons/fi'

const variants = {
  primary:   'bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-200 active:scale-[0.98]',
  secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]',
  danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200 active:scale-[0.98]',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 active:scale-[0.98]',
  success:   'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200 active:scale-[0.98]',
  outline:   'bg-transparent text-violet-600 border border-violet-200 hover:bg-violet-50 active:scale-[0.98]',
}

const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon,
  ...props
}) => (
  <button
    disabled={disabled || isLoading}
    className={`
      inline-flex items-center justify-center font-medium rounded-xl
      transition-all duration-150 focus:outline-none focus:ring-2
      focus:ring-violet-400 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {isLoading
      ? <FiLoader className="animate-spin flex-shrink-0" size={13} />
      : icon
        ? <span className="flex-shrink-0">{icon}</span>
        : null}
    {children}
  </button>
)

export default Button
