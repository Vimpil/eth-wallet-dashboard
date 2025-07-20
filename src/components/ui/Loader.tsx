import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'card' | 'fullscreen';
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-16 w-16',
};

export function Loader({ text = 'Loading...', size = 'md', variant = 'inline', className }: LoaderProps) {
  const spinner = (
    <motion.div
      className={cn(
        'relative',
        sizeMap[size],
        variant === 'fullscreen' && 'mx-auto',
        variant === 'card' && 'mx-auto',
        className
      )}
    >
      <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </motion.div>
  );

  return (
    <div
      className={cn(
        variant === 'fullscreen' && 'fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50',
        variant === 'card' && 'flex flex-col items-center justify-center p-8',
        variant === 'inline' && 'flex flex-col items-center justify-center',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {spinner}
      {text && (
        <span className="mt-4 text-muted-foreground animate-pulse text-center">{text}</span>
      )}
    </div>
  );
}
