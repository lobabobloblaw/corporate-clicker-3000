/**
 * Upgrade Definitions
 * Corporate Clicker 3000™ v3.0
 *
 * 25+ satirical upgrades organized by tier
 */

import type { Upgrade } from '../types/game'

export const UPGRADES: Upgrade[] = [
  // ============================================
  // TIER 1: Intern Life ($50 - $250)
  // ============================================
  {
    id: 'better_fingers',
    name: 'Better Fingers',
    description: 'Train your clicking finger. Results may vary.',
    baseCost: 50,
    costMultiplier: 1.2,
    tier: 1,
    icon: '👆',
    effect: {
      clickPower: 1
    }
  },
  {
    id: 'hire_intern',
    name: 'Hire Intern',
    description: 'Unpaid labor is the backbone of capitalism!',
    baseCost: 100,
    costMultiplier: 1.15,
    tier: 1,
    icon: '🧑‍💼',
    effect: {
      employees: 1,
      autoMoney: 1
    }
  },
  {
    id: 'coffee_machine',
    name: 'Coffee Machine',
    description: 'Keeps employees barely functional.',
    baseCost: 150,
    tier: 1,
    icon: '☕',
    effect: {
      autoMoney: 2,
      synergy: 5
    }
  },
  {
    id: 'more_electrolytes',
    name: 'More Electrolytes',
    description: "It's what plants crave! Refills to 100%.",
    baseCost: 150,
    costMultiplier: 1.3,
    tier: 1,
    icon: '⚡',
    effect: {
      // Special handling in component
    }
  },

  // ============================================
  // TIER 2: Middle Management ($200 - $1,500)
  // ============================================
  {
    id: 'buy_synergy',
    name: 'Buy Synergy',
    description: 'Purchase intangible corporate buzzwords.',
    baseCost: 200,
    tier: 2,
    icon: '🔥',
    effect: {
      clickPower: 5,
      buzzwordLevel: 1
    }
  },
  {
    id: 'hire_manager',
    name: 'Hire Manager',
    description: 'Someone to manage the interns managing themselves.',
    baseCost: 500,
    costMultiplier: 1.18,
    tier: 2,
    icon: '👔',
    effect: {
      employees: 1,
      autoMoney: 10
    }
  },
  {
    id: 'ergonomic_chair',
    name: 'Ergonomic Chair',
    description: '$800 chair to avoid $200 standing desk.',
    baseCost: 750,
    tier: 2,
    icon: '🪑',
    effect: {
      autoMoney: 15,
      synergy: 10
    }
  },
  {
    id: 'standing_desk',
    name: 'Standing Desk',
    description: 'Suffering, but vertically.',
    baseCost: 1000,
    tier: 2,
    icon: '🖥️',
    effect: {
      clickPower: 10,
      autoMoney: 20
    }
  },
  {
    id: 'whiteboard',
    name: 'Whiteboard',
    description: 'For drawing circles and calling them "synergy".',
    baseCost: 1200,
    tier: 2,
    icon: '📋',
    effect: {
      buzzwordLevel: 2,
      synergy: 20
    }
  },

  // ============================================
  // TIER 3: Corporate Elite ($2,000 - $10,000)
  // ============================================
  {
    id: 'hire_ceo',
    name: 'Hire CEO',
    description: 'Pays themselves 400x the average worker. Worth it?',
    baseCost: 2500,
    tier: 3,
    icon: '👑',
    effect: {
      autoMoney: 50,
      legalLiability: 10
    }
  },
  {
    id: 'open_office',
    name: 'Open Office Layout',
    description: 'Remove all privacy. Productivity definitely increases.',
    baseCost: 3000,
    tier: 3,
    icon: '🏢',
    effect: {
      autoMoney: 75,
      synergy: -20  // Actually decreases synergy lol
    }
  },
  {
    id: 'team_building',
    name: 'Mandatory Team Building',
    description: 'Trust falls and awkward ice breakers!',
    baseCost: 5000,
    tier: 3,
    icon: '🎯',
    effect: {
      synergy: 50,
      meetingTime: 10
    }
  },
  {
    id: 'blockchain',
    name: 'BLOCKCHAIN',
    description: 'We have no idea what it does but investors love it!',
    baseCost: 5000,
    tier: 3,
    icon: '⛓️',
    effect: {
      instantMoney: 10000,
      buzzwordLevel: 3
    }
  },
  {
    id: 'ping_pong',
    name: 'Ping Pong Table',
    description: 'Startup culture! (No one uses it)',
    baseCost: 6000,
    tier: 3,
    icon: '🏓',
    effect: {
      synergy: 30,
      autoMoney: 100
    }
  },
  {
    id: 'flex_time',
    name: 'Flex Time Policy',
    description: 'Work whenever you want! (Still 60 hours/week)',
    baseCost: 8000,
    tier: 3,
    icon: '⏰',
    effect: {
      autoMoney: 150,
      synergy: 40
    }
  },

  // ============================================
  // TIER 3.5: Growth Stage ($12k - $75k)
  // Rebalanced: Upgrades should pay for themselves in 90-120 seconds
  // ============================================
  {
    id: 'hire_hr',
    name: 'Hire HR Department',
    description: 'Protecting the company FROM employees since forever',
    baseCost: 12000,
    tier: 3,
    icon: '👨‍💼',
    effect: {
      employees: 3,
      autoMoney: 80,
      legalLiability: -20
    }
  },
  {
    id: 'energy_drinks',
    name: 'Energy Drink Supply',
    description: 'Coffee is for quitters. Electrolytes drain 50% slower.',
    baseCost: 15000,
    tier: 3,
    icon: '🥤',
    effect: {
      autoMoney: 100,
      // Special: Slows electrolyte drain (handled in component)
    }
  },
  {
    id: 'hire_sales',
    name: 'Hire Sales Team',
    description: 'Sell things people don\'t need! Perfect capitalism.',
    baseCost: 18000,
    costMultiplier: 1.25,
    tier: 3,
    icon: '📞',
    effect: {
      employees: 5,
      autoMoney: 120,
      clickPower: 15
    }
  },
  {
    id: 'hire_marketers',
    name: 'Hire Marketing Team',
    description: 'Spend money to make money to spend on marketing!',
    baseCost: 22000,
    costMultiplier: 1.22,
    tier: 3,
    icon: '📢',
    effect: {
      employees: 4,
      autoMoney: 140,
      buzzwordLevel: 3
    }
  },
  {
    id: 'consultant',
    name: 'Hire Expensive Consultant',
    description: '$10k/hour to tell you what you already know',
    baseCost: 28000,
    tier: 3,
    icon: '🎩',
    effect: {
      autoMoney: 180,
      meetingTime: 20,
      synergy: 50
    }
  },
  {
    id: 'offshore',
    name: 'Offshore Tax Haven',
    description: 'Taxes are for poor people!',
    baseCost: 35000,
    tier: 3,
    icon: '🏝️',
    effect: {
      autoMoney: 200,
      legalLiability: 150
    }
  },
  {
    id: 'accounting',
    name: 'Creative Accounting',
    description: 'The numbers mean whatever we want them to mean',
    baseCost: 42000,
    tier: 3,
    icon: '📊',
    effect: {
      autoMoney: 220,
      legalLiability: 80,
      instantMoney: 8000
    }
  },
  {
    id: 'vr_office',
    name: 'VR Office Space',
    description: 'Like a real office, but with motion sickness!',
    baseCost: 48000,
    tier: 3,
    icon: '🥽',
    effect: {
      autoMoney: 250,
      buzzwordLevel: 4,
      meetingTime: 15
    }
  },
  {
    id: 'synergy_team',
    name: 'Dedicated Synergy Team',
    description: 'Their only job is to create synergy (whatever that means)',
    baseCost: 55000,
    costMultiplier: 1.28,
    tier: 3,
    icon: '🔥',
    effect: {
      employees: 6,
      autoMoney: 280,
      synergy: 60,
      clickPower: 20
    }
  },
  {
    id: 'meeting_room',
    name: 'Executive Meeting Rooms',
    description: 'Where decisions go to die',
    baseCost: 60000,
    tier: 3,
    icon: '🚪',
    effect: {
      autoMoney: 300,
      meetingTime: 30,
      synergy: -15
    }
  },
  {
    id: 'stock_manipulation',
    name: 'Stock Manipulation',
    description: 'It\'s not illegal if you don\'t get caught!',
    baseCost: 65000,
    tier: 3,
    icon: '📈',
    effect: {
      autoMoney: 350,
      legalLiability: 200,
      instantMoney: 12000
    }
  },
  {
    id: 'insider_trading',
    name: 'Insider Trading Division',
    description: 'Using information before it\'s public? That\'s just smart!',
    baseCost: 70000,
    tier: 3,
    icon: '💼',
    effect: {
      autoMoney: 400,
      legalLiability: 250,
      clickPower: 30
    }
  },
  {
    id: 'automation',
    name: 'Automate Everything',
    description: 'Replace humans with robots. What could go wrong?',
    baseCost: 75000,
    tier: 3,
    icon: '🤖',
    effect: {
      autoMoney: 450,
      employees: -10,
      clickPower: 40
    }
  },
  {
    id: 'golden_parachute',
    name: 'Golden Parachute Clause',
    description: 'Get paid millions even if you fail spectacularly',
    baseCost: 80000,
    tier: 3,
    icon: '🪂',
    effect: {
      autoMoney: 500,
      legalLiability: -50,
      instantMoney: 15000
    }
  },
  {
    id: 'data_mining',
    name: 'User Data Mining',
    description: 'Your privacy is our profit!',
    baseCost: 90000,
    tier: 3,
    icon: '⛏️',
    effect: {
      autoMoney: 600,
      legalLiability: 300,
      clickPower: 50
    }
  },

  // ============================================
  // TIER 4: Unhinged Capitalism ($10k - $500k)
  // ============================================
  {
    id: 'useless_ai',
    name: 'AI That Does Nothing',
    description: '"Powered by AI" sounds good in press releases.',
    baseCost: 10000,
    tier: 4,
    icon: '🤖',
    effect: {
      buzzwordLevel: 4,
      autoMoney: 200,
      legalLiability: 20
    }
  },
  {
    id: 'metaverse',
    name: 'Metaverse Office',
    description: 'Like Zoom, but worse and more expensive!',
    baseCost: 25000,
    tier: 4,
    icon: '🥽',
    effect: {
      autoMoney: 500,
      buzzwordLevel: 5,
      meetingTime: 50
    }
  },
  {
    id: 'nft_collection',
    name: 'Corporate NFT Collection',
    description: 'Right-click save THIS, nerds! (Please buy them)',
    baseCost: 50000,
    tier: 4,
    icon: '🖼️',
    effect: {
      instantMoney: 25000,
      legalLiability: 50
    }
  },
  {
    id: 'acquire_competitor',
    name: 'Acquire Competitor',
    description: 'Eliminate competition through capitalism!',
    baseCost: 100000,
    tier: 4,
    icon: '💰',
    effect: {
      autoMoney: 1000,
      employees: 50,
      legalLiability: 100
    }
  },
  {
    id: 'ipo',
    name: 'Go Public (IPO)',
    description: 'Sell shares to idiots on the internet.',
    baseCost: 250000,
    tier: 4,
    icon: '📈',
    effect: {
      instantMoney: 500000,
      buzzwordLevel: 10,
      legalLiability: 200
    }
  },
  {
    id: 'lobbying',
    name: 'Lobbying Division',
    description: 'Laws are just suggestions when you have money.',
    baseCost: 300000,
    tier: 4,
    icon: '💼',
    effect: {
      autoMoney: 2000,
      legalLiability: -100  // Reduces legal liability!
    }
  },

  // ============================================
  // TIER 5: Endgame Absurdity ($500k+)
  // ============================================
  {
    id: 'meme_stock',
    name: 'Become Meme Stock',
    description: 'r/wallstreetbets will definitely make good decisions.',
    baseCost: 500000,
    tier: 5,
    icon: '🚀',
    requirementText: 'Must have IPO',
    requires: {
      achievements: ['went_public']
    },
    effect: {
      autoMoney: 5000,
      clickPower: 100,
      buzzwordLevel: 15
    }
  },
  {
    id: 'space_launch',
    name: 'Launch to Space',
    description: 'Tax avoidance, but make it look cool.',
    baseCost: 1000000,
    tier: 5,
    icon: '🛸',
    effect: {
      instantMoney: 2000000,
      buzzwordLevel: 20,
      legalLiability: 500
    }
  },
  {
    id: 'union_busting',
    name: 'Unionbusting Division',
    description: 'Worker rights? Not on MY watch!',
    baseCost: 2500000,
    tier: 5,
    icon: '⚔️',
    effect: {
      autoMoney: 10000,
      legalLiability: 1000,
      synergy: -100
    }
  },
  {
    id: 'rebrand',
    name: 'Rebrand as "Tech Company"',
    description: 'We sell sandwiches, but with an app!',
    baseCost: 5000000,
    tier: 5,
    icon: '✨',
    effect: {
      autoMoney: 25000,
      clickPower: 500,
      buzzwordLevel: 30
    }
  },
  {
    id: 'regulatory_capture',
    name: 'Regulatory Capture',
    description: 'Why follow laws when you can write them?',
    baseCost: 10000000,
    tier: 5,
    icon: '⚖️',
    effect: {
      autoMoney: 50000,
      legalLiability: -9999,  // Basically immune to laws
      buzzwordLevel: 50
    }
  },
  {
    id: 'too_big_fail',
    name: 'Too Big To Fail Status',
    description: 'Government bailout guaranteed!',
    baseCost: 25000000,
    tier: 5,
    icon: '🏛️',
    requirementText: 'Must own everything else',
    requires: {
      bankruptcyCount: 1  // Must have filed bankruptcy at least once
    },
    effect: {
      autoMoney: 100000,
      instantMoney: 50000000,
      legalLiability: -9999
    }
  }
]

