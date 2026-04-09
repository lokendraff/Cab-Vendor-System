import { cn } from '../../utils/cn'

const Skeleton = ({ className, ...props }) => (
  <div className={cn(
    'animate-pulse rounded-2xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700',
    className
  )} {...props} />
)

Skeleton.displayName = 'Skeleton'

export { Skeleton }

