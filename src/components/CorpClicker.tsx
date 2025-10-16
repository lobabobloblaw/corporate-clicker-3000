/**
 * Corporate Clicker 3000™
 * A satirical idle clicker game for Discord Activities
 * Redesigned for Discord's UI/UX patterns
 */

import { useState, useEffect, useCallback, memo } from 'react'
import { useDiscordSdk } from '@hooks/useDiscordSdk'

interface Upgrade {
  name: string
  cost: number
  effect: () => void
  desc: string
}

function CorpClickerInner() {
  const { auth } = useDiscordSdk()
  const [money, setMoney] = useState(0)
  const [clickPower, setClickPower] = useState(1)
  const [synergy, setSynergy] = useState(0)
  const [electrolytes, setElectrolytes] = useState(100)
  const [employees, setEmployees] = useState(0)
  const [buzzwordLevel, setBuzzwordLevel] = useState(1)
  const [showPopup, setShowPopup] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [achievements, setAchievements] = useState<string[]>([])
  const [autoMoney, setAutoMoney] = useState(0)

  const buzzwords = ['PIVOTING', 'DISRUPTING', 'LEVERAGING', 'OPTIMIZING', 'MONETIZING', 'SYNERGIZING']
  const [currentBuzzword, setCurrentBuzzword] = useState(buzzwords[0])

  // Auto money generation
  useEffect(() => {
    const interval = setInterval(() => {
      setMoney(prev => prev + autoMoney)
      setSynergy(prev => Math.min(100, prev + employees * 0.1))
      setElectrolytes(prev => Math.max(0, prev - 0.5))
    }, 1000)
    return () => clearInterval(interval)
  }, [autoMoney, employees])

  // Random events (now as toast notifications)
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const events = [
          { text: '🎉 CEO took a nap! Productivity +1000%', effect: () => setMoney(m => m + 500) },
          { text: '☢️ Nuclear launch detected (false alarm)', effect: () => {} },
          { text: '🍔 Free burger day! Morale boosted', effect: () => setSynergy(100) },
          { text: '⚡ Electrolyte shortage! Buy more Brawndo', effect: () => setElectrolytes(20) },
          { text: '📈 Stock market went up (or down idk)', effect: () => setMoney(m => m + Math.random() * 1000) },
          { text: '🤖 AI became sentient! Wants a raise', effect: () => setMoney(m => Math.max(0, m - 100)) }
        ]
        const event = events[Math.floor(Math.random() * events.length)]
        if (event) {
          showToastNotification(event.text)
          event.effect()
        }
      }
    }, 5000)
    return () => clearInterval(eventInterval)
  }, [])

  // Popup ads (less frequent)
  useEffect(() => {
    const popupInterval = setInterval(() => {
      if (Math.random() > 0.97) setShowPopup(true)
    }, 15000)
    return () => clearInterval(popupInterval)
  }, [])

  // Buzzword rotation
  useEffect(() => {
    const buzzInterval = setInterval(() => {
      setCurrentBuzzword(buzzwords[Math.floor(Math.random() * buzzwords.length)])
    }, 2000)
    return () => clearInterval(buzzInterval)
  }, [])

  // Toast notification helper
  const showToastNotification = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3500)
  }, [])

  const checkAchievement = useCallback((id: string, name: string, condition: boolean) => {
    if (condition && !achievements.includes(id)) {
      setAchievements(prev => [...prev, id])
      showToastNotification(`🏆 Achievement: ${name}`)
    }
  }, [achievements, showToastNotification])

  const handleClick = useCallback(() => {
    setMoney(prev => prev + clickPower)
    setSynergy(prev => Math.min(100, prev + 1))
    checkAchievement('first_click', 'First Click!', money === 0)
    checkAchievement('rich', 'Kinda Rich', money > 10000)
  }, [clickPower, money, checkAchievement])

  const upgrades: Upgrade[] = [
    {
      name: 'Better Fingers',
      cost: 50,
      effect: () => setClickPower(clickPower + 1),
      desc: '+1 per click'
    },
    {
      name: 'Hire Intern',
      cost: 100,
      effect: () => { setEmployees(employees + 1); setAutoMoney(autoMoney + 1) },
      desc: '+1 money/sec'
    },
    {
      name: 'Buy Synergy',
      cost: 200,
      effect: () => { setBuzzwordLevel(buzzwordLevel + 1); setClickPower(clickPower + 5) },
      desc: '+5 click power'
    },
    {
      name: 'More Electrolytes',
      cost: 150,
      effect: () => setElectrolytes(100),
      desc: 'Refill to 100%'
    },
    {
      name: 'Hire CEO',
      cost: 1000,
      effect: () => setAutoMoney(autoMoney + 50),
      desc: '+50 money/sec (does nothing)'
    },
    {
      name: 'BLOCKCHAIN',
      cost: 5000,
      effect: () => {
        setMoney(money + 10000)
        checkAchievement('blockchain', 'Blockchain Master', true)
      },
      desc: 'Instant +10k 🚀'
    }
  ]

  const buyUpgrade = useCallback((upgrade: Upgrade) => {
    if (money >= upgrade.cost) {
      setMoney(prev => prev - upgrade.cost)
      upgrade.effect()
    }
  }, [money])

  return (
    <div className="min-h-screen bg-discord-bg-primary text-discord-text-normal font-sans">

      {/* Toast Notification - Top Right */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-up max-w-xs">
          <div className="bg-discord-bg-secondary border-l-4 border-discord-blurple rounded-lg shadow-lg p-3">
            <p className="text-sm font-medium text-discord-text-normal">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Popup Ad - Bottom Sheet Style on Mobile, Modal on Desktop */}
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
                setMoney(money + 100)
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

      <div className="max-w-7xl mx-auto p-4 md:p-6">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2">
            CORPORATE CLICKER 3000™
          </h1>
          {auth.user && (
            <p className="text-base md:text-lg text-discord-green font-semibold flex items-center justify-center gap-2">
              <span className="text-2xl">👑</span>
              CEO: {auth.user.username}
            </p>
          )}
          <p className="text-sm md:text-base text-discord-text-muted mt-1">
            Now <span className="text-discord-yellow font-bold">{currentBuzzword}</span> your business! 🚀
          </p>
        </div>

        {/* Desktop: Two Column, Mobile: Single Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

          {/* LEFT COLUMN - Stats, Income, Upgrades */}
          <div className="space-y-4">

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 gap-3">
              {/* Money */}
              <div className="bg-discord-bg-secondary rounded-discord-lg p-4 border-l-4 border-discord-green shadow-md">
                <div className="text-2xl mb-1">💰</div>
                <div className="text-xs text-discord-text-muted font-medium uppercase tracking-wide">Money</div>
                <div className="text-2xl font-bold text-white">${money.toFixed(0)}</div>
              </div>

              {/* Synergy */}
              <div className="bg-discord-bg-secondary rounded-discord-lg p-4 border-l-4 border-discord-fuchsia shadow-md">
                <div className="text-2xl mb-1">🔥</div>
                <div className="text-xs text-discord-text-muted font-medium uppercase tracking-wide">Synergy</div>
                <div className="text-2xl font-bold text-white">{synergy.toFixed(0)}%</div>
              </div>

              {/* Electrolytes */}
              <div className="bg-discord-bg-secondary rounded-discord-lg p-4 border-l-4 border-discord-yellow shadow-md">
                <div className="text-2xl mb-1">⚡</div>
                <div className="text-xs text-discord-text-muted font-medium uppercase tracking-wide">Electrolytes</div>
                <div className="text-2xl font-bold text-white">{electrolytes.toFixed(0)}%</div>
              </div>

              {/* Employees */}
              <div className="bg-discord-bg-secondary rounded-discord-lg p-4 border-l-4 border-discord-blurple shadow-md">
                <div className="text-2xl mb-1">👔</div>
                <div className="text-xs text-discord-text-muted font-medium uppercase tracking-wide">Employees</div>
                <div className="text-2xl font-bold text-white">{employees}</div>
              </div>
            </div>

            {/* Income Display */}
            <div className="bg-discord-bg-secondary rounded-discord-lg p-4 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-discord-green text-lg">💸</span>
                  <span className="text-discord-text-normal font-semibold">
                    +${autoMoney}/sec
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-discord-yellow text-lg">👆</span>
                  <span className="text-discord-text-normal font-semibold">
                    ${clickPower}/click
                  </span>
                </div>
              </div>
            </div>

            {/* Upgrades */}
            <div className="bg-discord-bg-secondary rounded-discord-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span>🛒</span>
                <span>Upgrades</span>
              </h2>
              <div className="space-y-2">
                {upgrades.map((upgrade, i) => (
                  <button
                    key={i}
                    onClick={() => buyUpgrade(upgrade)}
                    disabled={money < upgrade.cost}
                    className={`w-full text-left p-3 rounded-lg transition-all min-h-touch ${
                      money >= upgrade.cost
                        ? 'bg-discord-green hover:bg-green-600 active:scale-98 cursor-pointer shadow-sm'
                        : 'bg-discord-bg-tertiary cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-white text-sm">{upgrade.name}</div>
                      <div className="text-white font-semibold text-sm">${upgrade.cost}</div>
                    </div>
                    <div className="text-xs text-discord-text-muted">{upgrade.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Clicker, Achievements, Tips */}
          <div className="space-y-4">

            {/* Main Clicker Button */}
            <div className="bg-discord-bg-secondary rounded-discord-lg p-6 shadow-md flex items-center justify-center">
              <button
                onClick={handleClick}
                className="bg-gradient-to-br from-discord-blurple to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full w-48 h-48 md:w-56 md:h-56 shadow-2xl active:scale-95 transition-all flex flex-col items-center justify-center"
              >
                <div className="text-7xl md:text-8xl mb-2">💵</div>
                <div className="text-white font-bold text-lg">CLICK ME!</div>
                <div className="text-discord-yellow font-semibold text-sm">+${clickPower}</div>
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-discord-bg-secondary rounded-discord-lg p-4 shadow-md">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <span>🏆</span>
                <span>Achievements</span>
              </h2>
              <div className="bg-discord-bg-tertiary rounded-lg p-3 min-h-[80px]">
                {achievements.length === 0 ? (
                  <p className="text-center text-discord-text-muted text-sm">
                    None yet! Keep clicking!
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {achievements.map((ach, i) => (
                      <span
                        key={i}
                        className="bg-discord-yellow text-gray-900 font-bold px-3 py-1 rounded-full text-xs uppercase"
                      >
                        🏆 {ach}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-discord-bg-secondary rounded-discord-lg p-4 shadow-md">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>Pro Tips</span>
              </h3>
              <div className="bg-discord-bg-tertiary rounded-lg p-3">
                <ul className="text-sm space-y-2 text-discord-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="text-discord-green">✓</span>
                    <span>Click the big money button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-discord-green">✓</span>
                    <span>Buy upgrades to get more money</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-discord-green">✓</span>
                    <span>More money = more better</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-discord-green">✓</span>
                    <span>Keep electrolytes high or else</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-discord-green">✓</span>
                    <span>Close popup ads for free money</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Warning */}
        <div className="text-center mt-6 text-discord-text-muted text-xs">
          <p className="font-medium">
            ⚠️ Game balance: None | Fun level: Maximum | Sense: Zero ⚠️
          </p>
        </div>
      </div>
    </div>
  )
}

// Export memoized component for better performance
export const CorpClicker = memo(CorpClickerInner)
