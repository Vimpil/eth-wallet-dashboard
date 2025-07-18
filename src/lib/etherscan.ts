import { NETWORK_CONFIG, isSupportedNetwork } from '@/config/networks'
import type { SupportedChainId } from '@/config/networks'

interface EtherscanResponse<T> {
  status: string
  message: string
  result: T
}

class EtherscanError extends Error {
  data?: unknown

  constructor(message: string, data?: unknown) {
    super(message)
    this.name = 'EtherscanError'
    this.data = data
  }
}

export async function etherscanRequest<T>(
  chainId: number,
  params: Record<string, string>
): Promise<T> {
  if (!isSupportedNetwork(chainId)) {
    throw new Error(`Network with ID ${chainId} is not supported`)
  }

  const config = NETWORK_CONFIG[chainId as SupportedChainId]
  const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY

  if (!apiKey) {
    throw new Error('Etherscan API key is not configured')
  }

  const queryParams = new URLSearchParams({
    ...params,
    apikey: apiKey
  })

  const response = await fetch(`${config.apiUrl}/api?${queryParams}`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: EtherscanResponse<T> = await response.json()

  if (data.status === '0') {
    // Special case for "No transactions found"
    if (data.message === 'No transactions found') {
      return [] as unknown as T
    }
    throw new EtherscanError(data.message, data)
  }

  return data.result
}

// Helper for formatting address to short form
export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Helper for getting transaction URL in block explorer
export function getExplorerTxUrl(chainId: number, hash: string): string {
  if (!isSupportedNetwork(chainId)) return ''
  const config = NETWORK_CONFIG[chainId as SupportedChainId]
  return `${config.explorerUrl}/tx/${hash}`
}

// Helper for getting address URL in block explorer
export function getExplorerAddressUrl(chainId: number, address: string): string {
  if (!isSupportedNetwork(chainId)) return ''
  const config = NETWORK_CONFIG[chainId as SupportedChainId]
  return `${config.explorerUrl}/address/${address}`
}
