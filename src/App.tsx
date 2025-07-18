import { WalletConnect } from '@/components/WalletConnect'
import { WalletBalance } from '@/components/WalletBalance'
import { TransactionHistory } from '@/components/TransactionHistory'
import { NetworkStatus } from '@/components/NetworkStatus'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useWallet } from '@/hooks/useWallet'

function App() {
  const { isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Theme Toggle - Fixed position on all screen sizes */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="mt-16 space-y-8">
          {/* Header */}
          <header className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
              Ethereum Wallet Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Simple Ethereum Wallet Management Application
            </p>
          </header>

          {/* Network Status */}
          <div className="flex justify-center">
            <NetworkStatus />
          </div>

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto">
            {isConnected ? (
              <div className="grid gap-6 md:gap-8">
                {/* Wallet Balance Card - Full width on mobile, centered on larger screens */}
                <div className="mx-auto w-full max-w-md">
                  <WalletBalance />
                </div>
                
                {/* Transaction History Card - Full width on mobile, centered on larger screens */}
                <div className="mx-auto w-full max-w-2xl">
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
      </div>
    </div>
  )
}

export default App
