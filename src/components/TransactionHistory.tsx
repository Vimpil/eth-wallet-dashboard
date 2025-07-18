import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { useTransactions } from '@/hooks/useTransactions'
import { ArrowDownUp, ArrowUp, ArrowDown, ExternalLink, History, Loader2 } from 'lucide-react'
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-6 w-6" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="text-center text-destructive py-8">
            Error loading transactions
          </div>
        ) : !transactions?.length ? (
          <div className="text-center text-muted-foreground py-8">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => {
              const isSent = tx.from.toLowerCase() === address.toLowerCase()
              const value = formatEther(tx.value)

              return (
                <div
                  key={tx.hash}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      isSent ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-500'
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
                    <div className={`font-medium ${isSent ? 'text-destructive' : 'text-green-500'}`}>
                      {isSent ? '-' : '+'}{formatEthValue(value)} ETH
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ≈ {ethPrice?.price ? formatUsdValue(value, ethPrice.price) : '$0.00'} USD
                    </div>
                    <a
                      href={getExplorerTxUrl(chainId, tx.hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      Etherscan
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
