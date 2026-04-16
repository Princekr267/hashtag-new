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
  
  // Mouse position relative to card center
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  // Transform rotations based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  // Spotlight effect position
  const spotlightX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])
  const spotlightY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    // Calculate normalized position (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5
    const mouseY = (e.clientY - rect.top) / height - 0.5
    
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1000 group ${className}`}
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full transition-shadow duration-500 ease-out"
      >
        {/* Main Surface */}
        <div className="relative z-10 w-full h-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden group-hover:border-white/20 transition-colors duration-500">
          
          {/* Internal Grid overlay overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(${accentColor} 1px, transparent 1px),
                linear-gradient(90deg, ${accentColor} 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Spotlight Effect */}
          <motion.div
            style={{
              left: spotlightX,
              top: spotlightY,
              background: `radial-gradient(circle at center, ${accentColor}33 0%, transparent 70%)`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none z-0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Border Glow */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-30 p-1 h-full">
            {children}
          </div>
        </div>

        {/* Floating Shadow/Glow behind */}
        <div 
          className="absolute -inset-2 z-0 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-3xl"
          style={{ background: accentColor }}
        />
      </motion.div>
    </div>
  )
}
