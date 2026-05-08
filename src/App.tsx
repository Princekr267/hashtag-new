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

// Only show the loader when the user lands directly on the home page
const INITIAL_PATH = typeof window !== 'undefined' ? window.location.pathname : '/'

function AnimatedRoutes(): JSX.Element {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        style={{ willChange: 'opacity' }}
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

  // Native scroll progress bar — zero React re-renders, no spring overhead
  useEffect(() => {
    const bar = document.getElementById('scroll-progress') as HTMLElement | null
    if (!bar) return
    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${total > 0 ? scrolled / total : 0})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div id="scroll-progress" />
      <ConstellationBackground />

      <Navbar />
      <main
        className="relative z-10 w-full min-h-screen flex flex-col justify-between overflow-x-clip border-none"
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
  // Only show the loader on the initial home page visit — not on sub-pages
  const isHomeLanding = INITIAL_PATH === '/' || INITIAL_PATH === ''
  const [loading, setLoading] = useState(isHomeLanding)

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
          <AppInner />
        )}
      </AnimatePresence>
    </BrowserRouter>
  )
}
