import { useRef, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  glowColor?: string
  style?: React.CSSProperties
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 15,
  glowColor = 'rgba(143,245,255,0.12)',
  style,
}: TiltCardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const rotateX = useSpring(0, { stiffness: 200, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 })
  const scale = useSpring(1, { stiffness: 200, damping: 20 })

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 768

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    rotateX.set((py - 0.5) * -maxTilt * 2)
    rotateY.set((px - 0.5) * maxTilt * 2)
    setGlowPos({ x: px * 100, y: py * 100 })
  }

  const handleMouseEnter = () => {
    if (isMobile) return
    scale.set(1.02)
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        willChange: 'transform',
        ...style,
      }}
      className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
    >
      {/* Glowing edge highlight */}
      {isHovered && !isMobile && (
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-[inherit] transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor} 0%, transparent 60%)`,
            opacity: 0.8,
          }}
        />
      )}
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  )
}
