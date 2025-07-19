import { useAccount } from 'wagmi'
import { Badge } from '@/components/ui/badge'
import { useNetwork } from '@/hooks/useNetwork'

export function NetworkStatus() {
  const { isConnected } = useAccount()
  const { networkName, isMainnet, isTestnet } = useNetwork()

  if (!isConnected) {
    return null
  }

  const getNetworkColor = () => {
    if (isMainnet) return 'bg-green-500'
    if (isTestnet) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  return (
    <div className="flex justify-center mb-4">
      <Badge variant="outline" className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getNetworkColor()}`} />
        {networkName}
      </Badge>
    </div>
  )
}
