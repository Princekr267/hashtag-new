import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface InteractiveCard3DProps {
  children: React.ReactNode
  className?: string
  accentColor?: string
}

export default function InteractiveCard3D({ 
  children, 
  className = '', 
  accentColor = '#60a5fa' 
}: InteractiveCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 })

  const rotateX  = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg'])
  const rotateY  = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg'])
  const spotX    = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%'])
  const spotY    = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%'])

  // Glare overlay tracks exact mouse %
  const glareX   = useMotionValue(50)
  const glareY   = useMotionValue(50)
  const glareBg  = useTransform(
    [glareX, glareY],
    ([gx, gy]) =>
      `radial-gradient(ellipse 110px 110px at ${gx}% ${gy}%, rgba(255,255,255,0.08) 0%, transparent 65%)`
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect  = cardRef.current.getBoundingClientRect()
    const nx    = (e.clientX - rect.left) / rect.width - 0.5
    const ny    = (e.clientY - rect.top)  / rect.height - 0.5
    x.set(nx)
    y.set(ny)
    glareX.set(((e.clientX - rect.left) / rect.width) * 100)
    glareY.set(((e.clientY - rect.top)  / rect.height) * 100)
  }

  const handleMouseLeave = () => {
    x.set(0); y.set(0)
    glareX.set(50); glareY.set(50)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${className}`}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-full h-full"
      >
        {/* Main Surface */}
        <div className="relative z-10 w-full h-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden group-hover:border-white/20 transition-colors duration-500">
          
          {/* Grid texture */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Deep accent spotlight */}
          <motion.div
            style={{
              left: spotX, top: spotY,
              background: `radial-gradient(circle at center, ${accentColor}2a 0%, transparent 70%)`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none z-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Specular glare — precise mouse tracking */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-3xl"
            style={{ background: glareBg }}
          />

          {/* Top edge highlight */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-white/[0.04] to-transparent rounded-3xl" />
          
          <div className="relative z-30 p-1 h-full">
            {children}
          </div>
        </div>

        {/* Ambient glow behind card */}
        <div 
          className="absolute -inset-3 z-0 blur-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-700 rounded-3xl"
          style={{ background: `radial-gradient(ellipse, ${accentColor} 0%, transparent 70%)` }}
        />
      </motion.div>
    </div>
  )
}
