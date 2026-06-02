import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink, Clock, Trophy, MapPin, Users, Award, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EVENTS, type Event } from '../constants/data'
import CountdownTimer from '../components/ui/CountdownTimer'

const STATUS = ['All', 'upcoming', 'past'] as const
type StatusFilter = typeof STATUS[number]

// ── Magnetic Register Button (Gold/Yellow) ──────────────────
function MagneticRegisterBtn({ 
  href, 
  children, 
  isLarge
}: { 
  href: string; 
  children: React.ReactNode; 
  isLarge?: boolean
}) {
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
        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold font-mono tracking-wider transition-all duration-300"
        style={{ 
          padding: isLarge ? '14px 32px' : '10px 20px', 
          fontSize: isLarge ? '0.85rem' : '0.75rem',
          background: 'linear-gradient(45deg, #edac03, #ffcf40)',
          color: '#221643',
          border: '1px solid transparent',
          boxShadow: '0 4px 15px rgba(237, 172, 3, 0.25)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#edac03';
          e.currentTarget.style.border = '1px solid #edac03';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(237,172,3,0.35)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(45deg, #edac03, #ffcf40)';
          e.currentTarget.style.color = '#221643';
          e.currentTarget.style.border = '1px solid transparent';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(237, 172, 3, 0.25)';
          e.currentTarget.style.transform = 'translateY(0)';
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="h-[380px] sm:h-[440px]"
    >
      <div
        ref={cardRef}
        className="relative group h-full flex flex-col justify-end overflow-hidden rounded-[30px] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-pointer"
        onClick={() => navigate(`/events/${event.id}`)}
        onMouseMove={handleMouseMove}
      >
        {/* Background square poster */}
        <div className="absolute inset-0 z-0">
          {event.poster ? (
            <img
              src={event.poster}
              alt={`${event.title} poster`}
              className="w-full h-full object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#121c38] to-[#08101d]" />
          )}
          {/* Subtle gradient vignette to overlay details */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b14] via-[#060b14]/75 to-[#060b14]/15 group-hover:via-[#060b14]/85 transition-colors duration-500" />
        </div>

        {/* Glowing hover light tracking */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background: `radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), ${event.gradientFrom}15, transparent 60%)`,
          }}
        />

        {/* Dynamic Glow Side Accent */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-[4px] opacity-80 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: `linear-gradient(to bottom, ${event.gradientFrom}, ${event.gradientTo})` }}
        />

        {/* Content Box */}
        <div className="relative z-20 p-6 sm:p-7 flex flex-col gap-4 w-full">
          
          <div className="space-y-2">
            {/* Category tag & Status */}
            <div className="flex items-center justify-between gap-4">
              <span 
                className="text-[9px] font-mono tracking-[0.25em] font-semibold uppercase px-2.5 py-0.5 rounded border"
                style={{ 
                  color: event.gradientFrom, 
                  borderColor: `${event.gradientFrom}20`, 
                  background: `${event.gradientFrom}08` 
                }}
              >
                {event.tag}
              </span>
              <div className="shrink-0">
                {event.status === 'upcoming' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.1)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-white/5 bg-white/5 px-2.5 py-0.5 text-[8px] font-mono tracking-wider text-white/40 uppercase">
                    Completed
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight break-words">
              {event.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2 break-words font-body transition-opacity duration-300 group-hover:text-white/90">
            {event.description}
          </p>

          {/* Event Quick Info Pills */}
          {(event.duration || event.prizePool) && (
            <div className="flex flex-wrap items-center gap-2">
              {event.duration && (
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg text-[9px] font-mono text-white/90">
                  <Clock size={10} className="flex-shrink-0" style={{ color: event.gradientFrom }} />
                  <span>{event.duration}</span>
                </div>
              )}
              {event.prizePool && (
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg text-[9px] font-mono text-white/90">
                  <Trophy size={10} className="flex-shrink-0" style={{ color: event.gradientTo }} />
                  <span>{event.prizePool}</span>
                </div>
              )}
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-2">
            {event.status === 'upcoming' && event.registerUrl ? (
              <MagneticRegisterBtn 
                href={event.registerUrl} 
              >
                <span className="leading-none text-[11px] tracking-wider">Register Now</span> 
                <ExternalLink size={11} className="flex-shrink-0" />
              </MagneticRegisterBtn>
            ) : (
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/30">
                // COMPLETED EVENT
              </span>
            )}
            
            <span className="text-[9px] font-mono tracking-[0.15em] text-white/20 uppercase group-hover:text-white/40 transition-colors duration-300">
              Details →
            </span>
          </div>
        </div>

      </div>
    </motion.div>
  )
}


// ── Featured upcoming event card with animated gradient border ──
function FeaturedEventCard({ event }: { event: Event }): JSX.Element {
  const navigate = useNavigate()
  const innerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return
    const el = innerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }, [])

  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/events/${event.id}`)}
      className="event-gradient-border block cursor-pointer h-full group"
    >
      <div 
        ref={innerRef}
        onMouseMove={handleMouseMove}
        className="event-gradient-inner p-8 sm:p-10 h-full flex flex-col relative overflow-hidden group/inner"
        style={{
          background: `radial-gradient(circle at 30% 25%, #221643 0%, #060b14 100%)`,
        }}
      >
        {/* Subtle static gradient corner highlights */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 group-hover/inner:opacity-35 transition-opacity duration-500" 
          style={{
            background: `radial-gradient(circle at 0% 0%, ${event.gradientFrom}15, transparent 40%), radial-gradient(circle at 100% 100%, ${event.gradientTo}22, transparent 40%)`
          }}
        />

        {/* Glowing hover light tracking */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/inner:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: `radial-gradient(350px circle at var(--mx, 50%) var(--my, 50%), ${event.gradientFrom}12, transparent 60%)`,
          }}
        />

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="pill pill-live inline-flex">REGISTRATIONS LIVE</span>
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-white/10 text-white/70 bg-white/5"
              >
                <Tag size={10} />
                {event.tag}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-primary leading-tight">
              {event.title}
            </h2>
          </div>
          {/* Live countdown */}
          <CountdownTimer
            targetDate={new Date('2026-09-11T09:00:00')}
            label="Event starts in"
          />
        </div>

        <p className="text-text-muted font-body leading-relaxed mb-6 max-w-xl flex-grow relative z-10 text-sm sm:text-base">
          {event.description}
        </p>

        {/* Quick info pills with icons & gradient effects */}
        {(event.prizePool || event.duration || event.venue) && (
          <div className="flex flex-wrap items-center gap-2.5 mb-8 relative z-10">
            {event.prizePool && (
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-[#edac03] border border-[#edac03]/25 bg-[#edac03]/5 transition-all duration-300 hover:scale-105"
              >
                <Trophy size={12} />
                <span>{event.prizePool}</span>
              </div>
            )}
            {event.duration && (
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-[#c084fc] border border-[#c084fc]/25 bg-[#c084fc]/5 transition-all duration-300 hover:scale-105"
              >
                <Clock size={12} />
                <span>{event.duration}</span>
              </div>
            )}
            {event.venue && (
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-[#60a5fa] border border-[#60a5fa]/25 bg-[#60a5fa]/5 transition-all duration-300 hover:scale-105"
              >
                <MapPin size={12} />
                <span>{event.venue}</span>
              </div>
            )}
          </div>
        )}

        {event.registerUrl && (
          <div className="relative z-10">
            <MagneticRegisterBtn 
              href={event.registerUrl} 
              isLarge={true}
            >
              <span className="leading-none text-sm tracking-wider font-semibold">Register Now</span> <ExternalLink size={15} className="flex-shrink-0" />
            </MagneticRegisterBtn>
          </div>
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
            <div className="max-w-4xl mx-auto">
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
