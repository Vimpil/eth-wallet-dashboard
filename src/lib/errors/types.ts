export enum ErrorCode {
  WALLET_ERROR = 'WALLET_ERROR',           // Wallet interaction errors
  ETHEREUM_RPC_ERROR = 'ETHEREUM_RPC_ERROR', // RPC call errors
  NETWORK_ERROR = 'NETWORK_ERROR',         // General network errors
  UNSUPPORTED_NETWORK = 'UNSUPPORTED_NETWORK', // Unsupported network
  VALIDATION_ERROR = 'VALIDATION_ERROR'    // Validation errors
}

export interface ErrorMetadata {
  recoverable: boolean;      // Can the error be recovered from?
  userActionRequired: boolean; // Is user action required?
  retryable: boolean;        // Can the operation be retried?
}

export const ERROR_METADATA: Record<ErrorCode, ErrorMetadata> = {
  [ErrorCode.WALLET_ERROR]: {
    recoverable: true,
    userActionRequired: true,
    retryable: false
  },
  [ErrorCode.ETHEREUM_RPC_ERROR]: {
    recoverable: true,
    userActionRequired: false,
    retryable: true
  },
  [ErrorCode.NETWORK_ERROR]: {
    recoverable: true,
    userActionRequired: false,
    retryable: true
  },
  [ErrorCode.UNSUPPORTED_NETWORK]: {
    recoverable: true,
    userActionRequired: true,
    retryable: false
  },
  [ErrorCode.VALIDATION_ERROR]: {
    recoverable: false,
    userActionRequired: true,
    retryable: false
  }
}