// Helper function to get available upgrades
export function getAvailableUpgrades(state: {
  money: number
  employees: number
  buzzwordLevel: number
  bankruptcyCount: number
  unlockedAchievements: string[]
  purchasedUpgrades: string[]
}): Upgrade[] {
  return UPGRADES.filter(upgrade => {
    // Already purchased (for non-repeatable)
    if (!upgrade.costMultiplier && state.purchasedUpgrades.includes(upgrade.id)) {
      return false
    }

    // Check requirements
    if (upgrade.requires) {
      if (upgrade.requires.money && state.money < upgrade.requires.money) return false
      if (upgrade.requires.employees && state.employees < upgrade.requires.employees) return false
      if (upgrade.requires.buzzwordLevel && state.buzzwordLevel < upgrade.requires.buzzwordLevel) return false
      if (upgrade.requires.bankruptcyCount && state.bankruptcyCount < upgrade.requires.bankruptcyCount) return false
      if (upgrade.requires.achievements) {
        const hasAll = upgrade.requires.achievements.every(ach =>
          state.unlockedAchievements.includes(ach)
        )
        if (!hasAll) return false
      }
    }

    return true
  })
}

// Calculate actual cost based on purchase count (for repeatable upgrades)
export function getUpgradeCost(upgrade: Upgrade, purchaseCount: number = 0): number {
  if (!upgrade.costMultiplier) return upgrade.baseCost
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, purchaseCount))
}
