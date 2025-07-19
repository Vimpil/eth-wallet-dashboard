import { useChainId } from 'wagmi'
import { type Chain, mainnet, sepolia } from 'wagmi/chains'
import { NETWORK_CONFIG, type SupportedChainId } from '@/config/networks'

export interface NetworkState {
  chainId: number
  network: Chain
  isMainnet: boolean
  isTestnet: boolean
  explorerUrl: string
  networkName: string
}

export function useNetwork(): NetworkState {
  const chainId = useChainId()
  
  const network = chainId === mainnet.id ? mainnet : sepolia
  const isMainnet = chainId === mainnet.id
  const isTestnet = chainId === sepolia.id
  const networkConfig = NETWORK_CONFIG[chainId as SupportedChainId]
  
  return {
    chainId,
    network,
    isMainnet,
    isTestnet,
    explorerUrl: networkConfig.explorerUrl,
    networkName: networkConfig.name
  }
}
