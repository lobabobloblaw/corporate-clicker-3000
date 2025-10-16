# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Corporate Clicker 3000™ v4.0 REALITY.EXE** - A satirical idle/clicker Discord Activity game that parodies corporate culture with reality-breaking mechanics.

**Architecture:** Pure client-side Vite + React + TypeScript app (NO backend/API)
**Deployed:** Cloudflare Pages at `https://corporate-clicker-3000.pages.dev`
**Platform:** Discord Embedded App SDK (Activities)

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
npm run build                  # Build for production (outputs to /dist)
npm run preview                # Preview production build locally
```

### Discord Testing Workflow
```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: HTTPS tunnel (required for testing in Discord client)
npx cloudflared tunnel --url http://localhost:5173
# Copy the .trycloudflare.com URL and configure in Discord Developer Portal
```

### Deployment Workflow
```bash
# Cloudflare Pages auto-deploys on git push
git add -A
git commit -m "Your commit message"
git push origin main           # Triggers automatic deployment
```

## Architecture Overview

### Critical: This is a Client-Side Only App

**NO server-side code exists.** All authentication, game logic, and state management happens in the browser.

- **NO** `src/api/` directory
- **NO** backend API routes
- **NO** server-side OAuth2 token exchange
- **NO** session management server
- **NO** Robo.js packages or configuration

### Client-Side Authentication Pattern

Authentication uses Discord SDK's built-in `authorize()` method:

1. **DiscordSDKMock** (local development): Uses mock user data when `window.parent === window`
2. **Real Discord SDK** (in Discord iframe): Calls `sdk.commands.authorize()` to get participant info
3. **No token exchange**: User data comes directly from SDK response or participant list

```typescript
// src/hooks/useDiscordSdk.tsx
// Key pattern: Check if using mock SDK
const isUsingMockSDK = sdk instanceof DiscordSDKMock

if (isUsingMockSDK) {
  // Local dev: use mock user
  user = { id: '123...', username: 'TestUser', ... }
} else {
  // Discord client: use authorize() + getInstanceConnectedParticipants()
  const authResponse = await sdk.commands.authorize({ ... })
  const participants = await sdk.commands.getInstanceConnectedParticipants()
  user = participants[0] // Current user
}
```

### Application Structure

```
src/
├── app/                          # React application entry
│   ├── App.tsx                   # Root component, routing, auth flow
│   ├── main.tsx                  # React DOM mount point
│   └── index.css                 # Global styles, Tailwind, animations
├── components/
│   ├── CorpClicker.tsx          # MAIN GAME COMPONENT (720 lines)
│   └── ErrorBoundary.tsx         # Error handling wrapper
├── hooks/
│   ├── useDiscordSdk.tsx        # Discord SDK context provider
│   └── useDeviceCapabilities.ts  # Mobile/desktop detection
├── types/
│   ├── discord.ts                # Discord SDK types
│   └── game.ts                   # Game state & mechanics types
├── data/                         # Game content (read-only)
│   ├── upgrades.ts               # 27 purchasable upgrades
│   ├── events.ts                 # 52 random events
│   ├── achievements.ts           # 33 achievements
│   └── ascension.ts              # 5 tiers, 10 synergies, 9 glitches
├── pages/
│   ├── PrivacyPolicy.tsx         # Legal page
│   └── TermsOfService.tsx        # Legal page
└── vite-env.d.ts                 # Environment variable types
```

### Configuration Files

- **vite.config.ts** - Build config, path aliases, optimization
- **tsconfig.json** - TypeScript strict mode, path aliases
- **tailwind.config.js** - Discord brand colors, custom utilities
- **package.json** - Dependencies (NO Robo.js packages)

### Path Aliases (configured in both tsconfig.json and vite.config.ts)

```typescript
@/           → ./src/
@app/        → ./src/app/
@hooks/      → ./src/hooks/
@components/ → ./src/components/
@types/      → ./src/types/
```

Note: `@api/` alias exists but points to non-existent directory (legacy from template).

## Game Mechanics Overview

### Core Loop
1. **Click button** → Earn money (clickPower × multipliers)
2. **Buy upgrades** → Increase clickPower, autoMoney, employees
3. **Unlock synergies** → Multiplicative bonuses (2x-10x)
4. **Farm glitches** → Fast-click to fill glitch meter → Reality breaks
5. **Ascend tiers** → Reset progress for buzzword points & unlock meta mechanics

### Progression Systems (all defined in src/data/ascension.ts)

**Ascension Tiers (5):**
- Tier 0: Corporatism ($0 to start)
- Tier 1: Capitalism ($100M to ascend, +100 BP)
- Tier 2: Post-Capitalism ($1B to ascend, +500 BP)
- Tier 3: Hypercapitalism ($10B to ascend, +2000 BP)
- Tier 4: SYNTAX ERROR ($100B to ascend, +10,000 BP)

Each tier increases visual chaos (CSS animations) and glitch probability.

**Synergies (10):**
Unlock when owning specific upgrade combinations. Examples:
- "Corporate Dystopia" (hire_hr + union_busting) → 2x money, 2x click power
- "Infinite Growth Loop" (hire_marketers + hire_sales) → 3x money
- "Digital Transformation" (4 tech upgrades) → 5x auto money

Multipliers are **multiplicative** (stacks exponentially).

**Glitches (9):**
Triggered when glitch meter reaches 100% (fills from fast clicking < 200ms).
Examples:
- "Integer Overflow" → Money wraps negative, then back positive
- "Duplicate Pointer" → Doubles money instantly
- "Corrupted Sprite" → Random visual effects

### GameState Structure (src/types/game.ts)

Key properties Claude should know about:
```typescript
interface GameState {
  // Core resources
  money: number              // Primary currency
  clickPower: number         // Money per click
  autoMoney: number          // Money per second

