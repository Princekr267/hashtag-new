import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Calendar, MapPin, Clock, Users, Trophy, Target, Globe } from 'lucide-react'
import { EVENTS } from '../constants/data'

export default function EventDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const event = EVENTS.find(e => e.id === id)

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Event Not Found</h1>
          <Link to="/events" className="text-primary hover:text-white transition-colors">
            Return to Events
          </Link>
        </div>
      </div>
    )
  }

  // Check if it's a detailed event (e.g. Hacktivate 2.0)
  const isDetailed = !!(event.timeline || event.tracks || event.prizes)

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 md:px-8 bg-[#060b14] relative overflow-hidden">
      {/* Dynamic Cosmic Background */}
      <div className="absolute top-0 right-0 w-full h-[600px] -z-10 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 80% at 80% 0%, ${event.gradientFrom}15, ${event.gradientTo}05, transparent 70%)`,
      }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] -z-10 pointer-events-none" style={{
        background: `radial-gradient(circle 300px at 0% 100%, ${event.gradientTo}10, transparent 70%)`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl mx-auto"
      >
        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase mb-8 transition-all duration-300 hover:-translate-x-1"
          style={{ color: event.gradientFrom }}
        >
          <ArrowLeft size={14} className="flex-shrink-0" />
          <span className="leading-none">Back to Events</span>
        </Link>

        {isDetailed ? (
          /* ══════════════════════════════════════════════════════════
             RICH DETAILED DASHBOARD (For Hacktivate 2.0)
             ══════════════════════════════════════════════════════════ */
          <div className="space-y-12">
            
            {/* ── Top Header Card ────────────────────────────────────── */}
            <div className="bg-[#0b1329]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
              {/* Radial gradient border decoration */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-20" 
                style={{
                  background: `radial-gradient(circle at 50% -20%, ${event.gradientFrom}, transparent 60%)`
                }}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                {/* Poster Side */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="event-poster-wrap relative group w-full max-w-[200px] sm:max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <img 
                      src={event.poster} 
                      alt={event.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Event Summary Side */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className="text-[10px] font-mono tracking-[0.25em] px-3 py-1 rounded-full border inline-block font-semibold uppercase"
                      style={{ color: event.gradientFrom, borderColor: `${event.gradientFrom}30`, background: `${event.gradientFrom}10` }}
                    >
                      {event.tag}
                    </span>
                    {event.status === 'upcoming' && (
                      <span className="pill pill-live flex-shrink-0 text-[10px] px-3 py-0.5 rounded-full font-mono font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(52,211,153,0.15)] uppercase">
                        REGISTRATIONS LIVE
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
                    {event.title}
                  </h1>

                  <p className="text-text-muted font-body text-base sm:text-lg leading-relaxed max-w-2xl">
                    {event.description}
                  </p>

                  {/* Badges/Quick Stats Grid */}
                  <div className="event-stats-grid grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    {event.duration && (
                      <div className="bg-[#121c38]/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                        <Clock size={18} style={{ color: event.gradientFrom }} />
                        <span className="text-[10px] font-mono text-text-faint tracking-wider uppercase">Duration</span>
                        <span className="text-white font-semibold text-sm font-display">{event.duration}</span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="bg-[#121c38]/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                        <MapPin size={18} style={{ color: event.gradientTo }} />
                        <span className="text-[10px] font-mono text-text-faint tracking-wider uppercase">Venue</span>
                        <span className="text-white font-semibold text-sm font-display">{event.venue}</span>
                      </div>
                    )}
                    {event.teamSize && (
                      <div className="bg-[#121c38]/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                        <Users size={18} style={{ color: event.gradientFrom }} />
                        <span className="text-[10px] font-mono text-text-faint tracking-wider uppercase">Team Size</span>
                        <span className="text-white font-semibold text-sm font-display">{event.teamSize}</span>
                      </div>
                    )}
                    {event.prizePool && (
                      <div className="bg-[#121c38]/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                        <Trophy size={18} style={{ color: event.gradientTo }} />
                        <span className="text-[10px] font-mono text-text-faint tracking-wider uppercase">Prizes</span>
                        <span className="text-white font-semibold text-sm font-display">{event.prizePool}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
                    {event.registerUrl && (
                      <a
                        href={event.registerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 min-w-[180px] px-6 py-3 rounded-full text-sm font-semibold tracking-wider font-mono border border-transparent bg-gradient-to-r from-[#edac03] to-[#ffcf40] text-[#221643] hover:from-[#221643] hover:to-[#221643] hover:text-[#edac03] hover:border-[#edac03] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(237,172,3,0.35)]"
                      >
                        <span>REGISTER NOW</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    {event.officialWebsite && (
                      <a
                        href={event.officialWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 min-w-[180px] px-6 py-3 rounded-full text-sm font-semibold tracking-wider font-mono border border-[#edac03] bg-[#221643] text-[#edac03] hover:bg-gradient-to-r hover:from-[#edac03] hover:to-[#ffcf40] hover:text-[#221643] hover:border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(237,172,3,0.25)]"
                      >
                        <span>OFFICIAL WEBSITE</span>
                        <Globe size={14} />
                      </a>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* ── Dashboard Grid ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* LEFT COLUMN: Tracks, Prizes (lg:span-7 or 8) */}
              <div className="lg:col-span-7 space-y-12">
                
                {/* Tracks / Themes Grid */}
                {event.tracks && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Target size={18} style={{ color: event.gradientFrom }} />
                      <h2 className="text-xs font-mono font-bold tracking-[0.25em] text-white uppercase">
                        // THEMES & TRACKS
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {event.tracks.map((track) => (
                        <div 
                          key={track} 
                          className="bg-[#0b1329]/40 border border-white/5 rounded-2xl p-4 transition-all duration-300 hover:border-white/10 group flex items-center gap-3 relative overflow-hidden"
                        >
                          <div 
                            className="absolute inset-y-0 left-0 w-[3px]"
                            style={{ background: `linear-gradient(to bottom, ${event.gradientFrom}, ${event.gradientTo})` }}
                          />
                          <span className="text-white/90 font-mono font-semibold text-xs sm:text-sm tracking-wide pl-2">
                            {track}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prizes Table */}
                {event.prizes && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Trophy size={18} style={{ color: event.gradientTo }} />
                      <h2 className="text-xs font-mono font-bold tracking-[0.25em] text-white uppercase">
                        // PRIZES & REWARDS
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Top 3 prizes grid */}
                      {event.prizes.slice(0, 3).map((prize, idx) => {
                        const rankColors = [
                          { border: 'border-yellow-500/30', glow: 'shadow-yellow-500/5', bg: 'bg-yellow-500/5', num: '1st' },
                          { border: 'border-slate-300/30', glow: 'shadow-slate-300/5', bg: 'bg-slate-300/5', num: '2nd' },
                          { border: 'border-amber-700/30', glow: 'shadow-amber-700/5', bg: 'bg-amber-700/5', num: '3rd' }
                        ][idx] || { border: 'border-white/5', glow: '', bg: '', num: '' }

                        return (
                          <div 
                            key={prize.title} 
                            className={`bg-[#0b1329]/50 border ${rankColors.border} rounded-2xl p-6 text-center shadow-lg ${rankColors.glow} relative flex flex-col justify-between`}
                          >
                            <span className="absolute top-3 right-4 font-mono text-[10px] text-text-faint font-semibold uppercase tracking-widest">
                              {rankColors.num}
                            </span>
                            <div className="py-2">
                              <h3 className="text-text-muted font-mono text-xs font-medium uppercase tracking-wider mb-2">
                                {prize.title}
                              </h3>
                              <p className="text-white font-display font-bold text-lg sm:text-xl">
                                {prize.amount}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-text-faint uppercase mt-2">
                              {prize.winners}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Special Category Prizes */}
                    {event.prizes.length > 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {event.prizes.slice(3).map((prize) => (
                          <div 
                            key={prize.title} 
                            className="bg-[#0b1329]/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-md"
                          >
                            <div>
                              <h3 className="text-text-muted font-mono text-xs font-medium uppercase tracking-wider mb-1">
                                {prize.title}
                              </h3>
                              <p className="text-white font-display font-bold text-base">
                                {prize.amount}
                              </p>
                            </div>
                            <span className="text-[10px] font-mono text-text-faint uppercase bg-white/5 px-2 py-1 rounded">
                              {prize.winners}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Timeline & Eligibility (lg:span-5 or 4) */}
              <div className="lg:col-span-5 space-y-12">
                
                {/* Timeline */}
                {event.timeline && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} style={{ color: event.gradientFrom }} />
                      <h2 className="text-xs font-mono font-bold tracking-[0.25em] text-white uppercase">
                        // TIMELINE & STAGES
                      </h2>
                    </div>
                    
                    <div className="relative border-l border-white/10 pl-6 ml-2 space-y-8">
                      {event.timeline.map((item, idx) => (
                        <div key={idx} className="relative group">
                          {/* Dot connector */}
                          <div 
                            className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-[#060b14] bg-white transition-transform duration-300 group-hover:scale-125"
                            style={{ 
                              background: `linear-gradient(to right, ${event.gradientFrom}, ${event.gradientTo})`,
                              boxShadow: `0 0 10px ${event.gradientFrom}`
                            }}
                          />
                          
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-mono font-semibold tracking-wider">
                              <span style={{ color: event.gradientFrom }}>{item.date}</span>
                              <span className="text-text-faint">•</span>
                              <span className="text-text-muted uppercase">{item.location}</span>
                            </div>
                            <h3 className="text-white font-display font-bold text-base">
                              {item.title}
                            </h3>
                            <p className="text-text-muted font-body text-xs sm:text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility Details */}
                {event.eligibility && (
                  <div className="bg-[#0b1329]/50 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase">
                      Eligibility & Guidelines
                    </h3>
                    <p className="text-text-muted font-body text-xs sm:text-sm leading-relaxed">
                      {event.eligibility}. Make sure your team has exactly 4 members before registrations close.
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
             SIMPLIFIED COMPACT VIEW (For Past/Simple Events)
             ══════════════════════════════════════════════════════════ */
          <div>
            <div className="mb-8">
              <span
                className="text-xs font-mono tracking-widest px-2 py-1 rounded border mb-4 inline-block font-semibold"
                style={{ color: event.gradientFrom, borderColor: `${event.gradientFrom}40`, background: `${event.gradientFrom}10` }}
              >
                {event.tag.toUpperCase()}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                {event.status === 'upcoming' && (
                  <span className="pill pill-live flex-shrink-0">REGISTRATIONS LIVE</span>
                )}
                {event.registerUrl && event.status === 'upcoming' && (
                  <a
                    href={event.registerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider font-mono border border-transparent bg-gradient-to-r from-[#edac03] to-[#ffcf40] text-[#221643] hover:from-[#221643] hover:to-[#221643] hover:text-[#edac03] hover:border-[#edac03] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(237,172,3,0.25)]"
                  >
                    <span className="leading-none">Register Now</span>
                    <ExternalLink size={14} className="flex-shrink-0" />
                  </a>
                )}
                {event.status === 'past' && (
                  <span className="text-text-muted text-sm font-mono uppercase tracking-widest">
                    — Event Completed
                  </span>
                )}
              </div>
            </div>

            <div className="w-16 h-1 mb-10 mt-6" style={{ background: `linear-gradient(90deg, ${event.gradientFrom}, ${event.gradientTo})` }} />

            <div className="prose prose-invert max-w-none font-body text-text-muted leading-relaxed">
              <p className="text-xl text-white/90 font-medium mb-8">
                {event.description}
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
