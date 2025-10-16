# Corporate Clicker 3000™ - Quick Reference Guide

**Version:** v4.0 REALITY.EXE
**Last Updated:** 2025-10-16

---

## 🚀 Common Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build

# Git
git status           # Check file changes
git add -A           # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Deploy to Cloudflare Pages
git log --oneline    # View commit history

# Deployment
# Auto-deploys on git push to main branch
# Live at: https://corporate-clicker-3000.pages.dev
```

---

## 📁 Project Structure

```
discord_webapi/
├── src/
│   ├── components/
│   │   └── CorpClicker.tsx        # 🎮 Main game component (720 lines)
│   ├── data/
│   │   ├── achievements.ts        # 🏆 33 achievements
│   │   ├── ascension.ts          # ⚡ NEW: Tiers, synergies, glitches (409 lines)
│   │   ├── events.ts             # 🎲 52 random events
│   │   └── upgrades.ts           # 🛒 27 upgrades
│   ├── types/
│   │   └── game.ts               # 📝 TypeScript interfaces
│   ├── hooks/
│   │   └── useDiscordSdk.tsx     # 🔐 Discord auth
│   └── app/
│       └── index.css             # 🎨 Styles + animations
├── dist/                         # 📦 Build output (auto-generated)
├── V4_IMPLEMENTATION_DOCS.md     # 📚 Full documentation
├── SESSION_WRAPUP.md             # ✅ Session summary
├── NEXT_SESSION_PROMPT.md        # 🔄 Continuation prompt
└── QUICK_REFERENCE.md            # 📖 This file
```

---

## 🎮 Game Systems at a Glance

### Resources (13 total)
| Resource | Description | Initial Value |
|----------|-------------|---------------|
| 💰 Money | Main currency | 0 |
| 👆 Click Power | Money per click | 1 |
| 💸 Auto Money | Passive income/sec | 0 |
| 🔥 Synergy | Team cohesion | 0 |
| ⚡ Electrolytes | Energy level | 100 |
| 👔 Employees | Worker count | 0 |
| 💬 Buzzword Level | Corporate nonsense | 1 |
| 📊 Stock Price | Multiplier (unused) | 1.0 |
| ⚖️ Legal Liability | Bad stat | 0 |
| ☕ Caffeine | Boost (unused) | 0 |
| 📅 Meeting Time | Slow stat (unused) | 0 |
| 🎯 Buzzword Points | Prestige currency | 0 |
| 🌀 Temporal Flux | ⭐ NEW: Time resource | 0 |

### Meta Mechanics (v4.0)
| Mechanic | Range | Purpose |
|----------|-------|---------|
| ⚡ Glitch Meter | 0-100% | Trigger reality glitches |
| 💥 Click Combo | 0-∞ | Track rapid clicking |
| 🎯 Reality Stability | 0-100% | Affect glitch frequency |
| 🏔️ Ascension Tier | 0-4 | Reality breakdown level |
| 🔄 Total Ascensions | 0-∞ | Times ascended |

---

## 🎯 Ascension Tiers

| Tier | Name | Cost | BP Reward | Glitch % | Visual Effect |
|------|------|------|-----------|----------|---------------|
| 0 | Corporatism | $0 | 0 | 0% | Normal |
| 1 | Late-Stage Capitalism | $100M | 100 | 10% | Pulse |
| 2 | Post-Scarcity | $1B | 500 | 25% | RGB shift |
| 3 | Cosmic CEO | $10B | 2,000 | 50% | Reality crack |
| 4 | §Y▓T▓X ER█OR | $100B | 10,000 | 100% | Chaos |

**Ascension Resets:**
- ❌ Money, clicks, employees, upgrades, stats → 0
- ✅ Buzzword points, achievements, lifetime stats, temporal flux

---

## 💥 Synergies (10 total)

| Name | Requirements | Best Multiplier |
|------|--------------|-----------------|
| Corporate Dystopia | HR + Union Busting | Auto ×2.5 |
| Infinite Synergy | Synergy Team + Consultant | Money ×3 |
| AI Blockchain | Blockchain + AI | Click ×5 |
| Too Big To Care | IPO + Bailout | Money ×10, Auto ×10 |
| Tax Haven | Offshore + Accounting | Money ×4 |
| Metaverse Madness | VR Office + Blockchain | Auto ×6 |
| Caffeine Overdrive | Coffee + Energy Drinks | Click ×3 |
| Market Manipulation | Stock + Insider Trading | Money ×8 |
| Meeting Singularity | Meeting + Consultant + Manager | Chaos |
| Quantum Capitalism | Blockchain + AI + Bailout | **Money ×20, Click ×10** |

**Most Powerful Combo:** Quantum + Too Big + Tax Haven = **×800 money multiplier**

---

## ⚡ Glitches (9 total)

| Glitch | Chance | Effect |
|--------|--------|--------|
| INTEGER OVERFLOW | 30% | ×2 money |
| EMPLOYEE DUPLICATION | 20% | ×2 employees, ×1.5 auto |
| TIME SKIP | 25% | +10sec income, +100 TF |
| REALITY CRACK | 15% | ×5 click power, -20 stability |
| NEGATIVE LIABILITY | 10% | Invert liability → money |
| UPGRADE CLONING | 5% | ×2 click & auto |
| BUZZWORD EXPLOSION | 20% | +10 levels, ×1.5 money |
| STACK OVERFLOW | 15% | ×3 auto money |
| §Y§T£M ERR*R | 5% | ×10 money, 0 stability |

**How to Trigger:**
1. Click rapidly (< 200ms between clicks)
2. Fill glitch meter to 100%
3. Chance based on ascension tier (0% → 100%)

---

## 🔧 Code Snippets

### Add Money (Testing)
```typescript
setGameState(prev => ({
  ...prev,
  money: prev.money + 100000000  // +100M
}))
```

### Jump to Tier 4
```typescript
setGameState(prev => ({
  ...prev,
  ascensionTier: 4,
  buzzwordPoints: 12600  // Total of all rewards
}))
```

### Unlock All Achievements
```typescript
setGameState(prev => ({
  ...prev,
  unlockedAchievements: ACHIEVEMENTS.map(a => a.id)
}))
```

### Trigger Glitch Manually
```typescript
const glitch = getRandomGlitch()
if (glitch) {
  showToastNotification(`⚡ GLITCH: ${glitch.name}`)
  setGameState(prev => ({ ...prev, ...glitch.gameEffect(prev) }))
}
```

### Fill Glitch Meter
```typescript
setGameState(prev => ({ ...prev, glitchMeter: 100 }))
```

---

## 📊 Game Balance Numbers

### Progression Curve
```
Starting: $1/click, $0/sec
Early game (10 min): $100/click, $50/sec
Mid game (30 min): $1000/click, $500/sec
Late game (1 hr): $10k/click, $5k/sec
Ascension ready: $100M total earned
```

### Upgrade Tiers
```
Tier 1: $50-$250 (Intern life)
Tier 2: $200-$1,500 (Middle management)
Tier 3: $2k-$10k (Corporate elite)
Tier 4: $10k-$500k (Unhinged capitalism)
Tier 5: $500k+ (Endgame absurdity)
```

### Event Frequency
```
Random events: 15% chance every 5 seconds = 1 every ~33 seconds
Achievements: Check every 2 seconds
Glitch trigger: Based on tier (0%-100% when meter full)
```

---

## 🐛 Known Issues

| Issue | Status | Location |
|-------|--------|----------|
| Username shows "Player" | 🔴 Needs testing | `useDiscordSdk.tsx:118` |
| Temporal flux not consumed | 🟡 Placeholder | Future feature |
| Glitch duration not tracked | 🟡 Placeholder | Future feature |
| No buzzword shop | 🟡 Planned | Phase 5.0 |
| Chaos events undefined | 🟡 Placeholder | Future feature |

🔴 = Bug, needs fix
🟡 = Intentional placeholder
🟢 = Fixed

---

## 📱 Testing Checklist

### Desktop
- [ ] Game loads without errors
- [ ] Clicks register and add money
- [ ] Upgrades purchase and apply effects
- [ ] Achievements unlock
- [ ] Events trigger randomly
- [ ] Synergies detect and display
- [ ] Glitch meter fills on fast clicking
- [ ] Glitches trigger at 100%
- [ ] Ascend button appears at $100M
- [ ] Ascension resets correctly
- [ ] Visual effects change with tier

### Mobile (iPhone 15 Pro Max)
- [ ] No scrolling
- [ ] All UI elements visible
- [ ] Touch targets accessible
- [ ] Meta panels display correctly
- [ ] Animations don't lag

### Discord Client
- [ ] Activity loads in Discord
- [ ] Username displays correctly
- [ ] No CORS errors
- [ ] All features work same as web

---

## 🎨 CSS Classes

### Reality Tier Effects
```css
.reality-0  /* Normal */
.reality-1  /* Pulse chaos */
.reality-2  /* RGB shift */
.reality-3  /* Reality crack */
.reality-4  /* Glitch shake + RGB */
```

### Animations
```css
.glitch-shake       /* Screen shake */
.glitch-active      /* Glitch flash */
.animate-slide-up   /* Notification slide */
```

### Utility
```css
.active\:scale-98   /* Button press */
.active\:scale-95   /* Button press (more) */
.scrollbar-thin     /* Custom scrollbar */
```

---

## 🔑 Important Constants

```typescript
// Click thresholds
FAST_CLICK = 200ms    // +2 glitch meter
COMBO_CLICK = 500ms   // +1 glitch meter, maintain combo

