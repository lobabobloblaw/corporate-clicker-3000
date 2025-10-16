/**
 * Type definitions for Discord Activity integration
 * Extends @discord/embedded-app-sdk types with application-specific needs
 */

/**
 * Discord OAuth2 access token response from server
 */
export interface DiscordTokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token: string
  scope: string
}

/**
 * Discord user information
 */
export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  bot?: boolean
  system?: boolean
  mfa_enabled?: boolean
  locale?: string
  verified?: boolean
  email?: string | null
  flags?: number
  premium_type?: number
  public_flags?: number
}

/**
 * Discord guild (server) information
 */
export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner?: boolean
  permissions?: string
  features: string[]
}

/**
 * Authentication state for the activity
 */
export interface AuthState {
  /** Whether authentication is in progress */
  isAuthenticating: boolean
  /** Whether the user is authenticated */
  isAuthenticated: boolean
  /** Discord access token (stored server-side, this is just a session identifier) */
  sessionToken?: string
  /** Current authenticated user */
  user?: DiscordUser
  /** Error during authentication if any */
  error?: Error
}

/**
 * Discord SDK context value provided to components
 */
export interface DiscordSDKContext {
  /** Discord SDK instance */
  sdk: any | null // Accept both DiscordSDK and DiscordSDKMock
  /** Whether SDK is ready for use */
  isReady: boolean
  /** Authentication state */
  auth: AuthState
  /** Function to initiate OAuth2 flow */
  authenticate: () => Promise<void>
  /** Function to sign out */
  signOut: () => void
}

/**
 * Platform-specific information
 */
export type Platform = 'desktop' | 'mobile' | 'web'

/**
 * Device capabilities for adaptive rendering
 */
export interface DeviceCapabilities {
  platform: Platform
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
  supportsTouch: boolean
  screenWidth: number
  screenHeight: number
}

/**
 * Activity command data structure
 * Used for launching activity with specific parameters
 */
export interface ActivityCommand {
  type: string
  data?: Record<string, unknown>
}
