import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import './App.css'

const DECAY_RATE = 100 / (24 * 60 * 60 * 1000)
const FEED_BOOST = 25
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

// Floating background particles
function FloatingParticles({ mood }) {
  const particles = Array.from({ length: 8 }, (_, i) => i)
  const emojis = mood === 'dead' ? ['💀', '🥀', '🍂'] : mood === 'happy' ? ['🌿', '🍊', '✨', '🌸'] : ['🍃', '🌱', '💧']

  return (
    <div className="particles-container">
      {particles.map(i => (
        <motion.div
          key={i}
          className="bg-particle"
          initial={{ opacity: 0, y: 300, x: Math.random() * 300 - 150 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            y: [300, -50],
            x: Math.random() * 300 - 150,
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.2,
            ease: 'linear',
          }}
        >
          {emojis[i % emojis.length]}
        </motion.div>
      ))}
    </div>
  )
}

// Blink hook
function useBlink() {
  const [isBlinking, setIsBlinking] = useState(false)
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }
    const interval = setInterval(() => {
      if (Math.random() < 0.3) blink()
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  return isBlinking
}

function Capybara({ health, isChewing, isAdamKill }) {
  const mood = getCapyMood(health)
  const isDead = health <= 0
  const bodyColor = isDead ? '#8b7d6b' : '#c4956a'
  const noseColor = isDead ? '#666' : '#6b4c3b'
  const bellyColor = isDead ? '#9e9484' : '#deb887'
  const isBlinking = useBlink()

  return (
    <motion.div
      className="capy-container"
      animate={isAdamKill ? { x: [0, -15, 15, -15, 15, -10, 10, 0], rotate: [0, -3, 3, -3, 3, 0] } : {}}
      transition={isAdamKill ? { duration: 0.6 } : {}}
    >
      {/* Floating hearts/sparkles when chewing */}
      <AnimatePresence>
        {isChewing && (
          <>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
              <motion.div
                key={`heart-${i}`}
                className="floating-heart"
                initial={{ opacity: 1, y: 0, x: (i - 4) * 20, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  y: -120 - Math.random() * 40,
                  x: (i - 4) * 30 + Math.sin(i) * 25,
                  scale: [0, 1.3, 0.8],
                  rotate: [0, Math.random() * 360],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, delay: i * 0.1, ease: 'easeOut' }}
              >
                {['💚', '🌿', '💛', '✨', '🧡', '⭐', '🍊', '💖'][i]}
              </motion.div>
            ))}
            {/* Nom nom text */}
            <motion.div
              className="nom-nom"
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 0.8], y: -60 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            >
              nom nom!
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Adam kill effect */}
      <AnimatePresence>
        {isAdamKill && (
          <motion.div
            className="adam-kill"
            initial={{ opacity: 0, scale: 5, rotate: -30 }}
            animate={{ opacity: 1, scale: [5, 0.8, 1.1, 1], rotate: [30, -5, 0] }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            ADAM POSTED
          </motion.div>
        )}
      </AnimatePresence>

      <motion.svg
        viewBox="0 0 240 220"
        className="capy-svg"
        animate={
          isDead
            ? { rotate: [0, 10, 90], scale: [1, 0.9, 0.7], y: [0, 10, 40], opacity: [1, 0.8, 0.5] }
            : isChewing
            ? {}
            : {}
        }
        transition={isDead ? { duration: 1.2, ease: 'easeIn' } : {}}
      >
        {/* Body - breathing animation */}
        <motion.ellipse
          cx="120" cy="145" rx="65" ry="50"
          fill={bodyColor}
          animate={isDead ? {} : { ry: [50, 52, 50], rx: [65, 66, 65] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cx="120" cy="155" rx="40" ry="30"
          fill={bellyColor} opacity="0.5"
          animate={isDead ? {} : { ry: [30, 31, 30] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Back legs */}
        <ellipse cx="75" cy="185" rx="18" ry="10" fill={noseColor} />
        <ellipse cx="165" cy="185" rx="18" ry="10" fill={noseColor} />

        {/* Front legs - happy tap */}
        <motion.ellipse
          cx="88" cy="190" rx="12" ry="8" fill={noseColor}
          animate={isChewing ? { y: [0, -4, 0, -4, 0] } : {}}
          transition={{ duration: 0.4, repeat: isChewing ? 5 : 0 }}
        />
        <motion.ellipse
          cx="152" cy="190" rx="12" ry="8" fill={noseColor}
          animate={isChewing ? { y: [0, -4, 0, -4, 0] } : {}}
          transition={{ duration: 0.4, repeat: isChewing ? 5 : 0, delay: 0.1 }}
        />

        {/* Head - bounces when chewing */}
        <motion.ellipse
          cx="120" cy="88" rx="48" ry="40"
          fill={bodyColor}
          animate={
            isChewing
              ? { cy: [88, 82, 88, 82, 88], rotate: [0, -5, 5, -5, 0] }
              : isDead ? {} : { cy: [88, 86, 88] }
          }
          transition={
            isChewing
              ? { duration: 0.5, repeat: 4 }
              : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
          }
        />

        {/* Left ear - twitches */}
        <motion.g
          animate={isDead ? {} : { rotate: [0, -8, 0, 0, 0, 0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: '82px', originY: '60px' }}
        >
          <ellipse cx="82" cy="55" rx="12" ry="8" fill={bodyColor} />
          <ellipse cx="82" cy="55" rx="7" ry="5" fill="#e8b89d" />
        </motion.g>

        {/* Right ear - twitches offset */}
        <motion.g
          animate={isDead ? {} : { rotate: [0, 0, 0, 6, 0, -5, 0, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{ originX: '158px', originY: '60px' }}
        >
          <ellipse cx="158" cy="55" rx="12" ry="8" fill={bodyColor} />
          <ellipse cx="158" cy="55" rx="7" ry="5" fill="#e8b89d" />
        </motion.g>

        {/* Nose/snout - twitches */}
        <motion.ellipse
          cx="120" cy="82" rx="24" ry="16"
          fill={noseColor}
          animate={isDead ? {} : { rx: [24, 24.5, 24, 23.5, 24] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle cx="112" cy="80" r="3" fill="#3d2b1f" />
        <circle cx="128" cy="80" r="3" fill="#3d2b1f" />

        {/* Eyes */}
        {mood === 'dead' ? (
          <>
            <motion.text
              x="101" y="72" fontSize="14" fill="#3d2b1f" fontFamily="monospace" fontWeight="bold"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >x</motion.text>
            <motion.text
              x="133" y="72" fontSize="14" fill="#3d2b1f" fontFamily="monospace" fontWeight="bold"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >x</motion.text>
          </>
        ) : (mood === 'happy' || isChewing) && !isBlinking ? (
          <>
            <path d="M 96 63 Q 103 58 110 63" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 130 63 Q 137 58 144 63" stroke="#3d2b1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        ) : isBlinking ? (
          <>
            <motion.line x1="96" y1="66" x2="110" y2="66" stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round"
              initial={{ scaleY: 1 }} animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.15 }} />
            <motion.line x1="130" y1="66" x2="144" y2="66" stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round"
              initial={{ scaleY: 1 }} animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 0.15 }} />
          </>
        ) : mood === 'dying' ? (
          <>
            <circle cx="103" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <circle cx="137" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <motion.circle cx="103" cy="66" r="2" fill="#3d2b1f"
              animate={{ cx: [103, 101, 105, 103] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.circle cx="137" cy="66" r="2" fill="#3d2b1f"
              animate={{ cx: [137, 135, 139, 137] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.ellipse
              cx="95" cy="78" rx="3" ry="5" fill="#87ceeb" opacity="0.7"
              animate={{ y: [0, 10, 0], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.ellipse
              cx="145" cy="78" rx="3" ry="5" fill="#87ceeb" opacity="0.7"
              animate={{ y: [0, 10, 0], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            />
          </>
        ) : (
          <>
            <circle cx="103" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <circle cx="137" cy="66" r="6" fill="white" stroke="#3d2b1f" strokeWidth="1.5" />
            <motion.circle
              cx="104" cy="66" r="3.5" fill="#3d2b1f"
              animate={mood === 'sad' ? { cy: [66, 68, 66] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.circle
              cx="138" cy="66" r="3.5" fill="#3d2b1f"
              animate={mood === 'sad' ? { cy: [66, 68, 66] } : {}}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <circle cx="105" cy="64" r="1.5" fill="white" />
            <circle cx="139" cy="64" r="1.5" fill="white" />
          </>
        )}

        {/* Mouth */}
        {isChewing ? (
          <motion.path
            d="M 112 98 Q 120 103 128 98"
            stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round"
            animate={{ d: ['M 112 98 Q 120 105 128 98', 'M 112 96 Q 120 98 128 96', 'M 112 98 Q 120 105 128 98'] }}
            transition={{ duration: 0.25, repeat: 10 }}
          />
        ) : mood === 'happy' || mood === 'content' ? (
          <path d="M 112 98 Q 120 106 128 98" stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : mood === 'dead' ? (
          <line x1="110" y1="100" x2="130" y2="100" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M 112 102 Q 120 96 128 102" stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Blush cheeks - pulse when happy */}
        {(mood === 'happy' || mood === 'content' || isChewing) && (
          <>
            <motion.circle cx="85" cy="90" r="10" fill="#f9a8d4"
              animate={{ opacity: [0.25, 0.45, 0.25], r: [10, 11, 10] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle cx="155" cy="90" r="10" fill="#f9a8d4"
              animate={{ opacity: [0.25, 0.45, 0.25], r: [10, 11, 10] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}

        {/* Orange on head - bobs */}
        {health > 70 && !isDead && (
          <motion.g
            animate={{ rotate: [0, -3, 3, -3, 0], y: [0, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="120" cy="50" r="9" fill="#ff9f43" />
            <rect x="118" y="40" width="4" height="6" rx="2" fill="#2d6a4f" />
            <ellipse cx="125" cy="42" rx="4" ry="2" fill="#2d6a4f" transform="rotate(30 125 42)" />
          </motion.g>
        )}

        {/* Tail - wags */}
        <motion.circle
          cx="185" cy="140" r="7" fill={bodyColor}
          animate={isDead ? {} : { cx: [185, 188, 185, 182, 185], cy: [140, 138, 140, 138, 140] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Whisker dots */}
        {!isDead && (
          <>
            <circle cx="90" cy="84" r="1.5" fill="#3d2b1f" opacity="0.3" />
            <circle cx="86" cy="88" r="1.5" fill="#3d2b1f" opacity="0.3" />
            <circle cx="150" cy="84" r="1.5" fill="#3d2b1f" opacity="0.3" />
            <circle cx="154" cy="88" r="1.5" fill="#3d2b1f" opacity="0.3" />
          </>
        )}

        {/* Ghost when dead */}
        {isDead && (
          <motion.g
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.7, 0.7, 0], y: [0, -60], scale: [0.5, 1.2, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <ellipse cx="120" cy="40" rx="18" ry="14" fill="white" opacity="0.6" />
            <text x="120" y="44" textAnchor="middle" fontSize="10" fill="#888">owo</text>
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
    return { health: 80, links: [], lastUpdate: Date.now(), streak: 0, bestStreak: 0 }
  })

  const [linkInput, setLinkInput] = useState('')
  const [isChewing, setIsChewing] = useState(false)
  const [isAdamKill, setIsAdamKill] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [screenShake, setScreenShake] = useState(false)

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

  useEffect(() => { saveState(state) }, [state])

  const feedLink = useCallback(() => {
    const link = linkInput.trim()
    if (!link) return

    if (link.toLowerCase().includes('adam') || link.toLowerCase().includes('@adam')) {
      setIsAdamKill(true)
      setScreenShake(true)
      setState(prev => ({ ...prev, health: 0, lastUpdate: Date.now(), streak: 0 }))
      setLinkInput('')
      setTimeout(() => { setIsAdamKill(false); setScreenShake(false) }, 3000)
      setFeedbackMsg('ADAM POSTED A VIDEO! The capybara couldn\'t handle it...')
      setTimeout(() => setFeedbackMsg(''), 4000)
      return
    }

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
    setFeedbackMsg(postedToday ? 'Yum! Extra snack today!' : `Day ${state.streak + 1} streak! Keep going!`)
    setTimeout(() => { setIsChewing(false); setFeedbackMsg('') }, 2500)
  }, [linkInput, state])

  const resetCapy = () => {
    setState({ health: 80, links: [], lastUpdate: Date.now(), streak: 0, bestStreak: state.bestStreak })
    setFeedbackMsg('A new capybara has arrived! Take good care of this one.')
    setTimeout(() => setFeedbackMsg(''), 3000)
  }

  const mood = getCapyMood(state.health)
  const healthColor = getHealthColor(state.health)
  const lowHealth = state.health < 30 && state.health > 0

  return (
    <motion.div
      className="app"
      animate={screenShake ? { x: [0, -10, 10, -10, 10, -5, 5, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="app-inner">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          Capy TikTok Buddy
        </motion.h1>
        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Feed your capybara daily TikTok links to keep it alive!
        </motion.p>

        {/* Health bar */}
        <motion.div
          className="health-section"
          animate={lowHealth ? { scale: [1, 1.02, 1] } : {}}
          transition={lowHealth ? { duration: 1, repeat: Infinity } : {}}
        >
          <div className="health-label">
            <span>HP</span>
            <motion.span
              style={{ color: healthColor, fontWeight: 700 }}
              key={Math.round(state.health)}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
            >
              {Math.round(state.health)}%
            </motion.span>
          </div>
          <div className={`health-bar ${lowHealth ? 'health-bar-low' : ''}`}>
            <motion.div
              className="health-fill"
              animate={{ width: `${Math.max(1, state.health)}%`, backgroundColor: healthColor }}
              transition={{ duration: 0.5, type: 'spring' }}
            />
          </div>
        </motion.div>

        {/* Streak */}
        <div className="streak-row">
          <motion.span
            className="streak-badge"
            key={state.streak}
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: [0.5, 1.3, 1], rotate: [-10, 5, 0] }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {state.streak} day streak
          </motion.span>
          <span className="best-streak">Best: {state.bestStreak}</span>
        </div>

        {/* Background particles */}
        <FloatingParticles mood={mood} />

        {/* Capybara */}
        <Capybara health={state.health} isChewing={isChewing} isAdamKill={isAdamKill} />

        {/* Mood message */}
        <AnimatePresence mode="wait">
          <motion.p
            className={`mood-message mood-${mood}`}
            key={mood}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {getMoodMessage(mood)}
          </motion.p>
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              className="feedback"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: [0.5, 1.1, 1], y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {feedbackMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feed input */}
        <div className="feed-section">
          <motion.input
            className="link-input"
            type="url"
            inputMode="url"
            placeholder="Paste your TikTok link here..."
            value={linkInput}
            onChange={e => setLinkInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && feedLink()}
            disabled={state.health <= 0}
            whileFocus={{ scale: 1.02, borderColor: '#c4956a' }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <motion.button
            className="feed-btn"
            onClick={feedLink}
            disabled={state.health <= 0 || !linkInput.trim()}
            whileTap={{ scale: 0.9, rotate: -2 }}
            whileHover={{ scale: 1.05 }}
            animate={!linkInput.trim() && state.health > 0 ? { rotate: [0, -2, 2, -2, 0] } : {}}
            transition={!linkInput.trim() ? { duration: 2, repeat: Infinity, repeatDelay: 3 } : { type: 'spring', stiffness: 400 }}
          >
            Feed Capy
          </motion.button>
        </div>

        {state.health <= 0 && (
          <motion.button
            className="reset-btn"
            onClick={resetCapy}
            initial={{ opacity: 0, y: 30, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: [0.5, 1.1, 1] }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 200, delay: 1 }}
          >
            Adopt New Capybara
          </motion.button>
        )}

        <motion.button
          className="history-toggle"
          onClick={() => setShowHistory(!showHistory)}
          whileTap={{ scale: 0.95 }}
        >
          {showHistory ? 'Hide' : 'Show'} Feed History ({state.links.length} videos)
        </motion.button>

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
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
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

        <motion.p
          className="warning-text"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          If Adam posts a video, your capybara dies instantly.
        </motion.p>
      </div>
    </motion.div>
  )
}

export default App
