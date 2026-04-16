import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/layout/Navbar'
import CustomCursor from './components/ui/CustomCursor'
import PageLoader from './components/ui/PageLoader'
import ConstellationBackground from './components/visuals/ConstellationBackground'
import WarpSpeed from './components/visuals/WarpSpeed'
import Footer from './components/layout/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Team from './pages/Team'
import Blogs from './pages/Blogs'
import Alumni from './pages/Alumni'

import { useSmoothScroll } from './hooks/useSmoothScroll'

import { useScroll, useSpring, type Variants } from 'framer-motion'

const PAGE_TRANSITION_VARIANTS: Variants = {
  initial: { 
    opacity: 0, 
    y: 40, 
    scale: 0.98,
    rotateX: -5 
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    rotateX: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
  exit: { 
    opacity: 0, 
    y: -40, 
    scale: 0.98,
    rotateX: 5,
    transition: { 
      duration: 0.4, 
      ease: [0.76, 0, 0.24, 1] 
    } 
  },
}

function AnimatedRoutes(): JSX.Element {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={PAGE_TRANSITION_VARIANTS}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/alumni" element={<Alumni />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppInner(): JSX.Element {
  useSmoothScroll()
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 800)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
      <motion.div id="scroll-progress" style={{ scaleX }} />
      <ConstellationBackground />
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[99999] pointer-events-none"
          >
            <WarpSpeed />
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar />
      <main className="relative z-10 min-h-screen flex flex-col justify-between" style={{ perspective: '1500px' }}>
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>
        <Footer />
      </main>
    </>
  )
}

export default function App(): JSX.Element {
  const [loaderDone, setLoaderDone] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    setShowLoader(true)
  }, [])

  const handleLoaderComplete = () => {
    setLoaderDone(true)
    setShowLoader(false)
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      {/* Custom cursor — desktop only via CSS */}
      <CustomCursor />

      {/* Page loader */}
      {showLoader && !loaderDone && (
        <PageLoader onComplete={handleLoaderComplete} />
      )}

      {/* Main app */}
      <motion.div
        initial={showLoader ? { opacity: 0 } : { opacity: 1 }}
        animate={loaderDone ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <AppInner />
      </motion.div>
    </BrowserRouter>
  )
}
