import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { BLOGS } from '../constants/data'
import { Link } from 'react-router-dom'

import AcertinityCard3D from "../components/visuals/AcertinityCard3D"


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
                className="h-full flex justify-center"
              >
                <AcertinityCard3D
                  id={blog.id}
                  image={blog.coverImage}
                  header={blog.title}
                  desc={blog.excerpt}
                  readTime={blog.readTime}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
