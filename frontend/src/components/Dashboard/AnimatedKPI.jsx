import { useEffect, useState } from 'react'
import { Users, Car, MapPin, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'
import { Skeleton } from '../ui/Skeleton'
import { cn } from '../../utils/cn'

const AnimatedKPI = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  isLoading = false,
  animateIn = true 
}) => {
  const controls = useAnimationControls()
  const [displayValue, setDisplayValue] = useState(0)
  const scale = useMotionValue(1)
  const glowIntensity = useTransform(scale, [0.95, 1, 1.05], [0.3, 0.5, 0.8])

  useEffect(() => {
    if (!isLoading && animateIn) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.6, ease: 'easeOut' }
      })
      
      // Animate counter
      const duration = 1500
      const steps = 60
      const increment = value / steps
      
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      
      return () => clearInterval(timer)
    }
  }, [value, isLoading, controls, animateIn])

  if (isLoading) {
    return (
      <div className="glass-card h-full">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <Skeleton className="h-8 w-32 mt-4" />
        <Skeleton className="h-6 w-20 mt-2" />
      </div>
    )
  }

  const isPositive = change >= 0
  const colors = {
    blue: { gradient: 'from-blue-400 to-blue-600', glow: 'from-blue-500/20', text: 'text-blue-600 dark:text-blue-400' },
    green: { gradient: 'from-emerald-400 to-emerald-600', glow: 'from-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
    orange: { gradient: 'from-orange-400 to-orange-600', glow: 'from-orange-500/20', text: 'text-orange-600 dark:text-orange-400' },
    purple: { gradient: 'from-purple-400 to-purple-600', glow: 'from-purple-500/20', text: 'text-purple-600 dark:text-purple-400' },
  }

  const colorStyle = colors[color]

  return (
    <motion.div
      ref={scale}
      animate={controls}
      className="glass-card h-full cursor-pointer group relative overflow-hidden hover:scale-[1.02] transition-all duration-300"
      whileHover={{ y: -8 }}
      style={{ boxShadow: `0 25px 50px -12px rgba(0,0,0,0.25)` }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" 
           style={{ backgroundImage: `linear-gradient(135deg, ${colorStyle.glow})` }} />
      
      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div className="flex items-center space-x-4 mb-6">
          <motion.div 
            className={`p-4 rounded-2xl bg-gradient-to-r ${colorStyle.gradient} shadow-glow backdrop-blur-sm shadow-lg animate-float`}
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: 'easeInOut' 
            }}
          >
            <Icon className="w-7 h-7" />
          </motion.div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider opacity-80">{title}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <motion.p 
            className="text-4xl md:text-5xl font-black gradient-text tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {displayValue.toLocaleString()}
          </motion.p>
          <div className="flex items-center space-x-2">
            <motion.div
              className={`px-3 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              {isPositive ? <ArrowUp className="w-3 h-3 mr-1 inline" /> : <ArrowDown className="w-3 h-3 mr-1 inline" />}
              {Math.abs(change)}%
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AnimatedKPI

