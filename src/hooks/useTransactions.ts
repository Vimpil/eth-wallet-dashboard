import { useQuery } from '@tanstack/react-query'
import type { Hash, Address } from 'viem'
import { useChainId } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'

// Define type for raw transaction from API
interface EtherscanTransaction {
  hash: string
  from: string
  to: string
  value: string
  timeStamp: string
  confirmations: string
  isError: string
  gasUsed: string
  gasPrice: string
}

// Define type for processed transaction
export type Transaction = {
  hash: Hash
  from: Address
  to: Address
  value: bigint
  timestamp: number
  confirmations: number
  isError: boolean
  gasUsed: bigint
  gasPrice: bigint
}

// Configuration for supported networks
const NETWORK_CONFIG = {
  [mainnet.id]: {
    apiUrl: 'https://api.etherscan.io',
    explorerUrl: 'https://etherscan.io',
    name: 'Ethereum Mainnet'
  },
  [sepolia.id]: {
    apiUrl: 'https://api-sepolia.etherscan.io',
    explorerUrl: 'https://sepolia.etherscan.io',
    name: 'Sepolia Testnet'
  }
} as const

// Function to check if network is supported
const isSupportedNetwork = (chainId: number): chainId is keyof typeof NETWORK_CONFIG => {
  return chainId in NETWORK_CONFIG
}

// Cache the data transformation function for better performance
const transformTransactions = (data: EtherscanTransaction[]): Transaction[] => {
  return data
    .map((tx: EtherscanTransaction): Transaction => ({
      hash: tx.hash as Hash,
      from: tx.from as Address,
      to: tx.to as Address,
      value: BigInt(tx.value),
      timestamp: Number(tx.timeStamp) * 1000,
      confirmations: Number(tx.confirmations),
      isError: tx.isError === '1',
      gasUsed: BigInt(tx.gasUsed),
      gasPrice: BigInt(tx.gasPrice)
    }))
    .filter((tx: Transaction) => !tx.isError)
    .slice(0, 5)
}

export function useTransactions(address: string | undefined) {
  const chainId = useChainId()

  return useQuery({
    queryKey: ['transactions', address, chainId],
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Cache data for 5 minutes before garbage collection
    queryFn: async (): Promise<Transaction[]> => {
      if (!address) return []
      
      // Check if current network is supported
      if (!isSupportedNetwork(chainId)) {
        throw new Error(`Network with ID ${chainId} is not supported. Please switch to Mainnet or Sepolia.`)
      }

      const config = NETWORK_CONFIG[chainId]
      
      try {
        const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY
        
        if (!apiKey) {
          throw new Error('Etherscan API key is not configured. Please add VITE_ETHERSCAN_API_KEY to your .env file')
        }

        const response = await fetch(
          `${config.apiUrl}/api` + 
          `?module=account` +
          `&action=txlist` +
          `&address=${address}` +
          `&startblock=0` +
          `&endblock=99999999` +
          `&page=1` +
          `&offset=10` +
          `&sort=desc` +
          `&apikey=${apiKey}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.status === '0') {
          console.error('Etherscan API Error:', data)
          if (data.message === 'No transactions found') {
            return [] // Empty list if no transactions
          }
          throw new Error(`Etherscan API Error: ${data.message || 'Unknown error'}`)
        }

        if (!Array.isArray(data.result)) {
          console.error('Unexpected API response:', data)
          throw new Error('Invalid response format from Etherscan API')
        }

        // Use the extracted transformation function
        return transformTransactions(data.result)

      } catch (error) {
        console.error('Error fetching transactions:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch transactions')
      }
    },
    enabled: Boolean(address),
    refetchInterval: 30000 // Refresh every 30 seconds
  })
}
