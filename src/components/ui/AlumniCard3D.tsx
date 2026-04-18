import React from 'react'

/**
 * AlumniCard — Change 7
 *
 * Horizontal flex-row layout:
 * - Left: 80×80 circle photo (object-fit: cover)
 * - Right: Name (16px/600), batch badge, role/company (muted 14px)
 * - Bottom: Email + LinkedIn pill buttons (outlined, hover fills)
 * - Card: white bg → replaced with dark surface for site consistency
 *   border-radius 12px, padding 1rem, subtle border
 * - Hover: translateY(-3px) + shadow increase
 */

interface AlumniMember {
  name: string
  batch: string
  role: string
  quote: string
  photo: string
  accent: string
  email?: string
  linkedin?: string
}

interface AlumniCardProps {
  member: AlumniMember
}

const AlumniCard: React.FC<AlumniCardProps> = ({ member }) => {
  const { name, batch, role, photo, accent, email, linkedin } = member

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '16px',
        padding: '16px',
        borderRadius: '12px',
        background: 'rgba(10,14,24,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'transform',
        cursor: 'default',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.transform  = 'translateY(-3px)'
        el.style.boxShadow  = `0 14px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accent}22`
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform  = 'translateY(0)'
        el.style.boxShadow  = 'none'
      }}
    >
      {/* ── Photo ─────────────────────────────────── */}
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${accent}35`,
            flexShrink: 0,
          }}
        >
          <img
            src={photo}
            alt={name}
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
            onError={e => {
              const img = e.currentTarget
              img.onerror = null
              img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=071428&textColor=${accent.replace('#', '')}`
            }}
          />
        </div>
      </div>

      {/* ── Info ──────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Name */}
        <p style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.9)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </p>

        {/* Batch badge */}
        <div>
          <span style={{
            display: 'inline-block',
            padding: '1px 8px',
            borderRadius: '999px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            background: `${accent}18`,
            color: accent,
            border: `1px solid ${accent}30`,
          }}>
            Batch {batch}
          </span>
        </div>

        {/* Role / Company */}
        <p style={{
          fontSize: '13px',
          color: 'rgba(148,163,184,0.75)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {role}
        </p>

        {/* Action buttons — only shown if data exists */}
        {(email || linkedin) && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            {email && (
              <PillButton href={`mailto:${email}`} accent={accent}>
                <EnvelopeIcon /> Email
              </PillButton>
            )}
            {linkedin && (
              <PillButton href={linkedin} accent={accent}>
                <LinkedInIcon /> LinkedIn
              </PillButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Pill button — outlined, fills on hover ───────────────────────
const PillButton: React.FC<{ href: string; accent: string; children: React.ReactNode }> = ({
  href, accent, children,
}) => (
  <a
    href={href}
    target={href.startsWith('mailto:') ? undefined : '_blank'}
    rel="noopener noreferrer"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '5px 13px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
      letterSpacing: '0.03em',
      color: accent,
      border: `1px solid ${accent}`,
      background: 'transparent',
      textDecoration: 'none',
      transition: 'background 0.2s ease, color 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget
      el.style.background = accent
      el.style.color      = '#fff'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget
      el.style.background = 'transparent'
      el.style.color      = accent
    }}
  >
    {children}
  </a>
)

const EnvelopeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default AlumniCard
