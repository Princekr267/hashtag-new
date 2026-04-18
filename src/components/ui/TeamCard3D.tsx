import React, { useRef } from 'react'
import { TeamMember } from '../../constants/data'

/**
 * TeamCard3D — Change 5 & 6
 *
 * Change 5:
 * - Uniform size: aspect-ratio 3/4 (no col/row spanning)
 * - Photo fills top 65% with object-fit:cover object-position:center top
 * - 3D tilt on mousemove: perspective(800px) rotateX/Y ±8°
 * - Shine overlay repositions with mouse
 * - transform-style: preserve-3d, will-change: transform
 * - mouseleave resets smoothly with transition: 0.5s ease
 *
 * Change 6:
 * - Social links area: position:relative, z-index:10, pointer-events:auto
 * - Shine overlay is pointer-events:none
 * - Icons 22px, tap target ≥40×40px, high-contrast colors
 * - Anchor tags: href, target=_blank, rel=noopener noreferrer
 */

interface TeamCard3DProps {
  member: TeamMember
  accentColor?: string
}

const TeamCard3D: React.FC<TeamCard3DProps> = ({ member, accentColor = '#60a5fa' }) => {
  const cardRef  = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const tiltRef  = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    const shine = shineRef.current
    const tilt = tiltRef.current
    if (!card || !tilt) return

    const rect = card.getBoundingClientRect()
    const cx   = rect.left + rect.width  / 2
    const cy   = rect.top  + rect.height / 2
    const mx   = e.clientX - cx
    const my   = e.clientY - cy

    const rotX = (-my / (rect.height / 2)) * 8
    const rotY = ( mx / (rect.width  / 2)) * 8

    tilt.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`

    if (shine) {
      const pctX = ((e.clientX - rect.left) / rect.width)  * 100
      const pctY = ((e.clientY - rect.top)  / rect.height) * 100
      shine.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
    }
  }

  const handleMouseLeave = () => {
    const tilt  = tiltRef.current
    const shine = shineRef.current
    if (tilt)  tilt.style.transform  = 'rotateX(0deg) rotateY(0deg)'
    if (shine) shine.style.background = 'transparent'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
        width: '100%',
        aspectRatio: '3 / 4',
      }}
    >
      {/* Tilt wrapper */}
      <div
        ref={tiltRef}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'transform 0.5s ease',
          borderRadius: '20px',
          position: 'relative',
          overflow: 'hidden',
          background: '#0a0a0a',
          border: `1px solid rgba(255,255,255,0.07)`,
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}30`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.45)'
        }}
      >
        {/* ── Photo area — top 65% ─────────────────────────── */}
        <div
          style={{
            width: '100%',
            height: '65%',
            overflow: 'hidden',
            borderRadius: '20px 20px 0 0',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <img
            src={member.avatarUrl}
            alt={member.name}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              transition: 'transform 0.7s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            onError={e => {
              const img = e.currentTarget
              img.onerror = null
              img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=071428&textColor=${accentColor.replace('#', '')}`
            }}
          />

          {/* Role badge */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }}>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                backdropFilter: 'blur(8px)',
                background: `${accentColor}20`,
                color: accentColor,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {member.title}
            </span>
          </div>

          {/* Gradient fade to card bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '60px',
              background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ── Info area ────────────────────────────────────── */}
        <div
          style={{
            padding: '12px 16px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '35%',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display, Inter, sans-serif)',
                fontWeight: 700,
                fontSize: 'clamp(0.88rem, 2.5vw, 1rem)',
                color: 'white',
                marginBottom: '2px',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {member.name}
            </h3>
            <p
              style={{
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(148,163,184,0.7)',
              }}
            >
              {member.department}
            </p>
          </div>

          {/* Change 6 — Social icons: fully clickable, correct z-index */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              position: 'relative',
              zIndex: 10,
              pointerEvents: 'auto',
            }}
          >
            {member.social?.github && (
              <SocialBtn href={member.social.github} label="GitHub" accent={accentColor}>
                <GitHubIcon />
              </SocialBtn>
            )}
            {member.social?.linkedin && (
              <SocialBtn href={member.social.linkedin} label="LinkedIn" accent={accentColor}>
                <LinkedInIcon />
              </SocialBtn>
            )}
            {member.social?.instagram && (
              <SocialBtn href={member.social.instagram} label="Instagram" accent={accentColor}>
                <InstagramIcon />
              </SocialBtn>
            )}
          </div>
        </div>

        {/* Top accent glow line */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
          className="card-top-glow"
        />

        {/* Shine overlay — pointer-events:none so clicks pass through (Change 6) */}
        <div
          ref={shineRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '20px',
            pointerEvents: 'none',
            zIndex: 8,
            transition: 'background 0.15s ease',
          }}
        />
      </div>
    </div>
  )
}

// ── Social button — Change 6 ─────────────────────────────────────
const SocialBtn: React.FC<{
  href: string
  label: string
  accent: string
  children: React.ReactNode
}> = ({ href, label, accent, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    onClick={e => e.stopPropagation()}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: `${accent}14`,
      color: accent,
      border: `1px solid ${accent}35`,
      transition: 'background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
      pointerEvents: 'auto',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget
      el.style.background  = `${accent}28`
      el.style.boxShadow   = `0 0 14px ${accent}55`
      el.style.transform   = 'scale(1.12)'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget
      el.style.background  = `${accent}14`
      el.style.boxShadow   = 'none'
      el.style.transform   = 'scale(1)'
    }}
  >
    {children}
  </a>
)

// ── Icons 22×22 ─────────────────────────────────────────────────
const GitHubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)
const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)
const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

export default TeamCard3D
