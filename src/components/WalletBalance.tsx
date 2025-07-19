import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { useBalance } from '@/hooks/useBalance'
import { useEthPrice } from '@/hooks/useEthPrice'
import { LogOut, Wallet, RefreshCw, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { formatUsdValue } from '@/lib/format'

import { memo } from 'react'

export const WalletBalance = memo(function WalletBalance() {
  const { address, disconnectWallet } = useWallet()
  const { 
    data: balance,
    isLoading: isBalanceLoading,
    isError: isBalanceError
  } = useBalance(address)
  const {
    data: ethPrice,
    isLoading: isPriceLoading,
    isError: isPriceError
  } = useEthPrice()

  return (
    <Card className="w-full backdrop-blur-sm bg-background/95 shadow-lg border-2 border-accent/20 hover:border-accent/30 transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Wallet className="h-6 w-6 text-accent-600" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-accent-600 to-secondary-600 bg-clip-text text-transparent">
              Wallet Balance
            </span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="flex items-center gap-2 hover:bg-destructive-100 hover:text-destructive-600 dark:hover:bg-destructive-950 dark:hover:text-destructive-300 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Disconnect</span>
          </Button>
        </div>
        <CardDescription className="text-sm sm:text-base">
          <span className="font-medium">Address:</span>{' '}
          {address ? (
            <span className="font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          ) : (
            'Not connected'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          {isBalanceLoading ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Loading balance...</span>
            </div>
          ) : isBalanceError ? (
            <div className="text-destructive flex items-center justify-center gap-2">
              <XCircle className="h-5 w-5" />
              <span>Error loading balance</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight">
                {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'}{' '}
                <span className="text-xl sm:text-2xl text-muted-foreground">ETH</span>
              </div>
              {isPriceLoading ? (
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Updating rate...</span>
                </div>
              ) : isPriceError ? (
                <div className="text-sm text-destructive flex items-center justify-center gap-2">
                  <XCircle className="h-4 w-4" />
                  <span>Error loading ETH rate</span>
                </div>
              ) : ethPrice ? (
                <div className="space-y-2">
                  <div className="text-lg sm:text-xl text-muted-foreground">
                    ≈ {formatUsdValue(balance?.formatted || '0', ethPrice.price)} USD
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground/60 flex items-center justify-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    <span>Rate updated {formatDistanceToNow(ethPrice.lastUpdate, { addSuffix: true })}</span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
