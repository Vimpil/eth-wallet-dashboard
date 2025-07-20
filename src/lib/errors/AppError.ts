import { ErrorCode, ERROR_METADATA } from './types';
import type { ErrorMetadata } from './types';

export class UnifiedError extends Error {
  public code?: ErrorCode | string;
  public cause?: Error;
  public context?: Record<string, unknown>;

  constructor(
    message: string,
    options?: {
      code?: ErrorCode | string;
      cause?: Error;
      context?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = options?.code;
    this.cause = options?.cause;
    this.context = options?.context;
    Error.captureStackTrace(this, this.constructor);
  }

  public get metadata(): ErrorMetadata | undefined {
    if (this.code && ERROR_METADATA[this.code as ErrorCode]) {
      return ERROR_METADATA[this.code as ErrorCode];
    }
    return undefined;
  }

  public isRecoverable(): boolean {
    return this.metadata?.recoverable ?? false;
  }

  public isRetryable(): boolean {
    return this.metadata?.retryable ?? false;
  }

  public requiresUserAction(): boolean {
    return this.metadata?.userActionRequired ?? false;
  }
}

export class ValidationError extends UnifiedError {
  constructor(message: string, cause?: Error) {
    super(message, { code: ErrorCode.VALIDATION_ERROR, cause });
  }
}

export class NetworkError extends UnifiedError {
  constructor(message: string, cause?: Error) {
    super(message, { code: ErrorCode.NETWORK_ERROR, cause });
  }
}

export class WalletError extends UnifiedError {
  constructor(message: string, cause?: Error) {
    super(message, { code: ErrorCode.WALLET_ERROR, cause });
  }
}

export class EthereumRpcError extends UnifiedError {
  public errorCode?: number;
  constructor(message: string, errorCode?: number, cause?: Error) {
    super(message, { code: ErrorCode.ETHEREUM_RPC_ERROR, cause });
    this.errorCode = errorCode;
  }
}

export class UnsupportedNetworkError extends UnifiedError {
  constructor(chainId: number, cause?: Error) {
    super(`Network with chain ID ${chainId} is not supported`, { code: ErrorCode.UNSUPPORTED_NETWORK, cause });
  }
}

export class ApiNetworkError extends UnifiedError {
  constructor(chainId: number) {
    super(`Network with ID ${chainId} is not supported`, { code: ErrorCode.UNSUPPORTED_NETWORK });
  }
}

export class ApiRateLimitError extends UnifiedError {
  constructor(waitTime: number) {
    super(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`, { code: 'RATE_LIMIT_ERROR' });
  }
}

export class ConfigError extends UnifiedError {
  constructor(message: string) {
    super(message, { code: 'CONFIG_ERROR' });
  }
}

export class HttpError extends UnifiedError {
  constructor(status: number) {
    super(`HTTP error! status: ${status}`, { code: 'HTTP_ERROR' });
  }
}
