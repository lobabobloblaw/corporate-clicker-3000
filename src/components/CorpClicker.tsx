/**
 * Corporate Clicker 3000™ v3.0
 * Complete redesign with 10x more complexity, humor, and engagement
 */

import { useState, useEffect, useCallback, memo } from 'react'
import { useDiscordSdk } from '@hooks/useDiscordSdk'
import type { GameState } from '../types/game'
import { UPGRADES, getAvailableUpgrades, getUpgradeCost } from '../data/upgrades'
import { getRandomEvent } from '../data/events'
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements'

function CorpClickerInner() {
  const { auth } = useDiscordSdk()

  // ============================================
  // GAME STATE
  // ============================================
  const [gameState, setGameState] = useState<GameState>({
    // Core resources
    money: 0,
    clickPower: 1,
    autoMoney: 0,

    // Advanced resources
    buzzwordPoints: 0,
    stockPrice: 1.0,
    legalLiability: 0,
    caffeine: 0,
    meetingTime: 0,

    // Basic stats
    synergy: 0,
    electrolytes: 100,
    employees: 0,
    buzzwordLevel: 1,

    // Tracking
    purchasedUpgrades: [],
    upgradeCount: {},
    unlockedAchievements: [],
    activeEffects: [],
    lifetimeEarnings: 0,
    bankruptcyCount: 0,
    totalClicks: 0,
    lifetimeClicks: 0,
    startTime: Date.now()
  })

  // UI state
  const [showPopup, setShowPopup] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [currentBuzzword, setCurrentBuzzword] = useState('SYNERGIZING')

  const buzzwords = [
    'PIVOTING', 'DISRUPTING', 'LEVERAGING', 'OPTIMIZING',
    'MONETIZING', 'SYNERGIZING', 'INNOVATING', 'SCALING'
  ]

  // ============================================
  // GAME LOOP - Auto Money Generation
  // ============================================
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newMoney = prev.money + prev.autoMoney
        return {
          ...prev,
          money: newMoney,
          lifetimeEarnings: Math.max(prev.lifetimeEarnings, newMoney),
          synergy: Math.min(100, prev.synergy + prev.employees * 0.1),
          electrolytes: Math.max(0, prev.electrolytes - 0.5),
          meetingTime: Math.max(0, prev.meetingTime - 0.5) // Meetings decay
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // ============================================
  // RANDOM EVENTS
  // ============================================
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.85) { // 15% chance every 5 seconds
        const event = getRandomEvent({
          money: gameState.money,
          employees: gameState.employees,
          buzzwordLevel: gameState.buzzwordLevel
        })

        if (event) {
          showToastNotification(event.text)
          setGameState(prev => ({
            ...prev,
            ...event.effect(prev)
          }))
        }
      }
    }, 5000)
    return () => clearInterval(eventInterval)
  }, [gameState.money, gameState.employees, gameState.buzzwordLevel])

  // ============================================
  // ACHIEVEMENT CHECKING
  // ============================================
  useEffect(() => {
    const achievementInterval = setInterval(() => {
      const { newAchievements, updatedUnlocked } = checkAchievements(
        gameState,
        gameState.unlockedAchievements
      )

      if (newAchievements.length > 0) {
        setGameState(prev => ({
          ...prev,
          unlockedAchievements: updatedUnlocked
        }))

        newAchievements.forEach(ach => {
          showToastNotification(`🏆 Achievement: ${ach.name}`)
        })
      }
    }, 2000) // Check every 2 seconds
    return () => clearInterval(achievementInterval)
  }, [gameState])

  // ============================================
  // POPUP ADS
  // ============================================
  useEffect(() => {
    const popupInterval = setInterval(() => {
      if (Math.random() > 0.97) setShowPopup(true)
    }, 15000)
    return () => clearInterval(popupInterval)
  }, [])

  // ============================================
  // BUZZWORD ROTATION
  // ============================================
  useEffect(() => {
    const buzzInterval = setInterval(() => {
      const randomBuzzword = buzzwords[Math.floor(Math.random() * buzzwords.length)]
      if (randomBuzzword) setCurrentBuzzword(randomBuzzword)
    }, 2000)
    return () => clearInterval(buzzInterval)
  }, [])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const showToastNotification = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3500)
  }, [])

  // ============================================
  // CLICK HANDLER
  // ============================================
  const handleClick = useCallback(() => {
    setGameState(prev => {
      const newMoney = prev.money + prev.clickPower
      return {
        ...prev,
        money: newMoney,
        lifetimeEarnings: Math.max(prev.lifetimeEarnings, newMoney),
        synergy: Math.min(100, prev.synergy + 1),
        totalClicks: prev.totalClicks + 1,
        lifetimeClicks: prev.lifetimeClicks + 1
      }
    })
  }, [])

  // ============================================
  // UPGRADE PURCHASE HANDLER
  // ============================================
  const buyUpgrade = useCallback((upgradeId: string) => {
    const upgrade = UPGRADES.find(u => u.id === upgradeId)
    if (!upgrade) return

    const purchaseCount = gameState.upgradeCount[upgradeId] || 0
    const cost = getUpgradeCost(upgrade, purchaseCount)

    if (gameState.money >= cost) {
      setGameState(prev => {
        let newState = { ...prev }

        // Deduct cost
        newState.money -= cost

        // Track purchase
        if (!upgrade.costMultiplier) {
          newState.purchasedUpgrades = [...prev.purchasedUpgrades, upgradeId]
        }
        newState.upgradeCount = {
          ...prev.upgradeCount,
          [upgradeId]: purchaseCount + 1
        }

        // Apply effects
        const effect = upgrade.effect
        if (effect.clickPower) newState.clickPower += effect.clickPower
        if (effect.autoMoney) newState.autoMoney += effect.autoMoney
        if (effect.synergy) newState.synergy = Math.min(100, newState.synergy + effect.synergy)
        if (effect.employees) newState.employees += effect.employees
        if (effect.buzzwordLevel) newState.buzzwordLevel += effect.buzzwordLevel
        if (effect.legalLiability) newState.legalLiability = Math.max(0, newState.legalLiability + effect.legalLiability)
        if (effect.instantMoney) newState.money += effect.instantMoney

        // Special effects
        if (upgradeId === 'more_electrolytes') {
          newState.electrolytes = 100
        }

        return newState
      })
    }
  }, [gameState.money, gameState.upgradeCount])

  // Get available upgrades
  const availableUpgrades = getAvailableUpgrades({
    money: gameState.money,
    employees: gameState.employees,
    buzzwordLevel: gameState.buzzwordLevel,
    bankruptcyCount: gameState.bankruptcyCount,
    unlockedAchievements: gameState.unlockedAchievements,
    purchasedUpgrades: gameState.purchasedUpgrades
  })

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="h-screen max-h-screen bg-discord-bg-primary text-discord-text-normal font-sans overflow-hidden flex flex-col touch-action-none">

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-3 right-3 z-50 animate-slide-up max-w-xs">
          <div className="bg-discord-bg-secondary border-l-4 border-discord-blurple rounded-lg shadow-lg p-2.5">
            <p className="text-xs font-medium text-discord-text-normal">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Popup Ad */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 relative animate-slide-up shadow-2xl">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 bg-discord-red text-white w-10 h-10 rounded-full font-bold text-lg hover:bg-red-600 active:scale-95 transition-all flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
            <h2 className="text-3xl font-black text-white mb-3">
              🎉 CLICK HERE TO WIN!
            </h2>
            <p className="text-xl font-bold text-white mb-4">
              You've won a free promotion!
            </p>
            <button
              onClick={() => {
                setGameState(prev => ({ ...prev, money: prev.money + 100 }))
                setShowPopup(false)
                showToastNotification('💰 +100 money claimed!')
              }}
              className="bg-discord-green text-white font-bold text-lg py-3 px-6 rounded-lg w-full min-h-touch hover:bg-green-600 active:scale-98 transition-all shadow-md"
            >
              CLAIM +100 MONEY 💰
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-discord-bg-secondary px-3 md:px-4 py-2 md:py-2.5 border-b border-discord-border flex-shrink-0">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-lg md:text-2xl font-black text-white leading-tight">
              CORPORATE CLICKER 3000™
            </h1>
            {auth.user && (
              <p className="text-[10px] md:text-xs text-discord-green font-semibold flex items-center gap-1">
                <span className="text-sm md:text-base">👑</span>
                CEO: {auth.user.username}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[10px] md:text-sm text-discord-text-muted hidden sm:block">
              <span className="text-discord-yellow font-bold">{currentBuzzword}</span> 🚀
            </p>
            <p className="text-[8px] text-discord-text-muted opacity-50">v3.0</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-2 md:p-4">

          {/* Desktop: Two Column, Mobile: Single Column */}
          <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-2 md:gap-3 md:h-full overflow-hidden">

              {/* Big Money Display - Mobile Only */}
              <div className="md:hidden bg-discord-bg-secondary rounded-lg p-3 border-l-4 border-discord-green">
                <div className="text-xs text-discord-text-muted uppercase tracking-wide mb-1">Total Money</div>
                <div className="text-3xl font-black text-discord-green">${gameState.money.toFixed(0)}</div>
                <div className="text-xs text-discord-text-muted mt-1">
                  💸 +${gameState.autoMoney}/sec | 👆 ${gameState.clickPower}/click
                </div>
              </div>

              {/* Stats Grid - 2x4 on mobile, 2x2 on desktop */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-1.5 md:gap-2">
                {/* Money */}
                <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-2.5 border-l-4 border-discord-green">
                  <div className="text-base md:text-lg mb-0.5">💰</div>
                  <div className="text-[9px] md:text-[10px] text-discord-text-muted font-medium uppercase tracking-wide">Money</div>
                  <div className="text-sm md:text-lg font-bold text-white">${gameState.money.toFixed(0)}</div>
                </div>

                {/* Synergy */}
                <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-2.5 border-l-4 border-discord-fuchsia">
                  <div className="text-base md:text-lg mb-0.5">🔥</div>
                  <div className="text-[9px] md:text-[10px] text-discord-text-muted font-medium uppercase tracking-wide">Synergy</div>
                  <div className="text-sm md:text-lg font-bold text-white">{gameState.synergy.toFixed(0)}%</div>
                </div>

                {/* Electrolytes */}
                <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-2.5 border-l-4 border-discord-yellow">
                  <div className="text-base md:text-lg mb-0.5">⚡</div>
                  <div className="text-[9px] md:text-[10px] text-discord-text-muted font-medium uppercase tracking-wide">Electrolytes</div>
                  <div className="text-sm md:text-lg font-bold text-white">{gameState.electrolytes.toFixed(0)}%</div>
                </div>

                {/* Employees */}
                <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-2.5 border-l-4 border-discord-blurple">
                  <div className="text-base md:text-lg mb-0.5">👔</div>
                  <div className="text-[9px] md:text-[10px] text-discord-text-muted font-medium uppercase tracking-wide">Employees</div>
                  <div className="text-sm md:text-lg font-bold text-white">{gameState.employees}</div>
                </div>
              </div>

              {/* Income Display - Desktop Only */}
              <div className="hidden md:flex bg-discord-bg-secondary rounded-lg p-2">
                <div className="flex justify-between items-center text-xs w-full">
                  <div className="flex items-center gap-1.5">
                    <span className="text-discord-green">💸</span>
                    <span className="text-discord-text-normal font-semibold">
                      +${gameState.autoMoney}/sec
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-discord-yellow">👆</span>
                    <span className="text-discord-text-normal font-semibold">
                      ${gameState.clickPower}/click
                    </span>
                  </div>
                </div>
              </div>

              {/* Upgrades */}
              <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-3 flex-1 flex flex-col overflow-hidden">
                <h2 className="text-sm md:text-base font-bold text-white mb-1.5 md:mb-2 flex items-center gap-1.5">
                  <span>🛒</span>
                  <span>Upgrades ({availableUpgrades.length})</span>
                </h2>
                <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-discord-border scrollbar-track-transparent">
                  {availableUpgrades.length === 0 ? (
                    <p className="text-center text-discord-text-muted text-xs py-4">
                      You bought everything! 🎉
                    </p>
                  ) : (
                    availableUpgrades.map((upgrade) => {
                      const purchaseCount = gameState.upgradeCount[upgrade.id] || 0
                      const cost = getUpgradeCost(upgrade, purchaseCount)
                      const canAfford = gameState.money >= cost

                      return (
                        <button
                          key={upgrade.id}
                          onClick={() => buyUpgrade(upgrade.id)}
                          disabled={!canAfford}
                          className={`w-full text-left p-2 rounded-lg transition-all ${
                            canAfford
                              ? 'bg-discord-green hover:bg-green-600 active:scale-98 cursor-pointer'
                              : 'bg-discord-bg-tertiary cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-0.5">
                            <div className="font-bold text-white text-xs flex items-center gap-1">
                              <span>{upgrade.icon}</span>
                              <span>{upgrade.name}</span>
                            </div>
                            <div className="text-white font-semibold text-xs">${cost}</div>
                          </div>
                          <div className="text-[10px] text-discord-text-muted">{upgrade.description}</div>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-2 md:gap-3 md:h-full">

              {/* Clicker Button */}
              <div className="bg-discord-bg-secondary rounded-lg p-3 md:p-4 flex items-center justify-center flex-shrink-0">
                <button
                  onClick={handleClick}
                  className="bg-gradient-to-br from-discord-blurple to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full w-40 h-40 md:w-44 md:h-44 shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center"
                >
                  <div className="text-6xl md:text-7xl mb-1">💵</div>
                  <div className="text-white font-bold text-sm md:text-base">CLICK ME!</div>
                  <div className="text-discord-yellow font-semibold text-xs">+${gameState.clickPower}</div>
                </button>
              </div>

              {/* Achievements */}
              <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-3 flex-1 overflow-hidden flex flex-col">
                <h2 className="text-sm md:text-base font-bold text-white mb-1.5 md:mb-2 flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>Achievements ({gameState.unlockedAchievements.length}/{ACHIEVEMENTS.filter(a => !a.hidden).length})</span>
                </h2>
                <div className="bg-discord-bg-tertiary rounded-lg p-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-discord-border scrollbar-track-transparent">
                  {gameState.unlockedAchievements.length === 0 ? (
                    <p className="text-center text-discord-text-muted text-xs">
                      None yet! Keep clicking!
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {gameState.unlockedAchievements.slice(-10).map((achId, i) => {
                        const ach = ACHIEVEMENTS.find(a => a.id === achId)
                        return ach ? (
                          <span
                            key={i}
                            className="bg-discord-yellow text-gray-900 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase"
                            title={ach.description}
                          >
                            {ach.icon} {ach.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Display - Desktop Only */}
              <div className="hidden md:block bg-discord-bg-secondary rounded-lg p-3">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                  <span>📊</span>
                  <span>Stats</span>
                </h3>
                <div className="bg-discord-bg-tertiary rounded-lg p-2">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-discord-text-muted">Legal Liability:</span>
                      <span className="text-white font-bold ml-1">{gameState.legalLiability}</span>
                    </div>
                    <div>
                      <span className="text-discord-text-muted">Buzzword Lvl:</span>
                      <span className="text-white font-bold ml-1">{gameState.buzzwordLevel}</span>
                    </div>
                    <div>
                      <span className="text-discord-text-muted">Total Clicks:</span>
                      <span className="text-white font-bold ml-1">{gameState.totalClicks}</span>
                    </div>
                    <div>
                      <span className="text-discord-text-muted">Lifetime $:</span>
                      <span className="text-white font-bold ml-1">${gameState.lifetimeEarnings.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CorpClicker = memo(CorpClickerInner)
