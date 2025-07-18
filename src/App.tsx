import { WalletConnect } from '@/components/WalletConnect'
import { WalletBalance } from '@/components/WalletBalance'
import { TransactionHistory } from '@/components/TransactionHistory'
import { NetworkStatus } from '@/components/NetworkStatus'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useWallet } from '@/hooks/useWallet'

function App() {
  const { isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ThemeToggle />
      
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Ethereum Wallet Dashboard
          </h1>
          <p className="text-muted-foreground">
            Простое приложение для управления кошельком Ethereum
          </p>
        </div>

        <NetworkStatus />

        {isConnected ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <WalletBalance />
            </div>
            <div className="flex justify-center">
              <TransactionHistory />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <WalletConnect />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
