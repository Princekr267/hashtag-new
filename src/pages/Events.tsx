import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import SubpageHeroVisual from '../components/visuals/SubpageHeroVisual'
import { EVENTS, type Event } from '../constants/data'
import InteractiveCard3D from '../components/ui/InteractiveCard3D'

const STATUS = ['All', 'upcoming', 'past'] as const
type StatusFilter = typeof STATUS[number]

function EventCard({ event }: { event: Event }): JSX.Element {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="p-4"
    >
      <InteractiveCard3D accentColor={event.gradientFrom} className="h-full">
        {/* Gradient top accent strip */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${event.gradientFrom}, ${event.gradientTo})` }}
        />

        <div className="p-7 flex flex-col h-full gap-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <span
                className="text-xs font-label tracking-widest"
                style={{ color: event.gradientFrom }}
              >
                {event.tag.toUpperCase()}
              </span>
              <h3 className="text-xl font-display font-bold mt-1.5 text-text-primary">
                {event.title}
              </h3>
            </div>
            {event.status === 'upcoming' && (
              <span className="pill pill-live flex-shrink-0 text-xs">LIVE SOON</span>
            )}
          </div>

          {/* Description */}
          <p className="text-text-muted text-sm font-body leading-relaxed flex-1 line-clamp-4">
            {event.description}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            {event.registerUrl && event.status === 'upcoming' && (
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex self-start text-xs"
                style={{ padding: '10px 20px' }}
              >
                Register Now <ExternalLink size={13} />
              </a>
            )}
            {event.status === 'past' && (
              <div
                className="flex items-center gap-2 text-xs font-label"
                style={{ color: event.gradientFrom + 'aa' }}
              >
                <span>Completed</span>
                <ArrowRight size={12} />
              </div>
            )}
            
            {/* Visual fluff for 3D feel */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center">
                 <ArrowRight size={14} className="text-white/20" />
               </div>
            </div>
          </div>
        </div>
      </InteractiveCard3D>
    </motion.div>
  )
}

export default function Events(): JSX.Element {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')

  const filtered = EVENTS.filter((e) => {
    return statusFilter === 'All' || e.status === statusFilter
  })

  return (
    <div className="relative z-10 pt-20">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            <span className="pill pill-cyan mb-6 inline-flex">Events</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              We Build,<br />
              <span className="text-gradient">We Compete</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-xl font-body leading-relaxed">
              From hackathons with Microsoft to cryptic hunts —
              every Hashtag event is an experience.
            </p>
          </motion.div>

          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block">
            <SubpageHeroVisual type="gyro" />
          </div>
        </div>
      </section>

      {/* ── UPCOMING HIGHLIGHT ────────────────────────────────── */}
      {EVENTS.filter(e => e.status === 'upcoming').length > 0 && (
        <section className="section-sm px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <span className="text-xs font-label text-secondary tracking-widest">COMING NEXT</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {EVENTS.filter(e => e.status === 'upcoming').map((event) => (
                <div
                  key={event.id}
                  className="surface-card p-10"
                  style={{ borderBottom: '3px solid', borderImage: `linear-gradient(90deg, ${event.gradientFrom}, ${event.gradientTo}) 1` }}
                >
                  <span className="pill pill-live inline-flex mb-4">LIVE SOON</span>
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-4">
                    {event.title}
                  </h2>
                  <p className="text-text-muted font-body leading-relaxed mb-8 max-w-lg">
                    {event.description}
                  </p>
                  {event.registerUrl && (
                    <a
                      href={event.registerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary inline-flex"
                    >
                      Register Now <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL EVENTS ────────────────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold mb-8">
              All <span className="text-gradient">Events</span>
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
              {STATUS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 text-xs font-label tracking-widest uppercase transition-all duration-200 ${
                    statusFilter === s
                      ? 'bg-secondary text-bg-base'
                      : 'text-text-muted border border-outline-var hover:text-secondary hover:border-secondary'
                  }`}
                >
                  {s === 'All' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((event, idx) => (
                <div
                  key={event.id}
                  style={{
                    borderRight: (idx % 3 !== 2) ? '1px solid rgba(143,245,255,0.05)' : 'none',
                    borderBottom: '1px solid rgba(143,245,255,0.05)',
                  }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-text-faint font-label tracking-widest">
              NO EVENTS MATCHING FILTERS
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
