import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { formatEther } from 'viem'
import type { Connector } from 'wagmi'

/**
 * Кастомный хук для управления состоянием кошелька
 * 
 * Предоставляет удобный интерфейс для:
 * - Подключения и отключения кошелька
 * - Получения информации о подключенном аккаунте
 * - Получения и отображения баланса
 * - Управления состоянием загрузки и ошибок
 */
export function useWallet() {
  // Получение информации о подключенном аккаунте
  const { address, isConnected } = useAccount()
  
  // Хук для подключения к кошельку
  const { connect, connectors, isPending } = useConnect()
  
  // Хук для отключения от кошелька
  const { disconnect } = useDisconnect()
  
  // Получение баланса для подключенного адреса
  const { data: balance, isError, isLoading } = useBalance({
    address
  })

  /**
   * Подключение к кошельку через выбранный коннектор
   * @param connector - коннектор кошелька (MetaMask, WalletConnect и т.д.)
   */
  const connectWallet = async (connector: Connector) => {
    try {
      await connect({ connector })
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  /**
   * Отключение от кошелька
   */
  const disconnectWallet = () => {
    disconnect()
  }

  // Форматирование баланса из Wei в ETH
  const formattedBalance = balance ? formatEther(balance.value) : '0'

  return {
    address,              // Адрес подключенного кошелька
    isConnected,          // Статус подключения
    balance: formattedBalance,  // Отформатированный баланс в ETH
    isBalanceLoading: isLoading,  // Статус загрузки баланса
    isBalanceError: isError,      // Ошибка загрузки баланса
    connectors,           // Доступные коннекторы кошельков
    isPending,            // Статус процесса подключения
    connectWallet,        // Функция подключения
    disconnectWallet,     // Функция отключения
  }
}
