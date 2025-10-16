/**
 * Buzzword Point Shop
 * Corporate Clicker 3000™ v4.0
 *
 * Permanent upgrades purchased with Buzzword Points (prestige currency)
 */

export interface BuzzwordUpgrade {
  id: string
  name: string
  description: string
  cost: number
  icon: string
  category: 'starting' | 'multiplier' | 'meta'

  // Permanent effects (persist across ascensions)
  effect: {
    startingMoney?: number
    startingClickPower?: number
    startingAutoMoney?: number
    globalMoneyMultiplier?: number
    globalClickMultiplier?: number
    globalAutoMultiplier?: number
    electrolyteDrainReduction?: number  // 0-1, reduces drain rate
    glitchMeterFillRate?: number        // multiplier
    temporalFluxGainMultiplier?: number
    unlockFeature?: string
  }
}

export const BUZZWORD_UPGRADES: BuzzwordUpgrade[] = [
  // ============================================
  // STARTING RESOURCES (50-200 BP)
  // ============================================
  {
    id: 'bp_starting_capital',
    name: 'Starting Capital',
    description: 'Begin each ascension with $1,000',
    cost: 50,
    icon: '💵',
    category: 'starting',
    effect: {
      startingMoney: 1000
    }
  },
  {
    id: 'bp_starting_capital_2',
    name: 'Venture Capital',
    description: 'Begin each ascension with $10,000',
    cost: 150,
    icon: '💰',
    category: 'starting',
    effect: {
      startingMoney: 10000
    }
  },
  {
    id: 'bp_starting_clicks',
    name: 'Strong Opener',
    description: 'Start with +10 click power',
    cost: 100,
    icon: '👆',
    category: 'starting',
    effect: {
      startingClickPower: 10
    }
  },
  {
    id: 'bp_starting_auto',
    name: 'Passive Income',
    description: 'Start with $50/sec auto money',
    cost: 200,
    icon: '💸',
    category: 'starting',
    effect: {
      startingAutoMoney: 50
    }
  },

  // ============================================
  // GLOBAL MULTIPLIERS (100-500 BP)
  // ============================================
  {
    id: 'bp_money_mult_1',
    name: 'Corporate Greed I',
    description: 'All money gains +10%',
    cost: 100,
    icon: '📈',
    category: 'multiplier',
    effect: {
      globalMoneyMultiplier: 1.1
    }
  },
  {
    id: 'bp_money_mult_2',
    name: 'Corporate Greed II',
    description: 'All money gains +25%',
    cost: 300,
    icon: '📈',
    category: 'multiplier',
    effect: {
      globalMoneyMultiplier: 1.25
    }
  },
  {
    id: 'bp_money_mult_3',
    name: 'Corporate Greed III',
    description: 'All money gains +50%',
    cost: 500,
    icon: '📈',
    category: 'multiplier',
    effect: {
      globalMoneyMultiplier: 1.5
    }
  },
  {
    id: 'bp_click_mult',
    name: 'Finger Strength Training',
    description: 'Click power +50%',
    cost: 250,
    icon: '💪',
    category: 'multiplier',
    effect: {
      globalClickMultiplier: 1.5
    }
  },
  {
    id: 'bp_auto_mult',
    name: 'Automation Expert',
    description: 'Auto money +50%',
    cost: 250,
    icon: '🤖',
    category: 'multiplier',
    effect: {
      globalAutoMultiplier: 1.5
    }
  },

  // ============================================
  // META MECHANICS (150-400 BP)
  // ============================================
  {
    id: 'bp_electrolyte_slow',
    name: 'Hydration Station',
    description: 'Electrolytes drain 50% slower',
    cost: 150,
    icon: '💧',
    category: 'meta',
    effect: {
      electrolyteDrainReduction: 0.5
    }
  },
  {
    id: 'bp_glitch_boost',
    name: 'Reality Hacker',
    description: 'Glitch meter fills 2x faster',
    cost: 300,
    icon: '⚡',
    category: 'meta',
    effect: {
      glitchMeterFillRate: 2.0
    }
  },
  {
    id: 'bp_temporal_boost',
    name: 'Time Lord',
    description: 'Temporal Flux gains +100%',
    cost: 400,
    icon: '🌀',
    category: 'meta',
    effect: {
      temporalFluxGainMultiplier: 2.0
    }
  }
]

// Helper: Get purchased BP upgrades from state
export function getPurchasedBPUpgrades(purchasedIds: string[]): BuzzwordUpgrade[] {
  return BUZZWORD_UPGRADES.filter(upgrade => purchasedIds.includes(upgrade.id))
}

// Helper: Calculate all active BP multipliers
export function getBPMultipliers(purchasedIds: string[]): {
  startingMoney: number
  startingClickPower: number
  startingAutoMoney: number
  globalMoneyMultiplier: number
  globalClickMultiplier: number
  globalAutoMultiplier: number
  electrolyteDrainMultiplier: number
  glitchMeterFillRate: number
  temporalFluxGainMultiplier: number
} {
  const purchased = getPurchasedBPUpgrades(purchasedIds)

  return purchased.reduce((acc, upgrade) => ({
    startingMoney: acc.startingMoney + (upgrade.effect.startingMoney || 0),
    startingClickPower: acc.startingClickPower + (upgrade.effect.startingClickPower || 0),
    startingAutoMoney: acc.startingAutoMoney + (upgrade.effect.startingAutoMoney || 0),
    globalMoneyMultiplier: acc.globalMoneyMultiplier * (upgrade.effect.globalMoneyMultiplier || 1),
    globalClickMultiplier: acc.globalClickMultiplier * (upgrade.effect.globalClickMultiplier || 1),
    globalAutoMultiplier: acc.globalAutoMultiplier * (upgrade.effect.globalAutoMultiplier || 1),
    electrolyteDrainMultiplier: acc.electrolyteDrainMultiplier * (1 - (upgrade.effect.electrolyteDrainReduction || 0)),
    glitchMeterFillRate: acc.glitchMeterFillRate * (upgrade.effect.glitchMeterFillRate || 1),
    temporalFluxGainMultiplier: acc.temporalFluxGainMultiplier * (upgrade.effect.temporalFluxGainMultiplier || 1)
  }), {
    startingMoney: 0,
    startingClickPower: 0,
    startingAutoMoney: 0,
    globalMoneyMultiplier: 1,
    globalClickMultiplier: 1,
    globalAutoMultiplier: 1,
    electrolyteDrainMultiplier: 1,
    glitchMeterFillRate: 1,
    temporalFluxGainMultiplier: 1
  })
}
