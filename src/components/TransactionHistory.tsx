import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { useTransactions } from '@/hooks/useTransactions'
import { ArrowUp, ArrowDown, ExternalLink, History, Loader2, XCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { formatEther, formatGwei } from 'viem'
import { formatAddress, getExplorerTxUrl } from '@/lib/etherscan'
import { formatEthValue, formatUsdValue } from '@/lib/format'
import { useChainId } from 'wagmi'
import { useEthPrice } from '@/hooks/useEthPrice'

export function TransactionHistory() {
  const { address } = useWallet()
  const chainId = useChainId()
  const { data: transactions, isLoading, isError } = useTransactions(address)
  const { data: ethPrice } = useEthPrice()

  if (!address) {
    return null
  }

  return (
    <Card className="w-full backdrop-blur-sm bg-card/95 shadow-md hover:shadow-lg border border-border/50 hover:border-border/80 transition-all duration-300">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 ring-1 ring-primary/20 dark:bg-white/10 dark:ring-white/50 dark:shadow-white/20 transition-all duration-300">
            <History className="h-5 w-5 text-primary dark:text-white transition-colors" />
          </div>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary-foreground dark:from-white dark:via-white/90 dark:to-white/70 bg-clip-text text-transparent drop-shadow-sm">
            Transaction History
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-primary/30 blur-sm animate-pulse" />
                <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
              </div>
              <span className="text-muted-foreground animate-pulse">Loading transactions...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="p-3 rounded-full bg-destructive/10 ring-2 ring-destructive/20">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="font-medium text-destructive">Error loading transactions</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        ) : !transactions?.length ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="p-4 rounded-2xl bg-muted/50 ring-1 ring-border">
              <History className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium text-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground">Start making transactions to see them here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => {
              const isSent = tx.from.toLowerCase() === address.toLowerCase()
              const value = formatEther(tx.value)

              return (
                <div
                  key={tx.hash}
                  className="group flex items-start justify-between p-4 rounded-xl border bg-card hover:bg-accent/5 hover:border-border/80 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ring-1 transition-colors ${
                      isSent 
                        ? 'bg-destructive/10 text-destructive ring-destructive/30' 
                        : 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/30'
                    }`}>
                      {isSent ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium">
                        {isSent ? 'Sent' : 'Received'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(tx.timestamp), {
                          addSuffix: true
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {isSent ? 'Recipient' : 'Sender'}: {' '}
                        <span className="font-mono">
                          {formatAddress(isSent ? tx.to : tx.from)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Gas: {formatGwei(tx.gasPrice)} Gwei × {tx.gasUsed.toString()} units
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confirmations: {tx.confirmations}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`font-medium ${
                      isSent ? 'text-destructive' : 'text-emerald-500'
                    }`}>
                      {isSent ? '-' : '+'}{formatEthValue(value)} ETH
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      ≈ {ethPrice?.price ? formatUsdValue(value, ethPrice.price) : '$0.00'} USD
                    </div>
                    <a
                      href={getExplorerTxUrl(chainId, tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors group-hover:text-primary/80"
                    >
                      View on Etherscan
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
