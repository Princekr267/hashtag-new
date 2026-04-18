import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/ui/MagneticButton'
import CosmosHero from '../components/visuals/CosmosHero'
import AmbientOrbs from '../components/ui/AmbientOrbs'
import InteractiveCard3D from '../components/ui/InteractiveCard3D'
import { STATS, MARQUEE_EVENTS } from '../constants/data'
import { useScrambleText } from '../hooks/useScrambleText'

gsap.registerPlugin(ScrollTrigger)

// ── What We Do ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: '</',
    title: 'Development',
    desc: 'We build real projects — from zero to shipped. Full stack, mobile, APIs. We write code that actually runs in the world.',
    accent: '#60a5fa',
    tag: 'TECHNICAL',
    back: '15K+ lines shipped to production by our community.',
  },
  {
    icon: '◈',
    title: 'Design',
    desc: 'We craft experiences people feel. Product design, motion, and branding that makes a lasting impression.',
    accent: '#818cf8',
    tag: 'CREATIVE',
    back: 'Every pixel is intentional. Aesthetic meets function.',
  },
  {
    icon: '⚡',
    title: 'Innovation',
    desc: 'We solve real problems. Hackathons, ideathons, and experiments that push the limit of what students can build.',
    accent: '#38bdf8',
    tag: 'IMPACT',
    back: '5 hackathons won. Countless ideas born here.',
  },
]

// ── Animated stat counter ─────────────────────────────────────
function StatCounter({ stat }: { stat: typeof STATS[0] }) {
  const ref       = useRef<HTMLSpanElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (triggered.current) return
        triggered.current = true
        const dur = 2000
        const t0  = performance.now()
        const tick = (now: number) => {
          const p  = Math.min((now - t0) / dur, 1)
          const e  = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.round(stat.value * e).toString()
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
    })
    return () => trigger.kill()
  }, [stat.value])

  return (
    <div className="text-center group">
      <div className="stat-number text-gradient">
        <span ref={ref}>0</span>
        <span>{stat.suffix}</span>
      </div>
      <p className="text-text-muted mt-2 text-xs font-label tracking-widest uppercase">{stat.label}</p>
    </div>
  )
}

// ── Hero headline with scramble — resets on every route entry ─────
// We use useEffect to track mount count so the hook key resets
import { useState as _useState } from 'react'
function ScrambleHeading() {
  // remountKey changes on every mount, forcing useScrambleText to restart
  const [remountKey] = _useState(() => Date.now())
  const line1 = useScrambleText('Explore the cosmos', { staggerMs: 28, iterations: 8, initialDelay: 400 })
  const line2 = useScrambleText('of technology',      { staggerMs: 28, iterations: 8, initialDelay: 700 })

  return (
    <motion.h1
      key={remountKey}
      className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] font-display font-bold leading-[1.05] tracking-tight text-white max-w-4xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      style={{ willChange: 'opacity' }}
    >
      <span className="block">{line1}</span>
      <span className="block">{line2}</span>
    </motion.h1>
  )
}

