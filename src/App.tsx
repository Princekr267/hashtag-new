import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/layout/Navbar'
import CustomCursor from './components/ui/CustomCursor'
import ConstellationBackground from './components/visuals/ConstellationBackground'
import Footer from './components/layout/Footer'

import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import Team from './pages/Team'
import Blogs from './pages/Blogs'
import Alumni from './pages/Alumni'
import EventDetail from './pages/EventDetail'
import BlogDetail from './pages/BlogDetail'
import PageLoader from './components/ui/PageLoader'

import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useScroll, useSpring } from 'framer-motion'

function AnimatedRoutes(): JSX.Element {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        style={{ willChange: 'opacity', touchAction: 'pan-y' }}
      >
        <Routes location={location}>
          <Route path="/"       element={<Home />} />
          <Route path="/about"  element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team"   element={<Team />} />
          <Route path="/blogs"  element={<Blogs />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function AppInner(): JSX.Element {
  useSmoothScroll()

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.documentElement.style.setProperty('--scroll-y', String(window.scrollY))
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.div id="scroll-progress" style={{ scaleX }} />
      <ConstellationBackground />

      <Navbar />
      <main
        className="relative z-10 min-h-screen flex flex-col justify-between"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>
        <Footer />
      </main>
    </>
  )
}

export default function App(): JSX.Element {
  const [loading, setLoading] = useState(true)

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <CustomCursor />
      <AnimatePresence mode="wait">
        {loading ? (
          <PageLoader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <AppInner />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  )
}
