/// <reference types="vite/client" />

/**
 * TypeScript definitions for Vite environment variables
 * Provides autocomplete and type safety for import.meta.env
 */

interface ImportMetaEnv {
  /** Discord OAuth2 Client ID (public, safe to expose) */
  readonly VITE_DISCORD_CLIENT_ID: string

  /** Current environment (development, production, etc.) */
  readonly MODE: string

  /** Base URL of the app */
  readonly BASE_URL: string

  /** Whether running in development mode */
  readonly DEV: boolean

  /** Whether running in production mode */
  readonly PROD: boolean

  /** Whether server-side rendering is enabled */
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
