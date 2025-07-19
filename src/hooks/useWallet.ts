import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { formatEther } from 'viem'
import type { Connector } from 'wagmi'

/**
 * Custom hook for managing wallet state
 * 
 * Provides convenient interface for:
 * - Connecting and disconnecting wallet
 * - Getting connected account information
 * - Getting and displaying balance
 * - Managing loading and error states
 */
export function useWallet() {
  // Get connected account information
  const { address, isConnected } = useAccount()
  
  // Hook for wallet connection
  const { connect, connectors, isPending } = useConnect()
  
  // Hook for wallet disconnection
  const { disconnect } = useDisconnect()
  
  // Get balance for connected address with auto-refresh
  const { data: balance, isError, isLoading } = useBalance({
    address,
    query: {
      refetchInterval: 10000, // Refresh every 10 seconds
      enabled: !!address,     // Only fetch when we have an address
      refetchOnMount: true,   // Refresh when component mounts
      refetchOnWindowFocus: true, // Refresh when window gets focus
      refetchOnReconnect: true    // Refresh on network reconnection
    }
  })

  /**
   * Connect to wallet through selected connector
   * @param connector - wallet connector (MetaMask, WalletConnect etc.)
   */
  const connectWallet = async (connector: Connector) => {
    try {
      await connect({ connector })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to connect wallet')
    }
  }

  /**
   * Disconnect from wallet
   */
  const disconnectWallet = () => {
    disconnect()
  }

  // Format balance from Wei to ETH with safety checks
  const formattedBalance = balance && balance.value ? formatEther(balance.value) : '0'

  return {
    address,              // Connected wallet address
    isConnected,          // Connection status
    balance: formattedBalance,  // Formatted balance in ETH
    isBalanceLoading: isLoading,  // Balance loading status
    isBalanceError: isError,      // Balance loading error
    connectors,           // Available wallet connectors
    isPending,            // Connection process status
    connectWallet,        // Connection function
    disconnectWallet,     // Disconnection function
  }
}
