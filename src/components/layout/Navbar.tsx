import { useState, useEffect, useRef } from 'react'
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
  hidden:  { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.2, 0, 0, 1] } },
  exit:    { opacity: 0, x: '100%', transition: { duration: 0.3, ease: [0.2, 0, 0, 1] } },
}

const mobileLinkVariants: Variants = {
  hidden:  { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: [0.2, 0, 0, 1] },
  }),
}

export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [navVisible, setNavVisible]   = useState(true)
  const lastScrollY                   = useRef(0)
  const location                      = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const diff     = currentY - lastScrollY.current

      // Frosted glass kicks in after 60px
      setScrolled(currentY > 60)

      // Hide on scroll down (more than 8px), show on scroll up
      if (currentY > 120) {
        if (diff > 8) {
          setNavVisible(false)
        } else if (diff < -5) {
          setNavVisible(true)
        }
      } else {
        setNavVisible(true)
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    // Always show nav on route change
    setNavVisible(true)
  }, [location.pathname])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          backdropFilter:       scrolled ? 'blur(12px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
          background:           scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
          borderBottom:         scrolled ? '1px solid rgba(96,165,250,0.08)' : 'none',
          /* slide-down reveal / slide-up hide */
          transform:            navVisible ? 'translateY(0)' : 'translateY(-110%)',
          /* smooth transition for hide/show */
          transition:           'transform 0.4s cubic-bezier(0.2, 0, 0, 1), backdrop-filter 0.4s ease, background 0.4s ease, border-bottom 0.4s ease',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-400"
          style={{ padding: scrolled ? '10px 24px' : '16px 24px' }}
        >

          {/* ── Left: Hashtag logo + JIMS logo ── */}
          <NavLink to="/" className="flex items-center gap-3 group" aria-label="Home">
            <img
              src="/hashtag-logo.png"
              alt="Hashtag Official Logo"
              className="h-10 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(143,245,255,0.6)]"
              style={{ height: scrolled ? '36px' : '40px', transition: 'height 0.4s ease' }}
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
                        style={{ background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)' }}
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
            style={{ background: 'rgba(10,10,15,0.98)', backdropFilter: 'blur(24px)' }}
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
                <a href="mailto:hashtag@jims.edu.in" className="btn-primary inline-flex">
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
