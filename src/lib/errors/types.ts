import { z } from 'zod'

export enum ErrorCode {
  WALLET_ERROR = 'WALLET_ERROR',           // Ошибки взаимодействия с кошельком
  ETHEREUM_RPC_ERROR = 'ETHEREUM_RPC_ERROR', // Ошибки RPC-вызовов
  NETWORK_ERROR = 'NETWORK_ERROR',         // Общие ошибки сети
  UNSUPPORTED_NETWORK = 'UNSUPPORTED_NETWORK' // Неподдерживаемая сеть
}

export interface ErrorMetadata {
  recoverable: boolean;      // Можно ли восстановиться после ошибки
  userActionRequired: boolean; // Требуется ли действие пользователя
}

export const ERROR_METADATA: Record<ErrorCode, ErrorMetadata> = {
  [ErrorCode.WALLET_ERROR]: {
    recoverable: true,
    userActionRequired: true
  },
  [ErrorCode.ETHEREUM_RPC_ERROR]: {
    recoverable: true,
    userActionRequired: false
  },
  [ErrorCode.NETWORK_ERROR]: {
    recoverable: true,
    userActionRequired: false
  },
  [ErrorCode.UNSUPPORTED_NETWORK]: {
    recoverable: true,
    userActionRequired: true
  }
}
