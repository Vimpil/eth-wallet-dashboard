import { useAccount, useChainId } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { Badge } from '@/components/ui/badge'

export function NetworkStatus() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  if (!isConnected) {
    return null
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case mainnet.id:
        return 'Mainnet'
      case sepolia.id:
        return 'Sepolia'
      default:
        return `Chain ${chainId}`
    }
  }

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case mainnet.id:
        return 'bg-green-500'
      case sepolia.id:
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="flex justify-center mb-4">
      <Badge variant="outline" className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getNetworkColor(chainId)}`} />
        {getNetworkName(chainId)}
      </Badge>
    </div>
  )
}
