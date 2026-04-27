import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
  const { data } = useData();
  const [filter, setFilter] = useState('upcoming');

  if (!data?.events) return null;

  // Handle both array and object structure
  const eventsArray = Array.isArray(data.events) 
    ? data.events 
    : [];
  
  const filteredEvents = eventsArray.filter(e => e.type === filter);

  return (
    <section id="events" className="section-padding border-t border-border/30 relative">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">Events & Workshops</h2>
          <p className="text-muted max-w-lg">Engage, learn, and hack. Discover what's happening next in our community.</p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-surface p-1 rounded-lg border border-border shrink-0">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all relative ${filter === 'upcoming' ? 'text-white' : 'text-muted hover:text-white'}`}
          >
            {filter === 'upcoming' && (
              <motion.div layoutId="event-tab" className="absolute inset-0 bg-white/10 rounded-md" />
            )}
            <span className="relative z-10">Upcoming</span>
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-md font-medium text-sm transition-all relative ${filter === 'past' ? 'text-white' : 'text-muted hover:text-white'}`}
          >
            {filter === 'past' && (
              <motion.div layoutId="event-tab" className="absolute inset-0 bg-white/10 rounded-md" />
            )}
            <span className="relative z-10">Past Events</span>
          </button>
        </div>
      </motion.div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event) => (
            <motion.div
              layout
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="card-surface overflow-hidden group hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] md:hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] transition-all duration-300 transform md:hover:-translate-y-2 flex flex-col rounded-xl sm:rounded-2xl"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden bg-background">
                <img 
                  src={event.image || '/assets/images/event1.jpg'} 
                  alt={event.title}
                  className="w-full h-full object-cover opacity-100 sm:opacity-80 group-hover:scale-105 sm:group-hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-3 h-3 text-primary" />
                  <span className="text-xs font-mono">{event.date}</span>
                </div>
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-heading font-bold mb-2 text-white group-hover:text-primary transition-colors line-clamp-2">{event.title}</h3>
                <p className="text-xs sm:text-sm text-muted mb-4 sm:mb-6 flex-1 line-clamp-3">{event.description}</p>
                {event.registrationLink && (
                  <a 
                    href={event.registrationLink}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-secondary transition-colors group/link mt-auto w-fit"
                  >
                    Register Now
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {filteredEvents.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full flex flex-col items-center justify-center py-20 bg-surface/30 rounded-2xl border border-border/50"
            >
              <Calendar className="w-12 h-12 text-muted mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No {filter} events found</h3>
              <p className="text-muted text-center max-w-sm">
                Stay tuned! We are brewing something exciting. Check back later or subscribe to our newsletter.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Events;
