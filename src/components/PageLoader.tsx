import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageLoaderProps {
  onComplete: () => void
}

const TITLE = 'HASHTAG OFFICIAL'

const containerVariants = {
  exit: {
    y: '-100vh',
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
}

export default function PageLoader({ onComplete }: PageLoaderProps): JSX.Element {
  const [charStage, setCharStage] = useState<'idle' | 'typing' | 'done'>('idle')
  const [subVisible, setSubVisible] = useState(false)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // Start character reveal
    const t1 = setTimeout(() => setCharStage('typing'), 200)
    const t2 = setTimeout(() => setCharStage('done'), 200 + TITLE.length * 60 + 200)
    const t3 = setTimeout(() => setSubVisible(true), 1400)
    const t4 = setTimeout(() => onComplete(), 2600)
    timeoutRefs.current = [t1, t2, t3, t4]
    return () => timeoutRefs.current.forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        variants={containerVariants}
        exit="exit"
        className="fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f11 0%, #16161a 50%, #1a1430 100%)' }}
      >
        {/* Scanning line */}
        <div
          className="absolute left-0 right-0 h-px z-10 animate-scan"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(184,169,245,0.6), rgba(159,245,209,0.6), transparent)',
          }}
        />

        {/* Background glow orbs */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #b8a9f5, transparent)',
            top: '20%',
            left: '20%',
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle, #9ff5d1, transparent)',
            bottom: '25%',
            right: '25%',
          }}
        />

        {/* Title */}
        <div className="relative z-20 flex flex-col items-center gap-6">
          <h1
            className="font-space text-center tracking-[0.25em]"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              fontWeight: 700,
            }}
          >
            {TITLE.split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  charStage === 'idle'
                    ? { opacity: 0, y: 20 }
                    : { opacity: 1, y: 0 }
                }
                transition={{
                  delay: idx * 0.06,
                  duration: 0.3,
                  ease: 'easeOut',
                }}
                style={{
                  display: 'inline-block',
                  background:
                    idx < Math.floor(TITLE.length / 2)
                      ? 'linear-gradient(135deg,#b8a9f5,#9ff5d1)'
                      : 'linear-gradient(135deg,#9ff5d1,#a9d4f5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  whiteSpace: char === ' ' ? 'pre' : 'normal',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={subVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: '#7a7a90',
            }}
          >
            est. 2021 · Tech Society · JIMS Greater Noida
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
