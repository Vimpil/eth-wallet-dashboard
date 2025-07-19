import { useQuery } from '@tanstack/react-query'
import { useChainId } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { z } from 'zod'
import { handleError, ValidationError } from '@/lib/errors'
import { etherscanRequest } from '@/lib/etherscan'
import { 
  type EtherscanTransaction, 
  type ProcessedTransaction,
  networkConfigSchema,
  processedTransactionSchema,
  type NetworkConfig
} from '@/lib/schemas'

// Network configurations
const SUPPORTED_NETWORKS: Record<number, NetworkConfig> = {
  [mainnet.id]: networkConfigSchema.parse({
    apiUrl: 'https://api.etherscan.io',
    explorerUrl: 'https://etherscan.io',
    name: 'Ethereum Mainnet'
  }),
  [sepolia.id]: networkConfigSchema.parse({
    apiUrl: 'https://api-sepolia.etherscan.io',
    explorerUrl: 'https://sepolia.etherscan.io',
    name: 'Sepolia Testnet'
  })
}

// Function to check if network is supported
const isSupportedNetwork = (chainId: number): boolean => {
  return chainId in SUPPORTED_NETWORKS
}

/**
 * Transform and validate raw transaction data into processed transactions
 */
const transformTransactions = (data: EtherscanTransaction[]): ProcessedTransaction[] => {
  return data
    .map((tx) => {
      try {
        // Transform the data
        const transformed: ProcessedTransaction = {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          timestamp: Number(tx.timeStamp) * 1000,
          confirmations: tx.confirmations,
          isError: tx.isError,
          gasUsed: tx.gasUsed,
          gasPrice: tx.gasPrice,
          methodId: tx.methodId,
          functionName: tx.functionName
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

// Schema for processed transactions after transformation
const transactionSchema = z.object({
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  timestamp: z.number(),
  confirmations: z.string(),
  isError: z.string(),
  gasUsed: z.string(),
  gasPrice: z.string()
})

// Validation schema for API response
// Schema for raw Etherscan transaction data
const etherscanTransactionSchema = z.object({
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  timeStamp: z.string(),
  confirmations: z.string(),
  isError: z.string(),
  gasUsed: z.string(),
  gasPrice: z.string()
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
  const chainId = useChainId()

  return useQuery({
    queryKey: ['transactions', address, chainId],
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Transaction[]> => {
      if (!address) return []

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
        
        // Log raw transactions for debugging
        console.log('Raw transactions:', validatedTransactions)
        
        // Transform and validate the processed data
        const transformedTransactions = transformTransactions(validatedTransactions)
        
        // Log transformed transactions
        console.log('Transformed transactions:', transformedTransactions)
        
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
    retry: (failureCount, error) => {
      if (error instanceof ValidationError) {
        console.error('Validation error:', error.message, error.cause)
        return false
      }
      console.error('Transaction fetch error:', error)
      return failureCount < 3
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        console.error('Validation error:', error.message, error.cause)
      } else {
        console.error('Transaction fetch error:', error)
      }
    }
  })
}
