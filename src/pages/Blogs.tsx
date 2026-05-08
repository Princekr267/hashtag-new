import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BLOGS } from '../constants/data'
import { Link } from 'react-router-dom'

export default function Blogs(): JSX.Element {
  
  const others = BLOGS.filter((b) => b.id === 'welcome-to-hashtag' || b.id === 'defuse-or-die-the-ultimate-valorant-showdown')

  return (
    <div className="relative z-10 pt-20">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            <span className="pill pill-cyan mb-6 inline-flex">Blog</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Welcome to Hashtag<br />
              <span className="text-gradient">Blogs</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-xl font-body leading-relaxed">
              Discover our latest stories from HashTag — gaming, events, culture, and campus impact.
            </p>
          </motion.div>

          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block pointer-events-none" style={{
            background: 'radial-gradient(ellipse 70% 80% at 80% 40%, rgba(129,140,248,0.06), transparent 70%)',
          }} />
        </div>
      </section>

      {/* ── OTHER POSTS GRID ──────────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold mb-12">
              <span className="text-gradient-green">Posts</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {others.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.2, 0, 0, 1] }}
                className="h-full"
              >
                <Link
                  className="blog-post-card h-full block cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                  to={`/blogs/${blog.id}`}
                  style={{
                    background: 'rgba(10,14,24,0.85)',
                    border: `1px solid ${blog.accent}22`,
                    borderRadius: '16px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.5), inset 0 0 0 1px ${blog.accent}40`
                    e.currentTarget.style.background = `radial-gradient(circle at 50% 0%, ${blog.accent}15, rgba(10,14,24,0.85) 60%)`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.background = 'rgba(10,14,24,0.85)'
                  }}
                >
                  <div className="p-6 md:p-8 flex flex-col h-full">
                    {blog.coverImage ? (
                      <div className="mb-6 overflow-hidden rounded-3xl h-56 bg-slate-950">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    {/* Accent bar */}
                    <div
                      className="h-0.5 w-12 mb-6"
                      style={{ background: `linear-gradient(90deg, ${blog.accent}, transparent)` }}
                    />
                    <span className="text-xs font-label tracking-widest mb-3 block" style={{ color: blog.accent }}>
                      {blog.tag.toUpperCase()} · {blog.date}
                    </span>
                    <h3 className="blog-title text-xl font-display font-bold text-text-primary mb-3 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-text-muted text-sm font-body leading-relaxed mb-6 flex-grow">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-text-faint text-xs font-label">{blog.readTime}</span>
                      <div className="flex items-center gap-[8px]">
                        <span
                          className="text-xs font-label tracking-widest blog-arrow"
                          style={{ color: blog.accent }}
                        >
                          Read More
                        </span>
                        <div
                          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center blog-arrow"
                          style={{ color: blog.accent }}
                        >
                          <ArrowRight size={15} className="flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
