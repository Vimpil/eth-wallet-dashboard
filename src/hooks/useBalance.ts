import { useBalance as useWagmiBalance } from 'wagmi'
import { useEthPrice } from './useEthPrice'
import { isAddress } from 'viem'

interface Balance {
  formatted: string     // Formatted balance in ETH
  value: bigint        // Raw balance in Wei
  usd: number | null   // USD value, null if price data unavailable
}

export function useBalance(address: string | undefined) {
  // Get ETH price from Etherscan
  const { 
    data: ethPriceData,
    isError: isEthPriceError 
  } = useEthPrice()

  // Get balance from Wagmi with suspense enabled
  const { 
    data: wagmiBalance,
    isError: isBalanceError,
    isLoading: isBalanceLoading,
    refetch
  } = useWagmiBalance({
    address: address as `0x${string}`,
    query: {
      refetchInterval: 15000, // Refresh every 15 seconds
      enabled: !!address && isAddress(address),
      refetchOnMount: true,
      refetchOnWindowFocus: 'always',
      refetchOnReconnect: true,
      // Add stale time to prevent unnecessary refetches
      staleTime: 10000
    }
  })

  if (!address || !isAddress(address)) {
    return {
      data: null,
      isError: true,
      isLoading: false,
      refetch
    }
  }

  if (!wagmiBalance && isBalanceLoading) {
    return {
      data: null,
      isError: isBalanceError || isEthPriceError,
      isLoading: isBalanceLoading,
      refetch
    }
  }

  const balance: Balance = wagmiBalance ? {
    formatted: wagmiBalance.formatted,
    value: wagmiBalance.value,
    usd: ethPriceData && !isEthPriceError ? parseFloat(wagmiBalance.formatted) * ethPriceData.price : null
  } : {
    formatted: '0',
    value: 0n,
    usd: null
  }

  return {
    data: balance,
    isError: isBalanceError || isEthPriceError,
    isLoading: isBalanceLoading,
    refetch
  }
}
