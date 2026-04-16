import React, { useRef, useState } from 'react';
import { TeamMember } from '../../constants/data';

/**
 * TeamCard3D — CSS 3D flip card with Neon Spotlight cursor tracking
 *
 * Front: Role badge + rectangular photo + name + neon spotlight
 * Back:  Social links + #HashTag branding
 *
 * Spotlight tracks cursor via CSS custom properties --mx, --my
 */

interface TeamCard3DProps {
  member: TeamMember;
  accentColor?: string;
}

const TeamCard3D: React.FC<TeamCard3DProps> = ({ member, accentColor = '#60a5fa' }) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if ('ontouchstart' in window) {
      setFlipped(!flipped);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${mx}%`);
    card.style.setProperty('--my', `${my}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  };

  const badgeBg = `${accentColor}18`;

  return (
    <>
      <style>{`
        .flip-card { 
          perspective: 1200px; 
          height: 300px;
        }
        @media (min-width: 640px) {
          .flip-card { height: 340px; }
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.75s cubic-bezier(0.2, 0, 0, 1);
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-inner,
        .flip-inner.flipped { transform: rotateY(180deg); }
        .flip-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 20px;
        }
        .flip-back { transform: rotateY(180deg); }

        /* Neon spotlight using --mx --my css vars */
        .team-card-spotlight::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(
            circle at var(--mx, 50%) var(--my, 50%),
            color-mix(in srgb, var(--accent) 25%, transparent),
            transparent 55%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 15;
        }
        .flip-card:hover .team-card-spotlight::before {
          opacity: 1;
        }
      `}</style>

      <div
        ref={cardRef}
        className="flip-card w-full group select-none"
        style={{ '--accent': accentColor } as React.CSSProperties}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`flip-inner h-full ${flipped ? 'flipped' : ''}`}>

          {/* ── FRONT FACE ─────────────────────────────── */}
          <div
            className="flip-face team-card-spotlight overflow-hidden h-full flex flex-col bg-bg-container border border-white/5 transition-all duration-300 group-hover:border-white/25 relative"
            style={{
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
            }}
          >
            {/* Subtle internal grid */}
            <div
              className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(${accentColor} 1px, transparent 1px),
                  linear-gradient(90deg, ${accentColor} 1px, transparent 1px)
                `,
                backgroundSize: '18px 18px',
              }}
            />

            {/* Top edge glow line */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }}
            />

            {/* Rectangular photo */}
            <div className="relative flex-shrink-0 z-10" style={{ height: '63%', overflow: 'hidden' }}>
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=071428&textColor=${accentColor.replace('#', '')}`;
                }}
              />
              {/* Role badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full font-label text-[9px] sm:text-[10px] uppercase tracking-widest backdrop-blur-md border transition-all duration-500"
                  style={{
                    background: badgeBg,
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                    boxShadow: `0 0 0 0 ${accentColor}00`,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 10px ${accentColor}60`)}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 0 ${accentColor}00`)}
                >
                  {member.title}
                </span>
              </div>
              {/* Fade-to-black gradient */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
              />
            </div>

            {/* Info Section */}
            <div className="px-3 sm:px-4 py-3 flex-1 flex flex-col justify-center bg-[#0a0a0a] relative z-20">
              <h3
                className="font-display font-bold line-clamp-1 transition-colors duration-300 mb-0.5"
                style={{ fontSize: 'clamp(0.9rem, 3vw, 1.05rem)', color: 'white' }}
                onMouseEnter={e => (e.currentTarget.style.color = accentColor)}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}
              >
                {member.name}
              </h3>
              <p className="text-text-faint font-label text-[8px] sm:text-[9px] uppercase tracking-wider">
                {member.department}
              </p>
            </div>
          </div>

          {/* ── BACK FACE ──────────────────────────────── */}
          <div
            className="flip-face flip-back flex flex-col p-5 sm:p-6 h-full bg-[#060d1a] backdrop-blur-2xl border transition-all duration-500 overflow-hidden"
            style={{
              borderColor: `${accentColor}35`,
              boxShadow: `0 0 60px ${accentColor}15, inset 0 0 30px ${accentColor}05`,
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}50, transparent)` }} />

            {/* Background dots grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
              <div
                className="w-10 h-10 rounded-full mb-4 flex items-center justify-center text-xs font-mono-custom font-bold"
                style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
              >
                #
              </div>
              <p className="font-label text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-1.5" style={{ color: accentColor }}>
                {member.department}
              </p>
              <h3 className="font-display font-bold text-base sm:text-lg text-white mb-0.5 leading-tight">
                {member.name}
              </h3>
              <p className="text-text-muted text-[11px] sm:text-xs font-body italic mb-5">
                {member.title}
              </p>

              {/* Social icons */}
              <div className="flex gap-3">
                {member.social?.github && (
                  <SocialLink href={member.social.github} label="GitHub" accentColor={accentColor}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </SocialLink>
                )}
                {member.social?.linkedin && (
                  <SocialLink href={member.social.linkedin} label="LinkedIn" accentColor={accentColor}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </SocialLink>
                )}
                {member.social?.instagram && (
                  <SocialLink href={member.social.instagram} label="Instagram" accentColor={accentColor}>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </SocialLink>
                )}
              </div>
            </div>

            <p className="text-[9px] sm:text-[10px] font-label text-text-faint tracking-widest text-center relative z-10">
              HASHTAG SOCIETY
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

const SocialLink: React.FC<{ href: string; label: string; children: React.ReactNode; accentColor: string }> = ({ href, label, children, accentColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 border"
    style={{
      background: `${accentColor}10`,
      color: accentColor,
      borderColor: `${accentColor}30`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = `${accentColor}25`;
      e.currentTarget.style.boxShadow = `0 0 16px ${accentColor}50`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = `${accentColor}10`;
      e.currentTarget.style.boxShadow = 'none';
    }}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </a>
);

export default TeamCard3D;
