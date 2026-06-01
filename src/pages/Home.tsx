import React, { useEffect, useRef, useState, Suspense, lazy } from 'react' // HYDRATION FIX
import { motion, Variants } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '../components/ui/MagneticButton'
import CosmosHero from '../components/visuals/CosmosHero'
import InteractiveCard3D from '../components/ui/InteractiveCard3D'
import HorizontalScrollSkeleton from '../components/ui/HorizontalScrollSkeleton' // HYDRATION FIX

import { STATS, MARQUEE_EVENTS } from '../constants/data'

// HYDRATION FIX: Convert to dynamic import with SSR disabled (lazy loading in Vite)
const HorizontalGallery = lazy(() => import('../components/ui/HorizontalGallery'))

gsap.registerPlugin(ScrollTrigger)

// ── What We Do ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: '</',
    title: 'Core Development',
    desc: 'Nurturing technical skills through hands-on workshops, algorithmic challenges, and live coding sessions focused on industry standards.',
    accent: '#60a5fa',
    tag: 'TECHNICAL',
  },
  {
    icon: '◈',
    title: 'Creative Design',
    desc: 'Enriching student culture with bold visual storytelling, UI/UX mastery, and creative brand challenges that push design limits.',
    accent: '#818cf8',
    tag: 'CREATIVE',
  },
  {
    icon: '⚡',
    title: 'Innovation & Impact',
    desc: 'Solving real-world problems and bridging students with industry through hackathons, mentor sessions, and professional networking.',
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
    <motion.div 
      className="text-center cursor-pointer group"
      whileHover={{ scale: 1.15 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="stat-number text-gradient transition-all duration-500 group-hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.4)] will-change-transform">
        <span ref={ref}>0</span>
        <span className="transition-colors duration-500 group-hover:text-white/80">{stat.suffix}</span>
      </div>
      <p className="text-text-muted mt-2 text-xs font-label tracking-widest uppercase transition-all duration-500 group-hover:text-primary group-hover:tracking-[0.15em]">{stat.label}</p>
    </motion.div>
  )
}

function RevealSection({ children, className = "", delay = 0, revealed = false, style }: { children: React.ReactNode, className?: string, delay?: number, revealed?: boolean, style?: React.CSSProperties }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const blurVal = isMobile ? '6px' : '12px'

  const variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 }
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
      transition={{ 
        duration: 1.2, 
        delay: delay,
        ease: [0.16, 1, 0.3, 1] 
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function BlurHeading({ text, className, revealed }: { text: string, className?: string, revealed: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const blurVal = isMobile ? '6px' : '12px'

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 1.4
      },
    },
  }

  const item: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      filter: `blur(${blurVal})`,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      scale: 1,
      transition: { 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  }

  return (
    <motion.h1
      className={`font-display font-bold leading-[1.1] tracking-tight ${className}`}
      style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
      variants={container}
      initial="hidden"
      animate={revealed ? "show" : "hidden"}
    >
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap mr-[0.3em] last:mr-0">
          {word.split('').map((char, j) => (
            <motion.span key={j} variants={item} className="inline-block">
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  )
}

export default function Home(): JSX.Element {
  const [revealed, setRevealed] = useState(false)
  const marqueeDoubled = [...MARQUEE_EVENTS, ...MARQUEE_EVENTS]

  useEffect(() => {
    // If skipping the loader, trigger reveal animation after a tiny delay to ensure fade-in is visible
    if ((window as any).siteRevealedOnce || window.location.pathname !== '/') {
      const timer = setTimeout(() => setRevealed(true), 200)
      return () => clearTimeout(timer)
    }

    const onReveal = () => {
      // Buffer for curtain slide up (matching the 0.8s PageLoader exit)
      // Starts at 400ms total (200ms from App.tsx + 200ms here)
      setTimeout(() => setRevealed(true), 200)
    }
    window.addEventListener('site-revealed', onReveal)
    return () => window.removeEventListener('site-revealed', onReveal)
  }, [])

  useEffect(() => {
    // Hero Parallax Scrub (Keep this)
    gsap.to('.hero-content', {
      y: 150,
      scale: 0.95,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Redundant GSAP entrances removed; now handled by RevealSection
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, []);

  return (
    <div className={`relative w-full ${revealed ? 'reveal-visible' : 'reveal-hidden'}`}>
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════ */}
      <section className="hero-section relative w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
        
        {/* Subtle Grid pattern for tech feel (restoring from original) */}
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{
          backgroundImage: `
            linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }} />

        {/* Abstract Background Layer */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <CosmosHero />
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center gpu-accel">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="badge-glow inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm text-primary text-[10px] font-label tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Empowering Next-Gen Innovators
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-white text-5xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight relative"
          >
            Explore the cosmos <br /> of <span className="text-gradient-premium">Technologies</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-text-muted text-lg md:text-xl font-body leading-relaxed mb-12 px-4"
          >
            A community-driven tech hub at <span className="text-primary font-bold">JIMS Greater Noida</span> dedicated to building, learning, and leading the future of technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
          >
            <MagneticButton>
              <Link to="/events" className="w-full sm:w-auto">
                <button className="btn-primary w-full sm:w-auto min-w-[180px] p-4 text-sm font-bold tracking-wider">
                  Explore Events
                </button>
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/about" className="w-full sm:w-auto">
                <button className="btn-ghost w-full sm:w-auto min-w-[180px] p-4 text-sm font-bold tracking-wider">
                  Our Story
                </button>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 0.5 } : { opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-label text-white/50">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </section>



      {/* ════════════════════════════════════════════════════════
          WHAT WE BUILD (FEATURES)
          ════════════════════════════════════════════════════ */}
      <section className="features-section section px-6 relative">
        <div className="max-w-7xl mx-auto">
          <RevealSection revealed={revealed} className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6" delay={0.2}>
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-display font-bold leading-tight">
                What We <span className="text-gradient">Build</span>
              </h2>
              <p className="text-text-muted mt-4 font-body text-base md:text-lg">
                Hashtag pulses with ideas, energy, and moments that unite learners. 
                We don't just learn tech—we build it.
              </p>
            </div>
            <Link to="/about" className="group flex items-center gap-3 text-primary text-xs font-label tracking-widest uppercase mb-2">
              <span className="leading-none">Learn more</span> <ArrowRight size={14} className="flex-shrink-0" />
            </Link>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, idx) => (
              <RevealSection revealed={revealed} key={f.title} delay={0.4 + idx * 0.12} className="feature-card-wrapper h-full">
                <div style={{ transformStyle: 'preserve-3d', height: '100%' }}>
                  <InteractiveCard3D accentColor={f.accent} className="h-full">
                    <div className="p-10 flex flex-col gap-6 h-full relative">
                    {/* Badge — absolutely positioned top-left */}
                    <div className="absolute top-6 left-10">
                      <span
                        className="text-[9px] font-label tracking-widest px-2 py-1 border rounded bg-white/5 backdrop-blur-sm"
                        style={{ color: `${f.accent}cc`, borderColor: `${f.accent}33` }}
                      >
                        {f.tag}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                      {/* Icon + Title */}
                      <div className="flex items-center gap-3">
                        <span
                          className="text-4xl font-mono-custom flex-shrink-0"
                          style={{ color: f.accent, textShadow: `0 0 20px ${f.accent}44` }}
                        >
                          {f.icon}
                        </span>
                        <h3
                          className="text-2xl font-display font-bold m-0 leading-tight"
                          style={{ color: f.accent }}
                        >
                          {f.title}
                        </h3>
                      </div>
                      {/* Description */}
                      <p className="text-text-muted leading-relaxed text-[13px] font-body opacity-80">
                        {f.desc}
                      </p>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className="h-px mt-auto transition-all duration-500 group-hover:w-full"
                      style={{ width: '3rem', background: `linear-gradient(90deg, ${f.accent}, transparent)` }}
                    />
                  </div>
                </InteractiveCard3D>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SCROLLING MARQUEE
          ════════════════════════════════════════════════════ */}
      <RevealSection revealed={revealed} className="py-8 overflow-hidden" delay={0.2}>
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(96,165,250,0.15), transparent)' }} />
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
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(129,140,248,0.15), transparent)' }} />
      </RevealSection>

      {/* ════════════════════════════════════════════════════════
          STATS
          ════════════════════════════════════════════════════ */}
      <section className="stats-section section px-6">
        <div className="max-w-7xl mx-auto">
          <RevealSection revealed={revealed} className="mb-16 text-center" delay={0.2}>
            <h2 className="text-4xl md:text-6xl font-display font-bold">
              By the <span className="text-gradient">Numbers</span>
            </h2>
            <p className="text-text-muted mt-4 max-w-lg mx-auto font-body text-base">
              A community that grows, builds, and makes things happen every semester.
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-outline-var/30 overflow-hidden rounded-2xl">
            {STATS.map((stat, idx) => (
              <RevealSection revealed={revealed}
                key={stat.label}
                delay={0.3 + idx * 0.12}
                className="stat-block p-10 md:p-12 surface-card border-b md:border-b-0 border-outline-var/30 md:border-r last:border-r-0 last:border-b-0 hover:bg-white/[0.01] transition-colors duration-500"
              >
                <StatCounter stat={stat} />
              </RevealSection>
            ))}
          </div>

          <RevealSection revealed={revealed}
            className="mt-20 flex flex-col md:flex-row items-center gap-6 justify-center"
            delay={0.5}
          >
            <p className="text-text-muted text-lg font-body max-w-md text-center md:text-left">
              Whether you code, design, or just love being around people who build —
              there's a place for you.
            </p>
            <MagneticButton>
              <Link to="/about" className="btn-primary flex-shrink-0 flex items-center gap-[8px] justify-center p-4">
                <span className="leading-none">Our Story</span> <ArrowRight size={15} className="flex-shrink-0" />
              </Link>
            </MagneticButton>
          </RevealSection>
        </div>
      </section>

      {/* HYDRATION FIX: Wrap in Suspense to handle lazy loading and prevent layout shift */}
      <RevealSection revealed={revealed} delay={0.2}>
        <Suspense fallback={<HorizontalScrollSkeleton />}>
          <HorizontalGallery 
            label="Event Moments"
            images={[
              { src: '/images/Events/photos/img1.png', alt: 'Event Moment 1' },
              { src: '/images/Events/photos/img2.png', alt: 'Event Moment 2' },
              { src: '/images/Events/photos/img3.png', alt: 'Event Moment 3' },
              { src: '/images/Events/photos/img4.png', alt: 'Event Moment 4' },
              { src: '/images/Events/photos/img5.png', alt: 'Event Moment 5' },
              { src: '/images/Events/photos/img6.png', alt: 'Event Moment 6' },
              { src: '/images/Events/photos/img7.png', alt: 'Event Moment 7' },
            ]}
          />
        </Suspense>
      </RevealSection>

    </div>
  )
}


