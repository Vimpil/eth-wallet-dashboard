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
    <Card className="w-full max-w-md">
      <CardHeader key="card-header">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-6 w-6" key="wallet-icon" />
          <span key="wallet-title">Подключить кошелек</span>
        </CardTitle>
        <CardDescription key="card-description">
          Выберите кошелек для подключения к приложению
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" key="card-content">
          {connectors.map((connector: Connector) => (
            <Button
              key={connector.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => connectWallet(connector)}
              disabled={isPending}
            >
              {connector.name}
            </Button>
          ))}
      </CardContent>
    </Card>
  )
}