export default function Home(): JSX.Element {
  const marqueeDoubled = [...MARQUEE_EVENTS, ...MARQUEE_EVENTS]

  useEffect(() => {
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 0, y: 30 },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        },
      )
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="relative z-10">

      {/* Subtle mascot watermark */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] opacity-[0.03] pointer-events-none -z-10 mix-blend-screen overflow-hidden">
         <img src="/mascot.png" alt="" className="w-full h-full object-contain filter grayscale invert" />
      </div>

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center px-6 pt-24 pb-12 relative overflow-hidden">

        {/* Ambient background orbs */}
        <AmbientOrbs />

        {/* Grid pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(143,245,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143,245,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(143,245,255,0.04) 0%, transparent 70%)',
        }} />

        <div className="absolute inset-0 z-0 pointer-events-none">
          <CosmosHero />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center relative z-10 px-4">
          <div className="flex flex-col items-center gap-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="text-[10px] md:text-xs font-label font-bold tracking-[0.4em] text-blue-500 uppercase px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5">
                TECH SOCIETY
              </span>
            </motion.div>

            {/* Scramble headline */}
            <ScrambleHeading />

            <motion.p
              className="text-blue-200/50 text-base md:text-xl leading-relaxed max-w-2xl font-body italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Where innovation meets the infinite
            </motion.p>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
            >
              {/* CTA with pulsing glow — Change 2 */}
              <style>{`
                @keyframes ctaGlow {
                  0%, 100% { box-shadow: 0 0 0px rgba(96,165,250,0); }
                  50%       { box-shadow: 0 0 18px rgba(96,165,250,0.4); }
                }
                .cta-glow-link {
                  animation: ctaGlow 3s ease-in-out infinite;
                  will-change: box-shadow;
                  border-radius: 999px;
                }
                @media (prefers-reduced-motion: reduce) {
                  .cta-glow-link { animation: none !important; }
                }
              `}</style>
              <Link
                to="/events"
                className="cta-glow-link text-white/40 hover:text-white transition-colors text-xs font-label tracking-[0.3em] uppercase flex items-center gap-4"
              >
                <div className="w-8 h-px bg-white/10" />
                ENTER SOCIETY
                <div className="w-8 h-px bg-white/10" />
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-text-faint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <span className="text-xs font-label tracking-widest">SCROLL</span>
          <ChevronDown size={18} className="animate-bounce-arrow" />
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════════
          WHAT WE DO
          ════════════════════════════════════════════════════ */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex items-end justify-between">
            <h2 data-reveal className="text-4xl md:text-6xl font-display font-bold">
              What We <span className="text-gradient-green">Build</span>
            </h2>
            <Link to="/about" className="hidden md:flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm font-label tracking-wider">
              Learn more <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.2, 0, 0, 1] }}
                className="h-full"
              >
                <InteractiveCard3D accentColor={f.accent} className="h-full">
                  <div className="p-10 flex flex-col gap-6 h-full">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-4xl font-mono-custom"
                        style={{ color: f.accent, textShadow: `0 0 20px ${f.accent}66` }}
                      >
                        {f.icon}
                      </span>
                      <span
                        className="text-[10px] font-label tracking-widest px-2 py-1 border rounded"
                        style={{ color: `${f.accent}99`, borderColor: `${f.accent}25` }}
                      >
                        {f.tag}
                      </span>
                    </div>

                    <div>
                      <h3
                        className="text-2xl font-display font-bold mb-3"
                        style={{ color: f.accent }}
                      >
                        {f.title}
                      </h3>
                      <p className="text-text-muted leading-relaxed text-sm font-body">{f.desc}</p>
                    </div>

                    <div
                      className="h-px mt-auto transition-all duration-500 group-hover:w-full"
                      style={{ width: '3rem', background: `linear-gradient(90deg, ${f.accent}, transparent)` }}
                    />
                  </div>
                </InteractiveCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          ARTIFACTS SECTION
          ════════════════════════════════════════════════════ */}
      <section className="section px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <h2 data-reveal className="text-4xl md:text-5xl font-display font-bold mb-4">
                Live <span className="text-gradient">Artifacts</span>
              </h2>
              <p className="text-text-muted font-body max-w-xl">
                Open-source projects and internal tools built by the Hashtag community. 
                We don't just learn tech, we ship it to production.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Artifact 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="surface-card p-8 h-full bg-[#050a1a] border border-cyan-500/20 hover:border-cyan-500/50 transition-colors rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-mono-custom tracking-widest text-cyan-400">STATUS.ONLINE</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">HashDash Finance</h3>
                  <p className="text-text-muted mb-6 text-sm">
                    A full-stack React and Node.js finance dashboard with role-based access control and live data streaming.
                  </p>
                  <div className="flex gap-2 font-mono-custom text-[10px] text-cyan-200/50 uppercase">
                    <span className="px-2 py-1 bg-cyan-900/30 rounded border border-cyan-500/20">React</span>
                    <span className="px-2 py-1 bg-cyan-900/30 rounded border border-cyan-500/20">Node.js</span>
                    <span className="px-2 py-1 bg-cyan-900/30 rounded border border-cyan-500/20">MongoDB</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Artifact 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="surface-card p-8 h-full bg-[#050a1a] border border-purple-500/20 hover:border-purple-500/50 transition-colors rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-purple-500 opacity-50" />
                    <span className="text-xs font-mono-custom tracking-widest text-purple-400">V2.BETA</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">CodeTrek Platform</h3>
                  <p className="text-text-muted mb-6 text-sm">
                    An automated judging platform built for our relay coding hackathons, capable of evaluating 100+ submissions per minute.
                  </p>
                  <div className="flex gap-2 font-mono-custom text-[10px] text-purple-200/50 uppercase">
                    <span className="px-2 py-1 bg-purple-900/30 rounded border border-purple-500/20">Python</span>
                    <span className="px-2 py-1 bg-purple-900/30 rounded border border-purple-500/20">Docker</span>
                    <span className="px-2 py-1 bg-purple-900/30 rounded border border-purple-500/20">Redis</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SCROLLING MARQUEE
          ════════════════════════════════════════════════════ */}
      <div className="py-8 overflow-hidden">
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(143,245,255,0.12), transparent)' }} />
        <div className="flex overflow-hidden py-6">
          <div className="marquee-track animate-marquee">
            {marqueeDoubled.map((e, i) => (
              <span key={i} className="text-3xl md:text-5xl font-bold text-text-faint/30 uppercase mx-8 font-display">
                {e}<span className="mx-6 text-primary/20">///</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex overflow-hidden py-2">
          <div className="marquee-track animate-marquee-reverse">
            {[...marqueeDoubled].reverse().map((e, i) => (
              <span key={i} className="text-lg md:text-2xl font-bold text-text-faint/20 uppercase mx-6 font-label tracking-widest">
                <span className="mr-4 text-primary/20">◈</span>{e}
              </span>
            ))}
          </div>
        </div>
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,252,64,0.12), transparent)' }} />
      </div>

      {/* ════════════════════════════════════════════════════════
          STATS
          ════════════════════════════════════════════════════ */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 data-reveal className="text-4xl md:text-6xl font-display font-bold">
              By the <span className="text-gradient">Numbers</span>
            </h2>
            <p className="text-text-muted mt-4 max-w-lg mx-auto font-body text-base">
              A community that grows, builds, and makes things happen every semester.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 border border-outline-var/30">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="p-10 md:p-12 surface-card border-b border-r border-outline-var/30"
              >
                <StatCounter stat={stat} />
              </div>
            ))}
          </div>

          <motion.div
            className="mt-20 flex flex-col md:flex-row items-center gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-text-muted text-lg font-body max-w-md text-center md:text-left">
              Whether you code, design, or just love being around people who build —
              there's a place for you.
            </p>
            <MagneticButton>
              <Link to="/about" className="btn-primary flex-shrink-0">
                Our Story <ArrowRight size={15} />
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
