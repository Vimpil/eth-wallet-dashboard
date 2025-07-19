import type { SupportedChainId } from '@/config/networks'

export interface BlockExplorerUrls {
  getTransactionUrl(chainId: number, hash: string): string
  getAddressUrl(chainId: number, address: string): string
}

export interface AddressFormatter {
  formatShort(address: string): string
}

export class BlockExplorerService implements BlockExplorerUrls, AddressFormatter {
  constructor(private readonly getNetworkConfig: (chainId: SupportedChainId) => { explorerUrl: string }) {}

  formatShort(address: string): string {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  getTransactionUrl(chainId: number, hash: string): string {
    try {
      const config = this.getNetworkConfig(chainId as SupportedChainId)
      return `${config.explorerUrl}/tx/${hash}`
    } catch {
      return ''
    }
  }

  getAddressUrl(chainId: number, address: string): string {
    try {
      const config = this.getNetworkConfig(chainId as SupportedChainId)
      return `${config.explorerUrl}/address/${address}`
    } catch {
      return ''
    }
  }
}
