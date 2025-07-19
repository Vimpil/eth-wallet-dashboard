import { NETWORK_CONFIG, isSupportedNetwork } from '@/config/networks'
import type { SupportedChainId } from '@/config/networks'
import { RateLimiter } from './RateLimiter'
import type { ApiResponse } from './ApiTypes'
import { ApiNetworkError, ConfigError, HttpError, ApiRateLimitError } from './ApiTypes'
import { BlockExplorerService } from './BlockExplorerService'

interface EtherscanServiceConfig {
  rateLimiter: RateLimiter
  blockExplorer: BlockExplorerService
}

export class EtherscanService {
  private rateLimiter: RateLimiter
  private blockExplorer: BlockExplorerService

  constructor(config: EtherscanServiceConfig) {
    this.rateLimiter = config.rateLimiter
    this.blockExplorer = config.blockExplorer
  }

  async request<T>(chainId: number, params: Record<string, string>): Promise<T> {
    if (!isSupportedNetwork(chainId)) {
      throw new ApiNetworkError(chainId)
    }

    const limitError = this.rateLimiter.check()
    if (limitError) {
      throw new ApiRateLimitError(limitError.waitTime)
    }

    const config = NETWORK_CONFIG[chainId as SupportedChainId]
    const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY

    if (!apiKey) {
      throw new ConfigError('Etherscan API key is not configured')
    }

    const queryParams = new URLSearchParams({
      ...params,
      apikey: apiKey
    })

    const response = await fetch(`${config.apiUrl}/api?${queryParams}`)

    if (!response.ok) {
      throw new HttpError(response.status)
    }

    const data: ApiResponse<T> = await response.json()

    if (data.status === '0') {
      // Special case for "No transactions found"
      if (data.message === 'No transactions found') {
        return [] as unknown as T
      }
      throw new ConfigError(data.message)
    }

    return data.result
  }

  formatAddress(address: string): string {
    return this.blockExplorer.formatShort(address)
  }

  getExplorerTxUrl(chainId: number, hash: string): string {
    return this.blockExplorer.getTransactionUrl(chainId, hash)
  }

  getExplorerAddressUrl(chainId: number, address: string): string {
    return this.blockExplorer.getAddressUrl(chainId, address)
  }
}

// Create default instance
const defaultRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 1000
})

const defaultBlockExplorer = new BlockExplorerService(
  (chainId: SupportedChainId) => NETWORK_CONFIG[chainId]
)

export const etherscan = new EtherscanService({
  rateLimiter: defaultRateLimiter,
  blockExplorer: defaultBlockExplorer
})
