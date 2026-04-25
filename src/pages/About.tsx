import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FlipCard from '../components/ui/FlipCard'
import { MILESTONES } from '../constants/data'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    icon: '◈',
    title: 'Build Real Things',
    desc: 'We ship projects that matter. From hackathons to industry partnerships — everything we do has real-world impact.',
    accent: '#8ff5ff',
    stat: '12+ projects shipped',
    quote: 'Real code. Real impact. Every semester.',
  },
  {
    icon: '⚡',
    title: 'Learn Together',
    desc: 'Workshops, seminars, and peer learning. Knowledge grows when shared — we believe in collaborative growth.',
    accent: '#00fc40',
    stat: '20+ workshops hosted',
    quote: 'Knowledge shared is knowledge multiplied.',
  },
  {
    icon: '◎',
    title: 'Lead with Purpose',
    desc: "We don't just participate — we organize, lead, and inspire. Every member is a potential leader.",
    accent: '#ac89ff',
    stat: '50+ members leading',
    quote: 'Every builder started as a beginner.',
  },
  {
    icon: '∞',
    title: 'Stay Curious',
    desc: 'Tech evolves fast. We celebrate curiosity, experimentation, and the bold willingness to try new things.',
    accent: '#ff6b9b',
    stat: '5 hackathons won',
    quote: 'The best projects start with "what if?"',
  },
]

