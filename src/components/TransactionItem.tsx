import { memo } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'
import { formatEther, formatGwei } from 'viem'
import { formatAddress, getExplorerTxUrl } from '@/lib/etherscan'
import { formatEthValue, formatUsdValue } from '@/lib/format'
import type { ProcessedTransaction } from '@/lib/schemas'
import { z } from 'zod'

// Validation schema for props
const transactionItemSchema = z.object({
  transaction: z.object({
    from: z.string().startsWith('0x'),
    to: z.string().startsWith('0x'),
    value: z.string(),
    timestamp: z.number().min(0),
    hash: z.string().startsWith('0x'),
    confirmations: z.string(),
    isError: z.string(),
    gasUsed: z.string(),
    gasPrice: z.string()
  }),
  userAddress: z.string().startsWith('0x'),
  chainId: z.number().positive(),
  ethPrice: z.number().positive().optional(),
  style: z.record(z.string(), z.string().or(z.number()).optional()).optional()
})

interface TransactionItemProps {
  transaction: ProcessedTransaction
  userAddress: string
  chainId: number
  ethPrice?: number
  style?: React.CSSProperties // For react-window
}

export const TransactionItem = memo(function TransactionItem(props: TransactionItemProps) {
  // Validate props
  try {
    transactionItemSchema.parse(props);
  } catch (error) {
    console.error('Invalid props:', error);
    return null;
  }

  const { transaction: tx, userAddress, chainId, ethPrice, style } = props;
  const isSent = tx.from.toLowerCase() === userAddress.toLowerCase()
  const value = Number(formatEther(BigInt(tx.value)))

  return (
    <div
      style={style}
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
            Gas: {formatGwei(BigInt(tx.gasPrice))} Gwei × {BigInt(tx.gasUsed).toString()} units
          </div>
          <div className="text-xs text-muted-foreground">
            Confirmations: {Number(tx.confirmations)}
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
          ≈ {ethPrice ? formatUsdValue(value, ethPrice) : '$0.00'} USD
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
})
