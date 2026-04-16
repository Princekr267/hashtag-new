import React, { useRef, useState } from 'react';

/**
 * AlumniCard3D — CSS 3D flip card with Neon Spotlight cursor tracking
 *
 * Front: Batch badge + photo + name + role + neon spotlight on hover
 * Back:  Quote + #HASHTAG Legacy branding + social if available
 */

interface AlumniMember {
  name: string;
  batch: string;
  role: string;
  quote: string;
  photo: string;
  accent: string;
}

interface AlumniCard3DProps {
  member: AlumniMember;
}

const AlumniCard3D: React.FC<AlumniCard3DProps> = ({ member }) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const accentColor = member.accent;

  const handleClick = () => {
    if ('ontouchstart' in window) setFlipped(!flipped);
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

  return (
    <>
      <style>{`
        .alumni-flip-card {
          perspective: 1200px;
          height: 320px;
        }
        @media (min-width: 640px) {
          .alumni-flip-card { height: 360px; }
        }
        .alumni-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.75s cubic-bezier(0.2, 0, 0, 1);
          transform-style: preserve-3d;
        }
        .alumni-flip-card:hover .alumni-flip-inner,
        .alumni-flip-inner.flipped { transform: rotateY(180deg); }
        .alumni-flip-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 20px;
        }
        .alumni-flip-back { transform: rotateY(180deg); }

        .alumni-spotlight::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(
            circle at var(--mx, 50%) var(--my, 50%),
            color-mix(in srgb, var(--accent) 28%, transparent),
            transparent 52%
          );
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 15;
        }
        .alumni-flip-card:hover .alumni-spotlight::before {
          opacity: 1;
        }
      `}</style>

      <div
        ref={cardRef}
        className="alumni-flip-card w-full group select-none"
        style={{ '--accent': accentColor } as React.CSSProperties}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`alumni-flip-inner h-full ${flipped ? 'flipped' : ''}`}>

          {/* ── FRONT FACE ─────────────────────────────────── */}
          <div
            className="alumni-flip-face alumni-spotlight overflow-hidden h-full flex flex-col bg-bg-container border border-white/5 transition-all duration-300 group-hover:border-white/20 relative"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          >
            {/* Internal grid texture */}
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
            {/* Top glow edge */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }}
            />

            {/* Photo */}
            <div className="relative flex-shrink-0 z-10" style={{ height: '58%', overflow: 'hidden' }}>
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=071428&textColor=${accentColor.replace('#', '')}`;
                }}
              />

              {/* Batch badge */}
              <div className="absolute top-3 left-3 z-20">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full font-label text-[9px] uppercase tracking-widest backdrop-blur-md border"
                  style={{
                    background: `${accentColor}15`,
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                  }}
                >
                  BATCH {member.batch}
                </span>
              </div>

              {/* Fade to black */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
              />
            </div>

            {/* Info */}
            <div className="px-4 py-3 flex-1 flex flex-col justify-center bg-[#0a0a0a] relative z-20">
              <h3
                className="font-display font-bold text-white line-clamp-1 mb-0.5 transition-colors duration-300"
                style={{ fontSize: 'clamp(0.9rem, 3vw, 1.05rem)' }}
                onMouseEnter={e => (e.currentTarget.style.color = accentColor)}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}
              >
                {member.name}
              </h3>
              <p
                className="text-[9px] sm:text-[10px] font-label uppercase tracking-wider line-clamp-1"
                style={{ color: accentColor }}
              >
                {member.role}
              </p>
            </div>
          </div>

          {/* ── BACK FACE ──────────────────────────────────── */}
          <div
            className="alumni-flip-face alumni-flip-back flex flex-col p-5 sm:p-6 h-full overflow-hidden"
            style={{
              background: '#060d1a',
              borderRadius: '20px',
              border: `1px solid ${accentColor}30`,
              boxShadow: `0 0 60px ${accentColor}12, inset 0 0 30px ${accentColor}05`,
            }}
          >
            {/* Top line */}
            <div className="absolute top-0 left-0 h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />
            {/* Dot grid bg */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `radial-gradient(${accentColor} 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
              }}
            />

            <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 gap-4">
              {/* Quote icon */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
              >
                "
              </div>
              <blockquote
                className="text-text-muted text-xs sm:text-sm font-body italic leading-relaxed max-w-[90%]"
              >
                {member.quote}
              </blockquote>

              {/* Role label */}
              <p
                className="font-label text-[9px] uppercase tracking-widest"
                style={{ color: accentColor }}
              >
                {member.role}
              </p>
            </div>

            <p className="text-[9px] font-label text-text-faint tracking-widest text-center relative z-10">
              HASHTAG LEGACY
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default AlumniCard3D;
