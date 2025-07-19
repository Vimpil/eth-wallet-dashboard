export interface ErrorReport {
  error: Error;
  timestamp: number;
  userAgent: string;
  context?: Record<string, unknown>;
}

export class ErrorMonitor {
  private static instance: ErrorMonitor;

  private constructor() {
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    window.addEventListener('error', this.handleError);
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  public reportError(error: Error, context?: Record<string, unknown>): void {
    const report: ErrorReport = {
      error,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      context
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Report:', report);
    }

    // Here you could send to error monitoring service like Sentry
    // await this.sendToErrorService(report);
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    this.reportError(event.reason);
  };

  private handleError = (event: ErrorEvent): void => {
    this.reportError(event.error);
  };
}
