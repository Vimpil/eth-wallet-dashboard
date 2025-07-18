import { useQuery } from '@tanstack/react-query'
import { useChainId } from 'wagmi'
import { formatEther } from 'viem'
import { etherscanRequest } from '@/lib/etherscan'
import { useEthPrice } from './useEthPrice'

interface Balance {
  formatted: string
  value: bigint
  usd: number | null
}

export function useBalance(address: string | undefined) {
  const chainId = useChainId()
  const { data: ethPrice } = useEthPrice()

  return useQuery<Balance | null>({
    queryKey: ['balance', address, chainId],
    queryFn: async () => {
      if (!address) return null

      const balance = await etherscanRequest<string>(chainId, {
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest'
      })

      const value = BigInt(balance)
      const formatted = formatEther(value)
      const ethValue = parseFloat(formatted)
      
      return {
        formatted,
        value,
        usd: ethPrice * ethValue
      }
    },
    enabled: Boolean(address),
    refetchInterval: 10000 // Refresh every 10 seconds
  })
}
