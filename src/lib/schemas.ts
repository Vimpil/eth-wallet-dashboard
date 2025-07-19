import { z } from 'zod'

/**
 * Schema for raw Etherscan transaction data
 */
export const etherscanTransactionSchema = z.object({
  blockNumber: z.string(),
  timeStamp: z.string(),
  hash: z.string(),
  nonce: z.string(),
  blockHash: z.string(),
  transactionIndex: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  gas: z.string(),
  gasPrice: z.string(),
  isError: z.string(),
  txreceipt_status: z.string(),
  input: z.string(),
  contractAddress: z.string().nullable(),
  cumulativeGasUsed: z.string(),
  gasUsed: z.string(),
  confirmations: z.string(),
  methodId: z.string(),
  functionName: z.string()
})

export type EtherscanTransaction = z.infer<typeof etherscanTransactionSchema>

/**
 * Schema for processed transaction data
 */
export const processedTransactionSchema = z.object({
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  timestamp: z.number(),
  confirmations: z.string(),
  isError: z.string(),
  gasUsed: z.string(),
  gasPrice: z.string(),
  methodId: z.string().optional(),
  functionName: z.string().optional()
})

export type ProcessedTransaction = z.infer<typeof processedTransactionSchema>

/**
 * Schema for network configuration
 */
export const networkConfigSchema = z.object({
  apiUrl: z.string().url(),
  explorerUrl: z.string().url(),
  name: z.string()
})

export type NetworkConfig = z.infer<typeof networkConfigSchema>

/**
 * Schema for Etherscan API response
 */
export const etherscanResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  result: z.union([z.array(etherscanTransactionSchema), z.string()])
})

/**
 * Schema for wallet balance data
 */
export const walletBalanceSchema = z.object({
  address: z.string(),
  balance: z.bigint(),
  tokenBalances: z.array(z.object({
    token: z.string(),
    balance: z.bigint(),
    symbol: z.string(),
    decimals: z.number()
  })).optional()
})

export type WalletBalance = z.infer<typeof walletBalanceSchema>

/**
 * Schema for transaction request parameters
 */
export const transactionRequestSchema = z.object({
  from: z.string(),
  to: z.string(),
  value: z.bigint(),
  data: z.string().optional(),
  nonce: z.number().optional(),
  gasLimit: z.bigint().optional(),
  gasPrice: z.bigint().optional(),
  maxFeePerGas: z.bigint().optional(),
  maxPriorityFeePerGas: z.bigint().optional()
})

export type TransactionRequest = z.infer<typeof transactionRequestSchema>
