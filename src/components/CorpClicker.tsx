/**
 * Corporate Clicker 3000™
 * A satirical idle clicker game for Discord Activities
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
  const [showEvent, setShowEvent] = useState(false)
  const [eventText, setEventText] = useState('')
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

  // Random events
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const events = [
          { text: '🎉 CEO TOOK A NAP! PRODUCTIVITY +1000%!', effect: () => setMoney(m => m + 500) },
          { text: '☢️ NUCLEAR LAUNCH DETECTED! (false alarm)', effect: () => {} },
          { text: '🍔 FREE BURGER DAY! MORALE BOOSTED!', effect: () => setSynergy(100) },
          { text: '⚡ ELECTROLYTE SHORTAGE! BUY MORE BRAWNDO!', effect: () => setElectrolytes(20) },
          { text: '📈 STOCK MARKET WENT UP! (or down idk)', effect: () => setMoney(m => m + Math.random() * 1000) },
          { text: '🤖 AI BECAME SENTIENT! IT WANTS A RAISE!', effect: () => setMoney(m => Math.max(0, m - 100)) }
        ]
        const event = events[Math.floor(Math.random() * events.length)]
        if (event) {
          setEventText(event.text)
          setShowEvent(true)
          event.effect()
          setTimeout(() => setShowEvent(false), 3000)
        }
      }
    }, 5000)
    return () => clearInterval(eventInterval)
  }, [])

  // Popup ads
  useEffect(() => {
    const popupInterval = setInterval(() => {
      if (Math.random() > 0.95) setShowPopup(true)
    }, 10000)
    return () => clearInterval(popupInterval)
  }, [])

  // Buzzword rotation
  useEffect(() => {
    const buzzInterval = setInterval(() => {
      setCurrentBuzzword(buzzwords[Math.floor(Math.random() * buzzwords.length)])
    }, 2000)
    return () => clearInterval(buzzInterval)
  }, [])

  const checkAchievement = useCallback((id: string, name: string, condition: boolean) => {
    if (condition && !achievements.includes(id)) {
      setAchievements(prev => [...prev, id])
      // Use a more Discord-friendly notification instead of alert
      setEventText(`🏆 ACHIEVEMENT UNLOCKED: ${name} 🏆`)
      setShowEvent(true)
      setTimeout(() => setShowEvent(false), 3000)
    }
  }, [achievements])

  const handleClick = useCallback(() => {
    setMoney(prev => prev + clickPower)
    setSynergy(prev => Math.min(100, prev + 1))
    checkAchievement('first_click', 'FIRST CLICK!', money === 0)
    checkAchievement('rich', 'KINDA RICH', money > 10000)
  }, [clickPower, money, checkAchievement])

  const upgrades: Upgrade[] = [
    {
      name: 'BETTER FINGERS',
      cost: 50,
      effect: () => setClickPower(clickPower + 1),
      desc: '+1 money per click'
    },
    {
      name: 'HIRE INTERN',
      cost: 100,
      effect: () => { setEmployees(employees + 1); setAutoMoney(autoMoney + 1) },
      desc: '+1 money/sec'
    },
    {
      name: 'BUY SYNERGY',
      cost: 200,
      effect: () => { setBuzzwordLevel(buzzwordLevel + 1); setClickPower(clickPower + 5) },
      desc: '+5 click power'
    },
    {
      name: 'MORE ELECTROLYTES',
      cost: 150,
      effect: () => setElectrolytes(100),
      desc: 'Refill to 100%'
    },
    {
      name: 'HIRE CEO',
      cost: 1000,
      effect: () => setAutoMoney(autoMoney + 50),
      desc: '+50 money/sec (does nothing)'
    },
    {
      name: 'BLOCKCHAIN',
      cost: 5000,
      effect: () => {
        setMoney(money + 10000)
        checkAchievement('blockchain', 'BLOCKCHAIN MASTER', true)
      },
      desc: 'Instant +10000 money'
    }
  ]

  const buyUpgrade = useCallback((upgrade: Upgrade) => {
    if (money >= upgrade.cost) {
      setMoney(prev => prev - upgrade.cost)
      upgrade.effect()
    }
  }, [money])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-4 sm:p-8 font-mono overflow-y-auto relative">

      {/* Random Event Banner */}
      {showEvent && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce max-w-xs sm:max-w-2xl">
          <div className="bg-red-500 border-4 sm:border-8 border-yellow-400 p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl">
            <p className="text-lg sm:text-4xl font-black text-white text-center">
              {eventText}
            </p>
          </div>
        </div>
      )}

      {/* Popup Ad */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-yellow-400 to-red-500 p-6 sm:p-12 rounded-3xl border-4 sm:border-8 border-green-500 max-w-sm sm:max-w-2xl relative transform rotate-3 shadow-2xl animate-pulse">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 bg-red-600 text-white min-w-touch min-h-touch rounded-full font-black text-xl sm:text-2xl hover:bg-red-800 active:bg-red-900 flex items-center justify-center"
            >
              X
            </button>
            <h2 className="text-3xl sm:text-6xl font-black text-white mb-4 sm:mb-6">
              🎉 CLICK HERE TO WIN!!! 🎉
            </h2>
            <p className="text-xl sm:text-3xl font-bold text-white mb-4">
              YOU'VE WON A FREE PROMOTION!!!
            </p>
            <button
              onClick={() => {
                setMoney(money + 100)
                setShowPopup(false)
              }}
              className="bg-green-500 text-white font-black text-xl sm:text-3xl py-3 sm:py-4 px-6 sm:px-8 rounded-full border-4 border-white w-full min-h-touch active:bg-green-600"
            >
              CLAIM +100 MONEY!!! 💰
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header with Discord user */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-4xl sm:text-7xl font-black text-white drop-shadow-2xl mb-2 animate-pulse">
            CORPORATE CLICKER 3000™
          </h1>
          {auth.user && (
            <p className="text-lg sm:text-xl text-yellow-300 font-bold mb-2">
              CEO: {auth.user.username} 👑
            </p>
          )}
          <p className="text-xl sm:text-2xl text-yellow-300 font-bold">
            CLICK TO MAKE MONEY! IT'S THAT EASY!!!
          </p>
          <p className="text-lg sm:text-xl text-white mt-2 animate-bounce">
            NOW {currentBuzzword} YOUR BUSINESS! 🚀
          </p>
        </div>

        {/* Stats Dashboard - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-green-500 p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-xl">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">💰</div>
            <div className="text-xs sm:text-sm font-bold text-white">MONEY</div>
            <div className="text-xl sm:text-3xl font-black text-white">${money.toFixed(0)}</div>
          </div>
          <div className="bg-purple-500 p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-xl">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">🔥</div>
            <div className="text-xs sm:text-sm font-bold text-white">SYNERGY</div>
            <div className="text-xl sm:text-3xl font-black text-white">{synergy.toFixed(0)}%</div>
          </div>
          <div className="bg-yellow-500 p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-xl">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">⚡</div>
            <div className="text-xs sm:text-sm font-bold text-white">ELECTROLYTES</div>
            <div className="text-xl sm:text-3xl font-black text-white">{electrolytes.toFixed(0)}%</div>
          </div>
          <div className="bg-blue-500 p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white shadow-xl">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">👔</div>
            <div className="text-xs sm:text-sm font-bold text-white">EMPLOYEES</div>
            <div className="text-xl sm:text-3xl font-black text-white">{employees}</div>
          </div>
        </div>

        {/* Main Clicker - Mobile Friendly Touch Target */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <button
            onClick={handleClick}
            className="bg-gradient-to-r from-pink-500 to-purple-600 border-4 sm:border-8 border-yellow-400 rounded-full w-48 h-48 sm:w-64 sm:h-64 shadow-2xl active:scale-95 transition-all touch-target"
          >
            <div className="text-7xl sm:text-9xl animate-bounce">💵</div>
            <div className="text-white font-black text-xl sm:text-2xl mt-2 sm:mt-4">CLICK ME!!!</div>
            <div className="text-yellow-300 font-bold text-lg sm:text-xl">+${clickPower}/click</div>
          </button>
        </div>

        {/* Income Display */}
        <div className="bg-black border-2 sm:border-4 border-green-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl">
          <div className="text-center flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
            <span className="text-green-400 font-black text-lg sm:text-2xl">
              💸 MAKING: ${autoMoney}/sec
            </span>
            <span className="text-yellow-400 font-black text-lg sm:text-2xl">
              👆 CLICK POWER: ${clickPower}
            </span>
          </div>
        </div>

        {/* Upgrades - Mobile Optimized */}
        <div className="bg-blue-500 border-4 sm:border-8 border-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 sm:mb-4 text-center">
            🛒 UPGRADES (MAKE YOU BETTER) 🛒
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {upgrades.map((upgrade, i) => (
              <button
                key={i}
                onClick={() => buyUpgrade(upgrade)}
                disabled={money < upgrade.cost}
                className={`${money >= upgrade.cost ? 'bg-green-600 active:bg-green-700' : 'bg-gray-600'}
                  p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white active:scale-95 transition-all min-h-touch`}
              >
                <div className="text-white font-black text-lg sm:text-xl mb-2">{upgrade.name}</div>
                <div className="text-yellow-300 font-bold text-sm mb-2">{upgrade.desc}</div>
                <div className="text-white font-bold text-base sm:text-lg">💰 ${upgrade.cost}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-purple-600 border-4 sm:border-8 border-pink-400 p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4 text-center">
            🏆 ACHIEVEMENTS 🏆
          </h2>
          <div className="bg-white p-3 sm:p-4 rounded-xl">
            {achievements.length === 0 ? (
              <p className="text-center font-bold text-gray-600 text-sm sm:text-base">NONE YET! KEEP CLICKING!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {achievements.map((ach, i) => (
                  <span key={i} className="bg-yellow-400 text-purple-900 font-black px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base">
                    🏆 {ach.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Game Tips */}
        <div className="bg-red-500 border-4 sm:border-8 border-yellow-400 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl mb-4">
          <h3 className="text-2xl sm:text-3xl font-black text-white text-center mb-3 sm:mb-4">
            💡 PRO TIPS (VERY HELPFUL) 💡
          </h3>
          <div className="bg-white p-3 sm:p-4 rounded-xl">
            <ul className="text-sm sm:text-xl font-bold space-y-1 sm:space-y-2">
              <li>✅ CLICK THE BIG MONEY BUTTON</li>
              <li>✅ BUY UPGRADES TO GET MORE MONEY</li>
              <li>✅ MORE MONEY = MORE BETTER</li>
              <li>✅ KEEP ELECTROLYTES HIGH OR ELSE</li>
              <li>✅ CLOSE THE POPUP ADS FOR FREE MONEY</li>
              <li>✅ SYNERGY IS IMPORTANT (MAYBE)</li>
            </ul>
          </div>
        </div>

        {/* Warning */}
        <div className="text-center text-white pb-4">
          <p className="font-black text-sm sm:text-xl animate-pulse">
            ⚠️ GAME BALANCE: NONE | FUN LEVEL: MAXIMUM | SENSE: ZERO ⚠️
          </p>
        </div>
      </div>
    </div>
  )
}

// Export memoized component for better performance
export const CorpClicker = memo(CorpClickerInner)
