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
  const navigate = useNavigate()
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="h-full"
    >
      <div
        ref={cardRef}
        className="relative group h-full flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#08101d]/95 shadow-[0_18px_50px_rgba(0,0,0,0.24)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_70px_rgba(0,0,0,0.26)] cursor-pointer"
        onClick={() => navigate(`/events/${event.id}`)}
        onMouseMove={handleMouseMove}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--mx, 50%) var(--my, 0%), ${event.gradientFrom}18, transparent 35%)`,
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <div className="overflow-hidden h-52 sm:h-56 bg-slate-950">
          {event.poster ? (
            <img
              src={event.poster}
              alt={`${event.title} poster`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-slate-900" />
          )}
        </div>

        <div className="relative z-10 flex flex-col flex-1 p-5 sm:p-6 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <span className="text-xs font-label tracking-[0.28em] uppercase" style={{ color: event.gradientFrom }}>
                {event.tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold mt-3 text-white leading-tight break-words">
                {event.title}
              </h3>
            </div>
            <div className="shrink-0">
              {event.status === 'upcoming' ? (
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/80">
                  Live Soon
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">
                  Completed
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-text-muted leading-relaxed flex-1 line-clamp-4 break-words">
            {event.description}
          </p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
            {event.status === 'upcoming' && event.registerUrl ? (
              <MagneticRegisterBtn href={event.registerUrl} gradientFrom={event.gradientFrom} gradientTo={event.gradientTo}>
                <span className="leading-none">Register Now</span> <ExternalLink size={13} className="flex-shrink-0" />
              </MagneticRegisterBtn>
            ) : (
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">Past event</span>
            )}
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
            className="events-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((event, idx) => (
                <EventCard key={event.id} event={event} idx={idx} />
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
