import React, { useState } from 'react';
import { TeamMember } from '../../constants/data';

/**
 * TeamCard3D — CSS 3D flip card
 * 
 * Front: Role badge + rectangular photo + name
 * Back:  Social links + #HashTag branding
 * 
 * All animation via CSS transforms.
 */

interface TeamCard3DProps {
  member: TeamMember;
  accentColor?: string;
}

const TeamCard3D: React.FC<TeamCard3DProps> = ({ member, accentColor = '#60a5fa' }) => {
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    if ('ontouchstart' in window) {
      setFlipped(!flipped);
    }
  };

  const glowColor = `${accentColor}15`;
  const badgeBg = `${accentColor}10`;

  return (
    <>
      <style>{`
        .flip-card { 
          perspective: 1200px; 
          height: 280px;
        }
        @media (min-width: 640px) {
          .flip-card { height: 320px; }
        }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.7s cubic-bezier(0.2, 0, 0, 1);
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
      `}</style>

      <div
        className="flip-card w-full group select-none"
        onClick={handleClick}
      >
        <div className={`flip-inner h-full ${flipped ? 'flipped' : ''}`}>

          {/* ── FRONT FACE ─────────────────────────────── */}
          <div
            className="flip-face overflow-hidden h-full flex flex-col bg-bg-container border border-white/5 transition-colors duration-300 group-hover:border-white/10"
            style={{
              boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4)`,
            }}
          >
            {/* Rectangular photo */}
            <div className="relative flex-shrink-0" style={{ height: '62%', overflow: 'hidden' }}>
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=071428&textColor=${accentColor.replace('#','')}`;
                }}
              />
              {/* Role badge */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full font-label text-[9px] sm:text-[10px] uppercase tracking-widest backdrop-blur-md border transition-all duration-300"
                  style={{
                    background: badgeBg,
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                  }}
                >
                  {member.title}
                </span>
              </div>
              {/* Gradient overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
              />
            </div>

            {/* Info Section */}
            <div className="px-3 sm:px-4 py-3 flex-1 flex flex-col justify-center bg-[#0a0a0a]">
              <h3
                className="font-display font-bold text-white line-clamp-1 group-hover:text-primary transition-colors mb-0.5"
                style={{ fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}
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
            className="flip-face flip-back flex flex-col p-5 sm:p-6 h-full bg-[#070b14] backdrop-blur-2xl border transition-all duration-500"
            style={{
              borderColor: `${accentColor}30`,
              boxShadow: `0 0 40px ${accentColor}10`,
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 h-1 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />

            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="font-label text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: accentColor }}>
                {member.department}
              </p>
              <h3 className="font-display font-bold text-base sm:text-lg text-white mb-1 leading-tight">
                {member.name}
              </h3>
              <p className="text-text-muted text-[11px] sm:text-xs font-body italic mb-6">
                {member.title}
              </p>

              {/* Social icons centered on y-axis of the back content area */}
              <div className="flex gap-3">
                {member.social?.github && (
                  <SocialLink href={member.social.github} label="GitHub">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </SocialLink>
                )}
                {member.social?.linkedin && (
                  <SocialLink href={member.social.linkedin} label="LinkedIn">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </SocialLink>
                )}
                {member.social?.instagram && (
                  <SocialLink href={member.social.instagram} label="Instagram">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </SocialLink>
                )}
              </div>
            </div>

            <p className="text-[9px] sm:text-[10px] font-label text-text-faint tracking-widest text-center">
              #HASHTAG SOCIETY
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

const SocialLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-text-muted hover:text-white hover:bg-primary/20 transition-all border border-white/5 hover:border-primary/30"
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </a>
);

export default TeamCard3D;
