import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Button = forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 focus:ring-gray-500 shadow-sm',
    destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-lg focus:ring-red-500',
    outline: 'bg-transparent hover:bg-gray-100 text-gray-900 border border-gray-200 focus:ring-gray-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }

