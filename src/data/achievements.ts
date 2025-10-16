/**
 * Achievement Definitions
 * Corporate Clicker 3000™ v3.0
 *
 * 30+ satirical achievements
 */

import type { Achievement, GameState } from '../types/game'

export const ACHIEVEMENTS: Achievement[] = [
  // ============================================
  // BASIC ACHIEVEMENTS
  // ============================================
  {
    id: 'first_click',
    name: 'First Click',
    description: 'You clicked the button! You\'re doing great!',
    icon: '👆',
    check: (state) => state.totalClicks > 0
  },
  {
    id: 'kinda_rich',
    name: 'Kinda Rich',
    description: 'Accumulated $10,000',
    icon: '💵',
    check: (state) => state.lifetimeEarnings >= 10000
  },
  {
    id: 'actually_rich',
    name: 'Actually Rich',
    description: 'Accumulated $100,000',
    icon: '💰',
    check: (state) => state.lifetimeEarnings >= 100000
  },
  {
    id: 'absurdly_rich',
    name: 'Absurdly Rich',
    description: 'Accumulated $1,000,000',
    icon: '🤑',
    check: (state) => state.lifetimeEarnings >= 1000000
  },
  {
    id: 'bezos_level',
    name: 'Bezos Level',
    description: 'Accumulated $10,000,000',
    icon: '🚀',
    check: (state) => state.lifetimeEarnings >= 10000000
  },

  // ============================================
  // CLICKING ACHIEVEMENTS
  // ============================================
  {
    id: 'clicker',
    name: 'Clicker',
    description: 'Clicked 100 times',
    icon: '👆',
    check: (state) => state.lifetimeClicks >= 100
  },
  {
    id: 'dedicated_clicker',
    name: 'Dedicated Clicker',
    description: 'Clicked 1,000 times',
    icon: '🖱️',
    check: (state) => state.lifetimeClicks >= 1000
  },
  {
    id: 'literally_insane',
    name: 'Literally Insane',
    description: 'Clicked 10,000 times. Seek help.',
    icon: '🤪',
    check: (state) => state.lifetimeClicks >= 10000
  },

  // ============================================
  // EMPLOYEE ACHIEVEMENTS
  // ============================================
  {
    id: 'first_hire',
    name: 'First Hire',
    description: 'Hired your first employee (sucker)',
    icon: '🧑‍💼',
    check: (state) => state.employees >= 1
  },
  {
    id: 'small_team',
    name: 'Small Team',
    description: '10 employees exploited',
    icon: '👥',
    check: (state) => state.employees >= 10
  },
  {
    id: 'corporation',
    name: 'Corporation',
    description: '50 employees under your thumb',
    icon: '🏢',
    check: (state) => state.employees >= 50
  },
  {
    id: 'megacorp',
    name: 'Megacorp',
    description: '100 employees. Congrats on the power trip!',
    icon: '🏙️',
    check: (state) => state.employees >= 100
  },

  // ============================================
  // UPGRADE ACHIEVEMENTS
  // ============================================
  {
    id: 'spender',
    name: 'Spender',
    description: 'Purchased 5 upgrades',
    icon: '🛒',
    check: (state) => state.purchasedUpgrades.length >= 5
  },
  {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Purchased 15 upgrades',
    icon: '💳',
    check: (state) => state.purchasedUpgrades.length >= 15
  },
  {
    id: 'bought_everything',
    name: 'Bought Everything',
    description: 'Purchased all available upgrades',
    icon: '🛍️',
    check: (state) => state.purchasedUpgrades.length >= 25
  },

  // ============================================
  // BUZZWORD ACHIEVEMENTS
  // ============================================
  {
    id: 'corporate_speak',
    name: 'Corporate Speak',
    description: 'Reached Buzzword Level 10',
    icon: '💬',
    check: (state) => state.buzzwordLevel >= 10
  },
  {
    id: 'jargon_master',
    name: 'Jargon Master',
    description: 'Reached Buzzword Level 25',
    icon: '🎯',
    check: (state) => state.buzzwordLevel >= 25
  },
  {
    id: 'peak_nonsense',
    name: 'Peak Nonsense',
    description: 'Reached Buzzword Level 50',
    icon: '🤡',
    check: (state) => state.buzzwordLevel >= 50
  },

  // ============================================
  // SPECIAL ACHIEVEMENTS
  // ============================================
  {
    id: 'blockchain_master',
    name: 'Blockchain Master',
    description: 'Bought BLOCKCHAIN without knowing what it does',
    icon: '⛓️',
    check: (state) => state.purchasedUpgrades.includes('blockchain')
  },
  {
    id: 'went_public',
    name: 'Went Public',
    description: 'Successfully IPO\'d! Welcome to hell.',
    icon: '📈',
    check: (state) => state.purchasedUpgrades.includes('ipo')
  },
  {
    id: 'too_big_fail',
    name: 'Too Big To Fail',
    description: 'Achieved bailout immunity status',
    icon: '🏛️',
    check: (state) => state.purchasedUpgrades.includes('too_big_fail')
  },

  // ============================================
  // DARK HUMOR ACHIEVEMENTS
  // ============================================
  {
    id: 'wage_theft_pro',
    name: 'Wage Theft Pro',
    description: 'Hired 10+ unpaid interns',
    icon: '💸',
    check: (state) => {
      const internCount = state.upgradeCount['hire_intern'] || 0
      return internCount >= 10
    }
  },
  {
    id: 'union_buster',
    name: 'Union Buster',
    description: 'Bought the Unionbusting Division',
    icon: '⚔️',
    hidden: true,
    check: (state) => state.purchasedUpgrades.includes('union_busting')
  },
  {
    id: 'tax_avoider',
    name: 'Tax Avoider',
    description: 'Made money while losing money (how?)',
    icon: '💰',
    check: (state) => state.money > 100000 && state.legalLiability > 500
  },
  {
    id: 'sec_called',
    name: 'SEC Called',
    description: 'Accumulated max legal liability',
    icon: '⚖️',
    check: (state) => state.legalLiability >= 1000
  },

  // ============================================
  // SPEED ACHIEVEMENTS
  // ============================================
  {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: '$10,000 in first 2 minutes',
    icon: '⚡',
    check: (state) => {
      const elapsed = (Date.now() - state.startTime) / 1000
      return state.lifetimeEarnings >= 10000 && elapsed < 120
    }
  },
  {
    id: 'day_trader',
    name: 'Day Trader',
    description: '$100,000 in first 10 minutes',
    icon: '📊',
    check: (state) => {
      const elapsed = (Date.now() - state.startTime) / 1000
      return state.lifetimeEarnings >= 100000 && elapsed < 600
    }
  },

  // ============================================
  // PRESTIGE ACHIEVEMENTS
  // ============================================
  {
    id: 'bankruptcy_filing',
    name: 'Chapter 11',
    description: 'Filed bankruptcy for the first time',
    icon: '📄',
    check: (state) => state.bankruptcyCount >= 1
  },
  {
    id: 'serial_bankrupter',
    name: 'Serial Bankrupter',
    description: 'Filed bankruptcy 5 times. It\'s a lifestyle.',
    icon: '🔄',
    check: (state) => state.bankruptcyCount >= 5
  },
  {
    id: 'eat_the_rich',
    name: 'Eat The Rich',
    description: 'Filed bankruptcy 10 times',
    icon: '🍽️',
    check: (state) => state.bankruptcyCount >= 10
  },

  // ============================================
  // SILLY ACHIEVEMENTS
  // ============================================
  {
    id: 'quiet_quitting',
    name: 'Quiet Quitting',
    description: 'Didn\'t click for 5 minutes straight',
    icon: '🤫',
    hidden: true,
    check: () => {
      // This would need special tracking, placeholder for now
      return false
    }
  },
  {
    id: 'workaholic',
    name: 'Workaholic',
    description: 'Played for 30 minutes straight',
    icon: '💼',
    check: (state) => {
      const elapsed = (Date.now() - state.startTime) / 1000
      return elapsed >= 1800
    }
  },
  {
    id: 'no_life',
    name: 'No Life',
    description: 'Played for 1 hour straight. Touch grass.',
    icon: '🌱',
    check: (state) => {
      const elapsed = (Date.now() - state.startTime) / 1000
      return elapsed >= 3600
    }
  }
]

// Helper function to check and unlock achievements
export function checkAchievements(
  state: GameState,
  currentUnlocked: string[]
): { newAchievements: Achievement[], updatedUnlocked: string[] } {
  const newlyUnlocked: Achievement[] = []
  const updatedList = [...currentUnlocked]

  for (const achievement of ACHIEVEMENTS) {
    if (!currentUnlocked.includes(achievement.id) && achievement.check(state)) {
      newlyUnlocked.push(achievement)
      updatedList.push(achievement.id)
    }
  }

  return {
    newAchievements: newlyUnlocked,
    updatedUnlocked: updatedList
  }
}
