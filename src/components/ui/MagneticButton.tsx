import { useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  as?: 'button' | 'div'
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  as: Tag = 'div',
}: MagneticButtonProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  const x = useSpring(0, { stiffness: 300, damping: 20 })
  const y = useSpring(0, { stiffness: 300, damping: 20 })
  const scale = useSpring(1, { stiffness: 300, damping: 20 })

  const isTouchDevice =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY

    x.set(dx * 0.3)
    y.set(dy * 0.3)
    scale.set(1.03)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    scale.set(1)
  }

  const rotateX = useTransform(y, [-20, 20], [2, -2])
  const rotateY = useTransform(x, [-20, 20], [-2, 2])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y, scale, rotateX, rotateY, willChange: 'transform' }}
      className={`inline-block ${className}`}
    >
      {Tag === 'button' ? (
        <button className="w-full h-full">{children}</button>
      ) : (
        children
      )}
    </motion.div>
  )
}
