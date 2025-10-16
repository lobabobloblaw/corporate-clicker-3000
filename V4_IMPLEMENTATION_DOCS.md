# Corporate Clicker 3000™ v4.0 REALITY.EXE - Implementation Documentation

**Deployed:** 2025-10-16
**Build Status:** ✅ Successful
**Live URL:** https://corporate-clicker-3000.pages.dev
**Version:** v4.0 REALITY.EXE

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture Changes](#architecture-changes)
3. [New Game Systems](#new-game-systems)
4. [File Structure](#file-structure)
5. [Key Mechanics](#key-mechanics)
6. [Configuration & Balancing](#configuration--balancing)
7. [Visual Effects](#visual-effects)
8. [Known Issues](#known-issues)
9. [Future Enhancements](#future-enhancements)
10. [Development Guide](#development-guide)

---

## Overview

v4.0 "REALITY.EXE" introduces reality-breaking mechanics inspired by Vampire Survivors-level chaos. The update adds:
- 5 ascension tiers that progressively break reality
- 10 synergy combinations for massive multipliers
- 9 glitch effects triggered by rapid clicking
- Meta-game mechanics (temporal flux, reality stability, combo system)
- Progressive visual chaos based on ascension tier

**Design Philosophy:** Go meta, introduce unexpected mechanics, make bugs into features, break the fourth wall.

---

## Architecture Changes

### GameState Extension (`src/types/game.ts`)

**New Properties Added:**
```typescript
// Ascension system
ascensionTier: number        // 0-4 (Corporatism → SYNTAX ERROR)
totalAscensions: number      // Total times ascended
temporalFlux: number         // Time manipulation resource
realityStability: number     // 0-100, affects glitch frequency

// Meta mechanics
glitchMeter: number          // 0-100, fills from fast clicking
activeGlitches: string[]     // Currently active glitch effects
secretsUnlocked: string[]    // Hidden mechanics discovered
maxMoneyThisRun: number      // For tracking achievements

// Enhanced tracking
lastClickTime: number        // For detecting rapid clicking
clickCombo: number           // Current click streak
```

**New Interfaces:**
- `AscensionTier` - Defines reality tier properties
- `Synergy` - Defines upgrade combinations
- `Glitch` - Defines reality-breaking effects

### New Data File (`src/data/ascension.ts`)

**Structure:**
- `ASCENSION_TIERS` - Array of 5 reality tiers
- `SYNERGIES` - Array of 10 upgrade combinations
- `GLITCHES` - Array of 9 glitch effects
- Helper functions for tier management, synergy detection, glitch triggering

**Key Functions:**
```typescript
getCurrentTier(tierId: number): AscensionTier
getNextTier(currentTierId: number): AscensionTier | null
canAscend(state: GameState): boolean
getActiveSynergies(purchasedUpgrades: string[]): Synergy[]
getSynergyMultipliers(purchasedUpgrades: string[]): MultiplierObject
shouldTriggerGlitch(state: GameState): boolean
getRandomGlitch(): Glitch | null
```

---

## New Game Systems

### 1. Ascension System

**Purpose:** Prestige mechanic that resets progress for permanent bonuses.

**Tiers:**
| Tier | Name | Cost | Buzzword Reward | Glitch Chance | Visual Effect |
|------|------|------|-----------------|---------------|---------------|
| 0 | Corporatism | $0 | 0 BP | 0% | None |
| 1 | Late-Stage Capitalism | $100M | 100 BP | 10% | Pulse chaos |
| 2 | Post-Scarcity | $1B | 500 BP | 25% | RGB shift |
| 3 | Cosmic CEO | $10B | 2000 BP | 50% | Reality crack |
| 4 | §Y▓T▓X ER█OR | $100B | 10000 BP | 100% | Glitch shake + RGB |

**Mechanics:**
- Ascend button appears when reaching tier cost threshold
- Resets: money, clicks, employees, upgrades, stats
- Preserves: buzzword points, achievements, lifetime stats, temporal flux
- Unlocks new mechanics at each tier

**Implementation Location:** `src/components/CorpClicker.tsx:328-382`

---

### 2. Synergy System

**Purpose:** Reward players for specific upgrade combinations with massive multipliers.

**10 Synergies Defined:**

1. **Corporate Dystopia** (hire_hr + union_busting)
   - Auto Money: ×2.5
   - Glitch Meter: +10

2. **Infinite Synergy Loop** (synergy_team + consultant)
   - Money: ×3
   - Triggers chaos events

3. **AI Blockchain Nonsense** (blockchain + useless_ai)
   - Click Power: ×5
   - Temporal Flux: +50/click
   - Triggers chaos events

4. **Too Big To Care** (ipo + too_big_fail)
   - Money: ×10
   - Auto Money: ×10

5. **Tax Haven Paradise** (offshore + accounting)
   - Money: ×4
   - Glitch Meter: +25

6. **Metaverse Madness** (vr_office + blockchain)
   - Auto Money: ×6
   - Temporal Flux: +100/click
   - Triggers chaos events

7. **Caffeine Overdrive** (coffee_machine + energy_drinks)
   - Click Power: ×3
   - Glitch Meter: +50

8. **Market Manipulation** (stock_manipulation + insider_trading)
   - Money: ×8
   - Temporal Flux: +150/click

9. **Meeting Singularity** (meeting_room + consultant + hire_manager)
   - Triggers chaos events
   - Glitch Meter: +100

10. **Quantum Capitalism** (blockchain + useless_ai + too_big_fail)
    - Money: ×20
    - Click Power: ×10
    - Temporal Flux: +500/click
    - Triggers chaos events

**Detection Logic:**
- Runs on every `purchasedUpgrades` change
- Checks if all required upgrade IDs are owned
- Displays active synergies in dedicated UI panel
- Shows total multipliers at bottom of panel

**Implementation Location:** `src/data/ascension.ts:71-186` and `src/components/CorpClicker.tsx:191-202`

---

### 3. Glitch Farming System

**Purpose:** Reward fast clicking with reality-breaking bonuses.

**How It Works:**
1. Click within 200ms → +2 glitch meter
2. Click within 500ms → +1 glitch meter
3. Click combo increments if within 500ms, resets otherwise
4. When glitch meter reaches 100%, chance to trigger glitch based on reality tier
5. Glitch meter decays at -0.5/second

**9 Glitches:**

1. **INTEGER OVERFLOW** (30% chance)
   - Effect: Double money instantly
   - Duration: 10 seconds

2. **EMPLOYEE DUPLICATION** (20% chance)
   - Effect: Double employees, ×1.5 auto money
   - Duration: 15 seconds

3. **TIME SKIP** (25% chance)
   - Effect: +10 seconds worth of auto money instantly
   - +100 temporal flux
   - Duration: 5 seconds

4. **REALITY CRACK** (15% chance)
   - Effect: ×5 click power
   - -20 reality stability
   - Duration: 20 seconds

5. **NEGATIVE LIABILITY** (10% chance)
   - Effect: Invert legal liability to negative
   - Gain money = liability × 1000
   - Duration: 30 seconds

6. **UPGRADE CLONING** (5% chance)
   - Effect: Double click power and auto money
   - Duration: 60 seconds

7. **BUZZWORD EXPLOSION** (20% chance)
   - Effect: +10 buzzword levels, ×1.5 money
   - Duration: 15 seconds

8. **STACK OVERFLOW** (15% chance)
   - Effect: Triple auto money
   - Duration: 20 seconds

9. **§Y§T£M ERR*R** (5% chance)
   - Effect: ×10 money, reality stability → 0
   - Duration: 5 seconds

**Implementation Location:** `src/data/ascension.ts:192-317` and `src/components/CorpClicker.tsx:157-186`

---

### 4. Click Combo System

**Purpose:** Track and reward sustained rapid clicking.

**Mechanics:**
- Combo increments on each click if < 500ms since last click
- Combo resets if > 500ms between clicks
- Displayed in Meta Mechanics panel (Tier 1+)
- Currently visual only, ready for future combo-based bonuses

**Implementation Location:** `src/components/CorpClicker.tsx:187-220`

---

### 5. Temporal Flux Resource

**Purpose:** New currency for future time manipulation mechanics.

**How to Earn:**
- Synergies grant temporal flux per click
- AI Blockchain Nonsense: +50/click
- Metaverse Madness: +100/click
- Market Manipulation: +150/click
- Quantum Capitalism: +500/click
- Time Skip glitch: +100

**Current State:**
- Displayed in Meta Mechanics panel
- Accumulates but not yet consumed
- Preserved through ascension
- **Future Use:** Time travel, temporal rewind, fast-forward mechanics

**Implementation Location:** Display at `src/components/CorpClicker.tsx:531-558`

---

## File Structure

```
src/
├── components/
│   └── CorpClicker.tsx          [MODIFIED] Main game component
├── data/
│   ├── achievements.ts          [UNCHANGED] 33 achievements
│   ├── ascension.ts             [NEW] Tiers, synergies, glitches
│   ├── events.ts                [UNCHANGED] 52 random events
│   └── upgrades.ts              [UNCHANGED] 27 upgrades
├── types/
│   └── game.ts                  [MODIFIED] Extended GameState
├── app/
│   └── index.css                [MODIFIED] Added glitch animations
└── hooks/
    └── useDiscordSdk.tsx        [UNCHANGED]

dist/                            [AUTO-GENERATED]
├── index.html
├── assets/
│   ├── index-nLqgOk5s.css      (24.83 KB)
│   ├── index-CaIBObVT.js       (139.73 KB)
│   ├── discord-sdk-BwT8OUmg.js (143.68 KB)
│   └── react-vendor-DbXGO6ox.js (301.75 KB)
└── _headers                     [UNCHANGED] CORS config
```

---

## Key Mechanics

### Click Handler Enhanced Logic

**Before v4.0:**
```typescript
money += clickPower
totalClicks++
```

**After v4.0:**
```typescript
// 1. Calculate time since last click
timeSinceLastClick = now - lastClickTime

// 2. Update combo
combo = timeSinceLastClick < 500ms ? combo + 1 : 1

// 3. Fill glitch meter
glitchGain = timeSinceLastClick < 200ms ? 2 :
             timeSinceLastClick < 500ms ? 1 : 0
glitchMeter = min(100, glitchMeter + glitchGain)

// 4. Apply synergy multipliers
effectiveClickPower = clickPower × synergyMultipliers.clickPowerMultiplier

// 5. Add money
money += effectiveClickPower

// 6. Add temporal flux
temporalFlux += synergyMultipliers.temporalFluxGain
```

### Auto Money Loop Enhanced Logic

**Before v4.0:**
```typescript
money += autoMoney (every second)
```

**After v4.0:**
```typescript
// Apply synergy multipliers
effectiveAutoMoney = autoMoney × synergyMultipliers.autoMoneyMultiplier
money += effectiveAutoMoney (every second)
```

### Ascension Reset Logic

**What Gets Reset:**
- money → 0
- clickPower → 1
- autoMoney → 0
- synergy → 0
- electrolytes → 100
- employees → 0
- buzzwordLevel → 1
- All stats (stockPrice, legalLiability, caffeine, meetingTime)
- purchasedUpgrades → []
- upgradeCount → {}
- totalClicks → 0
- glitchMeter → 0
- activeGlitches → []
- maxMoneyThisRun → 0
- clickCombo → 0

**What Gets Preserved:**
- buzzwordPoints (INCREMENTED by tier reward)
- lifetimeEarnings
- bankruptcyCount (INCREMENTED)
- unlockedAchievements
- lifetimeClicks
- temporalFlux ✨ (NEW - carries over!)
- secretsUnlocked
- ascensionTier (INCREMENTED)
- totalAscensions (INCREMENTED)

**What Gets Modified:**
- realityStability → 50 (lower in higher tiers)
- startTime → now
- lastClickTime → now

---

## Configuration & Balancing

### Ascension Cost Curve

```
Tier 0 → 1: $100,000,000      (100M)
Tier 1 → 2: $1,000,000,000    (1B)   - 10x increase
Tier 2 → 3: $10,000,000,000   (10B)  - 10x increase
Tier 3 → 4: $100,000,000,000  (100B) - 10x increase
```

**Design Rationale:** Exponential scaling ensures each ascension feels like a major accomplishment.

### Buzzword Point Rewards

```
Tier 0 → 1: 100 BP
Tier 1 → 2: 500 BP     (5x increase)
Tier 2 → 3: 2000 BP    (4x increase)
Tier 3 → 4: 10000 BP   (5x increase)
```

**Future Use:** Buzzword points will unlock permanent upgrades in future updates.

### Glitch Meter Fill Rates

```
Click < 200ms apart: +2/click  (Fast clicking)
Click < 500ms apart: +1/click  (Normal clicking)
Click > 500ms apart: 0/click   (Slow clicking)
Passive decay: -0.5/second

To fill 100%:
- Ultra fast (200ms): 50 clicks in 10 seconds
- Fast (500ms): 100 clicks in 50 seconds
- Mixed clicking: varies
```

**Design Rationale:** Rewards sustained rapid clicking, creates risk/reward for hand fatigue.

### Synergy Multiplier Stacking

Multipliers are **multiplicative**, not additive:

```
Example: Player has both synergies
- Infinite Synergy Loop: Money ×3
- Too Big To Care: Money ×10, Auto Money ×10

Final multipliers:
- Money: ×30 (3 × 10)
- Auto Money: ×10
```

**Most Powerful Combo:**
Quantum Capitalism + Too Big To Care + Tax Haven Paradise:
- Money: ×20 × ×10 × ×4 = **×800**
- Click Power: ×10
- Auto Money: ×10

---

## Visual Effects

### CSS Animations Added (`src/app/index.css:145-273`)

**Keyframe Animations:**
1. `glitch-shake` - Rapid screen shake
2. `glitch-rgb` - Hue rotation through color spectrum
3. `reality-crack` - Invert colors + scale/rotate fluctuation
4. `slide-up` - Notification slide animation
5. `pulse-chaos` - Opacity/scale pulse

**Reality Tier Classes:**
```css
.reality-0 { /* Normal - no effects */ }
.reality-1 { animation: pulse-chaos 3s infinite; }
.reality-2 { animation: glitch-rgb 5s infinite; }
.reality-3 { animation: reality-crack 4s infinite; }
.reality-4 {
  animation: glitch-shake 0.3s infinite,
             glitch-rgb 2s infinite;
  filter: saturate(1.5) contrast(1.2);
}
```

**Applied To:** Main container div dynamically based on `gameState.ascensionTier`

**Performance Note:** CSS animations are hardware-accelerated, minimal performance impact.

---

## Known Issues

### Current Limitations

1. **Temporal Flux Not Consumed**
   - Resource accumulates but has no spending mechanism yet
   - Planned for future time manipulation features

2. **Glitch Duration Not Tracked**
   - Glitches specify duration but effects are instant/permanent
   - Need duration tracking system for temporary effects

3. **No Buzzword Point Spending**
   - BP accumulates but no shop/upgrades to spend it on
   - Planned for permanent upgrade tree

4. **Synergy Chaos Events Not Implemented**
   - Some synergies flag `chaos: true` but no chaos handler exists
   - Placeholder for future random event triggers

5. **Active Glitches Array Not Used**
   - `activeGlitches[]` populated but not displayed or expired
   - Need glitch status display and duration management

6. **Reality Tier Unlocks Not Checked**
   - Each tier has `unlocks: ['feature_id']` but nothing validates them
   - Placeholder for gating future features

### Not Bugs, But Features

- **Glitch meter can exceed 100%** - Intentional, creates visual feedback
- **Synergy multipliers stack multiplicatively** - Intentional, creates power fantasy
- **No cap on temporal flux** - Intentional, long-term resource accumulation

---

## Future Enhancements

### Phase 5.0 - Planned Features

Based on original v4.0 plan that wasn't fully implemented:

1. **Time Manipulation** (Temporal Flux Usage)
   - Rewind 10 seconds: 100 TF
   - Fast-forward 30 seconds: 300 TF
   - Freeze time for 10 seconds: 500 TF

2. **Secret Upgrade Trees**
   - Conspiracy Branch (tinfoil hat upgrades)
   - Techbro Branch (Silicon Valley satire)
   - Nihilism Branch (nothing matters)

3. **Meta Mechanics**
   - Console commands (konami code, cheat codes)
   - Fake crash screens
   - Fourth wall break events

4. **Particle Effects**
   - Money flying off on clicks
   - Employees spawning animations
   - Glitch visual explosions

5. **News Ticker**
   - Scrolling absurd headlines at bottom
   - Reacts to player actions
   - Occasionally interactive

6. **Parallel Universes** (Unlocked Tier 2+)
   - Alternative reality branches
   - Different upgrade paths per universe
   - Merge/diverge mechanics

7. **Buzzword Point Shop**
   - Permanent multiplier upgrades
   - Starting resource bonuses
   - Meta progression unlocks

### Phase 5.5 - Advanced Features

1. **Discord Integration Chaos**
   - Change server icon (if permissions)
   - Spam typing indicator
   - Send messages as "the void"

2. **Save/Load System**
   - LocalStorage persistence
   - Import/export saves
   - Cloud sync via Discord user ID

3. **Leaderboards**
   - Fastest ascension times
   - Highest money achieved
   - Most glitches triggered

---

## Development Guide

### Adding a New Ascension Tier

1. Add tier definition to `ASCENSION_TIERS` in `src/data/ascension.ts`:
```typescript
{
  id: 5,
  name: 'Your Tier Name',
  description: 'Tier description',
  cost: 1000000000000,  // $1T
  buzzwordReward: 50000,
  unlocks: ['feature_ids'],
  visualEffect: 'reality-5',
  glitchChance: 1.5  // Can exceed 1.0 for guaranteed + extra effects
}
```

2. Add CSS animation in `src/app/index.css`:
```css
.reality-5 {
  animation: your-animation 2s infinite;
  /* your effects */
}
```

3. Update tier badge colors in `src/components/CorpClicker.tsx:466-474`

### Adding a New Synergy

1. Add synergy definition to `SYNERGIES` in `src/data/ascension.ts`:
```typescript
{
  id: 'synergy_id',
  name: 'Synergy Name',
  description: 'What it does',
  icon: '🎯',
  requires: ['upgrade_id_1', 'upgrade_id_2'],
  effect: {
    moneyMultiplier: 5,
    clickPowerMultiplier: 2,
    autoMoneyMultiplier: 3,
    glitchMeterBonus: 20,
    temporalFluxGain: 100,
    chaos: true  // Optional
  }
}
```

2. Ensure required upgrade IDs exist in `src/data/upgrades.ts`

### Adding a New Glitch

1. Add glitch definition to `GLITCHES` in `src/data/ascension.ts`:
```typescript
{
  id: 'glitch_id',
  name: 'GLITCH NAME',
  description: 'What happens',
  icon: '⚡',
  duration: 15,  // seconds
  triggerChance: 0.2,  // 20% when glitch meter full
  visualEffect: 'glitch-your-effect',
  gameEffect: (state) => ({
    money: state.money * 2,
    // other state changes
    glitchMeter: 0  // Always reset
  })
}
```

2. Add CSS animation for `visualEffect` if needed

### Modifying Synergy Multiplier Calculation

Located in `src/data/ascension.ts:361-388`

To add new multiplier type:
1. Add to return type interface
2. Add to `initialValue` object
3. Add calculation logic in reduce function
4. Update display in `src/components/CorpClicker.tsx:578-582`

### Testing Ascension

**Quick Test Mode:**
1. Temporarily change tier costs in `src/data/ascension.ts`:
```typescript
cost: 100,  // Changed from 100000000
```
2. Build and test
3. Revert before commit

**Debug Panel Idea:**
Add to `CorpClicker.tsx` in development:
```typescript
{process.env.NODE_ENV === 'development' && (
  <button onClick={() => setGameState(prev => ({
    ...prev,
    money: 100000000000
  }))}>
    DEV: +100B
  </button>
)}
```

---

## Performance Considerations

### Current Performance

**Intervals Running:**
- Auto money generation: 1/second
- Random events: 1/5 seconds (15% chance)
- Achievement checking: 1/2 seconds
- Glitch checking: 1/second
- Buzzword rotation: 1/2 seconds
- Popup ads: 1/15 seconds (3% chance)

**Total:** 6 intervals, minimal impact

**Optimization Opportunities:**
1. Debounce synergy detection (currently on every upgrade)
2. Memoize multiplier calculations
3. Virtual scroll for long upgrade lists
4. Disable animations on low-end devices

### Build Size

```
Total: ~610 KB (gzipped: ~168 KB)
- React vendor: 301 KB (91 KB gzipped)
- Discord SDK: 143 KB (43 KB gzipped)
- App code: 139 KB (28 KB gzipped)
- CSS: 24 KB (5 KB gzipped)
```

**Well within Discord Activity limits** (< 10 MB uncompressed)

---

## Git Workflow

### Branch Structure
```
main (production) ← currently deployed v4.0
```

### Commit Message Format
```
<type>: <description>

<body with details>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Deployment
Push to `main` triggers automatic Cloudflare Pages deployment.

**Build Command:** `npm run build`
**Output Directory:** `dist/`
**Deploy Time:** ~1-2 minutes

---

## Testing Checklist

### Before Deployment
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] All imports resolve correctly
- [ ] No console errors in browser
- [ ] Clicks register and update money
- [ ] Upgrades purchase correctly
- [ ] Achievements unlock
- [ ] Random events trigger
- [ ] Glitch meter fills on fast clicking
- [ ] Synergies detect when upgrades purchased
- [ ] Ascend button appears at threshold
- [ ] Ascension resets game state correctly
- [ ] Visual effects apply based on tier
- [ ] Mobile layout works (responsive)

### After Deployment
- [ ] Discord Activity loads in Discord client
- [ ] No CORS errors
- [ ] Username displays correctly
- [ ] Game state persists across refreshes (if save system added)

---

## Support & Resources

**Live Game:** https://corporate-clicker-3000.pages.dev
**GitHub Repo:** https://github.com/lobabobloblaw/corporate-clicker-3000
**Cloudflare Pages:** Auto-deploy from main branch
**Discord SDK Docs:** https://discord.com/developers/docs/activities/overview

**Key Technologies:**
- React 18
- TypeScript 5
- Vite 5.4
- Tailwind CSS 3.4
- Discord Embedded App SDK 1.1.0

---

## Changelog

### v4.0 REALITY.EXE (2025-10-16)
- ✨ Added 5 ascension tiers with progressive reality breakdown
- ✨ Added 10 synergy combinations with multiplicative bonuses
- ✨ Added 9 glitch effects triggered by rapid clicking
- ✨ Added temporal flux resource system
- ✨ Added click combo tracking
- ✨ Added reality stability mechanic
- ✨ Added meta mechanics display panel
- ✨ Added active synergies display
- ✨ Added visual chaos effects (CSS animations)
- ✨ Added prestige reset preserving key stats
- 🎨 Updated header to show reality tier with colors
- 🎨 Updated version to v4.0 REALITY.EXE
- ♻️ Refactored click handler for combo/glitch tracking
- ♻️ Refactored auto money loop for synergy multipliers
- 📝 Extended GameState with 9 new properties
- 📝 Created ascension.ts data file

### v3.0 (Previous)
- Complete redesign with 27 upgrades, 52 events, 33 achievements
- Mobile optimization
- Discord SDK integration

### v2.0 (Previous)
- Initial Discord Activity implementation

---

## License & Credits

**Created by:** Alex Voigt
**AI Assistant:** Claude Code (Anthropic)
**License:** MIT (presumably)

---

**Last Updated:** 2025-10-16
**Documentation Version:** 1.0
**Maintained By:** Project owner
