import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EVENTS, type Event } from '../constants/data'
import CountdownTimer from '../components/ui/CountdownTimer'

const STATUS = ['All', 'upcoming', 'past'] as const
type StatusFilter = typeof STATUS[number]

// ── Change 5: Magnetic Register Button ────────────────────────
function MagneticRegisterBtn({ href, children, gradientFrom, gradientTo }: { href: string; children: React.ReactNode; gradientFrom: string; gradientTo: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  const resetBtn = useCallback(() => {
    const el = wrapRef.current
    const inner = innerRef.current
    if (!el || !inner) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform = 'translate(0px, 0px)'
    inner.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    inner.style.transform = 'translate(0px, 0px)'
  }, [])

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return
    const el = wrapRef.current
    const inner = innerRef.current
    if (!el || !inner) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width  / 2
    const cy = rect.top  + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist > 80) { resetBtn(); return }
    el.style.transition = 'transform 0.15s ease-out'
    el.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`
    inner.style.transition = 'transform 0.15s ease-out'
    inner.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`
  }, [isTouchDevice, resetBtn])

  return (
    <div ref={wrapRef} style={{ display: 'inline-block' }} onMouseMove={onMove} onMouseLeave={resetBtn}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="btn-primary inline-flex"
        style={{ 
          padding: '10px 20px', 
          fontSize: '0.75rem',
          background: `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})`,
          border: 'none',
          color: 'white',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = `0 8px 25px rgba(0,0,0,0.3)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span ref={innerRef} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
          {children}
        </span>
      </a>
    </div>
  )
}

// ── Polaroid tilt seeded by index ─────────────────────────────
function getPolaroidRotation(idx: number): number {
  // Deterministic "random" rotation between -3 and +3 deg
  return ((idx * 137.5) % 7) - 3
}

// ── Event card — shiny matte gradient finish ───────────────────
function EventCard({ event, idx }: { event: Event; idx: number }): JSX.Element {
  const isPast   = event.status === 'past'
  const rotation = getPolaroidRotation(idx)
  const navigate = useNavigate()
  const cardRef  = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width)  * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className={`p-4 h-full min-h-[420px] event-card ${isPast ? 'polaroid-card' : ''}`}
      style={isPast ? { transform: `rotate(${rotation}deg)`, zIndex: 1 } : undefined}
    >
      <div
        ref={cardRef}
        className="h-full block cursor-pointer"
        onClick={() => navigate(`/events/${event.id}`)}
        onMouseMove={handleMouseMove}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${event.gradientFrom}30`
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
          e.currentTarget.style.background = `radial-gradient(circle at 50% 100%, ${event.gradientFrom}15, rgba(10,14,24,0.8) 70%)`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.background = 'rgba(10,14,24,0.8)'
        }}
      >
        {/* Mouse-tracking glare spotlight */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, borderRadius: '18px',
            background: `radial-gradient(circle at var(--mx, 50%) var(--my, 0%), ${event.gradientFrom}20 0%, transparent 55%)`,
            pointerEvents: 'none', zIndex: 1,
          }}
        />
        {/* Top sheen line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, ${event.gradientFrom}70, ${event.gradientTo}70, transparent)`,
          zIndex: 2,
        }} />

        {/* Gradient accent bar */}
        <div
          className="h-[3px] w-full relative z-[3]"
          style={{ background: `linear-gradient(90deg, ${event.gradientFrom}, ${event.gradientTo})` }}
        />

        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full h-48 md:w-48 md:h-full overflow-hidden bg-slate-950 flex-shrink-0">
            {event.poster ? (
              <img
                src={event.poster}
                alt={`${event.title} poster`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-900" />
            )}
          </div>

          <div className="p-5 md:p-7 flex flex-col flex-1 gap-4 event-card-content">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="text-xs font-label tracking-widest"
                  style={{ color: event.gradientFrom }}
                >
                  {event.tag.toUpperCase()}
                </span>
                <h3 className="text-xl font-display font-bold mt-1.5 text-text-primary">
                  {event.title}
                </h3>
              </div>
              {event.status === 'upcoming' && (
                <span className="pill pill-live flex-shrink-0 text-xs">LIVE SOON</span>
              )}
              {event.status === 'past' && (
                <span
                  className="text-[10px] font-label tracking-widest px-2 py-1 rounded border opacity-50"
                  style={{ color: event.gradientFrom, borderColor: `${event.gradientFrom}40` }}
                >
                  COMPLETED
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-text-muted text-sm font-body leading-relaxed flex-1 line-clamp-4">
              {event.description}
            </p>

            {/* Footer */}
            <div className="mt-auto pt-4 flex items-center justify-between">
              {event.registerUrl && event.status === 'upcoming' && (
                <MagneticRegisterBtn href={event.registerUrl} gradientFrom={event.gradientFrom} gradientTo={event.gradientTo}>
                  <span className="leading-none">Register Now</span> <ExternalLink size={13} className="flex-shrink-0" />
                </MagneticRegisterBtn>
              )}
              {event.status === 'past' && (
                <div
                  className="flex items-center gap-[8px] text-xs font-label"
                  style={{ color: event.gradientFrom + 'aa' }}
                >
                  <span className="leading-none">Completed</span>
                  <ArrowRight size={12} className="flex-shrink-0" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


// ── Featured upcoming event card with animated gradient border ─
function FeaturedEventCard({ event }: { event: Event }): JSX.Element {
  const navigate = useNavigate()
  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/events/${event.id}`)}
      className="event-gradient-border block cursor-pointer h-full"
    >
      <div className="event-gradient-inner surface-card p-10 h-full flex flex-col">
        <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
          <div>
            <span className="pill pill-live inline-flex mb-4">LIVE SOON</span>
            <h2 className="text-3xl font-display font-bold text-text-primary">
              {event.title}
            </h2>
          </div>
          {/* Live countdown */}
          <CountdownTimer
            targetDate={new Date('2025-05-15T10:00:00')}
            label="Event starts in"
          />
        </div>

        <p className="text-text-muted font-body leading-relaxed mb-8 max-w-lg flex-grow">
          {event.description}
        </p>

        {event.registerUrl && (
          <MagneticRegisterBtn href={event.registerUrl} gradientFrom={event.gradientFrom} gradientTo={event.gradientTo}>
            <span className="leading-none">Register Now</span> <ExternalLink size={15} className="flex-shrink-0" />
          </MagneticRegisterBtn>
        )}
      </div>
    </motion.div>
  )
}

export default function Events(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  const filtered  = EVENTS.filter((e) => statusFilter === 'All' || e.status === statusFilter)
 const upcoming = EVENTS.filter(
  (e) => e.status === 'upcoming'
) || []

  return (
    <div className="relative z-10 pt-20">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            <span className="pill pill-cyan mb-6 inline-flex">Events</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              We Build,<br />
              <span className="text-gradient">We Compete</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-xl font-body leading-relaxed">
              From hackathons with Microsoft to cryptic hunts —
              every Hashtag event is an experience.
            </p>
          </motion.div>

          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block pointer-events-none" style={{
            background: 'radial-gradient(ellipse 70% 80% at 80% 40%, rgba(96,165,250,0.06), transparent 70%)',
          }} />
        </div>
      </section>

      {/* ── UPCOMING HIGHLIGHT — animated gradient border ─────── */}
      {upcoming.length > 0 && (
        <section className="section-sm px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <span className="text-xs font-label text-secondary tracking-widest">COMING NEXT</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((event) => (
                <FeaturedEventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL EVENTS ────────────────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold mb-8">
              All <span className="text-gradient">Events</span>
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              {STATUS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 text-xs font-label tracking-widest uppercase transition-all duration-200 ${
                    statusFilter === s
                      ? 'bg-secondary text-bg-base'
                      : 'text-text-muted border border-outline-var hover:text-secondary hover:border-secondary'
                  }`}
                >
                  {s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid — past events have polaroid tilt */}
          <motion.div
            layout
            className="events-grid grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((event, idx) => (
                <div
                  key={event.id}
                  className="h-full"
                  style={{
                    borderRight: (idx % 2 === 0) ? '1px solid rgba(143,245,255,0.05)' : 'none',
                    borderBottom: '1px solid rgba(143,245,255,0.05)',
                    position: 'relative',
                  }}
                >
                  <EventCard event={event} idx={idx} />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-text-faint font-label tracking-widest">
              NO EVENTS MATCHING FILTERS
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
