import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@/hooks/useWallet'
import { useWalletSession } from '@/hooks/useWalletSession'
import { Loading } from '@/components/ui/loading'
import { PageLoader } from '@/components/ui/page-loader'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NetworkStatus } from '@/components/NetworkStatus'

// Lazy loaded components
const WalletConnect = lazy(() => 
  import('@/components/WalletConnect').then(module => ({ default: module.WalletConnect }))
)
const WalletBalance = lazy(() => 
  import('@/components/WalletBalance').then(module => ({ default: module.WalletBalance }))
)
const TransactionHistory = lazy(() => 
  import('@/components/TransactionHistory').then(module => ({ default: module.TransactionHistory }))
)

function App() {
  const { isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(true)
  
  // Initialize wallet session management
  useWalletSession({
    timeout: 30, // disconnect after 30 minutes of inactivity
    resetOnActivity: true
  })

  useEffect(() => {
    // Check if loading is really needed
    const checkInitialLoad = async () => {
      try {
        // Here you can add real checks, for example:
        // - Configuration loading
        // - Network connection check
        // - Web3 initialization
        await Promise.all([
          // Add real promises here
          new Promise(resolve => setTimeout(resolve, 500)) // Minimum time for smooth transition
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialLoad();
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <PageLoader key="loader" />
      ) : (
        <motion.div
          key="content"
          className="min-h-screen bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {/* Theme Toggle - Fixed position on all screen sizes */}
            <motion.div 
              className="fixed top-4 right-4 z-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Main Content */}
            <div className="mt-16 space-y-8">
              {/* Header */}
              <motion.header 
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  Ethereum Wallet Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Simple Ethereum Wallet Management Application
                </p>
              </motion.header>

              {/* Network Status */}
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <NetworkStatus />
              </motion.div>

              {/* Main Content Area */}
              <motion.div 
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {isConnected ? (
                  <motion.div 
                    className="grid gap-6 md:gap-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {/* Wallet Balance Card */}
                    <motion.div 
                      className="mx-auto w-full max-w-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Suspense fallback={<Loading />}>
                        <WalletBalance />
                      </Suspense>
                    </motion.div>
                    
                    {/* Transaction History Card */}
                    <motion.div 
                      className="mx-auto w-full max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Suspense fallback={<Loading />}>
                        <TransactionHistory />
                      </Suspense>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Suspense fallback={<Loading />}>
                      <WalletConnect />
                    </Suspense>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
