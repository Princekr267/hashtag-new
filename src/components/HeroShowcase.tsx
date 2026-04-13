import { motion } from 'framer-motion'
import { Code2, PenTool, Rocket, Terminal } from 'lucide-react'

export default function HeroShowcase() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center perspective-1000">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute w-48 h-48 bg-secondary/20 rounded-full blur-[80px] -translate-x-12 translate-y-12" />
      </div>

      {/* Center Main Card - Conceptual */}
      <motion.div
        className="absolute z-20 w-64 md:w-80 rounded-2xl glass p-6 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          boxShadow: '0 25px 50px -12px rgba(3, 11, 26, 0.7), 0 0 0 1px rgba(96, 165, 250, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Code2 size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg leading-tight">build_culture</h3>
            <p className="text-xs text-text-faint font-mono-custom mt-0.5">status: online</p>
          </div>
        </div>
        
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-2 w-full bg-outline-var/40 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${80 - i * 15}%` }}
                transition={{ duration: 1.5, delay: 0.5 + i * 0.2, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating Design Card (Left/Top) */}
      <motion.div
        className="absolute z-10 w-48 rounded-xl glass p-4 shadow-xl hidden md:block"
        initial={{ opacity: 0, x: -30, y: -20 }}
        animate={{ opacity: 1, x: -100, y: -80 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        style={{
          boxShadow: '0 20px 40px -10px rgba(3, 11, 26, 0.8), 0 0 0 1px rgba(129, 140, 248, 0.15)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <PenTool size={16} className="text-secondary" />
          <span className="text-xs font-label tracking-widest text-text-muted">CREATIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 rounded-lg bg-secondary/10 border border-secondary/20" />
          <div className="space-y-2">
            <div className="h-7 rounded-lg bg-outline-var/40" />
            <div className="h-7 rounded-lg bg-outline-var/40" />
          </div>
        </div>
      </motion.div>

      {/* Floating Terminal Card (Right/Bottom) */}
      <motion.div
        className="absolute z-30 w-56 rounded-xl glass p-4 shadow-xl hidden sm:block"
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 90, y: 100 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        style={{
          boxShadow: '0 20px 40px -10px rgba(3, 11, 26, 0.8), 0 0 0 1px rgba(56, 189, 248, 0.15)',
        }}
      >
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-var/50">
          <Terminal size={14} className="text-text-muted" />
          <span className="text-xs font-mono-custom text-text-muted">terminal</span>
        </div>
        <div className="font-mono-custom text-[10px] space-y-1.5 mt-3 text-text-muted">
          <p><span className="text-tertiary">~</span> <span className="text-primary">npm</span> run dev</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-text-primary"
          >
            &gt; server started on port 3000
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-secondary"
          >
            &gt; compiling application...
          </motion.p>
        </div>
      </motion.div>

      {/* Impact Badge */}
      <motion.div
        className="absolute z-20 pill pill-live bottom-12 md:-bottom-2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Rocket size={12} className="mr-1" /> ACTIVE COMMUNITY
      </motion.div>
    </div>
  )
}
