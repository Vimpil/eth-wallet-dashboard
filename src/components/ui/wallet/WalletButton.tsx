import { Button } from '@/components/ui/button'
import type { Connector } from 'wagmi'

interface WalletButtonProps {
  /** Wallet connector instance */
  connector: Connector;
  /** Click handler for wallet connection */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled: boolean;
}

/**
 * Wallet connection button component
 * Renders a button that triggers wallet connection when clicked
 */
export function WalletButton({ connector, onClick, disabled }: WalletButtonProps) {
  return (
    <Button
      key={connector.id}
      variant="outline"
      size="lg"
      className="w-full justify-start text-left hover:bg-accent/50 transition-colors duration-200"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg font-medium">{connector.name}</span>
      </div>
    </Button>
  )
}
