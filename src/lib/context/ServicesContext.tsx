import { createContext } from 'react'
import type { ReactNode } from 'react'
import { EtherscanService } from '../services/EtherscanService'
import { RateLimiter } from '../services/RateLimiter'
import { BlockExplorerService } from '../services/BlockExplorerService'
import { NETWORK_CONFIG } from '@/config/networks'
import type { SupportedChainId } from '@/config/networks'

interface Services {
  etherscan: EtherscanService
}

const ServicesContext = createContext<Services | null>(null)

interface ServicesProviderProps {
  children: ReactNode
}

export function ServicesProvider({ children }: ServicesProviderProps) {
  // Initialize services
  const rateLimiter = new RateLimiter({
    maxRequests: 5,
    windowMs: 1000
  })

  const blockExplorer = new BlockExplorerService(
    (chainId: SupportedChainId) => NETWORK_CONFIG[chainId]
  )

  const etherscan = new EtherscanService({
    rateLimiter,
    blockExplorer
  })

  const services: Services = {
    etherscan
  }

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  )
}

