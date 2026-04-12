import React, { useState } from 'react';

/**
 * TeamCard3D — CSS 3D flip card
 * 
 * Front: Role badge + rectangular photo + name
 * Back:  Social links + short bio placeholder
 * 
 * All animation via CSS transforms — zero GSAP overhead per card
 * Hover triggers 180° rotateY flip (preserve-3d)
 */

interface TeamMember {
  name: string;
  title: string;
  avatarUrl: string;
  social: {
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
}

interface TeamCard3DProps {
  member: TeamMember;
  index: number;
}

const TeamCard3D: React.FC<TeamCard3DProps> = ({ member }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    // Toggle flip on mobile (touch devices)
    if ('ontouchstart' in window) {
      setFlipped(!flipped);
    }
  };

  return (
    <>
      {/* Inject flip CSS once — Tailwind can't express preserve-3d + backface-hidden cleanly */}
      <style>{`
        .flip-card { 
          perspective: 1000px; 
          height: 280px;
        }
        @media (min-width: 640px) {
          .flip-card { height: 320px; }
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
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
        }
        .flip-back { transform: rotateY(180deg); }
      `}</style>

      <div
        className="flip-card w-full h-full"
        data-cursor-text="FLIP"
        onClick={handleClick}
      >
        <div className={`flip-inner h-full ${flipped ? 'flipped' : ''}`}>

          {/* ── FRONT FACE ─────────────────────────────── */}
          <div
            className="flip-face rounded-xl sm:rounded-2xl overflow-hidden h-full flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Rectangular photo — fills top portion */}
            <div className="relative flex-shrink-0" style={{ height: '60%', overflow: 'hidden' }}>
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=111111&textColor=C8FF47`;
                }}
              />
              {/* Role badge - positioned on top of image */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span
                  className="inline-block px-2 sm:px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest"
                  style={{
                    background: 'rgba(200,255,71,0.1)',
                    color: '#C8FF47',
                    border: '1px solid rgba(200,255,71,0.2)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {member.title}
                </span>
              </div>
              {/* Gradient overlay fading into card */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,8,8,0.95))' }}
              />
            </div>

            {/* Bottom info */}
            <div className="px-3 sm:px-5 pt-2 sm:pt-3 pb-3 sm:pb-4 flex-1 flex flex-col">
              <h3
                className="font-bold line-clamp-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 'clamp(0.85rem, 3vw, 1.05rem)',
                  color: '#F0EDE6',
                }}
              >
                {member.name}
              </h3>
              <p
                className="mt-1 hidden sm:block"
                style={{ 
                  color: 'var(--color-muted)', 
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
                }}
              >
                Hover to see links →
              </p>
              <p
                className="mt-1 sm:hidden"
                style={{ 
                  color: 'var(--color-muted)', 
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
                }}
              >
                Tap to flip →
              </p>
            </div>
          </div>

          {/* ── BACK FACE ──────────────────────────────── */}
          <div
            className="flip-face flip-back rounded-xl sm:rounded-2xl flex flex-col items-center justify-center gap-3 sm:gap-5 px-4 sm:px-6 h-full"
            style={{
              background: 'rgba(200,255,71,0.04)',
              border: '1px solid rgba(200,255,71,0.15)',
            }}
          >
            {/* Name + role on back */}
            <div className="text-center">
              <p
                className="mb-1 font-bold uppercase tracking-widest"
                style={{ 
                  color: '#C8FF47', 
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
                }}
              >
                {member.title}
              </p>
              <h3
                className="line-clamp-2"
                style={{ 
                  fontFamily: '"Playfair Display", serif', 
                  fontWeight: 700, 
                  fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', 
                  color: '#F0EDE6' 
                }}
              >
                {member.name}
              </h3>
            </div>

            {/* Social icons */}
            <div className="flex gap-2 sm:gap-3">
              {member.social?.github && member.social.github !== 'https://github.com/' && (
                <SocialLink href={member.social.github} label="GitHub" bg="#C8FF47" fg="#080808">
                  <GithubIcon />
                </SocialLink>
              )}
              {member.social?.linkedin && member.social.linkedin !== 'https://www.linkedin.com/in/' && (
                <SocialLink href={member.social.linkedin} label="LinkedIn" bg="#7B61FF" fg="#fff">
                  <LinkedinIcon />
                </SocialLink>
              )}
              {member.social?.instagram && member.social.instagram !== 'https://www.instagram.com/' && (
                <SocialLink href={member.social.instagram} label="Instagram" bg="#E1306C" fg="#fff">
                  <InstagramIcon />
                </SocialLink>
              )}
            </div>

            <p
              className="text-center hidden sm:block"
              style={{ 
                color: 'var(--color-muted)', 
                fontFamily: 'DM Mono, monospace', 
                maxWidth: '20ch',
                fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
              }}
            >
              #HashTag Technical Society
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

// ── Social link component ──────────────────────────────
const SocialLink: React.FC<{
  href: string; label: string; bg: string; fg: string; children: React.ReactNode;
}> = ({ href, label, bg, fg, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl transition-transform duration-200 hover:scale-110 active:scale-95"
    style={{ background: bg, color: fg }}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </a>
);

// ── Inline SVG icons ───────────────────────────────────
const GithubIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export default TeamCard3D;
