import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useNetwork } from './useNetwork'
import { handleError } from '@/lib/errors'
import { ValidationError } from '@/lib/errors/AppError'
import { etherscanRequest } from '@/lib/etherscan'
import { 
  type ProcessedTransaction,
  processedTransactionSchema
} from '@/lib/schemas'

/**
 * Transform and validate raw transaction data into processed transactions
 */
const transformTransactions = (data: z.infer<typeof etherscanTransactionSchema>[]): ProcessedTransaction[] => {
  return data
    .map((tx) => {
      try {
        // Transform the data, making methodId and functionName optional
        const transformed = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          timestamp: Number(tx.timeStamp) * 1000,
          confirmations: tx.confirmations,
          isError: tx.isError,
          gasUsed: tx.gasUsed,
          gasPrice: tx.gasPrice,
          ...(tx.methodId && { methodId: tx.methodId }),
          ...(tx.functionName && { functionName: tx.functionName })
        }
        
        // Validate the transformed data
        return processedTransactionSchema.parse(transformed)
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new ValidationError(
            `Failed to transform transaction ${tx.hash}: ${error.errors.map(e => e.message).join(', ')}`,
            error
          )
        }
        throw error
      }
    })
    .filter((tx) => tx.isError !== '1')
    .slice(0, 5)
}

// Validation schema for API response
// Schema for raw Etherscan transaction data
const etherscanTransactionSchema = z.object({
  blockNumber: z.string(),
  timeStamp: z.string(),
  hash: z.string(),
  nonce: z.string(),
  blockHash: z.string(),
  transactionIndex: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  gas: z.string(),
  gasPrice: z.string(),
  isError: z.string(),
  txreceipt_status: z.string(),
  input: z.string(),
  contractAddress: z.string().nullable(),
  cumulativeGasUsed: z.string(),
  gasUsed: z.string(),
  confirmations: z.string(),
  methodId: z.string().optional(),
  functionName: z.string().optional()
})

const requestParamsSchema = z.object({
  module: z.literal('account'),
  action: z.literal('txlist'),
  address: z.string().startsWith('0x'),
  startblock: z.string(),
  endblock: z.string(),
  page: z.string(),
  offset: z.string(),
  sort: z.enum(['asc', 'desc'])
})

export function useTransactions(address: string | undefined) {
  const networkResult = useNetwork()
  const chainId = networkResult.success === true && 'value' in networkResult ? networkResult.value.chainId : undefined

  return useQuery({
    queryKey: ['transactions', address, chainId],
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    queryFn: async (): Promise<ProcessedTransaction[]> => {
      if (!address) return []

      if (typeof chainId !== 'number') return []

      try {
        // Validate request parameters
        const params = requestParamsSchema.parse({
          module: 'account',
          action: 'txlist',
          address,
          startblock: '0',
          endblock: '99999999',
          page: '1',
          offset: '100',
          sort: 'desc'
        })

        // Fetch and validate transactions
        const result = await etherscanRequest<unknown[]>(chainId, params)
        
        // Validate array structure
        if (!Array.isArray(result)) {
          throw new ValidationError(
            'Expected array of transactions',
            new z.ZodError([{
              code: 'invalid_type',
              expected: 'array',
              received: typeof result,
              path: [],
              message: 'Expected array of transactions'
            }])
          )
        }

        // Validate each transaction in the response
        const validatedTransactions = z.array(etherscanTransactionSchema)
          .parse(result)
        
        if (process.env.NODE_ENV === 'development') {
          console.debug('[useTransactions] Raw transactions:', validatedTransactions)
        }
        
        // Transform and validate the processed data
        const transformedTransactions = transformTransactions(validatedTransactions)
        
        if (process.env.NODE_ENV === 'development') {
          console.debug('[useTransactions] Transformed transactions:', transformedTransactions)
        }
        
        return transformedTransactions
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new ValidationError(
            'Transaction validation failed',
            error
          )
        }
        throw handleError(error)
      }
    },
    enabled: Boolean(address),
    refetchInterval: 30000,
    retry: (failureCount, error: unknown) => {
      if (error instanceof ValidationError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[useTransactions] Validation error:', error.message, error.cause)
        }
        return false
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('[useTransactions] Transaction fetch error:', error)
      }
      return failureCount < 3
    }
  })
}
