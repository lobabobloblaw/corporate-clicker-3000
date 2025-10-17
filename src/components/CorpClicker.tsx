/**
 * Corporate Clicker 3000™ v4.0 REALITY.EXE
 * Now with reality-breaking mechanics!
 */

import { useState, useEffect, useCallback, memo } from 'react'
import { useDiscordSdk } from '@hooks/useDiscordSdk'
import type { GameState } from '../types/game'
import { UPGRADES, getAvailableUpgrades, getUpgradeCost } from '../data/upgrades'
import { getRandomEvent } from '../data/events'
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements'
import {
  canAscend,
  getNextTier,
  getCurrentTier,
  getActiveSynergies,
  getSynergyMultipliers,
  shouldTriggerGlitch,
  getRandomGlitch
} from '../data/ascension'

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
    purchasedBPUpgrades: [],
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

    // Ascension system
    ascensionTier: 0,
    totalAscensions: 0,
    temporalFlux: 0,
    realityStability: 100,

    // Meta mechanics
    glitchMeter: 0,
    activeGlitches: [],
    secretsUnlocked: [],
    maxMoneyThisRun: 0,
    recentGlitchCount: 0,

    // Stats tracking
    totalClicks: 0,
    lifetimeClicks: 0,
    startTime: Date.now(),
    lastClickTime: Date.now(),
    clickCombo: 0
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
        // Apply synergy multipliers
        const multipliers = getSynergyMultipliers(prev.purchasedUpgrades)

        // Electrolytes affect production: 100% = full power, 0% = 50% power
        const electrolytePenalty = 0.5 + (prev.electrolytes / 100) * 0.5
        const effectiveAutoMoney = prev.autoMoney * multipliers.autoMoneyMultiplier * electrolytePenalty

        const newMoney = prev.money + effectiveAutoMoney
        const newMaxMoney = Math.max(prev.maxMoneyThisRun, newMoney)

        // Energy drinks slow electrolyte drain by 50%
        const electrolyteDrain = prev.purchasedUpgrades.includes('energy_drinks') ? 0.25 : 0.5

        return {
          ...prev,
          money: newMoney,
          lifetimeEarnings: Math.max(prev.lifetimeEarnings, newMoney),
          maxMoneyThisRun: newMaxMoney,
          synergy: Math.min(100, prev.synergy + prev.employees * 0.1),
          electrolytes: Math.max(0, prev.electrolytes - electrolyteDrain),
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
      setGameState(prev => {
        const { newAchievements, updatedUnlocked } = checkAchievements(
          prev,
          prev.unlockedAchievements
        )

        if (newAchievements.length > 0) {
          // Show toast for each new achievement
          newAchievements.forEach(ach => {
            setToastMessage(`🏆 Achievement: ${ach.name}`)
            setShowToast(true)
            setTimeout(() => setShowToast(false), 3500)
          })

          return {
            ...prev,
            unlockedAchievements: updatedUnlocked
          }
        }

        return prev
      })
    }, 2000) // Check every 2 seconds
    return () => clearInterval(achievementInterval)
  }, [])

  // ============================================
  // GLITCH FARMING SYSTEM
  // ============================================
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGameState(prev => {
        if (shouldTriggerGlitch(prev)) {
          const glitch = getRandomGlitch()
          if (glitch) {
            showToastNotification(`⚡ GLITCH: ${glitch.name}`)

            // Apply glitch effects with diminishing returns
            const rawGlitchEffects = glitch.gameEffect(prev)

            // Diminishing returns: Each recent glitch reduces money multipliers by 20%
            const diminishingFactor = Math.pow(0.8, prev.recentGlitchCount)
            const glitchEffects = { ...rawGlitchEffects }

            // Apply diminishing returns to money gains
            if (glitchEffects.money !== undefined && glitchEffects.money > prev.money) {
              const moneyGain = glitchEffects.money - prev.money
              glitchEffects.money = prev.money + (moneyGain * diminishingFactor)
            }

            return {
              ...prev,
              ...glitchEffects,
              activeGlitches: [...prev.activeGlitches, glitch.id],
              realityStability: Math.max(0, prev.realityStability - 5),
              recentGlitchCount: prev.recentGlitchCount + 1
            }
          }
        }

        // Decay glitch meter slowly and decay recent glitch count
        return {
          ...prev,
          glitchMeter: Math.max(0, prev.glitchMeter - 0.5),
          realityStability: Math.min(100, prev.realityStability + 0.1),
          recentGlitchCount: Math.max(0, prev.recentGlitchCount - 0.016) // Decays fully in 60 seconds
        }
      })
    }, 1000)
    return () => clearInterval(glitchInterval)
  }, [])

  // ============================================
  // SYNERGY SYSTEM - Notify when unlocked
  // ============================================
  useEffect(() => {
    const activeSynergies = getActiveSynergies(gameState.purchasedUpgrades)
    activeSynergies.forEach(synergy => {
      if (!gameState.secretsUnlocked.includes(synergy.id)) {
        showToastNotification(`💥 SYNERGY UNLOCKED: ${synergy.name}`)
        setGameState(prev => ({
          ...prev,
          secretsUnlocked: [...prev.secretsUnlocked, synergy.id]
        }))
      }
    })
  }, [gameState.purchasedUpgrades])

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
      const now = Date.now()
      const timeSinceLastClick = now - prev.lastClickTime

      // Calculate click combo (reset if > 500ms between clicks)
      const newCombo = timeSinceLastClick < 500 ? prev.clickCombo + 1 : 1

      // Fast clicking fills glitch meter
      const glitchGain = timeSinceLastClick < 200 ? 2 : timeSinceLastClick < 500 ? 1 : 0
      const newGlitchMeter = Math.min(100, prev.glitchMeter + glitchGain)

      // Apply synergy multipliers
      const multipliers = getSynergyMultipliers(prev.purchasedUpgrades)

      // Combo multiplier: 10+ combo = 2x, 25+ combo = 5x, 50+ combo = 10x
      let comboMultiplier = 1
      if (newCombo >= 50) comboMultiplier = 10
      else if (newCombo >= 25) comboMultiplier = 5
      else if (newCombo >= 10) comboMultiplier = 2

      const effectiveClickPower = prev.clickPower * multipliers.clickPowerMultiplier * comboMultiplier

      const newMoney = prev.money + effectiveClickPower
      const newMaxMoney = Math.max(prev.maxMoneyThisRun, newMoney)

      return {
        ...prev,
        money: newMoney,
        lifetimeEarnings: Math.max(prev.lifetimeEarnings, newMoney),
        maxMoneyThisRun: newMaxMoney,
        synergy: Math.min(100, prev.synergy + 1),
        totalClicks: prev.totalClicks + 1,
        lifetimeClicks: prev.lifetimeClicks + 1,
        lastClickTime: now,
        clickCombo: newCombo,
        glitchMeter: newGlitchMeter,
        temporalFlux: prev.temporalFlux + multipliers.temporalFluxGain
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

  // ============================================
  // ASCENSION HANDLER
  // ============================================
  const handleAscend = useCallback(() => {
    if (!canAscend(gameState)) return

    const nextTier = getNextTier(gameState.ascensionTier)
    if (!nextTier) return

    showToastNotification(`⚡ ASCENDING TO ${nextTier.name}!`)

    setGameState(prev => ({
      // Reset resources
      money: 0,
      clickPower: 1,
      autoMoney: 0,
      synergy: 0,
      electrolytes: 100,
      employees: 0,
      buzzwordLevel: 1,
      stockPrice: 1.0,
      legalLiability: 0,
      caffeine: 0,
      meetingTime: 0,

      // Clear upgrades
      purchasedUpgrades: [],
      upgradeCount: {},

      // Preserve prestige stats
      buzzwordPoints: prev.buzzwordPoints + nextTier.buzzwordReward,
      purchasedBPUpgrades: prev.purchasedBPUpgrades, // Permanent upgrades persist
      lifetimeEarnings: prev.lifetimeEarnings,
      bankruptcyCount: prev.bankruptcyCount + 1,
      unlockedAchievements: prev.unlockedAchievements,
      lifetimeClicks: prev.lifetimeClicks,

      // Update ascension
      ascensionTier: prev.ascensionTier + 1,
      totalAscensions: prev.totalAscensions + 1,

      // Reset meta mechanics
      glitchMeter: 0,
      activeGlitches: [],
      maxMoneyThisRun: 0,
      recentGlitchCount: 0,
      temporalFlux: prev.temporalFlux, // Keep temporal flux
      realityStability: 50, // Lower stability in higher tiers

      // Keep secrets
      secretsUnlocked: prev.secretsUnlocked,
      activeEffects: [],

      // Reset tracking
      totalClicks: 0,
      startTime: Date.now(),
      lastClickTime: Date.now(),
      clickCombo: 0
    }))
  }, [gameState])

  // Get available upgrades
  const availableUpgrades = getAvailableUpgrades({
    money: gameState.money,
    employees: gameState.employees,
    buzzwordLevel: gameState.buzzwordLevel,
    bankruptcyCount: gameState.bankruptcyCount,
    unlockedAchievements: gameState.unlockedAchievements,
    purchasedUpgrades: gameState.purchasedUpgrades
  })

  // Get ascension data
  const currentTier = getCurrentTier(gameState.ascensionTier)
  const nextTier = getNextTier(gameState.ascensionTier)
  const canAscendNow = canAscend(gameState)
  const activeSynergies = getActiveSynergies(gameState.purchasedUpgrades)
  const synergyMultipliers = getSynergyMultipliers(gameState.purchasedUpgrades)

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={`min-h-screen md:h-screen md:max-h-screen bg-discord-bg-primary text-discord-text-normal font-sans md:overflow-hidden flex flex-col touch-action-manipulation reality-${gameState.ascensionTier}`}>

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
            <p className="text-[10px] md:text-sm text-discord-text-muted">
              <span className="text-discord-yellow font-bold hidden sm:inline">{currentBuzzword}</span>
              {' '}
              <span className={`font-black ${
                gameState.ascensionTier === 0 ? 'text-gray-400' :
                gameState.ascensionTier === 1 ? 'text-blue-400' :
                gameState.ascensionTier === 2 ? 'text-purple-400' :
                gameState.ascensionTier === 3 ? 'text-yellow-400' :
                'text-red-500 animate-pulse'
              }`}>
                {currentTier.name}
              </span>
            </p>
            <p className="text-[8px] text-discord-text-muted opacity-50">v4.0 REALITY.EXE</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto md:overflow-hidden">
        <div className="md:h-full max-w-7xl mx-auto p-2 md:p-4 pb-20 md:pb-4">

          {/* Desktop: Two Column, Mobile: Single Column */}
          <div className="md:h-full grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-2 md:gap-3 md:h-full md:overflow-hidden">

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

              {/* Meta Mechanics Display */}
              {gameState.ascensionTier > 0 && (
                <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-2.5">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-discord-text-muted">⚡ Glitch:</span>
                      <div className="bg-discord-bg-tertiary rounded-full h-2 mt-0.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all"
                          style={{ width: `${gameState.glitchMeter}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-discord-text-muted">🌀 Temporal:</span>
                      <span className="text-white font-bold ml-1">{gameState.temporalFlux.toFixed(0)}</span>
                    </div>
                    <div>
                      <span className="text-discord-text-muted">💥 Combo:</span>
                      <span className="text-white font-bold ml-1">x{gameState.clickCombo}</span>
                    </div>
                    <div>
                      <span className="text-discord-text-muted">🎯 Reality:</span>
                      <span className="text-white font-bold ml-1">{gameState.realityStability.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Active Synergies */}
              {activeSynergies.length > 0 && (
                <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-2">
                  <div className="text-[10px] font-bold text-white mb-1 flex items-center gap-1">
                    <span>💥</span>
                    <span>ACTIVE SYNERGIES ({activeSynergies.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeSynergies.map(syn => (
                      <span
                        key={syn.id}
                        className="bg-white bg-opacity-20 text-white text-[9px] px-1.5 py-0.5 rounded font-bold"
                        title={syn.description}
                      >
                        {syn.icon} {syn.name}
                      </span>
                    ))}
                  </div>
                  <div className="text-[9px] text-yellow-200 mt-1">
                    💰×{synergyMultipliers.moneyMultiplier.toFixed(1)} |
                    👆×{synergyMultipliers.clickPowerMultiplier.toFixed(1)} |
                    💸×{synergyMultipliers.autoMoneyMultiplier.toFixed(1)}
                  </div>
                </div>
              )}

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

              {/* Ascend Button */}
              {nextTier && (
                <button
                  onClick={handleAscend}
                  disabled={!canAscendNow}
                  className={`w-full rounded-lg p-3 transition-all ${
                    canAscendNow
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 animate-pulse cursor-pointer'
                      : 'bg-discord-bg-tertiary opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-white font-black text-sm">
                      ASCEND TO {nextTier.name}
                    </div>
                    <div className="text-[10px] text-discord-text-muted mt-1">
                      Cost: ${(nextTier.cost / 1000000).toFixed(0)}M | Reward: {nextTier.buzzwordReward} BP
                    </div>
                    {!canAscendNow && (
                      <div className="text-[10px] text-red-400 mt-1">
                        Need ${((nextTier.cost - gameState.money) / 1000000).toFixed(1)}M more
                      </div>
                    )}
                  </div>
                </button>
              )}

              {/* Upgrades */}
              <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-3 md:flex-1 flex flex-col md:overflow-hidden">
                <h2 className="text-sm md:text-base font-bold text-white mb-1.5 md:mb-2 flex items-center gap-1.5">
                  <span>🛒</span>
                  <span>Upgrades ({availableUpgrades.length})</span>
                </h2>
                <div className="space-y-1.5 md:overflow-y-auto pr-1 md:flex-1 scrollbar-thin scrollbar-thumb-discord-border scrollbar-track-transparent">
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
              <div className="bg-discord-bg-secondary rounded-lg p-2 md:p-3 md:flex-1 md:overflow-hidden flex flex-col">
                <h2 className="text-sm md:text-base font-bold text-white mb-1.5 md:mb-2 flex items-center gap-1.5">
                  <span>🏆</span>
                  <span>Achievements ({gameState.unlockedAchievements.length}/{ACHIEVEMENTS.filter(a => !a.hidden).length})</span>
                </h2>
                <div className="bg-discord-bg-tertiary rounded-lg p-2 md:flex-1 md:overflow-y-auto scrollbar-thin scrollbar-thumb-discord-border scrollbar-track-transparent min-h-[200px]">
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
