import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TEAM, DEPARTMENTS, type Department } from '../constants/data'
import SubpageHeroVisual from '../components/visuals/SubpageHeroVisual'
import TeamCard3D from '../components/ui/TeamCard3D'

const DEPT_ACCENTS: Record<string, { color: string; glow: string; tag: string }> = {
  Leadership:  { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
  Technical:   { color: '#38bdf8', glow: 'rgba(56,189,248,0.15)',  tag: 'bg-sky-500/10 text-sky-300' },
  Graphics:    { color: '#818cf8', glow: 'rgba(129,140,248,0.15)', tag: 'bg-indigo-500/10 text-indigo-300' },
  Management:  { color: '#f472b6', glow: 'rgba(244,114,182,0.15)', tag: 'bg-pink-500/10 text-pink-300' },
  Content:     { color: '#fbbf24', glow: 'rgba(251,191,36,0.15)',  tag: 'bg-yellow-500/10 text-yellow-300' },
  Social:      { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
}


// Old MemberCard removed

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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {leadershipFirst.map((m, i) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <TeamCard3D 
                  member={m} 
                  accentColor={DEPT_ACCENTS[m.department]?.color ?? '#60a5fa'} 
                />
              </motion.div>
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
