import { useEffect, useRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FlipCard from '../components/ui/FlipCard'
import { MILESTONES, ABOUT_CONTENT, JIMS_RELATION } from '../constants/data'

gsap.registerPlugin(ScrollTrigger)

const PRESET_OFFSETS = ['-30px', '35px', '-25px', '40px', '-35px']

const VALUES = [
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
    stat: '20+ members leading',
    quote: 'Every builder started as a beginner.',
  },
]

const SPONSORS = [
  { name: "Microsoft Azure", image: "/images/Sponsors/Microsoft Azure.png" },
  { name: "AZD", image: "/images/Sponsors/AZD.png" },
  { name: "Reskilll", image: "/images/Sponsors/Reskill.png" },
  { name: "Softmart", image: "/images/Sponsors/Softmart solutions_title sponser 1.png" },
  { name: "Physics Wallah", image: "/images/Sponsors/Physics wallah.png" },
  { name: "Finlatics", image: "/images/Sponsors/Finlatics.png" },
  { name: "Click a Diet", image: "/images/Sponsors/clickadiet.png" },
  { name: "Genesis", image: "/images/Sponsors/genesis.png" },
  { name: "Interview Buddy", image: "/images/Sponsors/interview buddy.png" },
  { name: "LinkedOut", image: "/images/Sponsors/LinkedOut_Bg_removed.png" },
  { name: "Julep AI", image: "/images/Sponsors/julep.png" },
  { name: "Events Info", image: "/images/Sponsors/Events Info.png" },
  { name: "Give My Certificates", image: "/images/Sponsors/Givemycert.png" },
  { name: "Advertising Point Line", image: "/images/Sponsors/adv point line.png" },
  { name: "Meraj's Creatives", image: "/images/Sponsors/meraj's creatives.png" },
  { name: "Navras Jemtec", image: "/images/Sponsors/NAVRAS LOGO (Original).png" },
  { name: ".xyz Domain Registry", image: "/images/Sponsors/.xyz.png" }
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
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  const createRipple = (clientX: number, clientY: number) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const id = Date.now()
    
    setRipples(prev => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples(prev => prev.filter((r: { id: number }) => r.id !== id))
    }, 800)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glowRef.current || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    gsap.to(glowRef.current, {
      opacity: 1,
      background: `radial-gradient(400px circle at ${x}px ${y}px, ${accentColor}25, transparent 80%)`,
      duration: 0.4
    })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!glowRef.current || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    
    gsap.to(glowRef.current, {
      opacity: 1,
      background: `radial-gradient(350px circle at ${x}px ${y}px, ${accentColor}30, transparent 80%)`,
      duration: 0.2
    })
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
    if (!glowRef.current) return
    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.6
    })
  }

  const handlePressStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsPressed(true)
    if ('touches' in e) {
      createRipple(e.touches[0].clientX, e.touches[0].clientY)
    } else {
      createRipple(e.clientX, e.clientY)
    }
  }

  const handlePressEnd = () => {
    setIsPressed(false)
  }

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden h-full group touch-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handlePressStart}
      onTouchStart={handlePressStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handlePressEnd}
      onMouseUp={handlePressEnd}
      style={{
        background: `linear-gradient(135deg, rgba(10,14,24,0.98) 0%, ${accentColor}15 50%, rgba(6,10,20,0.98) 100%)`,
        border: `1px solid ${accentColor}${isPressed ? '70' : '40'}`,
        borderRadius: '24px',
        padding: 'clamp(20px, 4vw, 32px)',
        minHeight: '260px',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
        boxShadow: isPressed 
          ? `0 15px 30px rgba(0,0,0,0.5), 0 0 30px ${accentColor}30` 
          : `0 8px 24px rgba(0,0,0,0.3), inset 0 0 20px ${accentColor}10`,
        cursor: 'pointer',
      }}
    >
      {/* ── Background Colorful Glow ── */}
      <div className="absolute top-0 right-0 w-48 h-48 blur-[100px] opacity-30 pointer-events-none"
           style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }} />
      
      <div className="absolute bottom-0 left-0 w-48 h-48 blur-[100px] opacity-20 pointer-events-none"
           style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)` }} />

      {/* ── Ripple Layer ── */}
      {ripples.map((r: { id: number; x: number; y: number }) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none animate-ripple"
          style={{
            left: r.x,
            top: r.y,
            width: '2px',
            height: '2px',
            background: `${accentColor}40`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      <div 
        ref={glowRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500"
        style={{ mixBlendMode: 'plus-lighter' }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar with Icon and Type - Reduced bottom margin to fix gap */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
               style={{ 
                 background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`, 
                 color: accentColor, 
                 border: `1px solid ${accentColor}40`, 
                 boxShadow: `0 0 15px ${accentColor}20` 
               }}>
            {icon}
          </div>
          <span className="px-3 py-1 rounded-full text-[9px] font-label font-bold tracking-[0.2em] uppercase"
                style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}>
            {type === 'MISSION' ? 'Mission' : 'Vision'}
          </span>
        </div>

        {/* Heading Area - Reduced min-height and margin to fix gap */}
        <div className="min-h-[60px] md:min-h-[80px] flex flex-col justify-end mb-4">
          <h2 
            className="text-2xl md:text-3xl font-display font-black leading-[1.2] transition-all duration-500 group-hover:tracking-tight"
            style={{ 
              background: `linear-gradient(to bottom right, #fff 40%, ${accentColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 10px ${accentColor}15)`
            }}
          >
            {heading}
          </h2>
          
          <div 
            className="h-1 w-10 mt-3 rounded-full transition-all duration-500 group-hover:w-20"
            style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
          />
        </div>

        {/* Body Text */}
        <p className="text-text-muted text-sm md:text-base leading-relaxed opacity-70 font-body flex-grow">
          {body}
        </p>
      </div>
    </div>
  )
}