  // Meta resources (earned on ascension)
  buzzwordPoints: number     // Prestige currency (NO SHOP YET)
  temporalFlux: number       // Time currency (NO SPENDING YET)

  // Tracking
  purchasedUpgrades: string[]     // For synergy checking
  upgradeCount: Record<string, number>  // For repeatable upgrades
  unlockedAchievements: string[]

  // Ascension
  ascensionTier: number      // 0-4
  totalAscensions: number
  realityStability: number   // 0-100, affects glitch frequency

  // Meta mechanics
  glitchMeter: number        // 0-100, fills from fast clicking
  activeGlitches: string[]   // Currently active (NOT DISPLAYED YET)
  clickCombo: number         // Maintained if clicks < 500ms apart
}
```

### Important Game Files

**src/components/CorpClicker.tsx** (720 lines)
- Main game component with all logic
- 6 setInterval loops (auto money, events, achievements, glitches, popups, buzzwords)
- Click handler (line ~244): Combo, glitch meter, synergy multipliers
- Upgrade purchase handler (line ~282)
- Ascension handler (line ~328): Resets progress, preserves meta stats
- Complex synergy system with multiplicative bonuses

**src/data/ascension.ts** (409 lines)
- `ASCENSION_TIERS`: 5 tier definitions
- `SYNERGIES`: 10 synergy combinations with requirements
- `GLITCHES`: 9 reality-breaking effects
- Helper functions: `canAscend()`, `getActiveSynergies()`, `getSynergyMultipliers()`

**src/data/upgrades.ts**
- 27 upgrades across 5 tiers
- Some repeatable (costMultiplier defined)
- Requirements: money, employees, bankruptcyCount, achievements

**src/data/events.ts**
- 52 random events (trigger every 5 seconds, 15% chance)
- Weighted probability system
- Effects modify GameState

**src/data/achievements.ts**
- 33 achievements
- Checked every 2 seconds
- Some hidden until unlocked

## Discord SDK Integration

### SDK Initialization Pattern

```typescript
// src/hooks/useDiscordSdk.tsx
// SDK is initialized ONCE in DiscordProvider
// All components access via useDiscordSdk() hook

const { sdk, isReady, auth, authenticate } = useDiscordSdk()

// Always check isReady before using SDK
if (!isReady) return <LoadingScreen />
if (!auth.isAuthenticated) return <AuthScreen />
```

### Environment Variables

**Client-side only (prefix VITE_):**
```env
VITE_DISCORD_CLIENT_ID=your_client_id_here
```

**NOT USED (legacy from template):**
```env
DISCORD_CLIENT_SECRET=...    # No server-side code exists
REDIRECT_URI=...             # Not used in current auth flow
SESSION_SECRET=...           # No session management
```

### Discord-Specific Constraints

**CSP (Content Security Policy):**
Discord blocks external requests, but this app doesn't make any external API calls, so not applicable.

**Forbidden in Discord iframes:**
- `localStorage`/`sessionStorage` - Unreliable; this app uses in-memory state only
- HTML `<form>` elements - Not used
- `window.open()` - Use `sdk.commands.openExternalLink()` if needed

## Mobile Development

### Touch Targets
All interactive elements use Tailwind custom classes:
```tsx
<button className="min-h-touch min-w-touch">  // 44x44px minimum
```

### Interaction States
**NO hover states** (mobile has no hover):
```tsx
// ✅ CORRECT
<button className="active:bg-discord-active active:scale-95">

