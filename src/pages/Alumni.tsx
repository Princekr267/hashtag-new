import { useState } from 'react'
import { motion } from 'framer-motion'
import SubpageHeroVisual from '../components/visuals/SubpageHeroVisual'

const ALUMNI = [
  { name: 'Harsh Nainwaya',  batch: '2024', role: 'SDE Intern @ Microsoft', quote: 'Hashtag gave me my first real product experience.', photo: '/Photos/Harsh_Nainwaya.jpg', accent: '#8ff5ff' },
  { name: 'Mayank',          batch: '2024', role: 'Full Stack Developer',     quote: 'The community here is unmatched — real builders.',    photo: '/Photos/Mayank.jpg',         accent: '#00fc40' },
  { name: 'Nikhil',          batch: '2023', role: 'UX Designer @ Startup',    quote: 'Design thinking at Hashtag changed my career.',       photo: '/Photos/Nikhil.jpg',         accent: '#ac89ff' },
  { name: 'Neelesh',         batch: '2024', role: 'Backend Engineer',          quote: 'CodeTrek pushed me beyond my comfort zone every time.', photo: '/Photos/Neelesh.png',       accent: '#00fc40' },
  { name: 'Tanuja',          batch: '2023', role: 'Product Manager Intern',    quote: 'IdeaUtsav was where I found my passion for product.', photo: '/Photos/Tanuja.jpg',         accent: '#ff6b9b' },
  { name: 'Rishabh',         batch: '2024', role: 'Data Science Intern',       quote: 'Hashtag taught me to build, not just study.', photo: '/Photos/Rishabh.png',               accent: '#8ff5ff' },
]

const BATCHES = ['All', '2023', '2024'] as const
type Batch = typeof BATCHES[number]

export default function Alumni(): JSX.Element {
  const [activeBatch, setActiveBatch] = useState<Batch>('All')

  const filtered = ALUMNI.filter((a) =>
    activeBatch === 'All' ? true : a.batch === activeBatch
  )

  return (
    <div className="relative z-10 pt-20">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            <span className="pill pill-green mb-6 inline-flex">Alumni</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              The Legacy<br />
              <span className="text-gradient-green">Lives On</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-xl font-body leading-relaxed">
              Our alumni have gone on to work at top companies and startups.
              They built Hashtag — and Hashtag built them.
            </p>
          </motion.div>

          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block">
            <SubpageHeroVisual type="rings" />
          </div>
        </div>
      </section>

      {/* ── ALUMNI GRID ───────────────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filter */}
          <div className="flex gap-2 mb-12">
            {BATCHES.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBatch(b)}
                className={`px-4 py-2 text-xs font-label tracking-widest uppercase transition-all duration-200 ${
                  activeBatch === b
                    ? 'bg-secondary text-bg-base'
                    : 'text-text-muted border border-outline-var hover:text-secondary hover:border-secondary'
                }`}
              >
                {b === 'All' ? 'All Batches' : `Batch ${b}`}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0">
            {filtered.map((a, idx) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.2, 0, 0, 1] }}
                className="surface-card p-8 group"
                style={{
                  borderRight: idx % 3 !== 2 ? '1px solid rgba(143,245,255,0.05)' : 'none',
                  borderBottom: '1px solid rgba(143,245,255,0.05)',
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 relative overflow-hidden flex-shrink-0"
                    style={{ boxShadow: `0 0 16px ${a.accent}30` }}
                  >
                    <img
                      src={a.photo}
                      alt={a.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        const t = e.currentTarget as HTMLImageElement
                        t.style.display = 'none'
                      }}
                    />
                    <div
                      className="absolute top-0 left-0 right-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${a.accent}80, transparent)` }}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-text-primary">{a.name}</h3>
                    <p className="text-xs font-label tracking-wider" style={{ color: a.accent }}>
                      {a.role}
                    </p>
                    <p className="text-text-faint text-xs font-label mt-0.5">BATCH {a.batch}</p>
                  </div>
                </div>

                <blockquote className="text-text-muted text-sm font-body italic leading-relaxed">
                  "{a.quote}"
                </blockquote>

                <div
                  className="h-px w-10 mt-6"
                  style={{ background: `linear-gradient(90deg, ${a.accent}, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
