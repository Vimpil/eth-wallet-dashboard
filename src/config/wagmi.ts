import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'viem/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http()
  },
  connectors: [
    metaMask()
  ]
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
