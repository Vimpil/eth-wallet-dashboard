import { useChainId } from 'wagmi'
import { type Chain, mainnet, sepolia } from 'wagmi/chains'
import { NETWORK_CONFIG, type SupportedChainId } from '@/config/networks'
import { ok, err } from '@/lib/errors/result'
import type { Result } from '@/lib/errors/result'
import { UnsupportedNetworkError } from '@/lib/errors/AppError'

export interface NetworkState {
  chainId: number
  network: Chain
  isMainnet: boolean
  isTestnet: boolean
  explorerUrl: string
  networkName: string
}

export function useNetwork(): Result<NetworkState, UnsupportedNetworkError> {
  const chainId = useChainId()
  
  // Verify that the chainId is supported
  if (!(chainId in NETWORK_CONFIG)) {
    return err(new UnsupportedNetworkError(chainId))
  }

  const network = chainId === mainnet.id ? mainnet : sepolia
  const isMainnet = chainId === mainnet.id
  const isTestnet = chainId === sepolia.id
  const networkConfig = NETWORK_CONFIG[chainId as SupportedChainId]
  
  return ok<NetworkState, UnsupportedNetworkError>({
    chainId,
    network,
    isMainnet,
    isTestnet,
    explorerUrl: networkConfig.explorerUrl,
    networkName: networkConfig.name
  })
}
