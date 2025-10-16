/**
 * Ascension/Reality Tier Definitions
 * Corporate Clicker 3000™ v4.0 REALITY.EXE
 *
 * 5 reality tiers that break the game progressively
 */

import type { AscensionTier, Synergy, Glitch, GameState } from '../types/game'

// ============================================
// ASCENSION TIERS
// ============================================

export const ASCENSION_TIERS: AscensionTier[] = [
  {
    id: 0,
    name: 'Corporatism',
    description: 'The boring reality. Everything makes sense.',
    cost: 0,
    buzzwordReward: 0,
    unlocks: [],
    visualEffect: 'normal',
    glitchChance: 0
  },
  {
    id: 1,
    name: 'Late-Stage Capitalism',
    description: 'Money grows on trees. Logic is optional.',
    cost: 100000000,  // $100M
    buzzwordReward: 100,
    unlocks: ['synergy_system', 'glitch_farming'],
    visualEffect: 'reality-1',
    glitchChance: 0.1
  },
  {
    id: 2,
    name: 'Post-Scarcity',
    description: 'Infinite growth! Numbers lose meaning!',
    cost: 1000000000,  // $1B
    buzzwordReward: 500,
    unlocks: ['time_manipulation', 'parallel_universes'],
    visualEffect: 'reality-2',
    glitchChance: 0.25
  },
  {
    id: 3,
    name: 'Cosmic CEO',
    description: 'You are the market. The market is you.',
    cost: 10000000000,  // $10B
    buzzwordReward: 2000,
    unlocks: ['reality_warping', 'secret_upgrades'],
    visualEffect: 'reality-3',
    glitchChance: 0.5
  },
  {
    id: 4,
    name: '§Y▓T▓X ER█OR',
    description: 'R̸̡̛̘̗̫E̸͓͋A̶̧̯̓L̶̰̈́I̸̱̽T̴̰̀Y̶̱͝.̵̗̄E̸̘͝X̸̰̚E̴͚̊ ̷̣̈́H̶̗̃A̸̰͋S̶̱̈ ̶̢̔S̴̰̈T̸̗̓O̴̢̎P̸̰̚P̴̢̛E̵̗͝D̸̰̈́',
    cost: 100000000000,  // $100B
    buzzwordReward: 10000,
    unlocks: ['the_void', 'existence_undefined'],
    visualEffect: 'reality-4',
    glitchChance: 1.0
  }
]

// ============================================
// SYNERGY COMBINATIONS
// ============================================

export const SYNERGIES: Synergy[] = [
  {
    id: 'corporate_dystopia',
    name: 'Corporate Dystopia',
    description: 'HR + Union Busting = Employee tears power the printer',
    icon: '😭',
    requires: ['hire_hr', 'union_busting'],
    effect: {
      autoMoneyMultiplier: 2.5,
      glitchMeterBonus: 10
    }
  },
  {
    id: 'infinite_synergy',
    name: 'Infinite Synergy Loop',
    description: 'Synergy breeds synergy breeds synergy breeds synergy...',
    icon: '♾️',
    requires: ['synergy_team', 'consultant'],
    effect: {
      moneyMultiplier: 3,
      chaos: true
    }
  },
  {
    id: 'blockchain_ai',
    name: 'AI Blockchain Nonsense',
    description: 'Nobody knows what this does. Perfect!',
    icon: '🤖⛓️',
    requires: ['blockchain', 'useless_ai'],
    effect: {
      clickPowerMultiplier: 5,
      temporalFluxGain: 50,
      chaos: true
    }
  },
  {
    id: 'ipo_bailout',
    name: 'Too Big To Care',
    description: 'IPO + Bailout Status = Infinite money glitch (legal)',
    icon: '💸🏛️',
    requires: ['ipo', 'too_big_fail'],
    effect: {
      moneyMultiplier: 10,
      autoMoneyMultiplier: 10
    }
  },
  {
    id: 'tax_haven_paradise',
    name: 'Tax Haven Paradise',
    description: 'Offshore accounts + Creative accounting = No laws apply',
    icon: '🏝️',
    requires: ['offshore', 'accounting'],
    effect: {
      moneyMultiplier: 4,
      glitchMeterBonus: 25
    }
  },
  {
    id: 'metaverse_madness',
    name: 'Metaverse Madness',
    description: 'VR Office + Blockchain = Money that doesn\'t exist',
    icon: '🥽',
    requires: ['vr_office', 'blockchain'],
    effect: {
      autoMoneyMultiplier: 6,
      temporalFluxGain: 100,
      chaos: true
    }
  },
  {
    id: 'caffeine_overdrive',
    name: 'Caffeine Overdrive',
    description: 'Coffee Machine + Energy Drinks = Employees vibrate through walls',
    icon: '☕⚡',
    requires: ['coffee_machine', 'energy_drinks'],
    effect: {
      clickPowerMultiplier: 3,
      glitchMeterBonus: 50
    }
  },
  {
    id: 'market_manipulation',
    name: 'Market Manipulation',
    description: 'Stock Manipulation + Insider Trading = SEC can\'t catch you',
    icon: '📈💰',
    requires: ['stock_manipulation', 'insider_trading'],
    effect: {
      moneyMultiplier: 8,
      temporalFluxGain: 150
    }
  },
  {
    id: 'meeting_singularity',
    name: 'Meeting Singularity',
    description: 'So many meetings they collapse into a black hole',
    icon: '🕳️',
    requires: ['meeting_room', 'consultant', 'hire_manager'],
    effect: {
      chaos: true,
      glitchMeterBonus: 100
    }
  },
  {
    id: 'quantum_capitalism',
    name: 'Quantum Capitalism',
    description: 'Money exists and doesn\'t exist until observed',
    icon: '⚛️',
    requires: ['blockchain', 'useless_ai', 'too_big_fail'],
    effect: {
      moneyMultiplier: 20,
      clickPowerMultiplier: 10,
      temporalFluxGain: 500,
      chaos: true
    }
  }
]

