/**
 * Application Entry Point
 *
 * Initializes React app with Discord SDK provider
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { DiscordProvider } from '@hooks/useDiscordSdk'
import { ErrorBoundary } from '@components/ErrorBoundary'
import App from './App'
import './index.css'

/**
 * Root element setup
 * Ensures proper error handling during mount
 */
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    'Failed to find root element. ' +
    'Make sure your HTML has a <div id="root"></div> element.'
  )
}

/**
 * Render app with providers
 * ErrorBoundary catches React errors
 * DiscordProvider must wrap entire app to provide SDK context
 */
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DiscordProvider>
        <App />
      </DiscordProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
