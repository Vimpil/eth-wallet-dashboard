import { mainnet, sepolia } from 'viem/chains'

export const NETWORK_CONFIG = {
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

type SupportedChainId = keyof typeof NETWORK_CONFIG
export type { SupportedChainId }

// Function to check if network is supported
export const isSupportedNetwork = (chainId: number): chainId is SupportedChainId => {
  return chainId in NETWORK_CONFIG
}