// ============================================
// GLITCHES
// ============================================

export const GLITCHES: Glitch[] = [
  {
    id: 'money_overflow',
    name: 'INTEGER OVERFLOW',
    description: 'You clicked so fast money went negative then positive again',
    icon: '💰',
    duration: 10,
    triggerChance: 0.3,
    visualEffect: 'glitch-shake',
    gameEffect: (state) => ({
      money: state.money * 2,
      glitchMeter: 0
    })
  },
  {
    id: 'duplicate_employees',
    name: 'EMPLOYEE DUPLICATION',
    description: 'Employees started mitosis. There are now twice as many.',
    icon: '👥',
    duration: 15,
    triggerChance: 0.2,
    visualEffect: 'glitch-double',
    gameEffect: (state) => ({
      employees: state.employees * 2,
      autoMoney: state.autoMoney * 1.5,
      glitchMeter: 0
    })
  },
  {
    id: 'time_skip',
    name: 'TIME SKIP',
    description: 'You blinked and 10 seconds passed',
    icon: '⏭️',
    duration: 5,
    triggerChance: 0.25,
    visualEffect: 'glitch-timeskip',
    gameEffect: (state) => ({
      money: state.money + (state.autoMoney * 10),
      temporalFlux: state.temporalFlux + 100,
      glitchMeter: 0
    })
  },
  {
    id: 'reality_crack',
    name: 'REALITY CRACK',
    description: 'The fabric of corporate reality is tearing',
    icon: '⚡',
    duration: 20,
    triggerChance: 0.15,
    visualEffect: 'glitch-crack',
    gameEffect: (state) => ({
      clickPower: state.clickPower * 5,
      realityStability: Math.max(0, state.realityStability - 20),
      glitchMeter: 0
    })
  },
  {
    id: 'negative_liability',
    name: 'NEGATIVE LIABILITY',
    description: 'Your legal problems are now legal solutions',
    icon: '⚖️',
    duration: 30,
    triggerChance: 0.1,
    visualEffect: 'glitch-invert',
    gameEffect: (state) => ({
      legalLiability: -Math.abs(state.legalLiability),
      money: state.money + (Math.abs(state.legalLiability) * 1000),
      glitchMeter: 0
    })
  },
  {
    id: 'clone_upgrades',
    name: 'UPGRADE CLONING',
    description: 'All your upgrades just... doubled',
    icon: '🛍️',
    duration: 60,
    triggerChance: 0.05,
    visualEffect: 'glitch-clone',
    gameEffect: (state) => ({
      clickPower: state.clickPower * 2,
      autoMoney: state.autoMoney * 2,
      glitchMeter: 0
    })
  },
  {
    id: 'buzzword_explosion',
    name: 'BUZZWORD EXPLOSION',
    description: 'Synergy! Pivot! Disrupt! AHHHHHHHHH',
    icon: '💥',
    duration: 15,
    triggerChance: 0.2,
    visualEffect: 'glitch-explode',
    gameEffect: (state) => ({
      buzzwordLevel: state.buzzwordLevel + 10,
      money: state.money * 1.5,
      glitchMeter: 0
    })
  },
  {
    id: 'stack_overflow',
    name: 'STACK OVERFLOW',
    description: 'Too much recursion. Money growing exponentially.',
    icon: '📚',
    duration: 20,
    triggerChance: 0.15,
    visualEffect: 'glitch-stack',
    gameEffect: (state) => ({
      autoMoney: state.autoMoney * 3,
      glitchMeter: 0
    })
  },
  {
    id: 'existence_error',
    name: '§Y§T£M ERR*R',
    description: 'R̸E̸A̸L̸I̸T̸Y̸.̸E̸X̸E̸ has encountered a problem',
    icon: '❌',
    duration: 5,
    triggerChance: 0.05,
    visualEffect: 'glitch-reality',
    gameEffect: (state) => ({
      money: state.money * 10,
      realityStability: 0,
      glitchMeter: 0
    })
  }
]

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get the current ascension tier data
 */
