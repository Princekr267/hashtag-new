import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink } from 'lucide-react'
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-[#060b14] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-96 -z-10 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 80% at 80% 0%, ${event.gradientFrom}15, transparent 70%)`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="max-w-5xl mx-auto"
      >
        <Link
          to="/events"
          className="inline-flex items-center gap-[8px] text-xs font-label tracking-widest uppercase mb-8 transition-colors hover:text-white"
          style={{ color: event.gradientFrom }}
        >
          <ArrowLeft size={14} className="flex-shrink-0" />
          <span className="leading-none">Back to Events</span>
        </Link>
        
        <div className="mb-8">
          <span
            className="text-xs font-label tracking-widest px-2 py-1 rounded border mb-4 inline-block"
            style={{ color: event.gradientFrom, borderColor: `${event.gradientFrom}40`, background: `${event.gradientFrom}10` }}
          >
            {event.tag.toUpperCase()}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            {event.status === 'upcoming' && (
              <span className="pill pill-live flex-shrink-0">LIVE SOON</span>
            )}
            {event.registerUrl && event.status === 'upcoming' && (
              <a
                href={event.registerUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center gap-[8px]"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                <span className="leading-none">Register Now</span>
                <ExternalLink size={14} className="flex-shrink-0" />
              </a>
            )}
            {event.status === 'past' && (
              <span className="text-text-muted text-sm font-label uppercase tracking-widest">
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <br />
          <h3 className="text-2xl text-white font-bold mb-4 font-display">Deep Dive</h3>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, 
            est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
            Donec accumsan mauris a vehicula faucibus.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
