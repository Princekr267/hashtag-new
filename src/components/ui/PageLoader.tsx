import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageLoaderProps {
  onComplete: () => void
}

const TITLE = 'HASHTAG OFFICIAL'

const containerVariants = {
  exit: {
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
}

export default function PageLoader({ onComplete }: PageLoaderProps): JSX.Element {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0)

  useEffect(() => {
    // Phase 0: Initialize / Draw geometric bounds
    // Phase 1: Typing text & booting up
    const t1 = setTimeout(() => setPhase(1), 400)
    // Phase 2: Solidify and expand
    const t2 = setTimeout(() => setPhase(2), 1600)
    // Phase 3: Glitch / fade out complete
    const t3 = setTimeout(() => setPhase(3), 2600)
    
    const t4 = setTimeout(() => onComplete(), 3200)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        variants={containerVariants}
        exit="exit"
        className="fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden bg-[#020617]"
      >
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(143,245,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(143,245,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        />

        {/* Central Geometric Frame */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          
          <motion.div
            initial={{ width: 0, height: 1 }}
            animate={
              phase === 0 ? { width: '40vw', height: 1 } :
              phase === 1 ? { width: '60vw', height: 1 } :
              phase === 2 ? { width: '80vw', height: '30vh' } :
              { width: '100vw', height: '100vh', opacity: 0 }
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute border border-cyan-500/30 bg-cyan-900/10 backdrop-blur-sm"
          >
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
          </motion.div>

          {/* Loader Text Content */}
          <div className="relative z-20 flex flex-col items-center gap-4 mix-blend-screen">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : { opacity: 0 }}
              className="text-[#22d3ee] text-xs tracking-[0.4em] font-mono-custom uppercase flex items-center gap-3 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
            >
              <span className="w-8 h-px bg-[#22d3ee]/50" />
              SYSTEM.INIT
              <span className="w-8 h-px bg-[#22d3ee]/50" />
            </motion.div>

            <div className="overflow-hidden">
              <h1
                className="font-display text-center whitespace-nowrap text-white"
                style={{
                  fontSize: 'clamp(2rem, 6vw, 5rem)',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                {TITLE.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={
                      phase >= 1 
                        ? { opacity: 1, y: 0, filter: 'blur(0px)' } 
                        : { opacity: 0, y: 20, filter: 'blur(10px)' }
                    }
                    transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                    style={{
                      display: 'inline-block',
                      textShadow: phase >= 2 ? '0 0 20px rgba(96,165,250,0.8)' : 'none',
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h1>
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={phase >= 2 ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: 1 } : { opacity: 0 }}
              className="mt-6 text-slate-400 font-label tracking-widest text-[10px] md:text-xs uppercase"
            >
               JIMS EMTC <span className="text-cyan-500">//</span> STUDENT TECH SOCIETY
            </motion.p>
          </div>

        </div>

      </motion.div>
    </AnimatePresence>
  )
}
