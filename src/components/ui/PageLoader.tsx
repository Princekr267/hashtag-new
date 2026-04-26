import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PageLoaderProps {
  onComplete: () => void
}

const containerVariants = {
  initial: { y: 0 },
  exit: {
    y: '-100vh',
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1] as const,
    },
  },
}

export default function PageLoader({ onComplete }: PageLoaderProps): JSX.Element {
  const [greeting, setGreeting] = useState('Good Morning')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 18) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    // Match animation duration (2.2s) + small linger
    const timer = setTimeout(() => onComplete(), 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      key="loader"
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-[100000] bg-[#020617] overflow-hidden flex flex-col items-center justify-center shadow-2xl"
    >
      {/* Scanning Line */}
      <motion.div
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="absolute left-0 w-full h-[2px] bg-cyan-400 z-50 shadow-[0_0_30px_5px_rgba(34,211,238,0.8)]"
      />

      {/* Revealed Content via ClipPath */}
      <motion.div
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 2.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617]"
      >
        <div className="flex flex-col items-center gap-6">
          <span className="text-cyan-400 font-mono-custom tracking-[0.3em] text-sm md:text-base uppercase flex items-center gap-3">
            <span className="hidden md:block w-12 h-px bg-cyan-400/50" />
            {greeting}
            <span className="hidden md:block w-12 h-px bg-cyan-400/50" />
          </span>
          
          <h1
            className="text-white font-display text-center whitespace-nowrap"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              fontWeight: 900,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            Hashtag Official
          </h1>
        </div>

        <div className="absolute bottom-12 text-slate-500 font-label tracking-[0.4em] text-[10px] uppercase">
          JIMS EMTC // Student Tech Society
        </div>
      </motion.div>
    </motion.div>
  )
}
