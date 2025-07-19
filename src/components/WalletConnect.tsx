import { Suspense, lazy } from 'react'
import { useWallet } from '@/hooks/useWallet'
import type { Connector } from 'wagmi'

// Динамический импорт компонентов
const WalletCard = lazy(() => import('@/components/ui/wallet/WalletCard').then(module => ({
  default: module.WalletCard
})))
const WalletButton = lazy(() => import('@/components/ui/wallet/WalletButton').then(module => ({
  default: module.WalletButton
})))

// Fallback компонент для загрузки
function LoadingFallback() {
  return <div className="w-full max-w-md h-64 animate-pulse bg-background/50 rounded-lg" />
}

export function WalletConnect() {
  const { isConnected, connectors, connectWallet, isPending } = useWallet()

  if (isConnected) {
    return null
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <WalletCard>
        <div className="grid gap-4">
          {connectors.map((connector: Connector) => (
            <Suspense key={connector.id} fallback={<div className="h-12 animate-pulse bg-accent/20 rounded-md" />}>
              <WalletButton
                connector={connector}
                onClick={() => connectWallet(connector)}
                disabled={isPending}
              />
            </Suspense>
          ))}
        </div>
      </WalletCard>
    </Suspense>
  )
}
