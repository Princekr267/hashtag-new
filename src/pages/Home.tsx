import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/ui/MagneticButton'
import CosmosHero from '../components/visuals/CosmosHero'
import { STATS, MARQUEE_EVENTS } from '../constants/data'

gsap.registerPlugin(ScrollTrigger)

// ── What We Do ──────────────────────────────────────────────-
const FEATURES = [
  {
    icon: '</',
    title: 'Development',
    desc: 'We build real projects — from zero to shipped. Full stack, mobile, APIs. We write code that actually runs in the world.',
    accent: '#60a5fa',
    tag: 'TECHNICAL',
  },
  {
    icon: '◈',
    title: 'Design',
    desc: 'We craft experiences people feel. Product design, motion, and branding that makes a lasting impression.',
    accent: '#818cf8',
    tag: 'CREATIVE',
  },
  {
    icon: '⚡',
    title: 'Innovation',
    desc: 'We solve real problems. Hackathons, ideathons, and experiments that push the limit of what students can build.',
    accent: '#38bdf8',
    tag: 'IMPACT',
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

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════ */}
      <section className="min-h-screen flex items-center px-6 pt-24 pb-12 relative overflow-hidden">

        {/* Background grid lines */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(143,245,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143,245,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />

        {/* Radial gradient polish */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 70% at 70% 50%, rgba(143,245,255,0.04) 0%, transparent 70%)',
        }} />

        <div className="absolute inset-0 z-0 pointer-events-none">
          <CosmosHero />
          {/* Subtle overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center relative z-10 px-4">
          {/* ── CONTENT ── */}
          <div className="flex flex-col items-center gap-6 max-w-5xl">
            {/* Tag pill - Blue TECH SOCIETY */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="text-[10px] md:text-xs font-label font-bold tracking-[0.4em] text-blue-500 uppercase px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5">
                TECH SOCIETY
              </span>
            </motion.div>

            {/* Headline - "Explore the cosmos of technology" */}
            <h1
              className="text-4xl sm:text-6xl md:text-8xl lg:text-[100px] font-display font-bold leading-[1.05] tracking-tight text-white max-w-4xl"
            >
              {"Explore the cosmos of technology".split(" ").map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4 + i * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Subtext - "Where innovation meets the infinite" */}
            <motion.p
              className="text-blue-200/50 text-base md:text-xl leading-relaxed max-w-2xl font-body italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Where innovation meets the infinite
            </motion.p>

            {/* Subtle Scroll Hint or Secondary CTA */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
               <Link to="/events" className="text-white/40 hover:text-white transition-colors text-xs font-label tracking-[0.3em] uppercase flex items-center gap-4">
                 <div className="w-8 h-px bg-white/10" />
                 ENTER SOCIETY
                 <div className="w-8 h-px bg-white/10" />
               </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-outline-var/30">
            {FEATURES.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.2, 0, 0, 1] }}
                className="group relative p-10 overflow-hidden cursor-default"
                style={{
                  background: 'var(--bg-container)',
                  borderRight: idx < 2 ? '1px solid rgba(143,245,255,0.08)' : 'none',
                }}
              >
                {/* Hover gradient fill */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${f.accent}0a 0%, transparent 70%)` }}
                />

                {/* Top bevel */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.accent}50, transparent)` }}
                />

                <div className="flex flex-col gap-6 h-full relative z-10">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-3xl font-mono-custom"
                      style={{ color: f.accent, textShadow: `0 0 20px ${f.accent}66` }}
                    >
                      {f.icon}
                    </span>
                    <span
                      className="text-xs font-label tracking-widest px-2 py-1 border"
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
              </motion.div>
            ))}
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

          <div className="grid grid-cols-2 lg:grid-cols-4 border border-outline-var/30">
            {STATS.map((stat, idx) => (
              <div
                key={stat.label}
                className="p-12 surface-card"
                style={{ borderRight: idx < 3 ? '1px solid rgba(143,245,255,0.06)' : 'none' }}
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
