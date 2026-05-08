import React, { useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface AlumniMember {
  name: string
  batch?: string
  role: string
  quote: string
  photo: string
  accent: string
  email?: string
  linkedin?: string
}

interface AlumniCardProps {
  member: AlumniMember
}

const AlumniCard: React.FC<AlumniCardProps> = ({ member }) => {
  const { name, role, quote, photo, accent, email, linkedin } = member
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Spring-based 3D rotation
  const x = useSpring(0, { stiffness: 100, damping: 20 })
  const y = useSpring(0, { stiffness: 100, damping: 20 })
  
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      // Idle floating animation
      animate={{ 
        y: [0, -8, 0],
        transition: { 
          duration: 4 + Math.random() * 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        } 
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
      className="relative w-full group"
    >
      <div 
        className="relative overflow-hidden rounded-[24px] p-8 md:p-10 flex flex-col items-center text-center gap-6"
        style={{
          background: 'linear-gradient(165deg, rgba(15,23,42,0.9) 0%, rgba(8,12,24,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          minHeight: '440px',
        }}
      >
        {/* Animated Mesh Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${accent}30 0%, transparent 70%)`,
          }}
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-24 -right-24 w-64 h-64 blur-[80px] rounded-full pointer-events-none"
          style={{ background: accent }}
        />

        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Dynamic Glowing Border */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 0 1.5px ${accent}40`,
            borderRadius: '24px'
          }}
        />

        {/* ── Photo ── */}
        <motion.div 
          style={{ transform: 'translateZ(60px)' }}
          className="relative"
        >
          <div
            className="w-28 h-28 rounded-full p-1 relative z-10"
            style={{ 
              background: `linear-gradient(135deg, ${accent}, transparent)`,
              boxShadow: `0 15px 30px -5px ${accent}30`
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#080c18]">
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={e => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=0f172a&textColor=${accent.replace('#', '')}`
                }}
              />
            </div>
          </div>
          {/* Pulse effect */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full blur-xl pointer-events-none"
            style={{ background: accent }}
          />
        </motion.div>

        {/* ── Info ── */}
        <div style={{ transform: 'translateZ(40px)' }} className="relative z-20 flex flex-col gap-3">
          <h3 className="text-2xl font-display font-bold text-white tracking-tight">
            {name}
          </h3>

          <p className="text-primary/90 font-label text-sm font-semibold tracking-wide uppercase">
            {role}
          </p>
        </div>

        {/* ── Quote Section ── */}
        <div style={{ transform: 'translateZ(30px)' }} className="relative z-20 max-w-[240px]">
          <p className="text-text-muted/80 text-sm italic font-body leading-relaxed line-clamp-3">
            "{quote}"
          </p>
        </div>

        {/* ── Magnetic Action Buttons ── */}
        <div 
          style={{ transform: 'translateZ(50px)' }} 
          className="mt-auto flex items-center gap-4 py-2"
        >
          <MagneticIconButton href={`mailto:${email}`} accent={accent}>
            <EnvelopeIcon />
          </MagneticIconButton>
          <MagneticIconButton href={linkedin || '#'} accent={accent}>
            <LinkedInIcon />
          </MagneticIconButton>
        </div>
      </div>
    </motion.div>
  )
}

const MagneticIconButton: React.FC<{ href: string; accent: string; children: React.ReactNode }> = ({
  href, accent, children,
}) => {
  const ref = useRef<HTMLAnchorElement>(null)
  const mx = useSpring(0, { stiffness: 200, damping: 15 })
  const my = useSpring(0, { stiffness: 200, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    mx.set(dx * 0.4)
    my.set(dy * 0.4)
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement
    el.style.borderColor = `${accent}30`
    el.style.boxShadow = 'none'
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-12 h-12 rounded-full border flex items-center justify-center overflow-hidden relative"
      style={{ 
        borderColor: `${accent}30`, 
        background: 'rgba(255,255,255,0.02)',
        x: mx,
        y: my
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = accent
        el.style.boxShadow = `0 0 16px ${accent}60`
      }}
    >
      {/* Hover fill */}
      <div 
        className="alumni-btn-fill absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
      />
      {/* Icon */}
      <div className="relative z-10" style={{ color: accent }}>
        <div className="alumni-btn-icon transition-colors duration-300">
          {children}
        </div>
      </div>
    </motion.a>
  )
}

const EnvelopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default AlumniCard

