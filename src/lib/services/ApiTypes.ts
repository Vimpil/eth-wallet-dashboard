
export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export class ApiNetworkError extends ApiError {
  constructor(chainId: number) {
    super(`Network with ID ${chainId} is not supported`)
    this.name = 'ApiNetworkError'
  }
}

export class ApiRateLimitError extends ApiError {
  constructor(waitTime: number) {
    super(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`)
    this.name = 'ApiRateLimitError'
  }
}

export class ConfigError extends ApiError {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

export class HttpError extends ApiError {
  constructor(status: number) {
    super(`HTTP error! status: ${status}`)
    this.name = 'HttpError'
  }
}

export interface ApiResponse<T> {
  status: string
  message: string
  result: T
}
