import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { useTransactions } from '@/hooks/useTransactions'
import { History, Loader2, XCircle } from 'lucide-react'
import { useNetwork } from '@/hooks/useNetwork'
import { useEthPrice } from '@/hooks/useEthPrice'
import { FixedSizeList as List } from 'react-window'
import { useMemo, useCallback } from 'react'
import { TransactionItem } from './TransactionItem'
import type { ProcessedTransaction } from '@/lib/schemas'
import type { ListChildComponentProps } from 'react-window'

const isValidTransaction = (tx: unknown): tx is ProcessedTransaction => {
  return (
    tx !== null &&
    typeof tx === 'object' &&
    'hash' in tx &&
    'from' in tx &&
    'to' in tx &&
    typeof tx.hash === 'string' &&
    typeof tx.from === 'string' &&
    typeof tx.to === 'string'
  )
}

export function TransactionHistory() {
  const { address } = useWallet()
  const networkResult = useNetwork()
  const chainId = networkResult.success === true && 'value' in networkResult ? networkResult.value.chainId : undefined
  const { data: transactions = [] as readonly ProcessedTransaction[], isLoading, isError, error } = useTransactions(address)
  const { data: ethPrice } = useEthPrice()

  // Convert error to string message
  const errorMessage = useMemo(() => {
    if (!error) return ''
    if (error instanceof Error) {
      return error.message
    }
    return String(error)
  }, [error])

  // Memoize list height to prevent recalculation on re-renders
  const listHeight = useMemo(() => {
    const transactionCount = (transactions as readonly ProcessedTransaction[]).length
    return transactionCount ? Math.min(600, transactionCount * 150) : 150
  }, [transactions])

  // Validate transaction index and data before rendering
  const validateTransaction = useCallback((index: number): boolean => {
    const txs = transactions as readonly ProcessedTransaction[]
    return (
      index >= 0 &&
      index < txs.length &&
      isValidTransaction(txs[index])
    )
  }, [transactions])

  // Memoize row renderer to prevent function recreation on re-renders
  const renderRow = useCallback(({ index, style }: ListChildComponentProps) => {
    if (!validateTransaction(index) || typeof chainId !== 'number') {
      return null;
    }
    const txs = transactions as readonly ProcessedTransaction[]
    return (
      <TransactionItem
        key={txs[index].hash}
        transaction={txs[index]}
        userAddress={address || ''}
        chainId={chainId}
        ethPrice={typeof ethPrice?.price === 'number' ? ethPrice.price : undefined}
        style={style}
      />
    );
  }, [transactions, address, chainId, ethPrice?.price, validateTransaction])

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
            {errorMessage && (
              <p className="text-sm text-destructive/80 text-center max-w-md">{errorMessage}</p>
            )}
            {/* Etherscan API key missing info */}
            {(!import.meta.env.VITE_ETHERSCAN_API_KEY || import.meta.env.VITE_ETHERSCAN_API_KEY === '' || import.meta.env.VITE_ETHERSCAN_API_KEY === '#') && (
              <span className="text-xs text-muted-foreground">Etherscan API key is missing. Transaction history may be incomplete or unavailable.</span>
            )}
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        ) : !(transactions as readonly ProcessedTransaction[]).length ? (
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
          <div>
            <List
              height={listHeight}
              itemCount={(transactions as readonly ProcessedTransaction[]).length}
              itemSize={150}
              width="100%"
              className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20"
              overscanCount={3}
            >
              {renderRow}
            </List>
          </div>
        )}
      </CardContent>
    </Card>
  )
}