import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AppError } from '@/lib/errors/AppError';
import { ErrorMonitor } from '@/lib/errors/monitoring';

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    ErrorMonitor.getInstance().reportError(error, {
      componentStack: errorInfo.componentStack
    });
  }

  private handleReset = () => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      return fallback?.(error) ?? (
        <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="mt-2 text-red-700">
            {error instanceof AppError ? error.message : 'An unknown error occurred'}
          </p>
          {error instanceof AppError && error.requiresUserAction() && (
            <button
              onClick={this.handleReset}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try again
            </button>
          )}
        </div>
      );
    }

    return children;
  }
}
