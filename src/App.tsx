import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import PageLoader from './components/PageLoader'
import AnimatedBackground from './components/AnimatedBackground'
import Footer from './components/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Team from './pages/Team'
import Blogs from './pages/Blogs'
import Alumni from './pages/Alumni'

import { useSmoothScroll } from './hooks/useSmoothScroll'

import type { Variants } from 'framer-motion'

const PAGE_TRANSITION_VARIANTS: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25, ease: [0.55, 0.06, 0.68, 0.19] } },
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

  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 min-h-screen flex flex-col justify-between">
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
