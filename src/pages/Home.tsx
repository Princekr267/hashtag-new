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

// HYDRATION FIX: Convert to dynamic import with SSR disabled (lazy loading in Vite)
const HorizontalGallery = lazy(() => import('../components/ui/HorizontalGallery'))
import { STATS, MARQUEE_EVENTS } from '../constants/data'

gsap.registerPlugin(ScrollTrigger)

// ── What We Do ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: '</',
    title: 'Development',
    desc: 'HashTag aims to nurture knowledge, opportunities, experience and collaborations within students.',
    accent: '#60a5fa',
    tag: 'TECHNICAL',
  },
  {
    icon: '◈',
    title: 'Design',
    desc: 'With a vision rooted in enriching the student coding culture, Hashtag pulses with ideas, energy and moments that unite learners.',
    accent: '#818cf8',
    tag: 'CREATIVE',
  },
  {
    icon: '⚡',
    title: 'Innovation',
    desc: 'The society welcomes participants from all technical domains eager to build, learn and grow.',
    accent: '#38bdf8',
    tag: 'IMPACT',
  },
]

const SPONSORS = [
  { name: "Microsoft Azure", image: "/Photos/Sponsors/Microsoft Azure.png" },
  { name: "AZD", image: "/Photos/Sponsors/AZD.png" },
  { name: "Reskilll", image: "/Photos/Sponsors/Reskill.png" },
  { name: "Softmart", image: "/Photos/Sponsors/Softmart solutions_title sponser 1.png" },
  { name: "Physics Wallah", image: "/Photos/Sponsors/Physics wallah.png" },
  { name: "Finlatics", image: "/Photos/Sponsors/Finlatics.png" },
  { name: "Click a Diet", image: "/Photos/Sponsors/clickadiet.png" },
  { name: "Genesis", image: "/Photos/Sponsors/genesis.png" },
  { name: "Interview Buddy", image: "/Photos/Sponsors/interview buddy.png" },
  { name: "LinkedOut", image: "/Photos/Sponsors/LinkedOut_Bg_removed.png" },
  { name: "Julep AI", image: "/Photos/Sponsors/julep.png" },
  { name: "Events Info", image: "/Photos/Sponsors/Events Info.png" },
  { name: "Give My Certificates", image: "/Photos/Sponsors/Givemycert.png" },
  { name: "Advertising Point Line", image: "/Photos/Sponsors/adv point line.png" },
  { name: "Meraj's Creatives", image: "/Photos/Sponsors/meraj's creatives.png" },
  { name: "Navras Jemtec", image: "/Photos/Sponsors/NAVRAS LOGO (Original).png" },
  { name: ".xyz Domain Registry", image: "/Photos/Sponsors/.xyz.png" }
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
      className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[100px] font-display font-bold leading-[1.0] tracking-tight text-white max-w-5xl text-center mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <span className="block" style={{ minHeight: '1.1em' }}>
        {line1.split(' ').map((word, i) => (
          <motion.span key={i} variants={item} className="inline-block mr-[0.25em] last:mr-0">
            {word}
          </motion.span>
        ))}
      </span>
      <span className="block" style={{ minHeight: '1.1em' }}>
        {line2.split(' ').map((word, i) => {
          const isLast = i === line2.split(' ').length - 1;
          return (
            <motion.span
              key={i}
              variants={item}
              className={`inline-block mr-[0.25em] last:mr-0 ${isLast ? 'text-gradient-gold' : ''}`}
            >
              {word}
            </motion.span>
          );
        })}
      </span>
    </motion.h1>
  )
}



