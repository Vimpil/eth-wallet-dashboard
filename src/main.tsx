import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/config/wagmi'
import { ServicesProvider } from '@/lib/context/ServicesContext'
import { initializeSentry } from '@/lib/errors/sentry'
import { ErrorMonitor } from '@/lib/errors/monitoring'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import './index.css'
import App from './App.tsx'

// Initialize error handling
initializeSentry();
ErrorMonitor.getInstance();

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ServicesProvider>
            <App />
          </ServicesProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </StrictMode>,
)
