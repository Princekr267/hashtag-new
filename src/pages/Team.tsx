import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TEAM, DEPARTMENTS, type TeamMember, type Department } from '../constants/data'
import SubpageHeroVisual from '../components/SubpageHeroVisual'

const DEPT_ACCENTS: Record<string, { color: string; glow: string; tag: string }> = {
  Leadership:  { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
  Technical:   { color: '#38bdf8', glow: 'rgba(56,189,248,0.15)',  tag: 'bg-sky-500/10 text-sky-300' },
  Graphics:    { color: '#818cf8', glow: 'rgba(129,140,248,0.15)', tag: 'bg-indigo-500/10 text-indigo-300' },
  Management:  { color: '#f472b6', glow: 'rgba(244,114,182,0.15)', tag: 'bg-pink-500/10 text-pink-300' },
  Content:     { color: '#fbbf24', glow: 'rgba(251,191,36,0.15)',  tag: 'bg-yellow-500/10 text-yellow-300' },
  Social:      { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
}

function MemberCard({ m }: { m: TeamMember }) {
  const style = DEPT_ACCENTS[m.department] ?? DEPT_ACCENTS.Technical

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="relative group cursor-default rounded-2xl overflow-hidden bg-surface-var h-72 md:h-[300px]"
      style={{
        boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4)`,
        border: '1px solid rgba(255,255,255,0.03)'
      }}
    >
      {/* Background Image / Portrait */}
      <img
        src={m.avatarUrl}
        alt={m.name}
        className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-105"
        onError={(e) => {
          ;(e.target as HTMLImageElement).src =
            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=071428&color=${style.color.replace('#','')}&size=400&bold=true`
        }}
      />
      
      {/* Permanent Bottom Name Strip (Fades out gently on hover) */}
      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end h-32 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="font-display font-bold text-xl text-white drop-shadow-md">
          {m.name}
        </h3>
        <p className="text-sm font-label tracking-widest uppercase drop-shadow-md" style={{ color: style.color }}>
          {m.title}
        </p>
        
      </div>

      {/* Sliding Dark Panel (Slides up from bottom on hover) */}
      <div className="absolute inset-x-0 bottom-0 bg-[#070b14]/95 backdrop-blur-xl border-t h-full flex flex-col translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ borderColor: `${style.color}30` }}>
        
        {/* Top Glowing Trim */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${style.color}, transparent)` }} />
        
        <div className="p-6 flex flex-col h-full">
          <div 
            className="text-[10px] font-label tracking-widest px-2 py-1 rounded inline-block mb-3 border w-max"
            style={{ color: style.color, borderColor: `${style.color}50`, backgroundColor: `${style.color}10` }}
          >
            {m.department.toUpperCase()}
          </div>
          
          <h3 className="font-display font-bold text-2xl text-white leading-tight mb-1">
            {m.name}
          </h3>
          <p className="text-sm font-body text-text-faint mb-5">
            {m.title}
          </p>

          {/* Pushes social icons to bottom */}
          <div className="mb-auto" />

          {/* Social Links Matrix */}
          <div className="border-t pt-4 flex gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {m.social?.github && (
              <a href={m.social.github} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/20 transition-all border border-white/5" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            )}
            {m.social?.linkedin && (
              <a href={m.social.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/20 transition-all border border-white/5" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            )}
            {m.social?.instagram && (
              <a href={m.social.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/20 transition-all border border-white/5" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Team(): JSX.Element {
  const [active, setActive] = useState<Department>('All')

  const filtered = active === 'All'
    ? TEAM
    : TEAM.filter((m) => m.department === active)

  const leadershipFirst = [...filtered].sort((a, b) => {
    if (a.department === 'Leadership') return -1
    if (b.department === 'Leadership') return 1
    return 0
  })

  return (
    
    <div className="min-h-screen pt-28 pb-24 px-6">
      
      <div className="max-w-7xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-16 px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="pill pill-cyan inline-block mb-6"
              style={{ borderColor: 'rgba(56,189,248,0.3)' }}
            >
              THE CREW
            </span>
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight">
                People Who<br />
                <span className="text-gradient">Make It Happen</span>
              </h1>
              <p className="text-text-muted max-w-sm text-base md:text-lg font-body leading-relaxed">
                Every event, every workshop, every late-night build session
                — powered by this team.
              </p>
            </div>
          </motion.div>

          {/* Background Visual */}
          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block">
            <SubpageHeroVisual type="rings" />
          </div>
        </div>

        {/* ── Filter tabs ─────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-12">
          {DEPARTMENTS.map((dept) => {
            const isActive = dept === active
            const accent   = DEPT_ACCENTS[dept]?.color ?? '#60a5fa'
            return (
              <button
                key={dept}
                onClick={() => setActive(dept)}
                className="text-xs font-label tracking-widest px-4 py-2 rounded-full transition-all duration-250"
                style={{
                  background: isActive ? `${accent}18` : 'transparent',
                  color:      isActive ? accent : 'var(--text-faint)',
                  border:     `1px solid ${isActive ? `${accent}50` : 'rgba(255,255,255,0.07)'}`,
                  boxShadow:  isActive ? `0 0 14px ${accent}25` : 'none',
                }}
              >
                {dept}
              </button>
            )
          })}
        </div>

        {/* ── Cards grid ──────────────────────────────────────── */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {leadershipFirst.map((m) => (
              <MemberCard key={m.id} m={m} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-text-faint font-label tracking-wider">
            No members in this department yet.
          </div>
        )}
      </div>
    </div>
  )
}