// Intervals
AUTO_MONEY = 1000ms
GLITCH_CHECK = 1000ms
EVENTS = 5000ms
ACHIEVEMENTS = 2000ms

// Ascension costs
TIER_1 = $100,000,000
TIER_2 = $1,000,000,000
TIER_3 = $10,000,000,000
TIER_4 = $100,000,000,000
```

---

## 📞 Quick Help

**Something not working?**
1. Check `npm run build` for TypeScript errors
2. Look in browser console for runtime errors
3. Check `V4_IMPLEMENTATION_DOCS.md` for detailed info
4. Check `SESSION_WRAPUP.md` for known issues

**Want to add a feature?**
1. Update TypeScript types in `src/types/game.ts`
2. Add data in `src/data/` files
3. Update logic in `src/components/CorpClicker.tsx`
4. Test with `npm run build`
5. Commit and push to deploy

**Need to revert?**
```bash
git log --oneline       # Find commit hash
git reset --hard <hash> # Revert to that commit
git push --force        # Update remote (careful!)
```

---

## 🎯 Next Session Quick Start

**Just starting a new session?**

1. Read `NEXT_SESSION_PROMPT.md`
2. Choose a development path (A, B, C, D, or E)
3. Run `npm run build` to verify current state
4. Start coding!

**Quick test in Discord:**
1. Open Discord desktop/mobile
2. Navigate to Activities
3. Click on Corporate Clicker 3000™
4. Test all v4.0 features

**Need full context?**
- See `V4_IMPLEMENTATION_DOCS.md` (comprehensive)
- See `SESSION_WRAPUP.md` (session summary)

---

**Live Game:** https://corporate-clicker-3000.pages.dev
**Version:** v4.0 REALITY.EXE
**Status:** ✅ Deployed and ready for testing

_Happy clicking!_ 💰
