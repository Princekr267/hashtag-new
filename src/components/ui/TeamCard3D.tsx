import React, { useRef, useState, useEffect } from 'react'

export interface TeamMember {
  id?: string
  name: string
  title: string
  avatarUrl: string
  department?: string
  social?: { github?: string; linkedin?: string; instagram?: string }
  isLeader?: boolean
}

/**
 * TeamCard3D — Mobile-first 3D Flip Card
 *
 * Desktop: hover flips the card with 3D tilt tracking
 * Mobile:  tap toggles flip (no hover). Shows "Tap to flip" hint.
 * All layout issues fixed:
 *  - Member name wraps instead of truncating
 *  - Designation is always on one line (ellipsis if super long)
 *  - Back-face avatar stays fully inside the card
 *  - Social links are large, accessible touch targets
 */

interface TeamCard3DProps {
  member: TeamMember
  accentColor?: string
}

const TeamCard3D: React.FC<TeamCard3DProps> = ({ member, accentColor = '#60a5fa' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const isFlippedRef = useRef(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
  }, [])

  /* ── Desktop: hover → flip + tilt ─────────────────────────────── */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || isFlippedRef.current) return
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = e.clientX - (rect.left + rect.width / 2)
    const my = e.clientY - (rect.top + rect.height / 2)
    const rotX = (-my / (rect.height / 2)) * 5
    const rotY = (mx / (rect.width / 2)) * 5
    el.style.transform = `rotateX(${rotX}deg) rotateY(${isFlipped ? 180 + rotY : rotY}deg)`
  }

  const handleMouseEnter = () => {
    if (isTouch) return
    setIsFlipped(true)
    isFlippedRef.current = true
    const el = containerRef.current
    if (el) {
      el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = 'rotateX(0deg) rotateY(180deg)'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return
    const related = e.relatedTarget as Node | null
    if (e.currentTarget.contains(related)) return
    setIsFlipped(false)
    isFlippedRef.current = false
    const el = containerRef.current
    if (el) {
      el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = 'rotateX(0deg) rotateY(0deg)'
    }
  }

  /* ── Mobile: tap → toggle flip ─────────────────────────────────── */
  const handleTap = () => {
    if (!isTouch) return
    const next = !isFlipped
    setIsFlipped(next)
    isFlippedRef.current = next
    const el = containerRef.current
    if (el) {
      el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform = `rotateX(0deg) rotateY(${next ? 180 : 0}deg)`
    }
  }

  return (
    <div
      className="group h-[220px] min-[400px]:h-[250px] sm:h-[320px]"
      style={{ perspective: '900px', width: '100%' }}
      onClick={handleTap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={containerRef}
        className="card-shadow"
        onMouseMove={handleMouseMove}
        style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d', willChange: 'transform',
          transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
          '--glow-color': `${accentColor}80`,
        } as React.CSSProperties}
      >
        {/* ── FRONT FACE ───────────────────────────────────────────── */}
        <div
          className="animated-gradient group-hover-gradient-move glare-effect"
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            borderRadius: '20px', overflow: 'hidden',
            background: `linear-gradient(135deg, ${accentColor}30 0%, #0a0a0a 45%, #050505 55%, ${accentColor}30 100%)`,
            border: `1px solid rgba(255,255,255,0.07)`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.45)`,
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Photo — top 62% */}
          <div style={{ flex: '0 0 62%', overflow: 'hidden', position: 'relative' }}>
            <img
              src={member.avatarUrl}
              alt={member.name}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center top',
                display: 'block',
                transition: 'transform 0.6s ease',
              }}
            />
            {/* Title badge */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
              <span style={{
                display: 'inline-block', padding: '3px 9px',
                borderRadius: '999px', fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: `${accentColor}33`, color: accentColor,
                border: `1px solid ${accentColor}45`,
                whiteSpace: 'nowrap',
              }}>
                {member.title}
              </span>
            </div>
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '56px',
              background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Info — remaining height */}
          <div style={{
            flex: '1 1 0', padding: '12px 14px 14px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px',
            overflow: 'hidden', minHeight: 0,
          }}>
            {/* Name — allow wrapping, no truncation */}
            <h3 style={{
              fontWeight: 700,
              fontSize: 'clamp(0.82rem, 3.5vw, 1rem)',
              color: 'white', lineHeight: 1.25, margin: 0,
              wordBreak: 'break-word',
            }}>
              {member.name}
            </h3>
            {/* Department — single line with ellipsis */}
            <p style={{
              fontSize: '9px', fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: `${accentColor}bb`,
              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {member.department}
            </p>
            {/* Interaction hint — adapts to device */}
            <p className="hidden sm:block" style={{
              fontSize: '8px', color: 'rgba(255,255,255,0.22)', marginTop: '2px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              {isTouch ? 'Tap to flip ✦' : 'Hover to flip ✦'}
            </p>
          </div>

          {/* Top glow edge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
          }} />
        </div>

        {/* ── BACK FACE ────────────────────────────────────────────── */}
        <div
          className="animated-gradient group-hover-gradient-move glare-effect"
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            borderRadius: '20px', overflow: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(135deg, ${accentColor}40 0%, #060d1a 45%, #02060d 55%, ${accentColor}40 100%)`,
            border: `1px solid ${accentColor}35`,
            boxShadow: `0 0 60px ${accentColor}15, inset 0 0 40px ${accentColor}06`,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '16px 12px',
            gap: 'clamp(6px, 1.5vw, 12px)',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
        >
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '20px',
            backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px', opacity: 0.05, pointerEvents: 'none',
          }} />
          {/* Top line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }} />

          {/* Avatar circle — responsive size */}
          <div style={{
            width: '64px', height: '64px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${accentColor}55`,
            boxShadow: `0 0 0 3px ${accentColor}18`,
            flexShrink: 0,
            position: 'relative', zIndex: 2,
          }}>
            <img
              src={member.avatarUrl}
              alt={member.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              onError={e => {
                const img = e.currentTarget
                img.onerror = null
                img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=071428&textColor=${accentColor.replace('#', '')}`
              }}
            />
          </div>

          {/* Name + role */}
          <div style={{
            textAlign: 'center', position: 'relative', zIndex: 2,
            width: '100%', overflow: 'hidden',
            padding: '0 4px',
          }}>
            <h3 style={{
              fontWeight: 700, fontSize: 'clamp(0.7rem, 3.2vw, 1rem)', color: 'white',
              margin: '0 0 3px 0', lineHeight: 1.2,
              wordBreak: 'break-word',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as any,
              overflow: 'hidden',
            }}>
              {member.name}
            </h3>
            <p style={{
              fontSize: 'clamp(7px, 1.8vw, 9px)', fontWeight: 600, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: accentColor, margin: 0,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {member.title}
            </p>
          </div>

          {/* Divider */}
          <div style={{
            width: '28px', height: '1px', flexShrink: 0,
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          }} />

          {/* Social links — responsive touch targets */}
          <div style={{
            display: 'flex', gap: 'clamp(6px, 1.5vw, 10px)', flexWrap: 'wrap', justifyContent: 'center',
            position: 'relative', zIndex: 10, pointerEvents: 'auto',
          }}>
            {member.social?.github && (
              <BackSocialBtn href={member.social.github} label="GitHub" accent={accentColor}>
                <GitHubIcon />
              </BackSocialBtn>
            )}
            {member.social?.linkedin && (
              <BackSocialBtn href={member.social.linkedin} label="LinkedIn" accent={accentColor}>
                <LinkedInIcon />
              </BackSocialBtn>
            )}
            {member.social?.instagram && (
              <BackSocialBtn href={member.social.instagram} label="Instagram" accent={accentColor}>
                <InstagramIcon />
              </BackSocialBtn>
            )}
          </div>

          {/* Bottom label — flows in flexbox, not absolute */}
          <p style={{
            fontSize: 'clamp(6px, 1.5vw, 8px)', fontWeight: 600, letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase',
            margin: 0, zIndex: 2, flexShrink: 0,
            marginTop: 'auto',
          }}>
            HASHTAG OFFICIAL
          </p>
        </div>

      </div>
    </div>
  )
}

/* ── Back-face social button ─────────────────────────────────────── */
const BackSocialBtn: React.FC<{
  href: string; label: string; accent: string; children: React.ReactNode
}> = ({ href, label, accent, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    onClick={e => e.stopPropagation()}
    style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      // Larger size for touch accessibility — responsive
      width: 'clamp(36px, 10vw, 44px)', height: 'clamp(36px, 10vw, 44px)', borderRadius: '50%',
      background: `${accent}18`, color: accent,
      border: `1px solid ${accent}40`,
      transition: 'all 0.2s ease',
      cursor: 'pointer', pointerEvents: 'auto',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
    }}
    onMouseEnter={e => {
      e.stopPropagation()
      e.currentTarget.style.background = accent
      e.currentTarget.style.color = '#000'
      e.currentTarget.style.transform = 'scale(1.1)'
    }}
    onMouseLeave={e => {
      e.stopPropagation()
      e.currentTarget.style.background = `${accent}18`
      e.currentTarget.style.color = accent
      e.currentTarget.style.transform = 'scale(1)'
    }}
  >
    {children}
  </a>
)

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export default TeamCard3D
