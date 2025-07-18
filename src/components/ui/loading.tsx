import { Card } from './card'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingProps {
  /**
   * Additional classes to apply to the container
   */
  className?: string
  /**
   * Text to display under the spinner
   */
  text?: string
  /**
   * Size of the spinner (sm, md, lg)
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Whether to show the loading text
   */
  showText?: boolean
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
} as const

const spinTransition = {
  rotate: 360,
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: "linear",
    repeatType: "loop" as const
  }
} as const

const pulseTransition = {
  opacity: [0.5, 1, 0.5],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "linear",
    repeatType: "reverse" as const
  }
} as const

export function Loading({ 
  className,
  text = 'Loading...',
  size = 'md',
  showText = true
}: LoadingProps) {
  return (
    <Card 
      className={cn("flex items-center justify-center p-8", className)}
      role="status"
      aria-live="polite"
    >
      <motion.div 
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.2,
          ease: "easeOut"
        }}
      >
        <motion.div 
          className={cn(
            "rounded-full border-2 border-primary",
            "border-t-transparent",
            sizeClasses[size]
          )}
          animate={spinTransition}
          aria-hidden="true"
        />
        {showText && (
          <motion.p 
            className="text-sm text-muted-foreground sr-only"
            initial={{ opacity: 0 }}
            animate={pulseTransition}
          >
            {text}
          </motion.p>
        )}
        {/* Hidden text for screen readers */}
        <span className="sr-only">{text}</span>
      </motion.div>
    </Card>
  )
}
