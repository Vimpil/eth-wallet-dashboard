import { z } from 'zod'

/**
 * Base class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: Error
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

/**
 * Error class for validation failures
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public cause?: z.ZodError | Error
  ) {
    super(message, 'VALIDATION_ERROR', cause)
  }
}

/**
 * Error class for network-related issues
 */
export class NetworkError extends AppError {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message, 'NETWORK_ERROR', cause)
  }
}

/**
 * Error class for wallet-related issues
 */
export class WalletError extends AppError {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message, 'WALLET_ERROR', cause)
  }
}

/**
 * Error class for Ethereum RPC issues
 */
export class EthereumRpcError extends AppError {
  constructor(
    message: string,
    public errorCode?: number,
    public cause?: Error
  ) {
    super(message, 'ETHEREUM_RPC_ERROR', cause)
  }
}

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