interface RateLimitOptions {
  maxRequests: number
  windowMs: number
}

interface RateLimitError {
  waitTime: number
}

export class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor({ maxRequests, windowMs }: RateLimitOptions) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  check(): RateLimitError | null {
    const now = Date.now()
    // Remove requests outside the current window
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    )
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0]
      const waitTime = this.windowMs - (now - oldestRequest)
      return { waitTime }
    }
    
    this.requests.push(now)
    return null
  }

  reset(): void {
    this.requests = []
  }
}
