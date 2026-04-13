import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TiltCard from '../components/TiltCard'
import SubpageHeroVisual from '../components/SubpageHeroVisual'
import { MILESTONES } from '../constants/data'

gsap.registerPlugin(ScrollTrigger)

const VALUES = [
  {
    icon: '◈',
    title: 'Build Real Things',
    desc: 'We ship projects that matter. From hackathons to industry partnerships — everything we do has real-world impact.',
    accent: '#8ff5ff',
  },
  {
    icon: '⚡',
    title: 'Learn Together',
    desc: 'Workshops, seminars, and peer learning. Knowledge grows when shared — we believe in collaborative growth.',
    accent: '#00fc40',
  },
  {
    icon: '◎',
    title: 'Lead with Purpose',
    desc: "We don't just participate — we organize, lead, and inspire. Every member is a potential leader.",
    accent: '#ac89ff',
  },
  {
    icon: '∞',
    title: 'Stay Curious',
    desc: 'Tech evolves fast. We celebrate curiosity, experimentation, and the bold willingness to try new things.',
    accent: '#ff6b9b',
  },
]

export default function About(): JSX.Element {
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const nodes = document.querySelectorAll('.timeline-node')
    nodes.forEach((node) => {
      ScrollTrigger.create({
        trigger: node,
        start: 'top 75%',
        onEnter: () => node.classList.add('active'),
      })
    })

    const headings = document.querySelectorAll('[data-reveal]')
    headings.forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 0, y: 30 },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        },
      )
    })

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

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

          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block">
             <SubpageHeroVisual type="rings" />
          </div>

          {/* Horizontal rule with glow */}
          <div
            className="h-px w-full mt-16"
            style={{ background: 'linear-gradient(90deg, rgba(143,245,255,0.4), transparent)' }}
          />
        </div>
      </section>

      {/* ── MISSION / VISION ────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0">
          <div
            className="surface-card p-12"
            style={{ borderRight: '1px solid rgba(143,245,255,0.05)' }}
          >
            <span className="text-xs font-label text-secondary tracking-widest mb-4 block">MISSION</span>
            <h2 className="text-2xl font-display font-bold mb-4 text-text-primary">
              Bridge the Gap
            </h2>
            <p className="text-text-muted font-body leading-relaxed">
              To bridge the gap between academic learning and industry reality by giving students
              hands-on experience, real mentorship, and a tribe that pushes them forward.
            </p>
          </div>
          <div className="surface-card p-12">
            <span className="text-xs font-label text-primary tracking-widest mb-4 block">VISION</span>
            <h2 className="text-2xl font-display font-bold mb-4 text-text-primary">
              Shape Tomorrow's Leaders
            </h2>
            <p className="text-text-muted font-body leading-relaxed">
              To cultivate a generation of technically proficient, creatively bold, and ethically
              grounded leaders who define the future of technology in India.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 data-reveal className="text-4xl md:text-5xl font-display font-bold">
              Our <span className="text-gradient-violet">Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0">
            {VALUES.map((v, idx) => (
              <TiltCard
                key={v.title}
                className="surface-card shimmer-card p-8"
                glowColor={`${v.accent}18`}
                style={{ borderRight: idx < 3 ? '1px solid rgba(143,245,255,0.05)' : 'none' } as React.CSSProperties}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.2, 0, 0, 1] }}
                  className="flex flex-col gap-5 h-full"
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
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ────────────────────────────────────────── */}
      <section className="section px-6" ref={timelineRef}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 data-reveal className="text-4xl md:text-5xl font-display font-bold">
              Our <span className="text-gradient-green">Journey</span>
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="timeline-line" />

            <div className="flex flex-col gap-0">
              {MILESTONES.map((m, idx) => {
                const isLeft = idx % 2 === 0
                return (
                  <motion.div
                    key={`${m.year}-${m.title}`}
                    className={`flex items-start gap-8 py-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
                  >
                    {/* Content block */}
                    <div className={`flex-1 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <span className="text-xs font-label text-secondary tracking-widest">{m.year}</span>
                      <h3 className="text-xl font-display font-bold mt-1 mb-2 text-text-primary">{m.title}</h3>
                      <p className="text-text-muted text-sm font-body leading-relaxed max-w-sm inline-block">{m.description}</p>
                    </div>
                    {/* Node */}
                    <div className="flex-shrink-0 relative z-10">
                      <div className="timeline-node" />
                    </div>
                    {/* Spacer */}
                    <div className="flex-1" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