function AboutValuesSection() {
  const containerRef = useRef<HTMLElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !containerRef.current || !spotlightRef.current) return

    const container = containerRef.current
    const spotlight = spotlightRef.current

    gsap.set(spotlight, { 
      opacity: 0, 
      background: 'radial-gradient(600px circle at center, rgba(96, 165, 250, 0.15), transparent 80%)' 
    })

    const ctx = gsap.context(() => {
      gsap.to(spotlight, {
        opacity: 1,
        scrollTrigger: {
          trigger: container,
          start: 'top 60%',
          end: 'bottom 40%',
          toggleActions: 'play reverse play reverse'
        }
      })

      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        gsap.to(spotlight, {
          background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(96, 165, 250, 0.15) 0%, rgba(129, 140, 248, 0.05) 30%, transparent 70%)`,
          duration: 0.8,
          ease: 'power2.out'
        })
      }

      const handleMouseLeave = () => {
        gsap.to(spotlight, {
          background: `radial-gradient(800px circle at 50% 50%, rgba(96, 165, 250, 0.1) 0%, transparent 70%)`,
          duration: 1.5,
          ease: 'power2.inOut'
        })
      }

      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseleave', handleMouseLeave)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={containerRef}
      className="section px-6 relative overflow-hidden bg-[#020617] border-y border-white/[0.02]"
    >
      <div 
        ref={spotlightRef}
        className="absolute inset-0 pointer-events-none z-20 will-change-[background,opacity]"
        style={{ mixBlendMode: 'plus-lighter' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold"
          >
            Our <span className="text-gradient-violet">Values</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-text-muted mt-6 max-w-2xl mx-auto font-body text-base leading-relaxed"
          >
            The core principles that drive our technical ambition and community culture.
            Each value represents a pillar of our collective mission.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {VALUES.map((v, idx) => (
            <motion.div 
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <FlipCard
                className="h-[290px] sm:h-[260px]"
                front={
                  <div
                    className="w-full h-full relative overflow-hidden flex flex-col gap-4 sm:gap-5 p-6 sm:p-8 rounded-[24px] border border-white/[0.05] bg-[#0A0F1A]/80 backdrop-blur-md hover:border-primary/30 transition-all duration-500 group"
                  >
                    {/* Background glow orb */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-20 pointer-events-none"
                         style={{ background: v.accent }} />
                    
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-500 group-hover:scale-110"
                      style={{ 
                        background: `${v.accent}15`, 
                        color: v.accent,
                        border: `1px solid ${v.accent}30`,
                        boxShadow: `0 0 20px ${v.accent}15`
                      }}
                    >
                      {v.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-bold mb-2" style={{ color: v.accent }}>{v.title}</h3>
                      <p className="text-text-muted text-[13px] font-body leading-relaxed opacity-80">{v.desc}</p>
                    </div>
                  </div>
                }
                back={
                  <div
                    className="w-full h-full rounded-[24px] flex flex-col items-center justify-center p-6 sm:p-8 text-center gap-4 sm:gap-5"
                    style={{
                      background: `linear-gradient(145deg, #0A0F1A 0%, #050810 100%)`,
                      border: `1px solid ${v.accent}30`,
                      boxShadow: `0 15px 40px rgba(0,0,0,0.5), inset 0 0 25px ${v.accent}10`
                    }}
                  >
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="text-[9px] font-label tracking-[0.2em] text-primary-dim uppercase">Impact</span>
                    </div>
                    <span className="text-4xl font-display font-black tracking-tighter" style={{ color: v.accent }}>{v.stat}</span>
                    <p className="text-text-muted text-[12px] font-body italic leading-relaxed">"{v.quote}"</p>
                  </div>
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function About(): JSX.Element {
  const timelineWrap   = useRef<HTMLDivElement>(null)
  const progressLine   = useRef<SVGPathElement>(null)
  const nodeRefs       = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs       = useRef<(HTMLDivElement | null)[]>([])

  // Change 4: Scroll-driven timeline progress via rAF-throttled scroll listener
  // Change 4: Scroll-driven timeline progress via rAF-throttled scroll listener
  const updateTimeline = useCallback(() => {
    const wrap = timelineWrap.current
    const line = progressLine.current as SVGPathElement | null
    if (!wrap || !line) return

    const wrapRect = wrap.getBoundingClientRect()
    const winH = window.innerHeight

    const firstDot = nodeRefs.current[0]
    const lastDot = nodeRefs.current[nodeRefs.current.length - 1]
    if (!firstDot || !lastDot) return

    const firstRect = firstDot.getBoundingClientRect()
    const lastRect = lastDot.getBoundingClientRect()

    const topOffset = (firstRect.top + firstRect.height / 2) - wrapRect.top
    const bottomOffset = wrapRect.bottom - (lastRect.top + lastRect.height / 2)
    const totalHeight = wrapRect.height - topOffset - bottomOffset

    // Document-relative positions of the first and last dots
    const currentScroll = window.scrollY
    const firstDotDocTop = currentScroll + firstRect.top
    const lastDotDocTop = currentScroll + lastRect.top

    // Timeline starts growing when first dot is at 80% of viewport height
    const startScroll = firstDotDocTop - winH * 0.8
    // Timeline is fully grown when last dot is at 55% of viewport height
    const endScroll = lastDotDocTop - winH * 0.55

    let progress = 0
    if (endScroll > startScroll) {
      progress = (currentScroll - startScroll) / (endScroll - startScroll)
    }
    
    // Check if we are at the bottom of the page (safety fallback)
    const maxScroll = document.documentElement.scrollHeight - winH
    if (currentScroll >= maxScroll - 15) {
      progress = 1
    } else {
      progress = Math.min(1, Math.max(0, progress))
    }

    // Grow line height according to progress
    const lengthStr = wrap.getAttribute('data-path-length')
    if (lengthStr) {
      const length = parseFloat(lengthStr)
      line.style.strokeDashoffset = `${length * (1 - progress)}`
    }

    // Glow each node when line reaches its position
    nodeRefs.current.forEach((node, i) => {
      if (!node) return
      const nodeRect = node.getBoundingClientRect()
      
      // Calculate dot's center offset relative to the container
      const dotCenterOffset = (nodeRect.top + nodeRect.height / 2) - wrapRect.top
      
      // The relative position of the dot along the active line path (0 to 1)
      const dotRelativePosition = totalHeight > 0 ? (dotCenterOffset - topOffset) / totalHeight : 0

      // The dot is active if the progress of the line has reached it
      const active = progress >= dotRelativePosition

      if (active) {
        node.style.background = 'var(--primary, #60a5fa)'
        node.style.boxShadow  = '0 0 0 4px rgba(96,165,250,0.3)'
        node.style.transform  = 'scale(1.15)'
        // animate card in
        const card = cardRefs.current[i]
        if (card && card.style.opacity === '0') {
          card.style.transition = 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)'
          card.style.opacity    = '1'
          card.style.transform  = 'none'
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

    const updateLinePosition = () => {
      const wrap = timelineWrap.current
      const line = progressLine.current as SVGPathElement | null
      const track = document.getElementById('timeline-track-path') as SVGPathElement | null
      const dots = nodeRefs.current.filter((dot): dot is HTMLDivElement => dot !== null)

      if (!wrap || !line || !track || dots.length < 2) return

      const wrapRect = wrap.getBoundingClientRect()
      
      // Calculate coordinates of the center of each dot relative to wrap
      const points = dots.map(dot => {
        const rect = dot.getBoundingClientRect()
        return {
          x: (rect.left + rect.width / 2) - wrapRect.left,
          y: (rect.top + rect.height / 2) - wrapRect.top
        }
      })

      // Generate smooth cubic Bezier curve path string
      let d = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1]
        const p1 = points[i]
        const cpY1 = p0.y + (p1.y - p0.y) / 2
        const cpY2 = p0.y + (p1.y - p0.y) / 2
        d += ` C ${p0.x} ${cpY1}, ${p1.x} ${cpY2}, ${p1.x} ${p1.y}`
      }

      // Apply path string to both track and progress lines
      track.setAttribute('d', d)
      line.setAttribute('d', d)

      // Measure total path length
      const length = line.getTotalLength()
      line.style.strokeDasharray = `${length}`
      
      // Cache the length for updateTimeline
      wrap.setAttribute('data-path-length', `${length}`)
      
      // Trigger timeline update immediately to set the correct progress
      updateTimeline()
    }

    // Measure initially and on resize
    const timer = setTimeout(updateLinePosition, 100)
    window.addEventListener('resize', updateLinePosition)

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
        c.style.transform = 'none'
      })
      if (progressLine.current) progressLine.current.style.transform = 'scaleY(1)'
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', updateLinePosition)
      }
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
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateLinePosition)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [updateTimeline])

  return (
    <div className="relative z-10 pt-20">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto">
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
              Founded in 2019 at JIMS Greater Noida, Hashtag Official is where technical ambition
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

      {/* ── ABOUT HASHTAG ───────────────────────────────── */}
<section className="section px-6 relative overflow-hidden">
  {/* Decorative Background Element */}
  <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full" />
  </div>

  <div className="max-w-6xl mx-auto">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-10 tracking-tight">
        The <span className="text-gradient">HASHTAG Society</span>
      </h2>

      <div className="relative">
        <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent hidden md:block" />
        <p className="text-text-muted leading-relaxed text-lg md:text-xl font-body whitespace-pre-line opacity-90">
          {ABOUT_CONTENT}
        </p>
      </div>
    </motion.div>
  </div>
</section>

{/* ── RELATION WITH JIMS ───────────────────────────── */}
<section className="section px-6 bg-white/[0.01] border-y border-white/[0.02]">
  <div className="max-w-6xl mx-auto">
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tight">
        Our Relation with <span className="text-gradient-violet">JIMS</span>
      </h2>

      <p className="text-text-muted leading-relaxed text-lg md:text-xl font-body whitespace-pre-line opacity-90">
        {JIMS_RELATION}
      </p>
    </motion.div>
  </div>
</section>

{/* ── SPONSORS ─────────────────────────────────────── */}
<section className="section px-6">
  <div className="max-w-7xl mx-auto">
    <div className="mb-20 text-center">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl md:text-6xl font-display font-bold"
      >
        Our <span className="text-gradient">Sponsors</span>
      </motion.h2>
      <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full opacity-50" />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {SPONSORS.map((sponsor, idx) => (
        <motion.div
          key={sponsor.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ y: -8, scale: 1.05, filter: 'brightness(1.15)' }}
          whileTap={{ scale: 0.95, filter: 'brightness(1.3)' }}
          className="group relative cursor-pointer"
        >
          {/* Outer Glow Effect */}
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 blur-[30px] transition-opacity duration-500 rounded-2xl" />
          
          <div
            className="relative h-32 md:h-40 p-6 rounded-3xl border border-white/[0.05] bg-[#0A0F1A] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:bg-white/[0.05] shadow-2xl"
          >
            {/* White center gradient for logo visibility — Increased intensity */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_70%)] opacity-100 transition-opacity duration-500 group-hover:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_70%)]" />
            
            {/* Subtle Surface overlay to lift black logos */}
            <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
            
            {/* Dynamic Glass Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.05] pointer-events-none" />
            
            <img
              src={sponsor.image}
              alt={sponsor.name}
              className="max-h-16 md:max-h-20 w-auto object-contain transition-all duration-700 group-hover:scale-110 group-hover:brightness-125 relative z-10"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5)) contrast(1.1)' }}
            />
            
            {/* Floating Label */}
            <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-20">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[9px] font-label text-white/50 tracking-[0.2em] uppercase font-bold">
                {sponsor.name}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* ── VALUES — FLIP CARDS ──────────────────────────────── */}
      <AboutValuesSection />

      {/* ── TIMELINE — Change 4: Scroll-driven progress line ─────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 data-reveal className="text-4xl md:text-5xl font-display font-bold">
              Our <span className="text-gradient-green">Journey</span>
            </h2>
          </div>

          <div className="relative" ref={timelineWrap}>
            {/* SVG Winding Timeline Path */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              style={{ zIndex: 0 }}
            >
              {/* Linear Gradient for Progress Path */}
              <defs>
                <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
              
              {/* Background Track Path */}
              <path
                id="timeline-track-path"
                fill="none"
                stroke="rgba(96,165,250,0.08)"
                strokeWidth="2"
              />
              
              {/* Active Progress Path */}
              <path
                id="timeline-progress-path"
                ref={progressLine}
                fill="none"
                stroke="url(#timeline-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  willChange: 'stroke-dashoffset',
                  transition: 'stroke-dashoffset 0.05s linear',
                }}
              />
            </svg>

            <div className="flex flex-col gap-0">
              {MILESTONES.map((m, idx) => {
                const isLeft = idx % 2 === 0
                return (
                  <div
                    key={`${m.year}-${m.title}`}
                    className={`flex items-start sm:items-center gap-4 sm:gap-8 py-6 sm:py-10 flex-row ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                  >
                    {/* Content — initial hidden state, revealed by scroll listener */}
                    <div
                      ref={(el) => { cardRefs.current[idx] = el }}
                      className={`flex-1 ${isLeft ? 'sm:text-right sm:pr-8' : 'sm:text-left sm:pl-8'} text-left px-2 order-2 sm:order-none ${isLeft ? '[--initial-transform:translateY(20px)] sm:[--initial-transform:translateX(-20px)]' : '[--initial-transform:translateY(20px)] sm:[--initial-transform:translateX(20px)]'}`}
                      style={{
                        opacity: 0,
                        transform: 'var(--initial-transform)',
                        willChange: 'opacity, transform',
                      }}
                    >
                      <span className="text-xs font-label text-secondary tracking-widest">{m.year}</span>
                      <h3 className="text-xl font-display font-bold mt-1 mb-2 text-text-primary">{m.title}</h3>
                      <p className="text-text-muted text-sm font-body leading-relaxed max-w-sm inline-block">{m.description}</p>
                    </div>

                    {/* Node dot — glows when progress reaches it */}
                    <div 
                      className="flex-shrink-0 w-9 relative z-10 flex items-center justify-center pt-1 sm:pt-0 order-1 sm:order-none [--dot-offset-val:0px] sm:[--dot-offset-val:var(--dot-offset)]"
                      style={{
                        '--dot-offset': PRESET_OFFSETS[idx],
                        transform: 'translateX(var(--dot-offset-val, 0px))',
                      } as React.CSSProperties}
                    >
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

                    <div className="hidden sm:flex flex-1 sm:order-none" />
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
