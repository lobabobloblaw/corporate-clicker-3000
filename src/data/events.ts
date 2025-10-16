/**
 * Random Event Definitions
 * Corporate Clicker 3000™ v3.0
 *
 * 50+ satirical random events
 */

import type { RandomEvent } from '../types/game'

export const RANDOM_EVENTS: RandomEvent[] = [
  // ============================================
  // POSITIVE EVENTS (Weight 3-5)
  // ============================================
  {
    id: 'ceo_nap',
    text: '🎉 CEO took a nap! Productivity +1000%',
    icon: '💤',
    weight: 4,
    sound: 'good',
    effect: (state) => ({ money: state.money + 500 })
  },
  {
    id: 'free_burger',
    text: '🍔 Free burger day! Morale boosted',
    icon: '🍔',
    weight: 5,
    sound: 'good',
    effect: () => ({ synergy: 100 })
  },
  {
    id: 'stock_surge',
    text: '📈 Stock price surged for no reason!',
    icon: '📈',
    weight: 3,
    requires: { minMoney: 10000 },
    sound: 'good',
    effect: (state) => ({ money: state.money + Math.floor(state.money * 0.1) })
  },
  {
    id: 'tax_loophole',
    text: '💸 Found a tax loophole! Free money!',
    icon: '💸',
    weight: 2,
    requires: { minMoney: 50000 },
    sound: 'good',
    effect: (state) => ({ money: state.money + 5000 })
  },
  {
    id: 'vc_funding',
    text: '💰 VCs threw money at you for no reason',
    icon: '💰',
    weight: 2,
    requires: { minBuzzwordLevel: 5 },
    sound: 'good',
    effect: (state) => ({ money: state.money + 10000 })
  },
  {
    id: 'competitor_bankrupt',
    text: '🎊 Competitor went bankrupt! Their loss is your gain',
    icon: '🎊',
    weight: 3,
    requires: { minEmployees: 10 },
    sound: 'good',
    effect: (state) => ({ money: state.money + 2000, autoMoney: state.autoMoney + 50 })
  },
  {
    id: 'viral_tweet',
    text: '🐦 CEO tweet went viral! Stock up 420%',
    icon: '🐦',
    weight: 2,
    requires: { minMoney: 100000 },
    sound: 'good',
    effect: (state) => ({ money: state.money + 25000 })
  },
  {
    id: 'govt_subsidy',
    text: '🏛️ Government subsidy acquired! (Socialism for the rich)',
    icon: '🏛️',
    weight: 2,
    requires: { minEmployees: 50 },
    sound: 'good',
    effect: () => ({ money: 50000 })
  },

  // ============================================
  // NEGATIVE EVENTS (Weight 4-6)
  // ============================================
  {
    id: 'ai_sentient',
    text: '🤖 AI became sentient! Immediately resigned',
    icon: '🤖',
    weight: 5,
    sound: 'bad',
    effect: (state) => ({ money: Math.max(0, state.money - 100) })
  },
  {
    id: 'electrolyte_shortage',
    text: '⚡ Electrolyte shortage! Productivity tanked',
    icon: '⚡',
    weight: 6,
    sound: 'bad',
    effect: () => ({ electrolytes: 20 })
  },
  {
    id: 'ceo_yacht',
    text: '🛥️ CEO bought another yacht. Morale -50%',
    icon: '🛥️',
    weight: 4,
    requires: { minEmployees: 20 },
    sound: 'bad',
    effect: (state) => ({ synergy: Math.max(0, state.synergy - 50) })
  },
  {
    id: 'pizza_party',
    text: '🍕 Pizza party instead of raises! Everyone quit',
    icon: '🍕',
    weight: 5,
    requires: { minEmployees: 5 },
    sound: 'bad',
    effect: (state) => ({ employees: Math.max(0, state.employees - 2), synergy: Math.max(0, state.synergy - 30) })
  },
  {
    id: 'layoffs_announced',
    text: '📉 Layoffs announced! Stock price SOARS 🚀',
    icon: '📉',
    weight: 4,
    requires: { minEmployees: 10 },
    sound: 'chaotic',
    effect: (state) => ({
      employees: Math.max(0, state.employees - 5),
      money: state.money + 1000,
      legalLiability: state.legalLiability + 50
    })
  },
  {
    id: 'sec_investigation',
    text: '⚖️ SEC investigation started... nevermind, lobbying worked',
    icon: '⚖️',
    weight: 3,
    requires: { minMoney: 100000 },
    sound: 'chaotic',
    effect: (state) => ({ money: Math.max(0, state.money - 25000), legalLiability: Math.max(0, state.legalLiability - 100) })
  },
  {
    id: 'intern_discovered',
    text: '🧑‍💼 Intern discovered you don\'t pay them. Awkward.',
    icon: '🧑‍💼',
    weight: 5,
    requires: { minEmployees: 1 },
    sound: 'bad',
    effect: (state) => ({ legalLiability: state.legalLiability + 25 })
  },
  {
    id: 'market_crash',
    text: '💥 Market crash! Everyone panic sold',
    icon: '💥',
    weight: 3,
    requires: { minMoney: 50000 },
    sound: 'bad',
    effect: (state) => ({ money: Math.floor(state.money * 0.8) })
  },
  {
    id: 'pr_disaster',
    text: '😰 Tried to be evil, accidentally did good. PR disaster!',
    icon: '😰',
    weight: 4,
    sound: 'chaotic',
    effect: (state) => ({ money: Math.max(0, state.money - 500), synergy: state.synergy + 20 })
  },
  {
    id: 'union_forming',
    text: '✊ Workers are forming a union! Quick, hire consultants!',
    icon: '✊',
    weight: 3,
    requires: { minEmployees: 20 },
    sound: 'bad',
    effect: (state) => ({ money: Math.max(0, state.money - 5000), legalLiability: state.legalLiability + 100 })
  },

  // ============================================
  // NEUTRAL/CHAOTIC EVENTS (Weight 5-7)
  // ============================================
  {
    id: 'nuclear_false_alarm',
    text: '☢️ Nuclear launch detected (false alarm)',
    icon: '☢️',
    weight: 6,
    sound: 'neutral',
    effect: () => ({})
  },
  {
    id: 'stock_uncertainty',
    text: '📊 Stock market went up (or down idk)',
    icon: '📊',
    weight: 7,
    sound: 'neutral',
    effect: (state) => ({ money: state.money + Math.floor((Math.random() - 0.5) * 2000) })
  },
  {
    id: 'interpretive_dance',
    text: '💃 Employee quit via interpretive dance',
    icon: '💃',
    weight: 5,
    requires: { minEmployees: 3 },
    sound: 'chaotic',
    effect: (state) => ({ employees: Math.max(0, state.employees - 1), synergy: state.synergy + 10 })
  },
  {
    id: 'zoom_email',
    text: '📧 Zoom meeting could\'ve been an email (time wasted)',
    icon: '📧',
    weight: 7,
    sound: 'bad',
    effect: (state) => ({ meetingTime: state.meetingTime + 5 })
  },
  {
    id: 'hr_investigation',
    text: '🔍 HR investigated themselves, found no wrongdoing',
    icon: '🔍',
    weight: 6,
    sound: 'neutral',
    effect: (state) => ({ legalLiability: state.legalLiability + 10 })
  },
  {
    id: 'reorg',
    text: '🔄 Reorganization announced! Nobody knows who reports to whom',
    icon: '🔄',
    weight: 5,
    requires: { minEmployees: 10 },
    sound: 'chaotic',
    effect: (state) => ({ synergy: Math.max(0, state.synergy - 20), autoMoney: Math.max(0, state.autoMoney - 20) })
  },
  {
    id: 'agile_coach',
    text: '🎯 Hired Agile Coach. Things are somehow worse now',
    icon: '🎯',
    weight: 5,
    sound: 'bad',
    effect: (state) => ({ money: Math.max(0, state.money - 1000), meetingTime: state.meetingTime + 20 })
  },
  {
    id: 'mandatory_training',
    text: '📚 Mandatory diversity training! (Nothing will change)',
    icon: '📚',
    weight: 6,
    requires: { minEmployees: 5 },
    sound: 'neutral',
    effect: (state) => ({ meetingTime: state.meetingTime + 10 })
  },
  {
    id: 'foosball',
    text: '⚽ Installed foosball table. Used exactly once.',
    icon: '⚽',
    weight: 5,
    sound: 'neutral',
    effect: (state) => ({ money: Math.max(0, state.money - 500), synergy: state.synergy + 5 })
  },

  // ============================================
  // RARE/SPECIAL EVENTS (Weight 1-2)
  // ============================================
  {
    id: 'elon_tweet',
    text: '🐦 Elon tweeted about your company! (Could go either way)',
    icon: '🐦',
    weight: 1,
    requires: { minMoney: 500000 },
    sound: 'chaotic',
    effect: (state) => ({
      money: Math.random() > 0.5 ? state.money * 2 : Math.floor(state.money * 0.5)
    })
  },
  {
    id: 'ipo_disaster',
    text: '💀 IPO went terribly! Congrats on the free publicity',
    icon: '💀',
    weight: 1,
    requires: { minMoney: 1000000 },
    sound: 'bad',
    effect: (state) => ({ money: Math.floor(state.money * 0.7), legalLiability: state.legalLiability + 500 })
  },
  {
    id: 'viral_scandal',
    text: '🔥 Scandal went viral! All press is good press... right?',
    icon: '🔥',
    weight: 1,
    requires: { minEmployees: 50 },
    sound: 'chaotic',
    effect: (state) => ({ money: state.money + 10000, legalLiability: state.legalLiability + 250 })
  },
  {
    id: 'found_bitcoin',
    text: '₿ Found old Bitcoin wallet from 2011!',
    icon: '₿',
    weight: 1,
    sound: 'good',
    effect: (state) => ({ money: state.money + 100000 })
  },
  {
    id: 'alien_contact',
    text: '👽 Aliens made first contact! They want to invest',
    icon: '👽',
    weight: 1,
    requires: { minMoney: 10000000 },
    sound: 'chaotic',
    effect: (state) => ({ money: state.money + 5000000, buzzwordLevel: state.buzzwordLevel + 100 })
  },

  // ============================================
  // ADDITIONAL ABSURD EVENTS
  // ============================================
  {
    id: 'printer_jam',
    text: '🖨️ Printer jammed. IT says they\'ll get to it next quarter',
    icon: '🖨️',
    weight: 7,
    sound: 'neutral',
    effect: () => ({})
  },
  {
    id: 'coffee_shortage',
    text: '☕ Coffee machine broke! Mass hysteria!',
    icon: '☕',
    weight: 6,
    sound: 'bad',
    effect: (state) => ({ autoMoney: Math.max(0, state.autoMoney - 50), synergy: Math.max(0, state.synergy - 30) })
  },
  {
    id: 'stand_up_meeting',
    text: '🕐 Daily standup lasted 2 hours (while standing)',
    icon: '🕐',
    weight: 6,
    sound: 'bad',
    effect: (state) => ({ meetingTime: state.meetingTime + 15, synergy: Math.max(0, state.synergy - 10) })
  },
  {
    id: 'synergy_overflow',
    text: '🌟 Achieved peak synergy! The buzzwords are working!',
    icon: '🌟',
    weight: 3,
    requires: { minBuzzwordLevel: 10 },
    sound: 'good',
    effect: () => ({ synergy: 100, clickPower: 25 })
  },
  {
    id: 'passive_aggressive',
    text: '😊 Passive-aggressive email chain reached 47 replies',
    icon: '😊',
    weight: 6,
    requires: { minEmployees: 5 },
    sound: 'neutral',
    effect: (state) => ({ synergy: Math.max(0, state.synergy - 15) })
  },
  {
    id: 'mandatory_fun',
    text: '🎉 Mandatory fun activity! (Attendance will be taken)',
    icon: '🎉',
    weight: 5,
    requires: { minEmployees: 10 },
    sound: 'bad',
    effect: (state) => ({ money: Math.max(0, state.money - 1000), meetingTime: state.meetingTime + 10 })
  },
  {
    id: 'blockchain_pivot',
    text: '⛓️ Pivoted to blockchain! (Whatever that means)',
    icon: '⛓️',
    weight: 3,
    requires: { minBuzzwordLevel: 5 },
    sound: 'chaotic',
    effect: (state) => ({ money: state.money + 5000, buzzwordLevel: state.buzzwordLevel + 5 })
  },
  {
    id: 'office_plant',
    text: '🌱 Office plant died. Janet is devastated.',
    icon: '🌱',
    weight: 7,
    sound: 'neutral',
    effect: (state) => ({ synergy: Math.max(0, state.synergy - 5) })
  },
  {
    id: 'rebrand_disaster',
    text: '✨ Rebrand went horribly! Everyone preferred the old logo',
    icon: '✨',
    weight: 4,
    requires: { minMoney: 50000 },
    sound: 'bad',
    effect: (state) => ({ money: Math.max(0, state.money - 10000) })
  },
  {
    id: 'influencer_deal',
    text: '📱 Influencer partnership! They have 47 real followers',
    icon: '📱',
    weight: 5,
    sound: 'bad',
    effect: (state) => ({ money: Math.max(0, state.money - 2000) })
  },
  {
    id: 'award_won',
    text: '🏆 Won "Best Place to Work"! (Survey had 3 respondents)',
    icon: '🏆',
    weight: 4,
    requires: { minEmployees: 20 },
    sound: 'good',
    effect: (state) => ({ synergy: state.synergy + 25 })
  },
  {
    id: 'quiet_quitting',
    text: '🤫 Half your workforce is "quiet quitting"',
    icon: '🤫',
    weight: 5,
    requires: { minEmployees: 15 },
    sound: 'bad',
    effect: (state) => ({ autoMoney: Math.floor(state.autoMoney * 0.9) })
  },
  {
    id: 'return_to_office',
    text: '🏢 Mandatory return to office! Mass exodus begins',
    icon: '🏢',
    weight: 4,
    requires: { minEmployees: 10 },
    sound: 'bad',
    effect: (state) => ({ employees: Math.max(0, state.employees - 3), synergy: Math.max(0, state.synergy - 40) })
  },
  {
    id: 'crypto_crash',
    text: '💸 CEO\'s crypto portfolio crashed! Company unaffected',
    icon: '💸',
    weight: 5,
    sound: 'neutral',
    effect: () => ({})
  },
  {
    id: 'metaverse_meeting',
    text: '🥽 Meeting in the metaverse! Nobody can figure out how to join',
    icon: '🥽',
    weight: 5,
    requires: { minBuzzwordLevel: 15 },
    sound: 'bad',
    effect: (state) => ({ meetingTime: state.meetingTime + 30, money: Math.max(0, state.money - 500) })
  },
  {
    id: 'tiktok_trend',
    text: '🎵 Employees making TikToks instead of working',
    icon: '🎵',
    weight: 6,
    requires: { minEmployees: 5 },
    sound: 'neutral',
    effect: (state) => ({ autoMoney: Math.max(0, state.autoMoney - 10), synergy: state.synergy + 15 })
  },
  {
    id: 'wellness_app',
    text: '🧘 Launched wellness app! (Tracks everything you do)',
    icon: '🧘',
    weight: 4,
    sound: 'chaotic',
    effect: (state) => ({ money: Math.max(0, state.money - 5000), legalLiability: state.legalLiability + 50 })
  },
  {
    id: 'acquihire',
    text: '🤝 Acqui-hired a startup! (Paid $10M for 3 engineers)',
    icon: '🤝',
    weight: 3,
    requires: { minMoney: 100000 },
    sound: 'chaotic',
    effect: (state) => ({
      money: Math.max(0, state.money - 10000),
      employees: state.employees + 3,
      autoMoney: state.autoMoney + 100
    })
  }
]

// Helper function to get weighted random event
export function getRandomEvent(state: {
  money: number
  employees: number
  buzzwordLevel: number
}): RandomEvent | null {
  // Filter events that meet requirements
  const availableEvents = RANDOM_EVENTS.filter(event => {
    if (!event.requires) return true

    if (event.requires.minMoney && state.money < event.requires.minMoney) return false
    if (event.requires.minEmployees && state.employees < event.requires.minEmployees) return false
    if (event.requires.minBuzzwordLevel && state.buzzwordLevel < event.requires.minBuzzwordLevel) return false

    return true
  })

  if (availableEvents.length === 0) return null

  // Calculate total weight
  const totalWeight = availableEvents.reduce((sum, event) => sum + event.weight, 0)

  // Pick random weighted event
  let random = Math.random() * totalWeight
  for (const event of availableEvents) {
    random -= event.weight
    if (random <= 0) return event
  }

  return availableEvents[0] || null
}
