import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { useBalance } from '@/hooks/useBalance'
import { useEthPrice } from '@/hooks/useEthPrice'
import { LogOut, Wallet, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { formatUsdValue } from '@/lib/format'

export function WalletBalance() {
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Wallet Balance
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </CardTitle>
        <CardDescription>
          Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          {isBalanceLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : isBalanceError ? (
            <div className="text-destructive">Error loading balance</div>
          ) : (
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'} ETH
              </div>
              {isPriceLoading ? (
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Updating rate...
                </div>
              ) : isPriceError ? (
                <div className="text-sm text-destructive">
                  Error loading ETH rate
                </div>
              ) : ethPrice ? (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    ≈ {formatUsdValue(balance?.formatted || '0', ethPrice.price)} USD
                  </div>
                  <div className="text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Rate updated {formatDistanceToNow(ethPrice.lastUpdate, { addSuffix: true })}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
