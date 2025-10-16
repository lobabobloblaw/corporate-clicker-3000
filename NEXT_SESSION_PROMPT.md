# Next Session Prompt for Corporate Clicker 3000™

Copy and paste this prompt to continue development:

---

## Session Continuation: Corporate Clicker 3000™ Phase 5.0

**Current Version:** v4.0 REALITY.EXE (deployed and live)
**Project:** Discord Activity - Corporate satire clicker game
**Location:** `/Users/alexvoigt/Documents/GPT-5/discord_webapi`

### Context
v4.0 was just deployed with reality-breaking mechanics including:
- 5 ascension tiers with visual chaos effects
- 10 synergy combinations for massive multipliers
- 9 glitches triggered by rapid clicking
- Meta mechanics (temporal flux, glitch meter, click combos, reality stability)

All core systems are implemented and working. See `V4_IMPLEMENTATION_DOCS.md` and `SESSION_WRAPUP.md` for complete details.

### Current State
✅ **Deployed:** https://corporate-clicker-3000.pages.dev
✅ **Build:** Successful, no errors
✅ **Features:** 27 upgrades, 52 events, 33 achievements, 10 synergies, 9 glitches

⏳ **Needs Testing:** Username display, mobile layout, all v4.0 features in Discord client

### Immediate Priorities

Choose one path:

**Path A: Test & Fix Issues** (Recommended First)
1. Test v4.0 in Discord Activity client
2. Fix username display bug (still showing "Player")
3. Verify mobile scrolling works on iPhone 15 Pro Max
4. Adjust UI if meta panels cause overflow
5. Balance gameplay if needed

**Path B: Implement Temporal Flux System**
1. Create time manipulation abilities:
   - Rewind 10 seconds (100 TF)
   - Fast-forward 30 seconds (300 TF)
   - Freeze time 10 seconds (500 TF)
2. Add temporal flux shop UI
3. Implement ability mechanics
4. Add cooldown system

**Path C: Buzzword Point Shop**
1. Create permanent upgrade tree (15-20 upgrades)
2. Categories: Starting Resources, Multipliers, Meta Unlocks
3. Add shop UI panel
4. Implement purchase and persistence logic

**Path D: Polish & Juice**
1. Add particle effects (money flying, employee spawns)
2. Implement glitch duration tracking and display
3. Create active glitches status bar
4. Add chaos event system for synergies
5. Improve visual feedback across the board

**Path E: New Content**
1. Add 20 more achievements
2. Create secret upgrade trees (3 branches)
3. Implement news ticker component
4. Add parallel universe system

### Technical Notes

**Known Placeholder Features:**
- `temporalFlux` - accumulates but not consumed
- `activeGlitches[]` - populated but not displayed
- `buzzwordPoints` - earned but no shop
- Synergy `chaos: true` - flagged but no handler
- Tier `unlocks: []` - defined but not validated
- Glitch `duration` - specified but not tracked

**Key Files to Modify:**
- `src/components/CorpClicker.tsx` - Main game logic
- `src/data/ascension.ts` - Tiers, synergies, glitches
- `src/data/upgrades.ts` - If adding new upgrades
- `src/types/game.ts` - If extending GameState

**Quick Test Commands:**
```bash
npm run build    # Build and check for errors
git status       # Check what changed
git add -A       # Stage all changes
git commit -m "..." # Commit with message
git push         # Deploy to Cloudflare Pages
```

### What I Need to Know

Please specify:
1. **Which path** do you want to pursue? (A, B, C, D, or E)
2. **Priority focus:** Testing, new features, or polish?
3. **Any issues** encountered while testing v4.0?
4. **Specific requests** or changes needed?

If unsure, I recommend **Path A (Test & Fix)** first to ensure v4.0 works perfectly before adding more features.

### Documentation References
- **Complete documentation:** `V4_IMPLEMENTATION_DOCS.md`
- **Session summary:** `SESSION_WRAPUP.md`
- **This prompt:** `NEXT_SESSION_PROMPT.md`

All files are in `/Users/alexvoigt/Documents/GPT-5/discord_webapi/`

---

**Ready to continue development!** Just tell me which path or specify what you'd like to work on.
