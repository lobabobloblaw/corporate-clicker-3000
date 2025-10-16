/**
 * Main App Component
 *
 * Root component for Discord Activity
 * - Handles authentication flow
 * - Provides responsive layout
 * - Demonstrates mobile-first design principles
 */

import { useDiscordSdk } from '@hooks/useDiscordSdk'
import { CorpClicker } from '@components/CorpClicker'
import { PrivacyPolicy } from '../pages/PrivacyPolicy'
import { TermsOfService } from '../pages/TermsOfService'
import './index.css'

/**
 * Loading Screen Component
 * Shown while Discord SDK initializes
 */
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-discord-bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner" />
        <p className="text-discord-text-muted">Initializing Discord SDK...</p>
      </div>
    </div>
  )
}

/**
 * Authentication Screen Component
 * Shown when user needs to authenticate
 */
function AuthScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-discord-bg-primary p-4 safe-top safe-bottom">
      <div className="card-discord max-w-md w-full animate-fade-in">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Discord Logo/Icon */}
          <div className="w-20 h-20 bg-discord-blurple rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-discord-text-normal mb-2">
              CORPORATE CLICKER 3000™
            </h1>
            <p className="text-discord-text-muted">
              Sign in with Discord to start clicking!
            </p>
          </div>

          <button
            onClick={onAuthenticate}
            className="btn-discord w-full active-touch"
          >
            Sign in with Discord
          </button>

          <p className="text-xs text-discord-text-muted">
            By signing in, you agree to share your Discord user information with this activity.
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Error Screen Component
 * Shown when there's an authentication or SDK error
 */
function ErrorScreen({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-discord-bg-primary p-4">
      <div className="card-discord max-w-md w-full">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-discord-red rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-discord-text-normal mb-2">
              Something went wrong
            </h2>
            <p className="text-discord-text-muted text-sm">
              {error.message}
            </p>
          </div>

          <button
            onClick={onRetry}
            className="btn-discord w-full active-touch"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Main Content Component
 * Shown when user is authenticated and ready
 * Now shows the Corporate Clicker game
 */
function MainContent() {
  return <CorpClicker />
}

/**
 * Main App Component
 * Handles routing between different states and pages
 */
export default function App() {
  const { isReady, auth, authenticate } = useDiscordSdk()

  // Simple routing based on pathname
  const pathname = window.location.pathname

  // Legal pages don't require Discord authentication
  if (pathname === '/privacy-policy' || pathname === '/privacy') {
    return <PrivacyPolicy />
  }

  if (pathname === '/terms-of-service' || pathname === '/terms' || pathname === '/tos') {
    return <TermsOfService />
  }

  // Discord-authenticated app pages
  // Loading state
  if (!isReady) {
    return <LoadingScreen />
  }

  // Error state
  if (auth.error) {
    return <ErrorScreen error={auth.error} onRetry={authenticate} />
  }

  // Authentication required
  if (!auth.isAuthenticated) {
    return <AuthScreen onAuthenticate={authenticate} />
  }

  // Main content
  return <MainContent />
}
