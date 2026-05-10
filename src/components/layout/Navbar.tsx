import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { X, Menu, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'

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

// ── Contact Modal ────────────────────────────────────────────────
type FormState = 'idle' | 'sending' | 'success' | 'error'

function ContactModal({ onClose }: { onClose: () => void }) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [state,   setState]   = useState<FormState>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return
    setState('sending')

    const mailtoHref = `mailto:hashtag@jims.edu.in?subject=${encodeURIComponent(subject || `Message from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`

    await new Promise(r => setTimeout(r, 600))
    window.open(mailtoHref, '_blank')
    setState('success')

    setTimeout(onClose, 2500)
  }

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/75"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[520px] rounded-[24px] p-9 relative overflow-hidden gpu-accel"
        style={{
          background: 'linear-gradient(145deg, var(--bg-container-hi) 0%, var(--bg-container) 100%)',
          border: '1px solid var(--primary-glow)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px var(--outline-var)',
        }}
      >
        {/* Background glow */}
        <div className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--primary-glow), transparent 70%)' }} />
        <div className="absolute bottom-[-40px] right-[-40px] w-[200px] h-[200px] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--secondary-glow), transparent 70%)' }} />

        {/* Top glow line */}
        <div className="absolute top-0 left-[15%] right-[15%] h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--primary), transparent)' }} />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close contact form"
          className="absolute top-4 right-4 w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white/60 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/12 hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-7 relative z-[2]">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] mb-4 border border-primary/30 bg-primary/10 shadow-[0_0_30px_var(--primary-glow)]">
            <Mail size={22} className="text-primary" />
          </div>
          <h2 className="font-display font-black text-[1.6rem] text-white m-0 leading-[1.2]">
            Get in Touch
          </h2>
          <p className="text-sm text-text-muted/80 m-0 font-body">
            Have a question or want to collaborate? Send us a message.
          </p>
        </div>

        {/* Success state */}
        {state === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 relative z-[2]"
          >
            <CheckCircle size={52} className="text-primary mb-4 mx-auto" />
            <h3 className="font-bold text-xl text-white mb-2 font-display">
              Message Sent!
            </h3>
            <p className="text-sm text-text-muted/80 font-body">
              Your email client has opened with the message pre-filled. We'll get back to you soon!
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-[2]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                label="Name"
                placeholder="Your name"
                value={name}
                onChange={setName}
                required
              />
              <FormField
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={setEmail}
                required
              />
            </div>

            <FormField
              label="Subject"
              placeholder="What's this about?"
              value={subject}
              onChange={setSubject}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold tracking-wider text-text-muted/90 uppercase">
                Message <span className="text-primary">*</span>
              </label>
              <textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                className="bg-white/5 border border-white/10 rounded-[12px] px-3.5 py-3 text-text-primary text-sm outline-none transition-colors duration-200 focus:border-primary/50 font-body leading-relaxed min-h-[100px]"
              />
            </div>

            {state === 'error' && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] bg-red-500/10 border border-red-500/30 text-red-400 text-[13px]">
                <AlertCircle size={16} />
                Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'sending'}
              className="btn-primary w-full py-3.5 rounded-[12px] text-sm font-bold tracking-wider gpu-accel"
              style={{ minHeight: '44px' }}
            >
              {state === 'sending' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Reusable form field ──────────────────────────────────────────
function FormField({
  label, placeholder, value, onChange, type = 'text', required = false,
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void
  type?: string; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold tracking-wider text-text-muted/90 uppercase">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="bg-white/5 border border-white/10 rounded-[12px] px-3.5 py-2.5 text-text-primary text-sm outline-none transition-colors duration-200 focus:border-primary/50 font-body w-full"
      />
    </div>
  )
}

// ── Main Navbar ──────────────────────────────────────────────────
export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [revealed, setRevealed]         = useState(() => {
    // If not landing on home, reveal immediately
    if (typeof window === 'undefined') return true
    return window.location.pathname !== '/' && window.location.pathname !== ''
  })
  const [navVisible, setNavVisible]     = useState(true)
  const [contactOpen, setContactOpen]   = useState(false)
  const lastScrollY                     = useRef(0)
  const location                        = useLocation()

  useEffect(() => {
    const onReveal = () => setRevealed(true)
    window.addEventListener('site-revealed', onReveal)
    return () => window.removeEventListener('site-revealed', onReveal)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const diff     = currentY - lastScrollY.current
      setScrolled(currentY > 60)
      if (currentY > 120) {
        if (diff > 8)        setNavVisible(false)
        else if (diff < -5)  setNavVisible(true)
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
    setNavVisible(true)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [mobileOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 gpu-accel"
        style={{
          backdropFilter:       scrolled ? 'blur(12px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
          background:           scrolled ? 'var(--bg-container)' : 'transparent',
          borderBottom:         scrolled ? '1px solid var(--outline-var)' : 'none',
          opacity:              revealed ? 1 : 0,
          transform:            !revealed ? 'translateY(-100%)' : navVisible ? 'translateY(0)' : 'translateY(-110%)',
          filter:               revealed ? 'blur(0px)' : 'blur(12px)',
          transition:           'transform 0.8s var(--ease-expo), opacity 0.8s var(--ease-expo), filter 0.8s var(--ease-expo), background 0.4s ease, border-bottom 0.4s ease',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-400"
          style={{ padding: scrolled ? '12px 24px' : '20px 24px' }}
        >

          {/* ── Left: Hashtag logo + JIMS logo ── */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center group px-1" aria-label="Home">
              <img
                src="/hashtag-logo.png"
                alt="Hashtag Official Logo"
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_var(--primary-glow)]"
                style={{ height: scrolled ? '36px' : '44px', transition: 'height 0.4s var(--ease-expo)' }}
              />
            </NavLink>
            <div className="h-6 w-px hidden max-[749px]:block lg:block bg-primary/20" />
            <a 
              href="https://jimsgn.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden max-[749px]:block lg:block group p-2"
              aria-label="JIMS Greater Noida"
            >
              <img
                src="/jims-logo.png"
                alt="JIMS Greater Noida"
                className="h-7 w-auto object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
            </a>
          </div>

          {/* ── Center: Desktop nav links ── */}
          <div className="hidden min-[750px]:flex items-center gap-2">
            {NAV_ITEMS.map(({ label, path }, idx) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 2 + (idx * 0.08), 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
              >
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `relative px-5 py-3 text-xs font-bold tracking-widest transition-all duration-200 font-label uppercase
                    ${isActive ? 'text-primary' : 'text-text-muted hover:text-white'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-underline"
                          className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* ── Right: Contact Us button & JIMS Swap ── */}
          <div className="hidden min-[750px]:flex items-center gap-3">
            {/* JIMS logo shows here on tablet (750px - 1024px) */}
            <a 
              href="https://jimsgn.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden min-[750px]:block lg:hidden group"
              aria-label="JIMS Greater Noida"
            >
              <img
                src="/jims-logo.png"
                alt="JIMS Greater Noida"
                className="h-7 w-auto object-contain opacity-70 transition-opacity duration-300 group-hover:opacity-100"
              />
            </a>
            {/* Contact Us shows on desktop (>1024px) */}
            <div className="hidden lg:block">
              <button
                onClick={() => setContactOpen(true)}
                className="btn-ghost flex items-center gap-[8px] text-xs"
                style={{ padding: '8px 20px' }}
              >
                <Mail size={14} className="flex-shrink-0" />
                <span className="leading-none">Contact Us</span>
              </button>
            </div>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="max-[749px]:block min-[750px]:hidden p-2 text-text-muted hover:text-primary transition-colors"
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
                      `block py-4 text-2xl font-bold font-display border-b transition-colors duration-200 nav-link-mobile
                      ${isActive
                        ? 'text-primary border-primary/20'
                        : 'text-text-muted border-white/5'}`
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
                <button
                  onClick={() => { setMobileOpen(false); setContactOpen(true) }}
                  className="btn-primary inline-flex items-center gap-[8px]"
                >
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="leading-none">Contact Us</span>
                </button>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contact Modal ── */}
      <AnimatePresence>
        {contactOpen && (
          <ContactModal onClose={() => setContactOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
