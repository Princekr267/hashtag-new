import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WarpSpeed from '../visuals/WarpSpeed'

interface PageLoaderProps {
  onComplete: () => void
}

const TITLE = '#Hashtag Official'

const containerVariants = {
  exit: {
    y: '-100%',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const, // Premium ease-out-expo
    },
  },
}

export default function PageLoader({ onComplete }: PageLoaderProps): JSX.Element {
  const [charStage, setCharStage] = useState<'idle' | 'typing' | 'done'>('idle')
  const [subVisible, setSubVisible] = useState(false)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    // Start character reveal sequence
    const t1 = setTimeout(() => setCharStage('typing'), 100)
    // TITLE.length * 30 is the stagger duration for the characters
    const t2 = setTimeout(() => setCharStage('done'), 100 + TITLE.length * 30 + 100)
    const t3 = setTimeout(() => setSubVisible(true), 600)
    
    // Call onComplete when we're ready to start the curtain slide-up
    // 2s gives enough time for everything to be fully visible and 'settled'
    const t4 = setTimeout(() => onComplete(), 2000)
    
    timeoutRefs.current = [t1, t2, t3, t4]
    return () => timeoutRefs.current.forEach(clearTimeout)
  }, [onComplete])

  return (
    <motion.div
      key="loader"
      variants={containerVariants}
      initial={{ y: 0 }}
      exit="exit"
      className="fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      <WarpSpeed />
      
      {/* Dynamic deep navy gradient background overlay */}
      <div
        className="absolute inset-0 z-0 opacity-80"
        style={{ background: 'radial-gradient(circle at 50% 50%, var(--bg-container) 0%, var(--bg-base) 80%)' }}
      />

        {/* Scanning line */}
        <div
          className="absolute left-0 right-0 h-1 z-10 animate-scan"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--accent-cyan), var(--primary), transparent)',
            boxShadow: '0 0 20px var(--accent-cyan-glow)'
          }}
        />

        {/* Background glow orbs - Electric Blue & Cyan */}
        <div
          className="absolute w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--primary), transparent)',
            top: '10%',
            left: '10%',
          }}
        />
        <div
          className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px] opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--accent-cyan), transparent)',
            bottom: '10%',
            right: '10%',
          }}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center gap-4 px-4 w-full">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={charStage !== 'idle' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-primary text-sm md:text-md tracking-[0.3em] font-label uppercase font-bold mb-2 flex items-center gap-3 drop-shadow-[0_0_10px_var(--primary-glow)]"
          >
            <span className="w-8 h-px bg-primary/50"></span>
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
            <span className="w-8 h-px bg-primary/50"></span>
          </motion.div>

          <h1
            className="font-display text-center"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 8vw, 6rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}
          >
            {TITLE.split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(12px)' }}
                animate={
                  charStage === 'idle'
                    ? { opacity: 0, scale: 0.8, y: 40, filter: 'blur(12px)' }
                    : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
                }
                transition={{
                  delay: idx * 0.02,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(180deg, #ffffff 0%, var(--accent-cyan) 50%, var(--primary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  whiteSpace: char === ' ' ? 'pre' : 'normal',
                  textShadow: '0 20px 40px var(--primary-glow)',
                  paddingBottom: '0.2em',
                  marginBottom: '-0.2em',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={subVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-text-muted font-body tracking-wider text-xs md:text-sm uppercase max-w-md text-center leading-relaxed"
          >
            Hashtag Official <br/><span className="text-primary font-bold">JIMS Greater Noida</span>
          </motion.p>
        </div>
      </motion.div>
  )
}
