/**
 * Device Capabilities Hook
 *
 * Detects device platform and capabilities for adaptive rendering
 * Essential for mobile optimization in Discord Activities
 *
 * MOBILE OPTIMIZATION NOTES:
 * - iOS and Android have different behaviors
 * - Touch events are primary interaction method
 * - Screen sizes vary widely (from phones to tablets)
 * - No hover states on mobile - use active states instead
 */

import { useState, useEffect } from 'react'

export type Platform = 'desktop' | 'mobile' | 'web'

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
 * Detect the current platform
 */
function detectPlatform(): Platform {
  const userAgent = navigator.userAgent.toLowerCase()

  // Check if running in Discord mobile app
  if (/discord.*mobile/.test(userAgent)) {
    return 'mobile'
  }

  // Check for mobile devices
  if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
    return 'mobile'
  }

  // Check if running in Discord desktop app
  if (/discord/.test(userAgent)) {
    return 'desktop'
  }

  // Default to web
  return 'web'
}

/**
 * Check if device is iOS
 */
function isIOS(): boolean {
  return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
}

/**
 * Check if device is Android
 */
function isAndroid(): boolean {
  return /android/.test(navigator.userAgent.toLowerCase())
}

/**
 * Check if device supports touch events
 */
function supportsTouch(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * Hook to get device capabilities
 * Updates on window resize for responsive behavior
 *
 * Usage:
 * ```tsx
 * function MyComponent() {
 *   const device = useDeviceCapabilities()
 *
 *   if (device.isMobile) {
 *     return <MobileLayout />
 *   }
 *
 *   return <DesktopLayout />
 * }
 * ```
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => ({
    platform: detectPlatform(),
    isMobile: detectPlatform() === 'mobile',
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    supportsTouch: supportsTouch(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  }))

  useEffect(() => {
    /**
     * Handle window resize
     * Important for device rotation on mobile
     */
    function handleResize() {
      setCapabilities(prev => ({
        ...prev,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight
      }))
    }

    // Add resize listener
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return capabilities
}

/**
 * Hook to check if viewport matches a media query
 * Useful for responsive breakpoints
 *
 * Usage:
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create event listener
    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