export default function Home(): JSX.Element {
  const marqueeDoubled = [...MARQUEE_EVENTS, ...MARQUEE_EVENTS]

  useEffect(() => {
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

    gsap.fromTo('.feature-card-wrapper',
      { opacity: 0, y: 60, scale: 0.9, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 80%',
        }
      }
    );

    gsap.fromTo('.stat-block',
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'back.out(1.5)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 85%',
        }
      }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      gsap.fromTo(el,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 0, y: 50 },
        {
          clipPath: 'polygon(-5% -5%, 105% -5%, 105% 105%, -5% 105%)',
          opacity: 1, y: 0, duration: 1.4, ease: 'power4.out',
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
      <section className="hero-section min-h-screen flex px-6 pt-24 pb-12 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>

        {/* Subtle Grid pattern for tech feel */}
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{
          backgroundImage: `
            linear-gradient(rgba(96,165,250,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96,165,250,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }} />

        {/* Lightweight Cosmos Hero background instead of Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-70">
          <CosmosHero />
        </div>

        {/* Gradient overlay to ensure text readability */}
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, var(--bg-base) 80%)'
          }} 
        />

        <div className="hero-content max-w-7xl mx-auto w-full flex flex-col items-center text-center relative z-10 flex-1">

          {/* Eyebrow — pinned near the top of the hero, right below navbar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
            style={{ animationFillMode: 'both' }}
            className="pt-2"
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

          {/* Centered hero content block */}
          <div className="flex flex-col items-center gap-6 max-w-5xl relative z-10 my-auto">
            {/* Main headline with modern blur reveal */}
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
              className="mt-6 flex flex-col sm:flex-row items-center gap-6"
              initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
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

          {/* Spacer to balance the mb-auto above and keep content centered */}
          <div className="mb-auto" />
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
      <section className="features-section section px-6" style={{ perspective: '1000px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex items-end justify-between">
            <h2 data-reveal className="text-4xl md:text-6xl font-display font-bold">
              What We <span className="text-gradient">Build</span>
            </h2>
            <Link to="/about" className="hidden md:flex items-center gap-[8px] text-text-muted hover:text-primary transition-colors text-sm font-label tracking-wider">
              <span className="leading-none">Learn more</span> <ArrowRight size={14} className="flex-shrink-0" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {FEATURES.map((f, idx) => (
              <div key={f.title} className="feature-card-wrapper h-full" style={{ transformStyle: 'preserve-3d' }}>
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
            ))}
          </div>
        </div>
      </section>




     

      {/* ════════════════════════════════════════════════════════
          SCROLLING MARQUEE
          ════════════════════════════════════════════════════ */}
      <div className="py-8 overflow-hidden">
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
      </div>

      {/* ════════════════════════════════════════════════════════
          STATS
          ════════════════════════════════════════════════════ */}
      <section className="stats-section section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 data-reveal className="text-4xl md:text-6xl font-display font-bold">
              By the <span className="text-gradient">Numbers</span>
            </h2>
            <p data-reveal className="text-text-muted mt-4 max-w-lg mx-auto font-body text-base">
              A community that grows, builds, and makes things happen every semester.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 border border-outline-var/30 overflow-hidden rounded-2xl">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="stat-block p-10 md:p-12 surface-card border-b border-r border-outline-var/30 hover:bg-white/[0.01] transition-colors duration-500"
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

      {/* HYDRATION FIX: Wrap in Suspense to handle lazy loading and prevent layout shift */}
      <Suspense fallback={<HorizontalScrollSkeleton />}>
        <HorizontalGallery 
          label="Event Moments"
          images={[
            { src: '/images/Event/img1.png', alt: 'Event Moment 1' },
            { src: '/images/Event/img2.png', alt: 'Event Moment 2' },
            { src: '/images/Event/img3.png', alt: 'Event Moment 3' },
            { src: '/images/Event/img4.png', alt: 'Event Moment 4' },
            { src: '/images/Event/img5.png', alt: 'Event Moment 5' },
            { src: '/images/Event/img6.png', alt: 'Event Moment 6' },
            { src: '/images/Event/img7.png', alt: 'Event Moment 7' },
          ]}
        />
      </Suspense>

    </div>
  )
}


