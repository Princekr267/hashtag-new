import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PageLoaderProps {
  onComplete: () => void
}

const TITLE = 'HASHTAG OFFICIAL'

const containerVariants = {
  exit: {
    y: '100vh',
    transition: {
      duration: 1.0,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
}

export default function PageLoader({ onComplete }: PageLoaderProps): JSX.Element {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(), 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        key="loader"
        variants={containerVariants}
        exit="exit"
        className="fixed inset-0 z-[100000] flex items-center justify-center bg-[#020617] overflow-hidden"
      >
        <div className="relative">
          {/* The Text - Hidden initially, revealed by curtain */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.1 }}
            className="text-white font-display text-center whitespace-nowrap"
            style={{
              fontSize: 'clamp(2rem, 10vw, 6rem)',
              fontWeight: 900,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            Hashtag Official
          </motion.h1>

          {/* The Blue Curtain */}
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ 
              scaleY: [0, 1, 1, 0],
              originY: [0, 0, 1, 1]
            }}
            transition={{ 
              duration: 2.2,
              times: [0, 0.4, 0.6, 1],
              ease: [0.76, 0, 0.24, 1]
            }}
            className="absolute z-10 bg-[#3b82f6]"
            style={{ 
              left: '-20px', right: '-20px', 
              top: '-20px', bottom: '-20px',
              boxShadow: '0 0 60px rgba(59,130,246,0.6)'
            }}
          />
        </div>

        {/* Brand Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-12 text-slate-500 font-label tracking-[0.4em] text-[10px] uppercase"
        >
          JIMS EMTC // Student Tech Society
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
