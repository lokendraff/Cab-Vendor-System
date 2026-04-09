import { cn } from '../../utils/cn'
import { forwardRef } from 'react'

const Card = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow-lg animate-fade-in',
      className
    )}
    {...props}
  >
    {children}
  </div>
))
Card.displayName = 'Card'

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
    {children}
  </div>
)
CardHeader.displayName = 'CardHeader'

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
)
CardContent.displayName = 'CardContent'

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-2xl font-bold leading-none tracking-tight', className)} {...props}>
    {children}
  </h3>
)
CardTitle.displayName = 'CardTitle'

const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </p>
)
CardDescription.displayName = 'CardDescription'

const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
    {children}
  </div>
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter }

