import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, ExternalLink, Camera } from 'lucide-react'
import { TEAM, DEPARTMENTS, type TeamMember, type Department } from '../constants/data'

const DEPT_ACCENTS: Record<string, { color: string; glow: string; tag: string }> = {
  Leadership:  { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
  Technical:   { color: '#38bdf8', glow: 'rgba(56,189,248,0.15)',  tag: 'bg-sky-500/10 text-sky-300' },
  Graphics:    { color: '#818cf8', glow: 'rgba(129,140,248,0.15)', tag: 'bg-indigo-500/10 text-indigo-300' },
  Management:  { color: '#f472b6', glow: 'rgba(244,114,182,0.15)', tag: 'bg-pink-500/10 text-pink-300' },
  Content:     { color: '#fbbf24', glow: 'rgba(251,191,36,0.15)',  tag: 'bg-yellow-500/10 text-yellow-300' },
  Social:      { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
}

function MemberCard({ m }: { m: TeamMember }) {
  const [hovered, setHovered] = useState(false)
  const style = DEPT_ACCENTS[m.department] ?? DEPT_ACCENTS.Technical

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="team-card group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo area */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '100%' }}>
        <img
          src={m.avatarUrl}
          alt={m.name}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=071428&color=60a5fa&size=400&bold=true`
          }}
        />

        {/* Gradient overlay at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
          style={{
            background: `linear-gradient(to top, var(--bg-container) 0%, transparent 100%)`,
          }}
        />

        {/* Social links — appear on hover */}
        <AnimatePresence>
          {hovered && (m.social?.github || m.social?.linkedin || m.social?.instagram) && (
            <motion.div
              className="absolute top-3 right-3 flex flex-col gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {m.social?.github && (
                <a
                  href={m.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                  style={{ background: 'rgba(3,11,26,0.75)', border: `1px solid ${style.color}40` }}
                  aria-label="GitHub"
                >
                  <Code2 size={14} style={{ color: style.color }} />
                </a>
              )}
              {m.social?.linkedin && (
                <a
                  href={m.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                  style={{ background: 'rgba(3,11,26,0.75)', border: `1px solid ${style.color}40` }}
                  aria-label="LinkedIn"
                >
                  <ExternalLink size={14} style={{ color: style.color }} />
                </a>
              )}
              {m.social?.instagram && (
                <a
                  href={m.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all hover:scale-110"
                  style={{ background: 'rgba(3,11,26,0.75)', border: `1px solid ${style.color}40` }}
                  aria-label="Instagram"
                >
                  <Camera size={14} style={{ color: style.color }} />
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role badge at image bottom */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <span
            className="inline-block text-xs font-label tracking-wider px-2 py-0.5 rounded"
            style={{
              background: `${style.color}18`,
              color: style.color,
              border: `1px solid ${style.color}35`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {m.title}
          </span>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4" style={{ position: 'relative', zIndex: 2 }}>
        <h3 className="font-display font-bold text-base text-text-primary leading-tight mb-0.5">
          {m.name}
        </h3>
        <p className="text-xs font-label tracking-wider" style={{ color: style.color }}>
          {m.department}
        </p>

        {/* Bottom accent line — expands on hover */}
        <div
          className="mt-3 h-px transition-all duration-500"
          style={{
            width: hovered ? '100%' : '2rem',
            background: `linear-gradient(90deg, ${style.color}, transparent)`,
          }}
        />
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
        <motion.div
          className="mb-16"
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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-none">
              People Who<br />
              <span className="text-gradient">Make It Happen</span>
            </h1>
            <p className="text-text-muted max-w-sm font-body leading-relaxed">
              Every event, every workshop, every late-night build session
              — powered by this team.
            </p>
          </div>
        </motion.div>

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