// Fix 2: Premium Mission/Vision card — glass surface, gradient mesh, glowing icon, readable text
function MissionVisionCard({
  type,
  heading,
  body,
  accentColor,
  icon,
}: {
  type: 'MISSION' | 'VISION'
  heading: string
  body: string
  accentColor: string
  icon: string
}) {
  return (
    <div
      className="relative overflow-hidden h-full"
      style={{
        background: `linear-gradient(135deg, rgba(10,14,24,0.95) 0%, rgba(6,10,20,0.98) 100%)`,
        border: `1px solid ${accentColor}28`,
        borderRadius: '24px',
        padding: '40px',
        minHeight: '320px',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = `0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.05)`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = `0 0 0 1px ${accentColor}14`
      }}
    >
      {/* Mesh gradient background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 60% at 10% 0%, ${accentColor}12, transparent 70%)`,
        borderRadius: '24px',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 60% 50% at 90% 100%, ${accentColor}08, transparent 70%)`,
        borderRadius: '24px',
      }} />

      {/* Top glowing line */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%',
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${accentColor}70, transparent)`,
      }} />

      {/* Icon + Badge row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        {/* Large glowing icon */}
        <div style={{
          width: '56px', height: '56px',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}10)`,
          border: `1px solid ${accentColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px',
          boxShadow: `0 0 30px ${accentColor}25, inset 0 1px 0 rgba(255,255,255,0.1)`,
          flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Type badge */}
        <span style={{
          padding: '5px 14px',
          borderRadius: '999px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          background: `${accentColor}14`,
          color: accentColor,
          border: `1px solid ${accentColor}35`,
        }}>
          {type === 'MISSION' ? 'Our Mission' : 'Our Vision'}
        </span>
      </div>

      {/* Heading */}
      <h2 style={{
        fontFamily: 'var(--font-display, Inter, sans-serif)',
        fontWeight: 800,
        fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
        lineHeight: 1.2,
        color: '#fff',
        margin: 0,
        position: 'relative',
        zIndex: 2,
      }}>
        {heading}
      </h2>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: `linear-gradient(90deg, ${accentColor}50, transparent)`,
        position: 'relative', zIndex: 2, flexShrink: 0,
      }} />

      {/* Body */}
      <p style={{
        fontSize: '15px',
        lineHeight: 1.75,
        color: 'rgba(148,163,196,0.85)',
        margin: 0,
        position: 'relative',
        zIndex: 2,
        flex: 1,
      }}>
        {body}
      </p>
    </div>
  )
}


export default function About(): JSX.Element {
  const timelineWrap   = useRef<HTMLDivElement>(null)
  const progressLine   = useRef<HTMLDivElement>(null)
  const nodeRefs       = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs       = useRef<(HTMLDivElement | null)[]>([])

  // Change 4: Scroll-driven timeline progress via rAF-throttled scroll listener
  const updateTimeline = useCallback(() => {
    const wrap = timelineWrap.current
    const line = progressLine.current
    if (!wrap || !line) return

    const rect = wrap.getBoundingClientRect()
    const winH = window.innerHeight
    // progress 0 when top enters viewport, 1 when bottom leaves
    const progress = Math.min(1, Math.max(0,
      (winH - rect.top) / (rect.height + winH)
    ))

    // Grow line height according to progress
    line.style.transform = `scaleY(${progress})`

    // Glow each node when line reaches its position
    nodeRefs.current.forEach((node, i) => {
      if (!node) return
      const nodeRect = node.getBoundingClientRect()
      const nodeProgress = (winH - nodeRect.top) / (winH * 0.8)
      const active = nodeProgress > 0.5

      if (active) {
        node.style.background = 'var(--primary, #60a5fa)'
        node.style.boxShadow  = '0 0 0 4px rgba(96,165,250,0.3)'
        node.style.transform  = 'scale(1.15)'
        // animate card in
        const card = cardRefs.current[i]
        if (card && card.style.opacity === '0') {
          card.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)'
          card.style.opacity    = '1'
          card.style.transform  = 'translateX(0)'
          void card.offsetHeight // flush
        }
      } else {
        node.style.background = 'rgba(100,116,139,0.4)'
        node.style.boxShadow  = 'none'
        node.style.transform  = 'scale(1)'
      }
    })
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      // Show everything immediately
      nodeRefs.current.forEach(n => {
        if (!n) return
        n.style.background = 'var(--primary, #60a5fa)'
        n.style.transform  = 'scale(1)'
      })
      cardRefs.current.forEach(c => {
        if (!c) return
        c.style.opacity   = '1'
        c.style.transform = 'translateX(0)'
      })
      if (progressLine.current) progressLine.current.style.transform = 'scaleY(1)'
      return
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateTimeline()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial call
    updateTimeline()
    window.addEventListener('scroll', onScroll, { passive: true })

    // section heading reveals via GSAP
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 0, y: 30 },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      )
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [updateTimeline])

  return (
    <div className="relative z-10 pt-20">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="pill pill-cyan mb-6 inline-flex">About Us</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              More Than a<br />
              <span className="text-gradient">Tech Society</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-2xl font-body">
              Founded in 2023 at JIMS Greater Noida, Hashtag Official is where technical ambition
              meets creative culture. We are a community of builders, designers, and dreamers
              committed to making real impact through technology.
            </p>
          </motion.div>

          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block pointer-events-none" style={{
            background: 'radial-gradient(ellipse 70% 80% at 80% 40%, rgba(56,189,248,0.06), transparent 70%)',
          }} />

          <div
            className="h-px w-full mt-16"
            style={{ background: 'linear-gradient(90deg, rgba(143,245,255,0.4), transparent)' }}
          />
        </div>
      </section>

      {/* ── MISSION / VISION ─────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission — left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <MissionVisionCard
                type="MISSION"
                icon="🎯"
                heading="Bridge the Gap"
                body="To bridge the gap between academic learning and industry reality by giving students hands-on experience, real mentorship, and a tribe that pushes them forward."
                accentColor="#38bdf8"
              />
            </motion.div>

            {/* Vision — right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <MissionVisionCard
                type="VISION"
                icon="🚀"
                heading="Shape Tomorrow's Leaders"
                body="To cultivate a generation of technically proficient, creatively bold, and ethically grounded leaders who define the future of technology in India."
                accentColor="#818cf8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES — FLIP CARDS ──────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 data-reveal className="text-4xl md:text-5xl font-display font-bold">
              Our <span className="text-gradient-violet">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {VALUES.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <FlipCard
                  height="260px"
                  front={
                    <div
                      className="w-full h-full surface-card shimmer-card p-8 flex flex-col gap-5 rounded-2xl"
                      style={{ borderColor: `${v.accent}18` }}
                    >
                      <span className="text-3xl font-mono-custom" style={{ color: v.accent }}>
                        {v.icon}
                      </span>
                      <div>
                        <h3 className="text-lg font-display font-bold mb-2" style={{ color: v.accent }}>
                          {v.title}
                        </h3>
                        <p className="text-text-muted text-sm font-body leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  }
                  back={
                    <div
                      className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-8 text-center gap-4"
                      style={{
                        background: `linear-gradient(135deg, ${v.accent}15, ${v.accent}05)`,
                        border: `1px solid ${v.accent}30`,
                      }}
                    >
                      <span className="text-4xl font-display font-black" style={{ color: v.accent }}>
                        {v.stat}
                      </span>
                      <p className="text-text-muted text-sm font-body italic leading-relaxed">
                        "{v.quote}"
                      </p>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE — Change 4: Scroll-driven progress line ─────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 data-reveal className="text-4xl md:text-5xl font-display font-bold">
              Our <span className="text-gradient-green">Journey</span>
            </h2>
          </div>

          <div className="relative" ref={timelineWrap}>
            {/* Background track line */}
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
              style={{ width: '2px', height: '100%', background: 'rgba(96,165,250,0.08)', zIndex: 0 }}
            />
            {/* Progress line — scaleY driven by scroll */}
            <div
              ref={progressLine}
              className="absolute left-1/2 top-0 -translate-x-1/2 origin-top pointer-events-none"
              style={{
                width: '2px',
                height: '100%',
                background: 'linear-gradient(180deg, #60a5fa, #818cf8)',
                zIndex: 1,
                transform: 'scaleY(0)',
                transition: 'transform 0.05s linear',
                willChange: 'transform',
                boxShadow: '0 0 8px rgba(96,165,250,0.5)',
              }}
            />

            <div className="flex flex-col gap-0">
              {MILESTONES.map((m, idx) => {
                const isLeft = idx % 2 === 0
                return (
                  <div
                    key={`${m.year}-${m.title}`}
                    className={`flex items-center gap-8 py-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Content — initial hidden state, revealed by scroll listener */}
                    <div
                      ref={(el) => { cardRefs.current[idx] = el }}
                      className={`flex-1 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}
                      style={{
                        opacity: 0,
                        transform: `translateX(${isLeft ? '-20px' : '20px'})`,
                        willChange: 'opacity, transform',
                      }}
                    >
                      <span className="text-xs font-label text-secondary tracking-widest">{m.year}</span>
                      <h3 className="text-xl font-display font-bold mt-1 mb-2 text-text-primary">{m.title}</h3>
                      <p className="text-text-muted text-sm font-body leading-relaxed max-w-sm inline-block">{m.description}</p>
                    </div>

                    {/* Node dot — glows when progress reaches it */}
                    <div className="flex-shrink-0 relative z-10 flex items-center justify-center">
                      <div
                        ref={(el) => { nodeRefs.current[idx] = el }}
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: 'rgba(100,116,139,0.4)',
                          border: '2px solid rgba(96,165,250,0.3)',
                          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          willChange: 'transform, box-shadow, background',
                        }}
                      />
                    </div>

                    <div className="flex-1" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
