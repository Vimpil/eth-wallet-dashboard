/**
 * Formats ETH value with 4 decimal places
 */
export function formatEthValue(value: number | string): string {
  return Number(value).toFixed(4)
}

/**
 * Formats USD value with special handling for small amounts
 * @param ethValue value in ETH
 * @param ethPrice ETH price in USD
 * @returns formatted USD value
 */
export function formatUsdValue(ethValue: number | string, ethPrice: number): string {
  const value = Number(ethValue) * ethPrice
  
  // For zero values
  if (value === 0) {
    return '$0.00'
  }

  // For very small amounts (less than 0.01)
  if (value > 0 && value < 0.01) {
    return 'less than $0.01'
  }

  // For all other amounts, format with fixed decimal places
  return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