// ❌ WRONG
<button className="hover:bg-blue-600">
```

### Responsive Layout
- Mobile: Single column, compact stats
- Desktop: Two-column grid (stats/upgrades left, clicker/achievements right)

### Device Detection
```tsx
import { useDeviceCapabilities } from '@hooks/useDeviceCapabilities'

const device = useDeviceCapabilities()
if (device.isMobile) { /* mobile-specific code */ }
```

## Common Development Patterns

### Adding New Upgrades

1. Add to `src/data/upgrades.ts`:
```typescript
export const UPGRADES: Upgrade[] = [
  {
    id: 'new_upgrade',
    name: 'Upgrade Name',
    description: 'What it does',
    baseCost: 1000,
    tier: 1,
    icon: '🎯',
    effect: {
      clickPower: 5,
      autoMoney: 2
    }
  }
]
```

2. If it's part of a synergy, add to `src/data/ascension.ts`:
```typescript
{
  id: 'new_synergy',
  name: 'Synergy Name',
  requires: ['upgrade_id_1', 'new_upgrade'],
  effect: {
    moneyMultiplier: 2.0,
    clickPowerMultiplier: 1.5
  }
}
```

### Adding New Achievements

Add to `src/data/achievements.ts`:
```typescript
{
  id: 'new_achievement',
  name: 'Achievement Name',
  description: 'How to unlock',
  icon: '🏆',
  check: (state: GameState) => state.money >= 1000000,
  reward: {
    buzzwordPoints: 50
  }
}
```

### Modifying Game State

Always use functional setState to avoid race conditions:
```typescript
setGameState(prev => ({
  ...prev,
  money: prev.money + 100,
  clickPower: prev.clickPower * 2
}))
```

### Adding New Intervals

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // Your logic here
  }, 1000) // 1 second

  return () => clearInterval(interval) // CRITICAL: Cleanup
}, []) // Dependencies
```

## Visual Effects (CSS Animations)

Reality-tier animations in `src/app/index.css` (lines 145-273):

```css
.reality-0 { /* Normal */ }
.reality-1 { /* Subtle pulse */ }
.reality-2 { /* RGB color shift */ }
.reality-3 { /* Reality crack (invert/scale/rotate) */ }
.reality-4 { /* Intense shake + RGB */ }
```

Applied via:
```tsx
<div className={`reality-${gameState.ascensionTier}`}>
```

## Known Limitations & TODOs

### Partially Implemented Features

1. **Temporal Flux** - Accumulates but no spending mechanism
   - Location: `gameState.temporalFlux`
   - TODO: Add time manipulation shop (rewind, fast-forward, freeze)

2. **Active Glitches Display** - Array populated but not shown
   - Location: `gameState.activeGlitches[]`
   - TODO: Create status bar showing active glitch effects

3. **Glitch Duration** - Specified but not tracked
   - Location: Each glitch has `duration` property
   - TODO: Implement timer to expire effects

4. **Buzzword Points Shop** - Earned on ascension but no spending
   - Location: `gameState.buzzwordPoints`
   - TODO: Create permanent upgrade shop

5. **Chaos Synergies** - Some synergies have `chaos: true` flag
   - Location: `src/data/ascension.ts`
   - TODO: Implement chaos event trigger system

6. **Tier Unlocks** - Each tier has `unlocks: []` array
   - Location: `ASCENSION_TIERS`
   - TODO: Gate features behind tier requirements

### No Persistence

**All progress is lost on page refresh.** GameState lives in React state only.

TODO: Implement localStorage save/load system.

## Performance Considerations

### Active Intervals: 6
- Auto Money (1/second)
- Glitch Check (1/second)
- Random Events (1/5 seconds, 15% chance)
- Achievements (1/2 seconds)
- Popup Ads (1/15 seconds, 3% chance)
- Buzzword Rotation (1/2 seconds)

All intervals use efficient functional setState. No performance issues observed.

### Bundle Size
```
Total: 610 KB uncompressed (168 KB gzipped)
- React vendor: 301 KB (30%)
- Discord SDK: 143 KB (14%)
- App code: 139 KB (14%)
- CSS: 24 KB (2.5%)
```