export function getCurrentTier(tierId: number): AscensionTier {
  const tier = ASCENSION_TIERS[tierId]
  if (tier !== undefined) return tier
  return ASCENSION_TIERS[0] as AscensionTier
}

/**
 * Get the next ascension tier (if available)
 */
export function getNextTier(currentTierId: number): AscensionTier | null {
  if (currentTierId >= ASCENSION_TIERS.length - 1) return null
  const nextTier = ASCENSION_TIERS[currentTierId + 1]
  return nextTier !== undefined ? nextTier : null
}

/**
 * Check if player can ascend
 */
export function canAscend(state: GameState): boolean {
  const nextTier = getNextTier(state.ascensionTier)
  if (!nextTier) return false
  return state.money >= nextTier.cost
}

/**
 * Check active synergies
 */
export function getActiveSynergies(purchasedUpgrades: string[]): Synergy[] {
  return SYNERGIES.filter(synergy =>
    synergy.requires.every(req => purchasedUpgrades.includes(req))
  )
}

/**
 * Calculate total multipliers from synergies
 */
export function getSynergyMultipliers(purchasedUpgrades: string[]): {
  moneyMultiplier: number
  clickPowerMultiplier: number
  autoMoneyMultiplier: number
  temporalFluxGain: number
  glitchMeterBonus: number
  hasChaos: boolean
} {
  const activeSynergies = getActiveSynergies(purchasedUpgrades)

  const initialValue = {
    moneyMultiplier: 1,
    clickPowerMultiplier: 1,
    autoMoneyMultiplier: 1,
    temporalFluxGain: 0,
    glitchMeterBonus: 0,
    hasChaos: false
  }

  return activeSynergies.reduce((acc, synergy) => ({
    moneyMultiplier: acc.moneyMultiplier * (synergy.effect.moneyMultiplier || 1),
    clickPowerMultiplier: acc.clickPowerMultiplier * (synergy.effect.clickPowerMultiplier || 1),
    autoMoneyMultiplier: acc.autoMoneyMultiplier * (synergy.effect.autoMoneyMultiplier || 1),
    temporalFluxGain: acc.temporalFluxGain + (synergy.effect.temporalFluxGain || 0),
    glitchMeterBonus: acc.glitchMeterBonus + (synergy.effect.glitchMeterBonus || 0),
    hasChaos: acc.hasChaos || (synergy.effect.chaos === true)
  }), initialValue)
}

/**
 * Get a random glitch based on probabilities
 */
export function getRandomGlitch(): Glitch | null {
  const totalChance = GLITCHES.reduce((sum, glitch) => sum + glitch.triggerChance, 0)
  let random = Math.random() * totalChance

  for (const glitch of GLITCHES) {
    random -= glitch.triggerChance
    if (random <= 0) return glitch
  }

  return GLITCHES[0] || null
}

/**
 * Should trigger a glitch based on reality tier and glitch meter
 */
export function shouldTriggerGlitch(state: GameState): boolean {
  if (state.glitchMeter < 100) return false

  const tierData = getCurrentTier(state.ascensionTier)
  return Math.random() < tierData.glitchChance
}
