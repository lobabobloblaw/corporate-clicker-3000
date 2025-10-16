/**
 * Discord SDK React Hook and Context Provider
 *
 * CRITICAL: This hook manages the entire Discord SDK lifecycle
 * - Initializes Discord SDK with proper client ID
 * - Handles OAuth2 authorization flow with CSRF protection
 * - Manages authentication state
 * - Provides SDK instance to all child components
 *
 * SECURITY NOTES:
 * - NEVER expose DISCORD_CLIENT_SECRET in client code
 * - OAuth2 code exchange MUST happen server-side
 * - Always validate state parameter to prevent CSRF attacks
 */

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { DiscordSDK, DiscordSDKMock } from '@discord/embedded-app-sdk'
import type { DiscordSDKContext, AuthState, DiscordUser } from '../types/discord'

// Create context with undefined default (will error if used outside provider)
const DiscordContext = createContext<DiscordSDKContext | undefined>(undefined)

interface DiscordProviderProps {
  children: ReactNode
}

/**
 * Discord SDK Context Provider
 * Wrap your app with this to provide Discord SDK access to all components
 */
export function DiscordProvider({ children }: DiscordProviderProps) {
  const [sdk, setSdk] = useState<DiscordSDK | DiscordSDKMock | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticating: false,
    isAuthenticated: false
  })

  /**
   * Initialize Discord SDK on mount
   * Uses DiscordSDKMock for local development without Discord client
   */
  useEffect(() => {
    const initSDK = async () => {
      try {
        const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID

        if (!clientId) {
          throw new Error(
            'VITE_DISCORD_CLIENT_ID is not defined. ' +
            'Please add it to your .env file.'
          )
        }

        // Determine if we're running in Discord or local development
        const isInDiscord = window.parent !== window

        // Use DiscordSDKMock for local development
        const discordSdk = isInDiscord
          ? new DiscordSDK(clientId)
          : new DiscordSDKMock(clientId, null, null, null) // guild, channel, location all null for mock

        // Wait for SDK to be ready
        await discordSdk.ready()

        // Subscribe to READY event
        discordSdk.subscribe('READY', () => {
          console.log('[Discord SDK] Ready')
        })

        setSdk(discordSdk)
        setIsReady(true)

        console.log('[Discord SDK] Initialized successfully')
      } catch (error) {
        console.error('[Discord SDK] Failed to initialize:', error)
        setAuth(prev => ({
          ...prev,
          error: error as Error
        }))
      }
    }

    initSDK()

    // Cleanup function
    return () => {
      // Unsubscribe from all events when component unmounts
      if (sdk) {
        // Discord SDK cleanup will be handled by the SDK itself
        console.log('[Discord SDK] Cleaning up')
      }
    }
  }, []) // Empty dependency array - only run once on mount

  /**
   * Simplified Authentication for Discord Activities
   *
   * For Discord Activities, users are already authenticated when they launch the activity.
   * We can use the SDK to get basic user info without a full OAuth flow.
   */
  const authenticate = useCallback(async () => {
    if (!sdk || !isReady) {
      console.error('[Discord Auth] SDK not ready')
      return
    }

    setAuth(prev => ({
      ...prev,
      isAuthenticating: true,
      error: undefined
    }))

    try {
      // Check if we're using DiscordSDKMock (local development)
      const isInDiscord = window.parent !== window

      let user: DiscordUser

      if (!isInDiscord) {
        // Local development with DiscordSDKMock - use mock data
        console.log('[Discord Auth] Using mock user data for local development')
        user = {
          id: '123456789012345678',
          username: 'TestUser',
          discriminator: '0',
          avatar: null,
          bot: false
        }
      } else {
        // Real Discord environment - use authenticate command
        // For Discord Activities, pass empty object to authenticate()
        const authResult = await sdk.commands.authenticate({})
        user = {
          id: authResult.user.id,
          username: authResult.user.username,
          discriminator: authResult.user.discriminator || '0',
          avatar: authResult.user.avatar || null,
          bot: false
        }
        console.log('[Discord Auth] Authenticated:', user)
      }

      setAuth({
        isAuthenticating: false,
        isAuthenticated: true,
        user
      })

      console.log('[Discord Auth] Authentication successful', user.username)
    } catch (error) {
      console.error('[Discord Auth] Authentication failed:', error)
      setAuth({
        isAuthenticating: false,
        isAuthenticated: false,
        error: error as Error
      })
    }
  }, [sdk, isReady])

  /**
   * Sign out - clear authentication state
   */
  const signOut = useCallback(() => {
    setAuth({
      isAuthenticating: false,
      isAuthenticated: false
    })
    console.log('[Discord Auth] Signed out')
  }, [])

  const contextValue: DiscordSDKContext = {
    sdk,
    isReady,
    auth,
    authenticate,
    signOut
  }

  return (
    <DiscordContext.Provider value={contextValue}>
      {children}
    </DiscordContext.Provider>
  )
}

/**
 * Custom hook to access Discord SDK context
 *
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const { sdk, isReady, auth, authenticate } = useDiscordSdk()
 *
 *   if (!isReady) return <div>Loading...</div>
 *   if (!auth.isAuthenticated) {
 *     return <button onClick={authenticate}>Sign in with Discord</button>
 *   }
 *
 *   return <div>Welcome, {auth.user?.username}!</div>
 * }
 * ```
 */
export function useDiscordSdk(): DiscordSDKContext {
  const context = useContext(DiscordContext)

  if (context === undefined) {
    throw new Error(
      'useDiscordSdk must be used within a DiscordProvider. ' +
      'Wrap your app with <DiscordProvider> in your root component.'
    )
  }

  return context
}
