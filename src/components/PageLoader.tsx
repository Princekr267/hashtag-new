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
        style={{ background: '#070b14' }}
      >
        {/* Dynamic deep navy gradient background */}
        <div
          className="absolute inset-0 z-0 opacity-60"
          style={{ background: 'radial-gradient(circle at 50% 50%, #0c1a3b 0%, #070b14 80%)' }}
        />

        {/* Scanning line */}
        <div
          className="absolute left-0 right-0 h-1 z-10 animate-scan"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), rgba(96,165,250,0.8), transparent)',
            boxShadow: '0 0 20px rgba(34,211,238,0.6)'
          }}
        />

        {/* Background glow orbs - Electric Blue & Cyan */}
        <div
          className="absolute w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-30 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #60a5fa, transparent)',
            top: '10%',
            left: '10%',
          }}
        />
        <div
          className="absolute w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px] opacity-20"
          style={{
            background: 'radial-gradient(circle, #22d3ee, transparent)',
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
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="text-[#22d3ee] text-sm md:text-md tracking-[0.3em] font-label uppercase font-bold mb-2 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          >
            <span className="w-8 h-px bg-[#22d3ee]/50"></span>
            {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}
            <span className="w-8 h-px bg-[#22d3ee]/50"></span>
          </motion.div>

          <h1
            className="font-display text-center"
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {TITLE.split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }}
                animate={
                  charStage === 'idle'
                    ? { opacity: 0, scale: 0.8, y: 40, filter: 'blur(10px)' }
                    : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
                }
                transition={{
                  delay: idx * 0.04,
                  duration: 0.5,
                  ease: [0.2, 0, 0, 1],
                }}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(180deg, #ffffff 0%, #a5f3fc 50%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  whiteSpace: char === ' ' ? 'pre' : 'normal',
                  textShadow: '0 20px 40px rgba(59,130,246,0.3)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={subVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
            className="mt-6 text-[#94a3b8] font-body tracking-wider text-xs md:text-sm uppercase max-w-md text-center leading-relaxed"
          >
            Hashtag Official <br/><span className="text-[#60a5fa] font-bold">JIMS Greater Noida</span>
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