## Testing & Debugging

### Local Testing (Browser)
1. `npm run dev`
2. Visit `http://localhost:5173`
3. Uses DiscordSDKMock with mock user

### Discord Client Testing (HTTPS Required)
1. Terminal 1: `npm run dev`
2. Terminal 2: `npx cloudflared tunnel --url http://localhost:5173`
3. Copy tunnel URL
4. Configure in Discord Developer Portal → Activities → URL Mapping
5. Join Discord voice channel → Activities → Launch your app

### Useful Dev Console Commands

```javascript
// Add money for testing
gameState.money += 100000000

// Trigger glitch manually
// (Inspect component, find setGameState in scope)

// Jump to specific tier
gameState.ascensionTier = 4

// Unlock all achievements
gameState.unlockedAchievements = ACHIEVEMENTS.map(a => a.id)
```

## Troubleshooting

### "VITE_DISCORD_CLIENT_ID is not defined"
- Ensure `.env` file exists with `VITE_DISCORD_CLIENT_ID=...`
- Restart dev server after changing `.env`

### Username shows "Player" instead of Discord name
- Known issue in `src/hooks/useDiscordSdk.tsx:118`
- SDK participant detection may need adjustment
- Test in actual Discord client to verify

### Build Errors
```bash
npm run type-check  # Identify TypeScript errors
npm run lint        # Check for linting issues
```

### Activity Not Loading in Discord
- Must use HTTPS (Cloudflare Tunnel) for Discord client testing
- Verify Activity URL mapping in Discord Developer Portal
- Activities only work when in a voice channel
- Check browser console for errors

### Mobile Scrolling Issues
- App designed to fit in viewport with no scrolling
- If content overflows, check responsive grid classes
- Meta panels (tier 1+) may need adjustment on small screens

## Important Notes for Future Modifications

### When Adding Game Features:
1. Update `src/types/game.ts` (GameState interface) first
2. Add content to appropriate `src/data/` file
3. Modify `src/components/CorpClicker.tsx` logic
4. Update this CLAUDE.md if pattern changes

### When Modifying Synergies:
- Multipliers are **multiplicative** (they stack exponentially)
- Check `getSynergyMultipliers()` in `src/data/ascension.ts`
- Synergies apply to BOTH clicks and auto-money

### When Adding Intervals:
- Always include cleanup: `return () => clearInterval(interval)`
- Consider performance impact (current 6 intervals are fine)
- Use functional setState to avoid race conditions

### Before Committing:
```bash
npm run type-check  # Must pass
npm run lint        # Should pass
npm run build       # Must succeed
```

## Deployment

**Platform:** Cloudflare Pages (auto-deploys from Git)

1. Commit changes: `git add -A && git commit -m "..."`
2. Push to main: `git push origin main`
3. Cloudflare Pages auto-builds and deploys
4. Live URL: `https://corporate-clicker-3000.pages.dev`

**Build command:** `npm run build`
**Output directory:** `dist`
**Environment variables:** Set in Cloudflare Pages dashboard

## Documentation Files

- `CLAUDE.md` - This file (guidance for Claude)
- `README.md` - User-facing project documentation
- `V4_IMPLEMENTATION_DOCS.md` - v4.0 technical implementation details
- `SESSION_WRAPUP.md` - Latest development session summary
- `NEXT_SESSION_PROMPT.md` - Continuation prompt for next session
- `DISCORD_SETUP.md` - Discord Developer Portal setup guide

## Quick Reference

| What | Where |
|------|-------|
| Main game logic | `src/components/CorpClicker.tsx` |
| Game state type | `src/types/game.ts` |
| Upgrades (27) | `src/data/upgrades.ts` |
| Events (52) | `src/data/events.ts` |
| Achievements (33) | `src/data/achievements.ts` |
| Ascension system | `src/data/ascension.ts` |
| Discord SDK hook | `src/hooks/useDiscordSdk.tsx` |
| CSS animations | `src/app/index.css:145-273` |
| Click handler | `CorpClicker.tsx:~244` |
| Ascend handler | `CorpClicker.tsx:~328` |
| Synergy detection | `ascension.ts:getActiveSynergies()` |

## Version History

- **v4.0 REALITY.EXE** (Current) - Ascension, synergies, glitch farming, meta mechanics
- **v3.0** - Mobile optimization, achievements, random events
- **v2.0** - Upgrades, employees, game loop
- **v1.0** - Basic clicker prototype
