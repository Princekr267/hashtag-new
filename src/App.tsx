import { useEffect, useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar from './components/layout/Navbar'
import CustomCursor from './components/ui/CustomCursor'
import ConstellationBackground from './components/visuals/ConstellationBackground'
import Footer from './components/layout/Footer'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Events = lazy(() => import('./pages/Events'))
const Team = lazy(() => import('./pages/Team'))
const Blogs = lazy(() => import('./pages/Blogs'))
const Alumni = lazy(() => import('./pages/Alumni'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const BlogDetail = lazy(() => import('./pages/BlogDetail'))
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
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense
          fallback={
            <div className="w-full min-h-[60vh] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          }
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/team" element={<Team />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

// Global flag to track if the site has been revealed once in the current session
let siteRevealedOnce = false

function AppInner(): JSX.Element {
  useSmoothScroll()

  // Native scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('scroll-progress') as HTMLElement | null
    if (!bar) return
    let totalHeight = document.documentElement.scrollHeight - window.innerHeight
    const handleResize = () => {
      totalHeight = document.documentElement.scrollHeight - window.innerHeight
    }
    window.addEventListener('resize', handleResize, { passive: true })

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY
          bar.style.transform = `scaleX(${totalHeight > 0 ? scrolled / totalHeight : 0})`
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', handleResize)
    }
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
  // Check if we're on the home page AND haven't revealed yet
  const isHomeLanding = INITIAL_PATH === '/' || INITIAL_PATH === ''
  const [loading, setLoading] = useState(isHomeLanding && !siteRevealedOnce)

  const handleLoaderComplete = () => {
    siteRevealedOnce = true
    if (typeof window !== 'undefined') (window as any).siteRevealedOnce = true
    setLoading(false)
    // Small delay to synchronize with loader exit animation
    setTimeout(() => {
      window.dispatchEvent(new Event('site-revealed', { bubbles: true }))
    }, 200)
  }

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <CustomCursor />
      <div className="relative w-full h-full">
        {/* Main content is always rendered underneath */}
        <AppInner />

        <AnimatePresence mode="wait">
          {loading && (
            <PageLoader key="loader" onComplete={handleLoaderComplete} />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}
