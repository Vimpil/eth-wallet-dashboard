import { createConfig, http } from 'wagmi'
import { mainnet } from 'viem/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
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
