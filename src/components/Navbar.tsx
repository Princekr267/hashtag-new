import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { X, Menu, Mail } from 'lucide-react'

interface NavItem { label: string; path: string }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',   path: '/' },
  { label: 'About',  path: '/about' },
  { label: 'Events', path: '/events' },
  { label: 'Team',   path: '/team' },
  { label: 'Blogs',  path: '/blogs' },
  { label: 'Alumni', path: '/alumni' },
]

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.4, ease: [0.2, 0, 0, 1] },
  },
  exit: {
    opacity: 0, x: '100%',
    transition: { duration: 0.3, ease: [0.2, 0, 0, 1] },
  },
}

const mobileLinkVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: [0.2, 0, 0, 1] },
  }),
}

export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          backdropFilter:       scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          background: scrolled ? 'rgba(14,14,16,0.9)' : 'transparent',
          borderBottom: scrolled ? '1px solid rgba(143,245,255,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* ── Left: Hashtag logo + JIMS logo ── */}
          <NavLink to="/" className="flex items-center gap-3 group" aria-label="Home">
            <img
              src="/hashtag-logo.png"
              alt="Hashtag Official Logo"
              className="h-10 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(143,245,255,0.6)]"
            />
            <div
              className="h-6 w-px hidden sm:block"
              style={{ background: 'rgba(143,245,255,0.2)' }}
            />
            <img
              src="/jims-logo.png"
              alt="JIMS Greater Noida"
              className="h-7 w-auto object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100 hidden sm:block"
            />
          </NavLink>

          {/* ── Center: Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-all duration-200 font-label
                  ${isActive ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-px"
                        style={{ background: 'linear-gradient(90deg, transparent, #8ff5ff, transparent)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Right: Contact Us button ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="mailto:hashtag@jims.edu.in"
              className="btn-ghost flex items-center gap-2 text-xs"
              style={{ padding: '8px 20px' }}
            >
              <Mail size={14} />
              Contact Us
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-2 text-text-muted hover:text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[99] flex flex-col"
            style={{ background: 'rgba(14,14,16,0.98)', backdropFilter: 'blur(24px)' }}
          >
            <div className="w-full flex flex-col pt-24 px-8 gap-2">
              {NAV_ITEMS.map(({ label, path }, idx) => (
                <motion.div
                  key={path}
                  variants={mobileLinkVariants}
                  initial="hidden"
                  animate="visible"
                  custom={idx}
                >
                  <NavLink
                    to={path}
                    end={path === '/'}
                    className={({ isActive }) =>
                      `block py-4 text-2xl font-bold font-display border-b transition-colors duration-200
                      ${isActive
                        ? 'text-gradient border-primary/20'
                        : 'text-text-muted border-white/5 hover:text-text-primary'}`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                variants={mobileLinkVariants}
                initial="hidden"
                animate="visible"
                custom={NAV_ITEMS.length}
                className="mt-8"
              >
                <a
                  href="mailto:hashtag@jims.edu.in"
                  className="btn-primary inline-flex"
                >
                  <Mail size={16} />
                  Contact Us
                </a>
              </motion.div>

              {/* Logos in mobile menu */}
              <motion.div
                className="mt-auto pb-8 flex items-center gap-4 opacity-40"
                variants={mobileLinkVariants}
                initial="hidden"
                animate="visible"
                custom={NAV_ITEMS.length + 1}
              >
                <img src="/hashtag-logo.png" alt="" className="h-8 w-auto" />
                <img src="/jims-logo.png"    alt="" className="h-7 w-auto" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
