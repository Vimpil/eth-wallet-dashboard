import { useBalance as useWagmiBalance } from 'wagmi'
import { useEthPrice } from './useEthPrice'
import { isAddress } from 'viem'

interface Balance {
  formatted: string
  value: bigint
  usd: number | null
}

export function useBalance(address: string | undefined) {
  // Get ETH price from Etherscan
  const { 
    data: ethPriceData,
    isError: isEthPriceError 
  } = useEthPrice()

  // Get balance from Wagmi
  const { 
    data: wagmiBalance,
    isError: isBalanceError,
    isLoading,
    refetch
  } = useWagmiBalance({
    address: address as `0x${string}`
  })

  if (!wagmiBalance || !address || !isAddress(address)) {
    return {
      data: null,
      isError: isBalanceError || isEthPriceError,
      isLoading,
      refetch
    }
  }

  const balance: Balance = {
    formatted: wagmiBalance.formatted,
    value: wagmiBalance.value,
    usd: ethPriceData && !isEthPriceError ? parseFloat(wagmiBalance.formatted) * ethPriceData.price : null
  }

  return {
    data: balance,
    isError: isBalanceError || isEthPriceError,
    isLoading,
    refetch
  }
}
