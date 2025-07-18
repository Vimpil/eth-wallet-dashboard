import { useQuery } from '@tanstack/react-query'

interface EtherscanPriceResult {
  ethusd: string
  ethbtc: string
  ethusd_timestamp: string
}

interface EthPrice {
  price: number
  lastUpdate: Date
}

// Function to get ETH price directly from Etherscan API
async function fetchEthPrice(): Promise<EtherscanPriceResult> {
  const response = await fetch(
    `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  
  if (data.status !== '1' || !data.result) {
    console.error('Etherscan API Error:', data)
    throw new Error(data.message || 'Failed to fetch ETH price')
  }

  return data.result
}

export function useEthPrice() {
  return useQuery<EthPrice | null>({
    queryKey: ['ethPrice'],
    queryFn: async () => {
      try {
        const result = await fetchEthPrice()

        return {
          price: parseFloat(result.ethusd),
          lastUpdate: new Date(parseInt(result.ethusd_timestamp) * 1000)
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error)
        return null
      }
    },
    refetchInterval: 60000, // Refresh every minute
    staleTime: 60000, // Consider data fresh for one minute
    gcTime: 3600000, // Keep in cache for one hour
    retry: 3 // Retry request 3 times on error
  })
}
