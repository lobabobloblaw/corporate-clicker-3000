/**
 * Error Boundary Component
 * Catches React errors and displays a friendly error screen
 * Required for production-quality Discord Activities
 */

import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })

    // In production, you could send this to an error tracking service
    // like Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
    // Reload the page to reset the app state
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 p-4 sm:p-8 flex items-center justify-center">
          <div className="max-w-2xl bg-white rounded-lg shadow-2xl p-6 sm:p-10">
            <div className="flex flex-col items-center text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              {/* Error Message */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
                Oops! Something Went Wrong
              </h1>

              <p className="text-gray-700 mb-6">
                Corporate Clicker 3000 encountered an unexpected error.
                This shouldn't happen, but hey, sometimes even the best code has bugs!
              </p>

              {/* Error Details (in development mode) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="w-full mb-6 text-left">
                  <summary className="cursor-pointer font-semibold text-gray-800 hover:text-gray-600 mb-2">
                    Show Error Details (Development Mode)
                  </summary>
                  <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60 text-sm">
                    <p className="font-mono text-red-700 mb-2">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-6 rounded-lg transition-colors min-h-touch"
                >
                  Reload Activity
                </button>

                <button
                  onClick={() => window.history.back()}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors min-h-touch"
                >
                  Go Back
                </button>
              </div>

              {/* Help Text */}
              <p className="text-sm text-gray-500 mt-6">
                If this problem persists, try clearing your browser cache or contact support.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
