import { useEffect, useCallback } from 'react'
import { useWallet } from './useWallet'

interface UseWalletSessionOptions {
  /** Timeout in minutes before auto-disconnect */
  timeout?: number;
  /** Whether to reset timer on user activity */
  resetOnActivity?: boolean;
}

/**
 * Hook for managing wallet session timeouts and auto-disconnection.
 * Automatically disconnects the wallet after a period of inactivity.
 * Can be configured to reset the timer on user activity.
 * 
 * @param options Configuration options for the wallet session
 * @param options.timeout Time in minutes before auto-disconnect (default: 30)
 * @param options.resetOnActivity Whether to reset timer on user interaction (default: true)
 * @returns void
 * 
 * @example
 * ```tsx
 * useWalletSession({
 *   timeout: 15, // disconnect after 15 minutes
 *   resetOnActivity: true // reset timer on user activity
 * })
 * ```
 */
export function useWalletSession({ 
  timeout = 30, // 30 minutes by default
  resetOnActivity = true 
}: UseWalletSessionOptions = {}) {
  const { isConnected, disconnectWallet } = useWallet()
  
  /**
   * Reset the auto-disconnect timer
   * Clears existing timeout and sets a new one
   */
  const resetTimer = useCallback(() => {
    // Only log in development and throttle messages
    if (process.env.NODE_ENV === 'development') {
      const lastLog = Number(sessionStorage.getItem('wallet_session_last_log') || '0');
      const now = Date.now();
      // Log only if more than 5 seconds have passed since last log
      if (now - lastLog > 5000) {
        console.debug('[useWalletSession] Timer reset, next disconnect in', timeout, 'minutes');
        sessionStorage.setItem('wallet_session_last_log', now.toString());
      }
    }

    // Clear existing timeout
    const existingTimeout = window.localStorage.getItem('wallet_disconnect_timeout')
    if (existingTimeout) {
      window.clearTimeout(Number(existingTimeout))
    }
    
    // Set new timeout
    const timeoutId = window.setTimeout(() => {
      if (isConnected) {
        disconnectWallet()
        // Clear timeout ID after disconnection
        window.localStorage.removeItem('wallet_disconnect_timeout')
      }
    }, timeout * 60 * 1000)
    
    // Store timeout ID in localStorage to persist across page reloads
    window.localStorage.setItem('wallet_disconnect_timeout', timeoutId.toString())
  }, [timeout, isConnected, disconnectWallet])

  // Set up auto-disconnect timer and activity listeners
  useEffect(() => {
    if (!isConnected) {
      // Clear timeout when wallet is disconnected - cleanup
      const existingTimeout = window.localStorage.getItem('wallet_disconnect_timeout')
      if (existingTimeout) {
        window.clearTimeout(Number(existingTimeout))
        window.localStorage.removeItem('wallet_disconnect_timeout')
      }
      return
    }

    // Initial timer setup
    resetTimer()

    if (resetOnActivity) {
      // Reset timer on user activity
      const activities = ['mousedown', 'keydown', 'touchstart']
      // Throttle scroll event handler
      let scrollTimeout: number | null = null;
      const handleScroll = () => {
        if (scrollTimeout === null) {
          scrollTimeout = window.setTimeout(() => {
            resetTimer();
            scrollTimeout = null;
          }, 1000); // Throttle to once per second
        }
      };
      
      const handleActivity = () => resetTimer()
      
      // Add event listeners for regular activities
      activities.forEach(event => {
        window.addEventListener(event, handleActivity)
      })
      // Add throttled scroll listener
      window.addEventListener('scroll', handleScroll)

      return () => {
        // Remove regular activity listeners
        activities.forEach(event => {
          window.removeEventListener(event, handleActivity)
        })
        // Remove scroll listener
        window.removeEventListener('scroll', handleScroll)
        // Clear scroll throttle timeout if it exists
        if (scrollTimeout) {
          window.clearTimeout(scrollTimeout)
        }
        // Clear session timeout on unmount
        const existingTimeout = window.localStorage.getItem('wallet_disconnect_timeout')
        if (existingTimeout) {
          window.clearTimeout(Number(existingTimeout))
          window.localStorage.removeItem('wallet_disconnect_timeout')
        }
      }
    }

    return () => {
      // Clear timeout on unmount if resetOnActivity is false
      const existingTimeout = window.localStorage.getItem('wallet_disconnect_timeout')
      if (existingTimeout) {
        window.clearTimeout(Number(existingTimeout))
        window.localStorage.removeItem('wallet_disconnect_timeout')
      }
    }
  }, [isConnected, resetTimer, resetOnActivity])
}
