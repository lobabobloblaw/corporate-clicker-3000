/**
 * Game Type Definitions
 * Corporate Clicker 3000™ v3.0
 */

export interface GameState {
  // Core resources
  money: number
  clickPower: number
  autoMoney: number

  // Advanced resources
  buzzwordPoints: number  // Prestige currency
  stockPrice: number      // Multiplier that fluctuates
  legalLiability: number  // Bad stat
  caffeine: number        // Temporary boost
  meetingTime: number     // Bad stat, slows production

  // Basic stats
  synergy: number
  electrolytes: number
  employees: number
  buzzwordLevel: number

  // Upgrade tracking
  purchasedUpgrades: string[]
  upgradeCount: Record<string, number>  // For repeatable upgrades

  // Achievements
  unlockedAchievements: string[]

  // Status effects
  activeEffects: StatusEffect[]

  // Prestige
  lifetimeEarnings: number
  bankruptcyCount: number

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

  // Stats tracking
  totalClicks: number
  lifetimeClicks: number
  startTime: number
  lastClickTime: number        // For detecting rapid clicking
  clickCombo: number           // Current click streak
}

export interface StatusEffect {
  id: string
  name: string
  icon: string
  description: string
  duration: number  // seconds remaining
  effects: {
    clickPowerMultiplier?: number
    autoMoneyMultiplier?: number
    synergyDrain?: number
    electrolytesDrain?: number
    clickAccuracy?: number  // For jittery effects
  }
}

export interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: number
  costMultiplier?: number  // For repeatable upgrades (default 1.15)
  maxPurchases?: number    // undefined = infinite
  tier: 1 | 2 | 3 | 4 | 5
  icon: string
  requirementText?: string

  // Requirements
  requires?: {
    money?: number
    employees?: number
    buzzwordLevel?: number
    bankruptcyCount?: number
    achievements?: string[]
  }

  // Effects
  effect: {
    clickPower?: number
    autoMoney?: number
    synergy?: number
    employees?: number
    buzzwordLevel?: number
    stockPriceMultiplier?: number
    legalLiability?: number
    meetingTime?: number

    // Special effects
    instantMoney?: number
    unlockFeature?: string
    statusEffect?: string
  }
}

export interface RandomEvent {
  id: string
  text: string
  icon: string
  weight: number  // Probability weight (1-10, 10 = most common)

  // Requirements to trigger
  requires?: {
    minMoney?: number
    minEmployees?: number
    minBuzzwordLevel?: number
  }

  // Effects
  effect: (state: GameState) => Partial<GameState>

  // Optional sound effect
  sound?: 'good' | 'bad' | 'neutral' | 'chaotic'
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  hidden?: boolean  // Don't show until unlocked

  // Check if unlocked
  check: (state: GameState) => boolean

  // Reward
  reward?: {
    buzzwordPoints?: number
    instantMoney?: number
    permanentMultiplier?: number
  }
}

export interface NewsItem {
  text: string
  icon?: string
}

export interface AscensionTier {
  id: number
  name: string
  description: string
  cost: number  // Money required to ascend
  buzzwordReward: number  // Buzzword points gained
  unlocks: string[]  // Feature IDs unlocked
  visualEffect: string  // CSS class or effect identifier
  glitchChance: number  // 0-1, chance for reality glitches
}

export interface Synergy {
  id: string
  name: string
  description: string
  icon: string
  requires: string[]  // Upgrade IDs that must be owned
  effect: {
    moneyMultiplier?: number
    clickPowerMultiplier?: number
    autoMoneyMultiplier?: number
    glitchMeterBonus?: number
    temporalFluxGain?: number
    chaos?: boolean  // Triggers random chaos events
  }
}

export interface Glitch {
  id: string
  name: string
  description: string
  icon: string
  duration: number  // seconds, -1 for permanent
  triggerChance: number  // 0-1, probability when glitch meter full
  visualEffect: string  // CSS class or animation
  gameEffect: (state: GameState) => Partial<GameState>
}
