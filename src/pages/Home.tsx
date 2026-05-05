import React, { useEffect, useRef, Suspense, lazy } from 'react' // HYDRATION FIX
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

    gsap.utils.toArray('.artifact-card').forEach((el: any) => {
      gsap.to(el, {
        y: -60, // Same speed for both — keeps them aligned
        ease: 'none',
        scrollTrigger: {
          trigger: '.artifacts-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
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
      <section className="hero-section min-h-screen flex items-center px-6 pt-24 pb-12 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>

        {/* Removed AmbientOrbs to fix heavy lag */}
        
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

        <div className="hero-content max-w-7xl mx-auto w-full flex flex-col items-center text-center relative z-10">


          <div className="flex flex-col items-center gap-6 max-w-5xl relative z-10">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((f, idx) => (
              <div key={f.title} className="feature-card-wrapper h-full" style={{ transformStyle: 'preserve-3d' }}>
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
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          ARTIFACTS SECTION
          ════════════════════════════════════════════════════ */}
      <section className="artifacts-section section px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <h2 data-reveal className="text-4xl md:text-5xl font-display font-bold mb-4">
                Live <span className="text-gradient">Artifacts</span>
              </h2>
              <p className="text-text-muted font-body max-w-xl" data-reveal>
                Open-source projects and internal tools built by the Hashtag community. 
                We don't just learn tech, we ship it to production.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 items-stretch">
            {/* Artifact 1 */}
            <div className="artifact-card group h-full">
              <div className="surface-card p-6 md:p-8 h-full flex flex-col bg-[#030b1a]/40 border border-primary/20 hover:border-primary/50 transition-colors rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                    <span className="text-xs font-mono-custom tracking-widest text-primary leading-none">STATUS.ONLINE</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">HashDash Finance</h3>
                  <p className="text-text-muted mb-6 text-sm flex-grow">
                    A full-stack React and Node.js finance dashboard with role-based access control and live data streaming.
                  </p>
                  <div className="flex flex-wrap gap-2 font-mono-custom text-[10px] text-primary/50 uppercase mt-auto">
                    <span className="px-2 py-1 bg-primary/10 rounded border border-primary/20">React</span>
                    <span className="px-2 py-1 bg-primary/10 rounded border border-primary/20">Node.js</span>
                    <span className="px-2 py-1 bg-primary/10 rounded border border-primary/20">MongoDB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Artifact 2 */}
            <div className="artifact-card group h-full">
              <div className="surface-card p-6 md:p-8 h-full flex flex-col bg-[#030b1a]/40 border border-secondary/20 hover:border-secondary/50 transition-colors rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-secondary/10 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-secondary opacity-50 flex-shrink-0" />
                    <span className="text-xs font-mono-custom tracking-widest text-secondary leading-none">V2.BETA</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-2">CodeTrek Platform</h3>
                  <p className="text-text-muted mb-6 text-sm flex-grow">
                    An automated judging platform built for our relay coding hackathons, capable of evaluating 100+ submissions per minute.
                  </p>
                  <div className="flex flex-wrap gap-2 font-mono-custom text-[10px] text-secondary/50 uppercase mt-auto">
                    <span className="px-2 py-1 bg-secondary/10 rounded border border-secondary/20">Python</span>
                    <span className="px-2 py-1 bg-secondary/10 rounded border border-secondary/20">Docker</span>
                    <span className="px-2 py-1 bg-secondary/10 rounded border border-secondary/20">Redis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
    HASHTAG SOCIETY
═══════════════════════════════════════════════════════ */}
<section className="section px-6">
  <div className="max-w-6xl mx-auto">
    <div className="surface-card p-8 md:p-14 rounded-3xl border border-primary/20">
      <h2
        data-reveal
        className="text-4xl md:text-6xl font-display font-bold mb-8"
      >
        The <span className="text-gradient">HASHTAG Society</span>
      </h2>

      <p
        data-reveal
        className="text-text-muted text-lg leading-relaxed font-body"
      >
        Founded in the year 2019, HashTag aims to nurture knowledge,
        opportunities, experience and collaborations within students.
        With a vision rooted in enriching the student coding culture,
        Hashtag pulses with ideas, energy and moments that unite learners.

        <br /><br />

        Hashtag is not just a technical society, it's a platform that welcomes
        students across all levels of experience, fostering a culture of peer
        learning and inclusive growth. The society welcomes participants from
        all technical domains eager to build, learn and grow.

        <br /><br />

        The society has been actively organizing events, hackathons, and tech
        competitions felicitating its participants and the winners for their
        efforts and creativity.

        <br /><br />

        With every passing year, Hashtag continues to grow — inspiring
        creativity, building a community and shaping the future of student
        innovation.
      </p>
    </div>
  </div>
</section>

{/* ════════════════════════════════════════════════════════
    OUR RELATIONS WITH JIMS
═══════════════════════════════════════════════════════ */}
<section className="section px-6">
  <div className="max-w-6xl mx-auto">
    <div className="surface-card p-8 md:p-14 rounded-3xl border border-secondary/20">
      <h2
        data-reveal
        className="text-4xl md:text-6xl font-display font-bold mb-8"
      >
        Our Relations with <span className="text-gradient">JIMS</span>
      </h2>

      <p
        data-reveal
        className="text-text-muted text-lg leading-relaxed font-body"
      >
        HASHTAG is the tech pulse of JIMS Greater Noida — not just a club, but
        a movement built into the core of the campus.

        <br /><br />

        Born in classrooms and raised in computer labs, HASHTAG was founded
        with the vision to turn ideas into innovation.

        <br /><br />

        With full support from JIMS — mentorship, resources, and the freedom
        to create — we’ve grown into a student-powered force of creativity and
        code.

        <br /><br />

        Every workshop, every hackathon, every project we lead is a reflection
        of JIMS’ trust in its students and belief in experiential learning.

        <br /><br />

        Together, we don’t just participate in tech — we shape it. JIMS
        provides the launchpad, HASHTAG brings the momentum.

        <br /><br />

        It’s a collaboration where passion meets purpose, and a campus becomes
        a community of creators. This is more than partnership — it’s a shared
        mission to lead the future of tech.
      </p>
    </div>
  </div>
</section>

{/* ════════════════════════════════════════════════════════
    OUR SPONSORS
═══════════════════════════════════════════════════════ */}
<section className="section px-6">
  <div className="max-w-7xl mx-auto">
    <div className="mb-16 text-center">
      <h2
        data-reveal
        className="text-4xl md:text-6xl font-display font-bold"
      >
        Our <span className="text-gradient">Sponsors</span>
      </h2>

      <p
        data-reveal
        className="text-text-muted mt-4 max-w-2xl mx-auto font-body text-base"
      >
        The organizations and communities that supported Hashtag in building
        opportunities for students and fostering innovation.
      </p>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {SPONSORS.map((sponsor) => (
        <div
          key={sponsor.name}
          className="surface-card p-6 rounded-2xl border border-outline-var/30 flex items-center justify-center hover:border-primary/40 transition-all duration-300"
        >
          <img
            src={sponsor.image}
            alt={sponsor.name}
            className="max-h-20 w-auto object-contain mx-auto"
          />
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
