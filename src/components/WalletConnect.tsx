import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { Wallet } from 'lucide-react'
import type { Connector } from 'wagmi'

export function WalletConnect() {
  const { isConnected, connectors, connectWallet, isPending } = useWallet()

  if (isConnected) {
    return null
  }

  return (
    <Card className="w-full max-w-md backdrop-blur-sm bg-background/95 shadow-lg">
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-primary" />
          <span className="text-2xl sm:text-3xl font-bold">Connect Wallet</span>
        </CardTitle>
        <CardDescription className="text-base">
          Choose your preferred wallet to connect to the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {connectors.map((connector: Connector) => (
            <Button
              key={connector.id}
              variant="outline"
              size="lg"
              className="w-full justify-start text-left hover:bg-accent/50 transition-colors duration-200"
              onClick={() => connectWallet(connector)}
              disabled={isPending}
            >
              <div className="flex items-center gap-3">
                {/* You can add wallet icons here if available */}
                <span className="text-lg font-medium">{connector.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
