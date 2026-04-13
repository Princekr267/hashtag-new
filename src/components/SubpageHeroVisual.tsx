import { motion } from 'framer-motion'
import OrbitalRings from './OrbitalRings'
import GyroOrb from './GyroOrb'

interface SubpageHeroVisualProps {
  type: 'rings' | 'gyro'
}

export default function SubpageHeroVisual({ type }: SubpageHeroVisualProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full flex items-center justify-center pointer-events-none opacity-90"
    >
      <div className="absolute inset-0 bg-radial-glow opacity-25" />
      <div className="w-full h-full scale-[0.8] md:scale-[0.85] lg:scale-95">
        {type === 'rings' ? <OrbitalRings /> : <GyroOrb />}
      </div>
    </motion.div>
  )
}
