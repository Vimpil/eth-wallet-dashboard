import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PageLoaderProps {
  className?: string
}

const fadeIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}

export function PageLoader({ className }: PageLoaderProps) {
  return (
    <motion.div 
      className={cn(
        "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50",
        className
      )}
      initial={fadeIn.initial}
      animate={fadeIn.animate}
      exit={fadeIn.exit}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex flex-col items-center space-y-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated logo/icon */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <motion.div 
            className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        {/* Animated text */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h2 
            className="text-2xl font-semibold text-foreground"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            Ethereum Wallet
          </motion.h2>
          <p className="text-sm text-muted-foreground mt-2">
            Loading application...
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
