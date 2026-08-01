import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink, Clock, Trophy, MapPin, Users, Award, Tag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { EVENTS, type Event } from '../constants/data'
import { useCountdown } from '../hooks/useCountdown'
import { DirectionAwareHover } from '../components/ui/direction-aware-hover'

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
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
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
      <DirectionAwareHover
        imageUrl={event.poster || ''}
        className="w-full h-full rounded-[30px] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.4)] cursor-pointer"
        imageClassName="w-full h-full object-cover"
        childrenClassName="w-full h-full"
      >
        <div
          ref={cardRef}
          className="relative h-full w-full flex flex-col justify-end overflow-hidden"
          onClick={() => navigate(`/events/${event.id}`)}
          onMouseMove={handleMouseMove}
        >
          {/* Subtle gradient vignette to overlay details */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b14] via-[#060b14]/75 to-[#060b14]/15 group-hover:via-[#060b14]/85 transition-colors duration-500 pointer-events-none" />

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
      </DirectionAwareHover>
    </motion.div>
  )
}


// ── Featured upcoming event card with animated gradient border ──
function FeaturedEventCard({ event }: { event: Event }): JSX.Element {
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${x}%`)
    el.style.setProperty('--my', `${y}%`)
  }, [isMobile])

  const countdown = useCountdown(new Date('2026-09-11T09:00:00'))

  const segments = [
    event.duration,
    event.venue,
    event.eligibility?.split('.')[0]
  ].filter(Boolean)
  const subtitleText = segments.join(' · ')

  const pillBaseStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    padding: '3px 9px',
    borderRadius: '9999px'
  }

  const timeUnits = [
    { label: 'Days', value: countdown.days },
    { label: 'Hrs', value: countdown.hours },
    { label: 'Min', value: countdown.minutes },
    { label: 'Sec', value: countdown.seconds }
  ]

  const stats = [
    {
      key: 'prizePool',
      label: 'Prize Pool',
      value: event.prizePool,
      accentColor: '#edac03',
      accentColorLighter: '#ffe066',
      width: '80%'
    },
    {
      key: 'duration',
      label: 'Duration',
      value: event.duration,
      accentColor: '#60a5fa',
      accentColorLighter: '#93c5fd',
      width: '60%'
    },
    {
      key: 'teamSize',
      label: 'Team Size',
      value: event.teamSize ? event.teamSize.replace(/\s*[Rr]equired/, '') : undefined,
      accentColor: '#818cf8',
      accentColorLighter: '#a5b4fc',
      width: '40%'
    },
    {
      key: 'tracks',
      label: 'Tracks',
      value: event.tracks ? `${event.tracks.length} Tracks` : null,
      accentColor: '#10b981',
      accentColorLighter: '#34d399',
      width: '70%'
    }
  ].filter((s): s is typeof s & { value: string } => s.value !== undefined && s.value !== null && s.value !== '')

  const keyframesStyle = (
    <style dangerouslySetInnerHTML={{
      __html: `
      @keyframes fec_gradBorderSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes fec_scanline {
        0% { top: -2px; }
        100% { top: 102%; }
      }
      @keyframes fec_orbDrift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -20px) scale(1.06); }
        66% { transform: translate(-20px, 25px) scale(0.94); }
      }
      @keyframes fec_particleDrift {
        0% { transform: translateY(0) translateX(0); opacity: 0.7; }
        100% { transform: translateY(-55px) translateX(15px); opacity: 0; }
      }
      @keyframes fec_pulseGreen {
        0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6); }
        50% { box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
      }
      @keyframes fec_textShimmer {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
      @keyframes fec_shimmerBtn {
        0% { transform: translateX(0); }
        100% { transform: translateX(500%); }
      }
      @keyframes fec_cdFlip {
        0% { opacity: 0; transform: translateY(8px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes fec_statReveal {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fec_progressFill {
        from { width: 0; }
        to { width: var(--pw); }
      }
      .fec-inner-card .fec-mouse-glow {
        opacity: 0;
        transition: opacity 0.4s;
      }
      .fec-inner-card:hover .fec-mouse-glow {
        opacity: 1;
      }
      .fec-register-btn {
        transition: all 0.3s ease;
        border: 1px solid transparent;
        box-shadow: 0 4px 12px rgba(237, 172, 3, 0.2);
      }
      .fec-register-btn:hover {
        background: #221643 !important;
        color: #edac03 !important;
        border-color: #edac03 !important;
        box-shadow: 0 0 20px rgba(34, 22, 67, 0.6) !important;
        transform: translateY(-1px);
      }
      .fec-details-btn {
        transition: all 0.3s ease;
      }
      .fec-details-btn:hover {
        background: linear-gradient(45deg, #edac03, #ffcf40) !important;
        color: #221643 !important;
        border-color: transparent !important;
        box-shadow: 0 0 20px rgba(237, 172, 3, 0.45) !important;
        transform: translateY(-1px);
      }
    `}} />
  )

  return (
    <>
      {keyframesStyle}
      <motion.div
        whileHover={{ scale: 1.01, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/events/${event.id}`)}
        className="cursor-pointer w-full select-none"
      >
        {/* Spinning conic border layer */}
        <div style={{ position: 'relative', padding: '2px', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            width: '220%',
            height: '220%',
            inset: '-60%',
            background: 'conic-gradient(from 0deg, transparent 0deg, #edac03 35deg, #ffcf40 65deg, transparent 100deg, transparent 210deg, #60a5fa 250deg, #818cf8 290deg, transparent 330deg, transparent 360deg)',
            animation: 'fec_gradBorderSpin 4s linear infinite',
            zIndex: 0
          }} />

          {/* Inner card on top */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="fec-inner-card"
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(145deg, #0d1529 0%, #060b14 60%, #0a0e1a 100%)',
              borderRadius: '22px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: (isMobile || isTablet) ? 'column' : 'row'
            }}
          >
            {/* Mouse tracking glow */}
            <div
              className="fec-mouse-glow"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 1,
                background: 'radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(237,172,3,0.1), transparent 60%)'
              }}
            />

            {/* Scanline sweep */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.5), rgba(237,172,3,0.3), transparent)',
              pointerEvents: 'none',
              zIndex: 20,
              animation: 'fec_scanline 3.5s ease-in-out infinite'
            }} />

            {/* Ambient glow orbs */}
            <div style={{
              position: 'absolute',
              borderRadius: '50%',
              pointerEvents: 'none',
              width: '300px',
              height: '300px',
              top: '-120px',
              left: '-80px',
              background: 'radial-gradient(circle, rgba(237,172,3,0.1) 0%, transparent 70%)',
              animation: 'fec_orbDrift 14s ease-in-out infinite',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              borderRadius: '50%',
              pointerEvents: 'none',
              width: '220px',
              height: '220px',
              bottom: '-80px',
              right: '160px',
              background: 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)',
              animation: 'fec_orbDrift 18s ease-in-out infinite',
              animationDelay: '-4s',
              zIndex: 0
            }} />

            {/* Floating particles */}
            <div style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              pointerEvents: 'none',
              left: '18%',
              top: '25%',
              background: '#edac03',
              animation: 'fec_particleDrift 2.3s ease-in infinite',
              animationDelay: '0s',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              pointerEvents: 'none',
              left: '30%',
              top: '60%',
              background: '#60a5fa',
              animation: 'fec_particleDrift 1.9s ease-in infinite',
              animationDelay: '0.8s',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              pointerEvents: 'none',
              left: '48%',
              top: '35%',
              background: '#818cf8',
              animation: 'fec_particleDrift 2.6s ease-in infinite',
              animationDelay: '1.5s',
              zIndex: 0
            }} />
            <div style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              pointerEvents: 'none',
              left: '65%',
              top: '70%',
              background: '#edac03',
              animation: 'fec_particleDrift 2.1s ease-in infinite',
              animationDelay: '0.3s',
              zIndex: 0
            }} />

            {/* ── Portrait Poster Panel (left/top) ── */}
            {event.poster && (
              <div style={{
                flexShrink: 0,
                padding: (isMobile || isTablet) 
                  ? (isMobile ? '1.25rem 1.25rem 0 1.25rem' : '1.5rem 1.5rem 0 1.5rem')
                  : '1.5rem 0 1.5rem 1.5rem',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: (isMobile || isTablet) ? '100%' : '260px',
                  height: (isMobile || isTablet) ? (isMobile ? '240px' : '320px') : 'auto',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(237,172,3,0.07)'
                }}>
                  <img
                    src={event.poster}
                    alt={event.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      display: 'block',
                      transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {/* Bottom fade */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(6,11,20,0.55) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }} />
                </div>
              </div>
            )}

            {/* ── Right content panel ── */}
            <div style={{
              flex: 1,
              minWidth: 0,
              padding: isMobile 
                ? '1.25rem 1.25rem' 
                : (isTablet ? '1.75rem 2rem' : '2.25rem 2.5rem')
            }}>

            {/* Top Row Layout */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1.5rem',
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Left Column */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
                {/* Live Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.3)',
                  background: 'rgba(16,185,129,0.07)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981',
                    animation: 'fec_pulseGreen 1.6s ease infinite'
                  }} />
                  Registrations Live
                </div>

                {/* Shimmer title */}
                <h2 style={{
                  fontSize: isMobile ? '22px' : '30px',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  marginBottom: '8px',
                  fontFamily: "'Outfit', sans-serif",
                  background: 'linear-gradient(90deg, #fff 0%, #fff 35%, #edac03 52%, #ffe066 62%, #fff 75%, #fff 100%)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'fec_textShimmer 4s linear infinite'
                }}>
                  {event.title}
                </h2>

                {/* Subtitle */}
                {subtitleText && (
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(148,163,196,0.7)',
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: '14px'
                  }}>
                    {subtitleText}
                  </div>
                )}

                {/* Pill tags row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                  {event.prizePool && (
                    <span style={{
                      ...pillBaseStyle,
                      color: '#edac03',
                      border: '1px solid rgba(237,172,3,0.25)',
                      background: 'rgba(237,172,3,0.07)'
                    }}>
                      {event.prizePool}
                    </span>
                  )}
                  {event.duration && (
                    <span style={{
                      ...pillBaseStyle,
                      color: '#60a5fa',
                      border: '1px solid rgba(96,165,250,0.25)',
                      background: 'rgba(96,165,250,0.07)'
                    }}>
                      {event.duration}
                    </span>
                  )}
                  {event.teamSize && (
                    <span style={{
                      ...pillBaseStyle,
                      color: '#a78bfa',
                      border: '1px solid rgba(167,139,250,0.25)',
                      background: 'rgba(167,139,250,0.07)'
                    }}>
                      {event.teamSize}
                    </span>
                  )}
                  {event.tracks && (
                    <span style={{
                      ...pillBaseStyle,
                      color: '#10b981',
                      border: '1px solid rgba(16,185,129,0.25)',
                      background: 'rgba(16,185,129,0.07)'
                    }}>
                      {event.tracks.length} Tracks
                    </span>
                  )}
                </div>

                {/* Actions row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {event.registerUrl && (
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="fec-register-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        background: 'linear-gradient(45deg, #edac03, #ffcf40)',
                        color: '#221643',
                        fontWeight: 800,
                        fontSize: '12px',
                        letterSpacing: '0.1em',
                        padding: '10px 22px',
                        borderRadius: '9999px',
                        position: 'relative',
                        overflow: 'hidden',
                        textDecoration: 'none'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-40%',
                        width: '35%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        animation: 'fec_shimmerBtn 2.2s ease infinite'
                      }} />
                      <span>Register Now</span>
                      <ExternalLink size={12} className="flex-shrink-0" />
                    </a>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event.id}`);
                    }}
                    className="fec-details-btn"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      border: '1px solid rgba(96,165,250,0.3)',
                      color: '#60a5fa',
                      fontWeight: 700,
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      padding: '9px 18px',
                      borderRadius: '9999px',
                      background: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={11} className="flex-shrink-0" />
                  </button>
                </div>
              </div>

              {/* Right Column — countdown */}
              {event.status === 'upcoming' && (
                <div style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: (isMobile || isTablet) ? 'center' : 'flex-end',
                  position: 'relative',
                  zIndex: 2,
                  width: (isMobile || isTablet) ? '100%' : 'auto',
                  marginTop: (isMobile || isTablet) ? '1rem' : 0
                }}>
                  {/* Countdown label */}
                  <div style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(148,163,196,0.38)',
                    textAlign: (isMobile || isTablet) ? 'center' : 'right'
                  }}>
                    Event starts in
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {timeUnits.map((unit, index) => (
                      <React.Fragment key={unit.label}>
                        {index > 0 && (
                          <span style={{
                            fontSize: '18px',
                            color: 'rgba(96,165,250,0.2)',
                            paddingTop: '5px',
                            fontWeight: 'bold'
                          }}>
                            :
                          </span>
                        )}
                        <div style={{
                          background: 'rgba(96,165,250,0.06)',
                          border: '1px solid rgba(96,165,250,0.18)',
                          borderRadius: '12px',
                          padding: '8px 10px',
                          minWidth: '54px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.5), transparent)'
                          }} />
                          <span
                            key={unit.value}
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '25px',
                              fontWeight: 700,
                              color: '#60a5fa',
                              lineHeight: 1,
                              animation: 'fec_cdFlip 0.3s ease'
                            }}
                          >
                            {String(unit.value).padStart(2, '0')}
                          </span>
                          <span style={{
                            fontSize: '8px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'rgba(148,163,196,0.38)',
                            marginTop: '3px'
                          }}>
                            {unit.label}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Horizontal divider */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
              margin: '1.5rem 0'
            }} />

            {/* Bottom stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '12px',
              position: 'relative',
              zIndex: 2
            }}>
              {stats.map((stat, idx) => (
                <div
                  key={stat.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    animation: 'fec_statReveal 0.5s ease both',
                    animationDelay: `${0.1 * idx}s`
                  }}
                >
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: stat.accentColor,
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                    {stat.value}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(148,163,196,0.4)'
                  }}>
                    {stat.label}
                  </span>
                  <div style={{
                    height: '3px',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginTop: '6px'
                  }}>
                    <div
                      style={{
                        height: '100%',
                        borderRadius: '9999px',
                        background: `linear-gradient(90deg, ${stat.accentColor}, ${stat.accentColorLighter})`,
                        animation: 'fec_progressFill 2s cubic-bezier(0.16,1,0.3,1) both',
                        animationDelay: `${0.2 + 0.2 * idx}s`,
                        width: 0,
                        ['--pw' as any]: stat.width
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            </div>{/* end right content panel */}
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function Events(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  const filtered = EVENTS.filter((e) => statusFilter === 'All' || e.status === statusFilter)
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
                  className={`px-4 py-2 text-xs font-label tracking-widest uppercase transition-all duration-200 ${statusFilter === s
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
            className="events-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 xl:gap-12"
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
