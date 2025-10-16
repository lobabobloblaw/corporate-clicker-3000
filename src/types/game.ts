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

  // Stats tracking
  totalClicks: number
  lifetimeClicks: number
  startTime: number
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
