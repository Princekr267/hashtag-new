import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { BLOGS } from '../constants/data'

export default function BlogDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const blog = BLOGS.find(b => b.id === id)

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blogs" className="text-primary hover:text-white transition-colors">
            Return to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-[#060b14] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-96 -z-10 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 80% at 80% 0%, ${blog.accent}15, transparent 70%)`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="max-w-5xl mx-auto"
      >
        <Link
          to="/blogs"
          className="inline-flex items-center gap-[8px] text-xs font-label tracking-widest uppercase mb-8 transition-colors hover:text-white"
          style={{ color: blog.accent }}
        >
          <ArrowLeft size={14} className="flex-shrink-0" />
          <span className="leading-none">Back to Blogs</span>
        </Link>
        
        <div className="mb-8">
          <span
            className="text-xs font-label tracking-widest px-2 py-1 rounded border mb-4 inline-block"
            style={{ color: blog.accent, borderColor: `${blog.accent}40`, background: `${blog.accent}10` }}
          >
            {blog.tag.toUpperCase()}
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-label text-text-muted">
            <span>{blog.date}</span>
            <span className="w-1 h-1 rounded-full bg-outline-var" />
            <span>{blog.readTime}</span>
          </div>
        </div>

        <div className="w-16 h-1 mb-10 mt-6" style={{ background: blog.accent, opacity: 0.8 }} />

        <div className="prose prose-invert max-w-none font-body text-text-muted leading-relaxed">
          <p className="text-xl text-white/90 font-medium mb-8">
            {blog.excerpt}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <br />
          <h3 className="text-2xl text-white font-bold mb-4 font-display">Going Deeper</h3>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, 
            est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.
            Donec accumsan mauris a vehicula faucibus.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
