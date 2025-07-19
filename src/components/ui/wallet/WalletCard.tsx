import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { memo } from 'react'
import type { ReactNode } from 'react'

interface WalletCardProps {
  /** Card content */
  children: ReactNode;
  /** Card title */
  title?: string;
  /** Description below the title */
  description?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Wallet connection card component
 * Displays a card with a title, description, and customizable content for wallet connection
 */
export const WalletCard = memo(function WalletCard({ 
  children, 
  title = 'Connect Wallet',
  description = 'Choose your preferred wallet to connect to the application',
  className = '',
}: WalletCardProps) {
  return (
    <Card className={`w-full max-w-md backdrop-blur-sm bg-background/95 shadow-lg ${className}`.trim()}>
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-primary" aria-hidden="true" />
          <span className="text-2xl sm:text-3xl font-bold">{title}</span>
        </CardTitle>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
});
