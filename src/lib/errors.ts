import { z } from 'zod'
import {
  AppError,
  ValidationError,
  NetworkError,
  WalletError,
  EthereumRpcError
} from './errors/AppError'

/**
 * Generic error handler that formats different types of errors
 * @param error - The error to be handled
 * @returns Formatted error instance
 */
export function handleError(error: unknown): Error {
  // Already an instance of our custom error classes
  if (error instanceof AppError) {
    return error
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return new ValidationError(
      'Validation failed: ' + error.errors.map(e => e.message).join(', '),
      error
    )
  }

  // Handle native Error instances
  if (error instanceof Error) {
    // Check for network errors
    if (error.name === 'NetworkError' || error.message.toLowerCase().includes('network')) {
      return new NetworkError(error.message, error)
    }

    // Check for common wallet errors
    if (error.message.toLowerCase().includes('wallet') || 
        error.message.toLowerCase().includes('metamask')) {
      return new WalletError(error.message, error)
    }

    return error
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return new Error(error)
  }

  // Handle JSON RPC errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const rpcError = error as { code: number; message?: string }
    return new EthereumRpcError(
      rpcError.message || 'Unknown RPC error',
      rpcError.code
    )
  }
  
  // Fallback for unknown error types
  return new Error('An unknown error occurred')
}

/**
 * Type guard to check if an error is a specific type
 */
export function isErrorType<T extends AppError>(
  error: Error,
  errorType: new (...args: any[]) => T
): error is T {
  return error instanceof errorType
}