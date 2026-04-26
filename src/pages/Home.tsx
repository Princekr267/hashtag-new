import { useEffect, useRef, useState } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { useScrambleText } from '../hooks/useScrambleText'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/ui/MagneticButton'
import CosmosHero from '../components/visuals/CosmosHero'
import AmbientOrbs from '../components/ui/AmbientOrbs'
import InteractiveCard3D from '../components/ui/InteractiveCard3D'
import { STATS, MARQUEE_EVENTS } from '../constants/data'

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

function BlurHeading() {
  const line1 = 'Explore the cosmos'
  const line2 = 'of technology'

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)', scale: 0.95 },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <motion.h1
      className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] font-display font-extrabold leading-[0.95] tracking-[-0.03em] text-white max-w-5xl"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <span className="block" style={{ minHeight: '1.1em' }}>
        {line1.split(' ').map((word, i) => (
          <motion.span key={i} variants={item} className="inline-block mr-[0.2em] last:mr-0">
            {word}
          </motion.span>
        ))}
      </span>
      <span className="block text-gradient" style={{ minHeight: '1.1em' }}>
        {line2.split(' ').map((word, i) => (
          <motion.span key={i} variants={item} className="inline-block mr-[0.2em] last:mr-0">
            {word}
          </motion.span>
        ))}
      </span>
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

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center lg:items-start text-center lg:text-left relative z-10">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 80%)',
            }}
          />

          <div className="flex flex-col items-center lg:items-start gap-6 max-w-5xl relative z-10">
            {/* Eyebrow — Change 4A */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
              style={{ animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-label font-bold tracking-[0.4em] uppercase"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--tertiary)',
                    letterSpacing: '0.15em',
                  }}
                >
                  JIMS Greater Noida
                </span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>✦</span>
                <span
                  className="font-label font-bold tracking-[0.4em] uppercase px-3 py-1 rounded-full border"
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--primary)',
                    borderColor: 'rgba(96,165,250,0.25)',
                    background: 'rgba(96,165,250,0.07)',
                    letterSpacing: '0.15em',
                  }}
                >
                  Tech Society
                </span>
              </div>
            </motion.div>

            {/* Main headline with modern blur reveal — Change 4B */}
            <BlurHeading />

            {/* Subheadline — Change 4A actual description */}
            <motion.p
              className="font-body leading-relaxed max-w-[620px]"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(148,163,196,0.9)',
                fontWeight: 400,
                letterSpacing: '0.01em',
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: 'easeOut' }}
            >
              JIMS Greater Noida's premier technical society — where builders,
              designers, and dreamers turn ideas into real-world impact through
              hackathons, workshops, and cross-disciplinary collaboration.
            </motion.p>

            {/* CTA row */}
            <motion.div
              className="mt-4 flex flex-col sm:flex-row items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <MagneticButton>
                <Link
                  to="/events"
                  className="btn-primary flex-shrink-0 text-sm"
                  style={{ padding: '13px 32px' }}
                >
                  Explore Events
                </Link>
              </MagneticButton>
              <Link
                to="/about"
                className="text-white/40 hover:text-white transition-colors text-xs font-label tracking-[0.3em] uppercase flex items-center gap-3"
              >
                <div className="w-6 h-px bg-white/15" />
                Our Story
                <div className="w-6 h-px bg-white/15" />
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
            <Link to="/about" className="hidden md:flex items-center gap-[8px] text-text-muted hover:text-primary transition-colors text-sm font-label tracking-wider">
              <span className="leading-none">Learn more</span> <ArrowRight size={14} className="flex-shrink-0" />
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
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-4xl font-mono-custom flex-shrink-0"
                            style={{ color: f.accent, textShadow: `0 0 20px ${f.accent}66` }}
                          >
                            {f.icon}
                          </span>
                          <h3
                            className="text-2xl font-display font-bold m-0"
                            style={{ color: f.accent }}
                          >
                            {f.title}
                          </h3>
                        </div>
                        <span
                          className="text-[10px] font-label tracking-widest px-2 py-1 border rounded flex-shrink-0 mt-1"
                          style={{ color: `${f.accent}99`, borderColor: `${f.accent}25` }}
                        >
                          {f.tag}
                        </span>
                      </div>
                      <p className="text-text-muted leading-relaxed text-sm font-body mt-2">{f.desc}</p>
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
              <div className="surface-card p-6 md:p-8 h-full bg-[#050a1a] border border-cyan-500/20 hover:border-cyan-500/50 transition-colors rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-cyan-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                    <span className="text-xs font-mono-custom tracking-widest text-cyan-400 leading-none">STATUS.ONLINE</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">HashDash Finance</h3>
                  <p className="text-text-muted mb-6 text-sm">
                    A full-stack React and Node.js finance dashboard with role-based access control and live data streaming.
                  </p>
                  <div className="flex flex-wrap gap-2 font-mono-custom text-[10px] text-cyan-200/50 uppercase">
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
              <div className="surface-card p-6 md:p-8 h-full bg-[#050a1a] border border-purple-500/20 hover:border-purple-500/50 transition-colors rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/10 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-purple-500 opacity-50 flex-shrink-0" />
                    <span className="text-xs font-mono-custom tracking-widest text-purple-400 leading-none">V2.BETA</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">CodeTrek Platform</h3>
                  <p className="text-text-muted mb-6 text-sm">
                    An automated judging platform built for our relay coding hackathons, capable of evaluating 100+ submissions per minute.
                  </p>
                  <div className="flex flex-wrap gap-2 font-mono-custom text-[10px] text-purple-200/50 uppercase">
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
              <Link to="/about" className="btn-primary flex-shrink-0 flex items-center gap-[8px] justify-center">
                <span className="leading-none">Our Story</span> <ArrowRight size={15} className="flex-shrink-0" />
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
