import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { motion } from 'framer-motion';

// Inline SVG icons to stay consistent with your Icons.tsx pattern
const GithubIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Generates initials from a full name
const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// Cycles through your brand accent colors for avatar backgrounds
const AVATAR_COLORS = [
  { bg: 'rgba(200,255,71,0.12)', color: '#C8FF47' },
  { bg: 'rgba(123,97,255,0.12)', color: '#7B61FF' },
  { bg: 'rgba(0,245,212,0.12)', color: '#00f5d4' },
];

const Alumni: React.FC = () => {
  const { data } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  if (!data?.alumni || !Array.isArray(data.alumni) || data.alumni.length === 0) return null;

  const filtered = data.alumni.filter((a: any) => {
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.currentRole.toLowerCase().includes(q) ||
      a.batch.toString().includes(q)
    );
  });

  // Derive unique batch years for a stats line
  const batches = [...new Set(data.alumni.map((a: any) => a.batch))].sort();

  return (
    <section
      id="alumni"
      className="py-32 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: '#C8FF47', opacity: 0.03, filter: 'blur(120px)' }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <p
          className="mb-4"
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.78rem',
            color: 'var(--color-muted)',
            letterSpacing: '0.15em',
          }}
        >
          06 — Alumni
        </p>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 700,
              color: '#F0EDE6',
              lineHeight: 1.1,
            }}
          >
            Where our{' '}
            <em style={{ color: '#C8FF47', fontStyle: 'italic' }}>alumni</em>{' '}
            are now.
          </h2>

          {/* Quick stats */}
          <div className="flex gap-8 shrink-0">
            <div className="text-center">
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: 700, color: '#F0EDE6', lineHeight: 1 }}>
                {data.alumni.length}+
              </p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>Alumni</p>
            </div>
            <div className="text-center">
              <p style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontWeight: 700, color: '#F0EDE6', lineHeight: 1 }}>
                {batches.length}
              </p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', letterSpacing: '0.1em' }}>Batches</p>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-10 relative max-w-sm">
          <input
            type="text"
            placeholder="Search by name, role, or batch…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F0EDE6',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(200,255,71,0.3)';
              (e.currentTarget as HTMLInputElement).style.background = 'rgba(200,255,71,0.03)';
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLInputElement).style.background = 'rgba(255,255,255,0.04)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Alumni Grid */}
        <div
          className="grid gap-3 sm:gap-4"
          style={{ 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
            maxWidth: '100%',
          }}
        >
          {filtered.map((alumni: any, i: number) => {
            const accent = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const initials = getInitials(alumni.name);
            const hasGithub = alumni.github && alumni.github !== 'https://github.com/';
            const hasLinkedin = alumni.linkedin && alumni.linkedin !== 'https://www.linkedin.com/in/';

            return (
              <motion.div
                key={alumni.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: (i % 6) * 0.07, duration: 0.45 }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300 hover:-translate-y-0.5 group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,255,71,0.15)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(200,255,71,0.02)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center font-bold text-sm overflow-hidden"
                  style={{ background: accent.bg, border: `1px solid ${accent.color}22` }}
                >
                  {alumni.avatarUrl ? (
                    <img
                      src={alumni.avatarUrl}
                      alt={alumni.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.display = 'none';
                        const fallback = img.nextSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span
                    className="w-full h-full items-center justify-center font-bold"
                    style={{
                      display: alumni.avatarUrl ? 'none' : 'flex',
                      color: accent.color,
                      fontFamily: 'DM Mono, monospace',
                      fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)',
                    }}
                  >
                    {initials}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="truncate"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
                      color: '#F0EDE6',
                    }}
                  >
                    {alumni.name}
                  </h3>
                  <p
                    className="truncate text-xs sm:text-sm"
                    style={{ color: 'var(--color-muted)', lineHeight: 1.4 }}
                  >
                    {alumni.currentRole}
                  </p>
                  <p
                    style={{
                      color: accent.color,
                      fontSize: '0.68rem',
                      fontFamily: 'DM Mono, monospace',
                      opacity: 0.8,
                    }}
                  >
                    Batch of {alumni.batch}
                  </p>
                </div>

                {/* Social icons — appear on hover */}
                {(hasGithub || hasLinkedin) && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    {hasGithub && (
                      <a
                        href={alumni.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                        style={{ background: 'rgba(200,255,71,0.1)', color: '#C8FF47' }}
                      >
                        <GithubIcon />
                      </a>
                    )}
                    {hasLinkedin && (
                      <a
                        href={alumni.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                        style={{ background: 'rgba(123,97,255,0.1)', color: '#7B61FF' }}
                      >
                        <LinkedinIcon />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            style={{ color: 'var(--color-muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}
          >
            No alumni found for "{searchQuery}"
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Alumni;