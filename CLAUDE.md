# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Development
npm install                    # Install dependencies (run first)
npm run dev                    # Start development server (http://localhost:5173)

# Code Quality
npm run type-check             # TypeScript type checking (run before committing)
npm run lint                   # ESLint code linting
npm run format                 # Prettier code formatting

# Production
npm run build                  # Build for production
npm run start                  # Start production server
```

### Discord Testing Workflow
```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: HTTPS tunnel (required for testing in Discord client)
npx cloudflared tunnel --url http://localhost:5173
# Copy the .trycloudflare.com URL and add to Discord Developer Portal
```

### Robo.js Commands
```bash
robo doctor                    # Diagnose configuration issues
robo invite                    # Generate Activity invite URL
robo deploy                    # Deploy to production
robo update                    # Update Robo.js dependencies
```

## Architecture Overview

### Critical Architectural Patterns

**1. Client-Server OAuth2 Flow**
- **Client** (`src/hooks/useDiscordSdk.tsx`): Gets authorization code from Discord SDK
- **Server** (`src/api/token.ts`): Exchanges code for access token using client secret
- **NEVER** expose `DISCORD_CLIENT_SECRET` in client code (only in `src/api/`)
- Session tokens stored in-memory Map (replace with Redis/DB for production)

**2. Discord SDK Singleton Pattern**
- SDK initialized ONCE in `DiscordProvider` (src/hooks/useDiscordSdk.tsx)
- All components access via `useDiscordSdk()` hook
- Uses `DiscordSDKMock` for local development (when `window.parent === window`)
- Uses real `DiscordSDK` when running in Discord iframe

**3. Robo.js API Routes**
- Files in `src/api/` are server-side endpoints (NOT client code)
- Export default function with signature: `(req: RoboRequest) => Promise<RoboResponse>`
- Routes auto-mapped: `src/api/token.ts` → `/api/token`
- Has access to `process.env` for secrets

### Key Files and Their Roles

**Authentication Flow:**
1. `src/hooks/useDiscordSdk.tsx` - Client-side OAuth2 initiation
2. `src/api/token.ts` - Server-side token exchange (has `DISCORD_CLIENT_SECRET`)
3. `src/api/user.ts` - Fetches Discord user info using session token

**Configuration:**
- `vite.config.ts` - Contains `@robojs/patch` plugin for CSP compliance
- `.config/robo.mjs` - Robo.js framework configuration
- `tsconfig.json` - Path aliases: `@/`, `@hooks/`, `@api/`, `@components/`, `@types/`

**Type System:**
- `src/types/discord.ts` - Discord SDK types (AuthState, DiscordUser, etc.)
- `src/vite-env.d.ts` - Environment variable types

## Discord-Specific Constraints

### Content Security Policy (CSP)
**Problem:** Discord blocks direct external API requests
**Solution:** All external requests must use `/.proxy/` prefix or URL mappings

```typescript
// ❌ BLOCKED by CSP
await fetch('https://api.example.com/data')

// ✅ CORRECT - Configure in vite.config.ts urlMappings
await fetch('/.proxy/example-api/data')
```

### Forbidden in Discord iframes
- `localStorage`/`sessionStorage` (unreliable, don't use for critical data)
- HTML `<form>` elements (blocked)
- `window.open()` (use `sdk.commands.openExternalLink()`)

### Environment Variables
**Client-side** (prefix `VITE_`):
- `VITE_DISCORD_CLIENT_ID` - Safe to expose, used in client code

**Server-side** (NO prefix):
- `DISCORD_CLIENT_SECRET` - CRITICAL: Never access in `src/app/` or `src/hooks/`
- `REDIRECT_URI` - OAuth2 redirect URI

## Mobile Development Requirements

### Touch Targets
All interactive elements MUST be minimum 44x44px:
```tsx
<button className="min-h-touch min-w-touch">  // Uses Tailwind custom utility
```

### Interaction States
NO hover states (mobile has no hover):
```tsx
// ✅ CORRECT - active state
<button className="active:bg-discord-active active:scale-95">

// ❌ WRONG - hover doesn't work on mobile
<button className="hover:bg-blue-600">
```

### Device Detection
```tsx
import { useDeviceCapabilities } from '@hooks/useDeviceCapabilities'

const device = useDeviceCapabilities()
if (device.isMobile) { /* mobile-specific code */ }
```

## Production Deployment Checklist

**CRITICAL - Update before production:**
1. Replace in-memory session storage in `src/api/token.ts` with Redis/database
2. Implement proper CSRF state validation in `src/api/token.ts` (currently TODO)
3. Set environment variables in hosting platform
4. Test OAuth2 flow on actual Discord mobile clients (iOS & Android)

## Common Development Patterns

### Adding New Components
```tsx
// Always check SDK ready state
import { useDiscordSdk } from '@hooks/useDiscordSdk'

function MyComponent() {
  const { sdk, isReady, auth } = useDiscordSdk()

  if (!isReady) return <LoadingSpinner />
  if (!auth.isAuthenticated) return <SignInPrompt />

  // Component logic
}
```

### Adding New API Endpoints
```typescript
// src/api/my-endpoint.ts
import type { RoboRequest, RoboResponse } from '@robojs/server'

export default async function handler(req: RoboRequest): Promise<RoboResponse> {
  if (req.method !== 'POST') {
    return { status: 405, body: { error: 'Method not allowed' } }
  }

  // Has access to process.env secrets here
  const secret = process.env.MY_SECRET

  return { status: 200, body: { data: 'response' } }
}
```

### Discord SDK Event Subscriptions
```tsx
useEffect(() => {
  if (!sdk) return

  const handler = (data: any) => { /* handle event */ }
  sdk.subscribe('VOICE_STATE_UPDATE', handler)

  // CRITICAL: Always cleanup
  return () => sdk.unsubscribe('VOICE_STATE_UPDATE', handler)
}, [sdk])
```

## Troubleshooting

### "VITE_DISCORD_CLIENT_ID is not defined"
- Ensure `.env` file exists with `VITE_DISCORD_CLIENT_ID=...`
- Restart dev server after changing `.env`

### OAuth2 Redirect Error
- Redirect URI in `.env` must exactly match Discord Developer Portal
- Include protocol (http/https) and no trailing slash

### CSP Violations
- Check browser console for blocked requests
- Add URL mapping in `vite.config.ts` urlMappings object
- Use `/.proxy/` prefix for external APIs

### Activity Not Loading in Discord
- Must use HTTPS (Cloudflare Tunnel) for testing in Discord client
- Verify Activity URL mapping in Discord Developer Portal
- Activities only work in voice channels
