import React, { useRef, useState } from 'react'
import { TeamMember } from '../../constants/data'

/**
 * TeamCard3D — Fix 3
 *
 * On hover: card flips 180° around Y axis (CSS 3D flip)
 * Front: photo + name + role + department (with cursor-tracked 3D tilt on the whole scene)
 * Back:  dark glass with accent gradient, member name, role, social links, quote icon
 * Social links fully clickable on both faces.
 */

interface TeamCard3DProps {
  member: TeamMember
  accentColor?: string
}

const TeamCard3D: React.FC<TeamCard3DProps> = ({ member, accentColor = '#60a5fa' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  // 3D tilt tracking on the whole card container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const mx   = e.clientX - cx
    const my   = e.clientY - cy
    const rotX = (-my / (rect.height / 2)) * 6
    const rotY = ( mx / (rect.width  / 2)) * 6
    el.style.transform = `rotateX(${rotX}deg) rotateY(${isFlipped ? 180 + rotY : rotY}deg)`
  }

  const handleMouseEnter = () => {
    setIsFlipped(true)
    const el = containerRef.current
    if (el) el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
  }

  const handleMouseLeave = () => {
    setIsFlipped(false)
    const el = containerRef.current
    if (el) {
      el.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transform  = 'rotateX(0deg) rotateY(0deg)'
    }
  }

  return (
    <>
      <div
        style={{ perspective: '900px', width: '100%', aspectRatio: '3 / 4' }}
        onClick={() => { if ('ontouchstart' in window) setIsFlipped(f => !f) }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          style={{
            position: 'relative', width: '100%', height: '100%',
            transformStyle: 'preserve-3d', willChange: 'transform',
            transform: isFlipped ? 'rotateX(0deg) rotateY(180deg)' : 'rotateX(0deg) rotateY(0deg)',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >

          {/* ── FRONT FACE ──────────────────────────────────── */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
              borderRadius: '20px', overflow: 'hidden',
              background: '#0a0a0a',
              border: `1px solid rgba(255,255,255,0.07)`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.45)`,
            }}
          >
            {/* Photo — top 65% */}
            <div style={{ height: '65%', overflow: 'hidden', position: 'relative' }}>
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
              <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
                <span style={{
                  display: 'inline-block', padding: '2px 10px',
                  borderRadius: '999px', fontSize: '9px', fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  backdropFilter: 'blur(8px)',
                  background: `${accentColor}22`, color: accentColor,
                  border: `1px solid ${accentColor}45`,
                }}>
                  {member.title}
                </span>
              </div>
              {/* Fade */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '64px',
                background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Info — bottom 35% */}
            <div style={{
              height: '35%', padding: '12px 16px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
            }}>
              <h3 style={{
                fontWeight: 700, fontSize: 'clamp(0.85rem, 2.5vw, 1rem)',
                color: 'white', lineHeight: 1.3, margin: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {member.name}
              </h3>
              <p style={{
                fontSize: '9px', fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: `${accentColor}bb`, marginTop: '4px',
              }}>
                {member.department}
              </p>
              {/* Hover hint */}
              <p style={{
                fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '8px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Hover to flip ✦
              </p>
            </div>

            {/* Top glow edge */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)`,
            }} />
          </div>

          {/* ── BACK FACE ───────────────────────────────────── */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
              borderRadius: '20px', overflow: 'hidden',
              transform: 'rotateY(180deg)',
              background: `linear-gradient(145deg, #060d1a 0%, #0a1225 100%)`,
              border: `1px solid ${accentColor}35`,
              boxShadow: `0 0 60px ${accentColor}15, inset 0 0 40px ${accentColor}06`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '16px', padding: '24px',
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

            {/* Avatar circle */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              overflow: 'hidden', border: `2px solid ${accentColor}50`,
              boxShadow: `0 0 0 4px ${accentColor}15`,
              flexShrink: 0,
            }}>
              <img
                src={member.avatarUrl}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                onError={e => {
                  const img = e.currentTarget
                  img.onerror = null
                  img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=071428&textColor=${accentColor.replace('#', '')}`
                }}
              />
            </div>

            {/* Name + role */}
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <h3 style={{
                fontWeight: 700, fontSize: '1.05rem', color: 'white',
                margin: '0 0 4px 0', lineHeight: 1.3,
              }}>
                {member.name}
              </h3>
              <p style={{
                fontSize: '10px', fontWeight: 600, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: accentColor, margin: 0,
              }}>
                {member.title}
              </p>
            </div>

            {/* Divider */}
            <div style={{
              width: '40px', height: '1px',
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            }} />

            {/* Social links */}
            <div style={{
              display: 'flex', gap: '10px', position: 'relative', zIndex: 10,
              pointerEvents: 'auto',
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

            {/* Bottom label */}
            <p style={{
              fontSize: '8px', fontWeight: 600, letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase',
              position: 'absolute', bottom: '14px', margin: 0,
            }}>
              HASHTAG OFFICIAL
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

// ── Back-face social button ───────────────────────────────────────
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
      width: '40px', height: '40px', borderRadius: '50%',
      background: `${accent}18`, color: accent,
      border: `1px solid ${accent}40`,
      transition: 'all 0.2s ease',
      cursor: 'pointer', pointerEvents: 'auto',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = accent
      e.currentTarget.style.color      = '#000'
      e.currentTarget.style.transform  = 'scale(1.1)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = `${accent}18`
      e.currentTarget.style.color      = accent
      e.currentTarget.style.transform  = 'scale(1)'
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
