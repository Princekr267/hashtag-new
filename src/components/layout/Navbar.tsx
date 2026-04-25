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

    // Build mailto: link — send via user's email client
    // For a real form submission you'd POST to a backend/formspree endpoint here
    const mailtoHref = `mailto:hashtag@jims.edu.in?subject=${encodeURIComponent(subject || `Message from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`

    // Simulate async (open mailto + show success)
    await new Promise(r => setTimeout(r, 600))
    window.open(mailtoHref, '_blank')
    setState('success')

    // Auto-close after 2.5s
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
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: '520px',
          background: 'linear-gradient(145deg, #080e1c 0%, #060a16 100%)',
          border: '1px solid rgba(96,165,250,0.20)',
          borderRadius: '24px',
          padding: '36px',
          position: 'relative',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(96,165,250,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '-60px', left: '-60px',
          width: '280px', height: '280px',
          background: 'radial-gradient(circle, rgba(96,165,250,0.10), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', right: '-40px',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(129,140,248,0.08), transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.6), transparent)',
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close contact form"
          style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '36px', height: '36px',
            borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '28px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.08))',
            border: '1px solid rgba(96,165,250,0.3)',
            marginBottom: '16px',
            boxShadow: '0 0 30px rgba(96,165,250,0.15)',
          }}>
            <Mail size={22} color="#60a5fa" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#fff', margin: '0 0 6px', lineHeight: 1.2 }}>
            Get in Touch
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(148,163,196,0.8)', margin: 0 }}>
            Have a question or want to collaborate? Send us a message.
          </p>
        </div>

        {/* Success state */}
        {state === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '32px 0', position: 'relative', zIndex: 2 }}
          >
            <CheckCircle size={52} color="#00fc40" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff', marginBottom: '8px' }}>
              Message Sent!
            </h3>
            <p style={{ fontSize: '14px', color: 'rgba(148,163,196,0.8)' }}>
              Your email client has opened with the message pre-filled. We'll get back to you soon!
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 2 }}>
            {/* Name + Email row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

            {/* Message textarea */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(148,163,196,0.9)', textTransform: 'uppercase' }}>
                Message <span style={{ color: '#60a5fa' }}>*</span>
              </label>
              <textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '12px 14px',
                  color: '#e8f0ff', fontSize: '14px',
                  resize: 'vertical', outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit', lineHeight: 1.6,
                  minHeight: '100px',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              />
            </div>

            {/* Error state */}
            {state === 'error' && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', borderRadius: '10px',
                background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
                color: '#ff8080', fontSize: '13px',
              }}>
                <AlertCircle size={16} />
                Something went wrong. Please try again.
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={state === 'sending'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '14px 24px',
                borderRadius: '12px', border: 'none',
                background: state === 'sending'
                  ? 'rgba(96,165,250,0.4)'
                  : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                color: '#fff', fontWeight: 700, fontSize: '14px',
                letterSpacing: '0.04em', cursor: state === 'sending' ? 'wait' : 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: state === 'sending' ? 'none' : '0 4px 20px rgba(96,165,250,0.3)',
              }}
              onMouseEnter={e => {
                if (state !== 'sending') {
                  e.currentTarget.style.transform   = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow   = '0 8px 30px rgba(96,165,250,0.45)'
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow   = '0 4px 20px rgba(96,165,250,0.3)'
              }}
            >
              {state === 'sending' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
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

        {/* Spin keyframe */}
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em', color: 'rgba(148,163,196,0.9)', textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: '#60a5fa' }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', padding: '10px 14px',
          color: '#e8f0ff', fontSize: '14px',
          outline: 'none', transition: 'border-color 0.2s ease',
          fontFamily: 'inherit', width: '100%',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(96,165,250,0.5)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
      />
    </div>
  )
}

// ── Main Navbar ──────────────────────────────────────────────────
export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [navVisible, setNavVisible]     = useState(true)
  const [contactOpen, setContactOpen]   = useState(false)
  const lastScrollY                     = useRef(0)
  const location                        = useLocation()

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

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          backdropFilter:       scrolled ? 'blur(12px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none',
          background:           scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
          borderBottom:         scrolled ? '1px solid rgba(96,165,250,0.08)' : 'none',
          transform:            navVisible ? 'translateY(0)' : 'translateY(-110%)',
          transition:           'transform 0.4s cubic-bezier(0.2, 0, 0, 1), backdrop-filter 0.4s ease, background 0.4s ease, border-bottom 0.4s ease',
        }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-400"
          style={{ padding: scrolled ? '10px 24px' : '16px 24px' }}
        >

          {/* ── Left: Hashtag logo + JIMS logo ── */}
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center group" aria-label="Home">
              <img
                src="/hashtag-logo.png"
                alt="Hashtag Official Logo"
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(143,245,255,0.6)]"
                style={{ height: scrolled ? '36px' : '40px', transition: 'height 0.4s ease' }}
              />
            </NavLink>
            <div className="h-6 w-px hidden sm:block" style={{ background: 'rgba(143,245,255,0.2)' }} />
            <a 
              href="https://jimsgn.org/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden sm:block group"
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

          {/* ── Right: Contact Us button (opens modal) ── */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setContactOpen(true)}
              className="btn-ghost flex items-center gap-[8px] text-xs"
              style={{ padding: '8px 20px' }}
            >
              <Mail size={14} className="flex-shrink-0" />
              <span className="leading-none">Contact Us</span>
            </button>
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
                <button
                  onClick={() => { setMobileOpen(false); setContactOpen(true) }}
                  className="btn-primary inline-flex items-center gap-[8px]"
                >
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="leading-none">Contact Us</span>
                </button>
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

      {/* ── Contact Modal ── */}
      <AnimatePresence>
        {contactOpen && (
          <ContactModal onClose={() => setContactOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
