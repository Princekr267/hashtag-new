import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BLOGS } from '../constants/data'
import { Link } from 'react-router-dom'

export default function Blogs(): JSX.Element {
  
  const allPosts = BLOGS
  const featuredPost = allPosts.find(p => p.featured) || allPosts[0]
  const otherPosts = allPosts.filter(p => p.id !== featuredPost.id)

  return (
    <div className="relative z-10 pt-20 bg-[#020617]">
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="section px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[130px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center md:text-left mb-12 md:mb-16"
          >
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="pill pill-cyan mb-6 inline-flex"
            >
              The Hashtag Journal
            </motion.span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.0] mb-6 tracking-tight">
              Stories from the<br />
              <span className="text-gradient">Frontier</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-2xl font-body leading-relaxed opacity-70 mx-auto md:mx-0">
              Technical deep-dives, community culture, and campus innovation. 
            </p>
          </motion.div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-20">
            {allPosts.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
              >
                <Link to={`/blogs/${blog.id}`} className="group block h-full">
                  <div className="h-full flex flex-col rounded-[32px] bg-white/[0.03] border border-white/5 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-2">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      {blog.coverImage ? (
                        <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-slate-900/50" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 text-[10px] font-label text-primary-dim uppercase tracking-widest font-bold">
                          {blog.tag}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <span className="text-[10px] font-label tracking-[0.3em] text-text-faint uppercase mb-4">{blog.date}</span>
                      <h3 className="text-2xl font-display font-bold text-white mb-4 leading-tight group-hover:text-primary-dim transition-colors">{blog.title}</h3>
                      <p className="text-text-muted text-sm line-clamp-3 mb-8 opacity-70 leading-relaxed">{blog.excerpt}</p>
                      
                      <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[10px] font-label text-text-faint tracking-widest">{blog.readTime}</span>
                        <div className="flex items-center gap-2 text-primary-dim group-hover:text-primary transition-colors">
                          <span className="text-[10px] font-label tracking-widest font-bold">READ STORY</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
