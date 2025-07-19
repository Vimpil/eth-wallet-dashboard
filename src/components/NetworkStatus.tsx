import { useAccount } from 'wagmi'
import { Badge } from '@/components/ui/badge'
import { useNetwork } from '@/hooks/useNetwork'
import { isError } from '@/lib/errors/result'

export function NetworkStatus() {
  const { isConnected } = useAccount()
  const networkResult = useNetwork()

  if (!isConnected) {
    return null
  }

  if (isError(networkResult)) {
    return (
      <div className="flex justify-center mb-4">
        <Badge variant="outline" className="flex items-center gap-2 bg-red-50 text-red-700">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          Unsupported Network
        </Badge>
      </div>
    )
  }

  const { networkName, isMainnet, isTestnet } = networkResult.value

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
