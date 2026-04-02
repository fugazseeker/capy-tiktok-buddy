import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const DECAY_RATE = 100 / (24 * 60 * 60 * 1000) // lose 100% over 24 hours
const FEED_BOOST = 25 // each link restores 25%
const STORAGE_KEY = 'capy-state'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function getCapyMood(health) {
  if (health <= 0) return 'dead'
  if (health < 20) return 'dying'
  if (health < 40) return 'sad'
  if (health < 60) return 'worried'
  if (health < 80) return 'content'
  return 'happy'
}

function getMoodMessage(mood) {
  switch (mood) {
    case 'dead': return 'Capy has passed away... Adopt a new one to try again'
    case 'dying': return 'Capy is fading... Feed me a TikTok link!'
    case 'sad': return 'Capy is getting weak... Please post a video!'
    case 'worried': return 'Capy is a bit hungry for content...'
    case 'content': return 'Capy is doing okay! Keep posting!'
    case 'happy': return 'Capy is thriving! What a good capybara!'
    default: return ''
  }
}

function getHealthColor(health) {
  if (health > 60) return '#4ade80'
  if (health > 30) return '#facc15'
  return '#ef4444'
}

function Capybara({ health, isChewing, isAdamKill }) {
  const mood = getCapyMood(health)
  const isDead = health <= 0
  const bodyColor = isDead ? '#8b7d6b' : '#c4956a'
  const darkColor = isDead ? '#5c534a' : '#8b6914'
  const noseColor = isDead ? '#666' : '#6b4c3b'
  const bellyColor = isDead ? '#9e9484' : '#deb887'

  return (
    <motion.div className="capy-container">
      {/* Floating hearts when chewing */}
      <AnimatePresence>
        {isChewing && (
          <>
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={`heart-${i}`}
                className="floating-heart"
                initial={{ opacity: 1, y: 0, x: (i - 2) * 25 }}
                animate={{ opacity: 0, y: -100, x: (i - 2) * 35 + Math.sin(i) * 20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.15 }}
              >
                {['💚', '🌿', '💛', '✨', '🧡'][i]}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Adam kill effect */}
      <AnimatePresence>
        {isAdamKill && (
          <motion.div
            className="adam-kill"
            initial={{ opacity: 0, scale: 3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            💀 ADAM POSTED 💀
          </motion.div>
        )}
      </AnimatePresence>

      <motion.svg
        viewBox="0 0 240 220"
        className="capy-svg"
        animate={
          isChewing
            ? { rotate: [0, -4, 4, -4, 4, 0], scale: [1, 1.08, 1.04, 1.08, 1] }
            : mood === 'dying'
            ? { rotate: [0, -8, 8, -8, 0], y: [0, 3, 0] }
            : mood === 'dead'
            ? { rotate: 90, x: 20, y: 40 }
            : mood === 'sad'
            ? { y: [0, 2, 0] }
            : { y: [0, -6, 0] }
        }
        transition={
          isChewing
            ? { duration: 0.5, repeat: 4 }
            : mood === 'dying'
            ? { duration: 1.5, repeat: Infinity }
            : mood === 'dead'
            ? { duration: 0.8 }
            : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Body */}
        <ellipse cx="120" cy="145" rx="65" ry="50" fill={bodyColor} />
        {/* Belly */}
        <ellipse cx="120" cy="155" rx="40" ry="30" fill={bellyColor} opacity="0.5" />

        {/* Back legs */}
        <ellipse cx="75" cy="185" rx="18" ry="10" fill={noseColor} />
        <ellipse cx="165" cy="185" rx="18" ry="10" fill={noseColor} />

        {/* Front legs */}
        <ellipse cx="88" cy="190" rx="12" ry="8" fill={noseColor} />
        <ellipse cx="152" cy="190" rx="12" ry="8" fill={noseColor} />

        {/* Head */}
        <ellipse cx="120" cy="88" rx="48" ry="40" fill={bodyColor} />

        {/* Ears */}
        <ellipse cx="82" cy="55" rx="12" ry="8" fill={bodyColor} />
        <ellipse cx="158" cy="55" rx="12" ry="8" fill={bodyColor} />
        <ellipse cx="82" cy="55" rx="7" ry="5" fill="#e8b89d" />
        <ellipse cx="158" cy="55" rx="7" ry="5" fill="#e8b89d" />

        {/* Nose/snout bump */}
        <ellipse cx="120" cy="82" rx="24" ry="16" fill={noseColor} />

        {/* Nostrils */}
        <circle cx="112" cy="80" r="3" fill="#3d2b1f" />
        <circle cx="128" cy="80" r="3" fill="#3d2b1f" />

        {/* Eyes */}
        {mood === 'dead' ? (
          <>
            <text x="101" y="72" fontSize="14" fill="#3d2b1f" fontFamily="monospace" fontWeight="bold">x</text>
            <text x="133" y="72" fontSize="14" fill="#3d2b1f" fontFamily="monospace" fontWeight="bold">x</text>
          </>
        ) : mood === 'happy' || isChewing ? (
          <>
            {/* Happy squinty eyes */}
            <path d="M 96 63 Q 103 58 110 63" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 130 63 Q 137 58 144 63" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'dying' ? (
          <>
            {/* Swirly/dazed eyes */}
            <circle cx="103" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <circle cx="137" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <circle cx="103" cy="66" r="2" fill="#3d2b1f" />
            <circle cx="137" cy="66" r="2" fill="#3d2b1f" />
            {/* Tear drops */}
            <motion.ellipse
              cx="95" cy="78" rx="3" ry="5" fill="#87ceeb" opacity="0.7"
              animate={{ y: [0, 8, 0], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.ellipse
              cx="145" cy="78" rx="3" ry="5" fill="#87ceeb" opacity="0.7"
              animate={{ y: [0, 8, 0], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        ) : (
          <>
            {/* Normal round eyes */}
            <circle cx="103" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <circle cx="137" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <circle cx={mood === 'sad' ? '102' : '104'} cy={mood === 'sad' ? '68' : '66'} r="3.5" fill="#3d2b1f" />
            <circle cx={mood === 'sad' ? '136' : '138'} cy={mood === 'sad' ? '68' : '66'} r="3.5" fill="#3d2b1f" />
            {/* Eye shine */}
            <circle cx="105" cy="64" r="1.5" fill="white" />
            <circle cx="139" cy="64" r="1.5" fill="white" />
          </>
        )}

        {/* Mouth */}
        {isChewing ? (
          <motion.path
            d="M 112 98 Q 120 103 128 98"
            stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round"
            animate={{ d: ['M 112 98 Q 120 103 128 98', 'M 112 96 Q 120 100 128 96', 'M 112 98 Q 120 103 128 98'] }}
            transition={{ duration: 0.3, repeat: 8 }}
          />
        ) : mood === 'happy' || mood === 'content' ? (
          <path d="M 112 98 Q 120 106 128 98" stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : mood === 'dead' ? (
          <line x1="110" y1="100" x2="130" y2="100" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M 112 102 Q 120 96 128 102" stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Blush cheeks */}
        {(mood === 'happy' || mood === 'content' || isChewing) && (
          <>
            <circle cx="85" cy="90" r="10" fill="#f9a8d4" opacity="0.35" />
            <circle cx="155" cy="90" r="10" fill="#f9a8d4" opacity="0.35" />
          </>
        )}

        {/* Orange on head when healthy */}
        {health > 70 && !isDead && (
          <>
            <circle cx="120" cy="50" r="9" fill="#ff9f43" />
            <rect x="118" y="40" width="4" height="6" rx="2" fill="#2d6a4f" />
            <ellipse cx="125" cy="42" rx="4" ry="2" fill="#2d6a4f" transform="rotate(30 125 42)" />
          </>
        )}

        {/* Tail nub */}
        <circle cx="185" cy="140" r="7" fill={bodyColor} />

        {/* Whisker dots */}
        {!isDead && (
          <>
            <circle cx="90" cy="84" r="1.5" fill="#3d2b1f" opacity="0.3" />
            <circle cx="86" cy="88" r="1.5" fill="#3d2b1f" opacity="0.3" />
            <circle cx="150" cy="84" r="1.5" fill="#3d2b1f" opacity="0.3" />
            <circle cx="154" cy="88" r="1.5" fill="#3d2b1f" opacity="0.3" />
          </>
        )}

        {/* Ghost leaving body when dead */}
        {isDead && (
          <motion.g
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: -40 }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <ellipse cx="120" cy="40" rx="15" ry="12" fill="white" opacity="0.5" />
            <text x="120" y="44" textAnchor="middle" fontSize="10" fill="#666">owo</text>
          </motion.g>
        )}
      </motion.svg>
    </motion.div>
  )
}

function App() {
  const [state, setState] = useState(() => {
    const saved = loadState()
    if (saved) {
      const elapsed = Date.now() - saved.lastUpdate
      const decay = elapsed * DECAY_RATE
      const newHealth = Math.max(0, saved.health - decay)
      return { ...saved, health: newHealth, lastUpdate: Date.now() }
    }
    return {
      health: 80,
      links: [],
      lastUpdate: Date.now(),
      streak: 0,
      bestStreak: 0,
    }
  })

  const [linkInput, setLinkInput] = useState('')
  const [isChewing, setIsChewing] = useState(false)
  const [isAdamKill, setIsAdamKill] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')

  // Health decay tick
  useEffect(() => {
    if (state.health <= 0) return
    const interval = setInterval(() => {
      setState(prev => {
        const elapsed = Date.now() - prev.lastUpdate
        const decay = elapsed * DECAY_RATE
        const newHealth = Math.max(0, prev.health - decay)
        const newState = { ...prev, health: newHealth, lastUpdate: Date.now() }
        saveState(newState)
        return newState
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [state.health <= 0])

  useEffect(() => {
    saveState(state)
  }, [state])

  const feedLink = useCallback(() => {
    const link = linkInput.trim()
    if (!link) return

    // Check for Adam
    if (link.toLowerCase().includes('adam') || link.toLowerCase().includes('@adam')) {
      setIsAdamKill(true)
      setState(prev => ({
        ...prev,
        health: 0,
        lastUpdate: Date.now(),
        streak: 0,
      }))
      setLinkInput('')
      setTimeout(() => setIsAdamKill(false), 3000)
      setFeedbackMsg('ADAM POSTED A VIDEO! The capybara couldn\'t handle it...')
      setTimeout(() => setFeedbackMsg(''), 4000)
      return
    }

    // Loose TikTok link check
    const isTikTok = link.includes('tiktok.com') || link.includes('vm.tiktok')
    if (!isTikTok) {
      setFeedbackMsg('That doesn\'t look like a TikTok link! Try pasting a real one.')
      setTimeout(() => setFeedbackMsg(''), 3000)
      return
    }

    setIsChewing(true)
    const today = new Date().toLocaleDateString()
    const postedToday = state.links.some(l => l.date === today)

    setState(prev => ({
      ...prev,
      health: Math.min(100, prev.health + FEED_BOOST),
      links: [{ url: link, date: today, time: new Date().toLocaleTimeString() }, ...prev.links],
      lastUpdate: Date.now(),
      streak: postedToday ? prev.streak : prev.streak + 1,
      bestStreak: postedToday ? prev.bestStreak : Math.max(prev.bestStreak, prev.streak + 1),
    }))

    setLinkInput('')
    setFeedbackMsg(postedToday ? 'Yum! Extra snack today! 🌿' : `🔥 Day ${state.streak + 1} streak! Keep going!`)
    setTimeout(() => {
      setIsChewing(false)
      setFeedbackMsg('')
    }, 2500)
  }, [linkInput, state])

  const resetCapy = () => {
    setState({
      health: 80,
      links: [],
      lastUpdate: Date.now(),
      streak: 0,
      bestStreak: state.bestStreak,
    })
    setFeedbackMsg('A new capybara has arrived! Take good care of this one.')
    setTimeout(() => setFeedbackMsg(''), 3000)
  }

  const mood = getCapyMood(state.health)
  const healthColor = getHealthColor(state.health)

  return (
    <div className="app">
      <div className="app-inner">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Capy TikTok Buddy
        </motion.h1>
        <p className="subtitle">Feed your capybara daily TikTok links to keep it alive!</p>

        {/* Health bar */}
        <div className="health-section">
          <div className="health-label">
            <span>HP</span>
            <span style={{ color: healthColor, fontWeight: 700 }}>{Math.round(state.health)}%</span>
          </div>
          <div className="health-bar">
            <motion.div
              className="health-fill"
              animate={{ width: `${Math.max(1, state.health)}%`, backgroundColor: healthColor }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Streak display */}
        <div className="streak-row">
          <motion.span
            className="streak-badge"
            key={state.streak}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
          >
            🔥 {state.streak} day streak
          </motion.span>
          <span className="best-streak">Best: {state.bestStreak}</span>
        </div>

        {/* Capybara */}
        <Capybara health={state.health} isChewing={isChewing} isAdamKill={isAdamKill} />

        {/* Mood message */}
        <AnimatePresence mode="wait">
          <motion.p
            className={`mood-message mood-${mood}`}
            key={mood}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {getMoodMessage(mood)}
          </motion.p>
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              className="feedback"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
            >
              {feedbackMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed input */}
        <div className="feed-section">
          <input
            className="link-input"
            type="url"
            inputMode="url"
            placeholder="Paste your TikTok link here..."
            value={linkInput}
            onChange={e => setLinkInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && feedLink()}
            disabled={state.health <= 0}
          />
          <motion.button
            className="feed-btn"
            onClick={feedLink}
            disabled={state.health <= 0 || !linkInput.trim()}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.02 }}
          >
            🌿 Feed Capy
          </motion.button>
        </div>

        {state.health <= 0 && (
          <motion.button
            className="reset-btn"
            onClick={resetCapy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.95 }}
          >
            🐾 Adopt New Capybara
          </motion.button>
        )}

        {/* History toggle */}
        <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? 'Hide' : 'Show'} Feed History ({state.links.length} videos)
        </button>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              className="history"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              {state.links.length === 0 ? (
                <p className="empty-history">No links yet. Feed your capybara!</p>
              ) : (
                state.links.map((link, i) => (
                  <motion.div
                    key={`${link.date}-${link.time}-${i}`}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="history-date">{link.date} {link.time}</span>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="history-link">
                      {link.url.length > 45 ? link.url.slice(0, 45) + '...' : link.url}
                    </a>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="warning-text">
          ⚠️ If Adam posts a video, your capybara dies instantly.
        </p>
      </div>
    </div>
  )
}

export default App
