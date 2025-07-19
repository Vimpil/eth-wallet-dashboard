import { useQuery } from '@tanstack/react-query'

interface EtherscanPriceResult {
  ethusd: string
  ethbtc: string
  ethusd_timestamp: string
}

interface EthPrice {
  price: number
  lastUpdate: Date
}

import { z } from 'zod'
import { etherscanRequest } from '@/lib/etherscan'
import { handleError, ValidationError } from '@/lib/errors'
import { mainnet } from 'viem/chains'

// Validation schema for price data
const ethPriceSchema = z.object({
  ethusd: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid price format'),
  ethbtc: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid BTC price format'),
  ethusd_timestamp: z.string().regex(/^\d+$/, 'Invalid timestamp')
})

export function useEthPrice() {
  return useQuery<EthPrice | null>({
    queryKey: ['ethPrice'],
    queryFn: async () => {
      try {
        // Always use mainnet for price data
        const result = await etherscanRequest<EtherscanPriceResult>(
          mainnet.id,
          {
            module: 'stats',
            action: 'ethprice'
          }
        )

        // Validate response format
        const validatedData = ethPriceSchema.parse(result)
        const price = parseFloat(validatedData.ethusd)

        // Additional validation for price value
        if (price <= 0) {
          throw new ValidationError('Invalid ETH price value', 
            new z.ZodError([{
              code: 'custom',
              message: 'Price must be greater than 0',
              path: ['ethusd']
            }])
          )
        }

        return {
          price,
          lastUpdate: new Date(parseInt(validatedData.ethusd_timestamp) * 1000)
        }
      } catch (error) {
        throw handleError(error)
      }
    },
    refetchInterval: 60 * 1000, // Refresh every minute
    staleTime: 60 * 1000,      // Consider data fresh for 1 minute
    gcTime: 60 * 60 * 1000,    // Keep unused data in cache for 1 hour
    retry: (failureCount, error) => {
      // Only retry on network errors and rate limit errors, not validation errors
      if (error instanceof ValidationError) {
        return false
      }
      
      // Add exponential backoff for rate limit errors
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        // Will retry with exponential backoff
        return failureCount < 5
      }
      
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000) // Exponential backoff with max 30s delay
  })
}
