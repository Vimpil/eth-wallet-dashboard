import { ErrorCode, ERROR_METADATA } from './types';
import type { ErrorMetadata } from './types';

export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public cause?: Error,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  public get metadata(): ErrorMetadata {
    return ERROR_METADATA[this.code];
  }

  public isRecoverable(): boolean {
    return this.metadata.recoverable;
  }

  public isRetryable(): boolean {
    return this.metadata.retryable;
  }

  public requiresUserAction(): boolean {
    return this.metadata.userActionRequired ?? false;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.VALIDATION_ERROR, cause);
  }
}

export class NetworkError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.NETWORK_ERROR, cause);
  }
}

export class WalletError extends AppError {
  constructor(message: string, cause?: Error) {
    super(message, ErrorCode.WALLET_ERROR, cause);
  }
}

export class EthereumRpcError extends AppError {
  constructor(message: string, public errorCode?: number, cause?: Error) {
    super(message, ErrorCode.ETHEREUM_RPC_ERROR, cause);
  }
}

export class UnsupportedNetworkError extends AppError {
  constructor(chainId: number, cause?: Error) {
    super(
      `Network with chain ID ${chainId} is not supported`,
      ErrorCode.UNSUPPORTED_NETWORK,
      cause
    );
  }
}
