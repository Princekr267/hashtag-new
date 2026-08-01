import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { BLOGS } from '../constants/data'
import { SparklesCore } from '../components/ui/sparkles'

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
    <div className="min-h-screen pt-24 pb-24 bg-[#020617] relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <SparklesCore
          background="transparent"
          minSize={0.5}
          maxSize={1.2}
          particleDensity={60}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20 blur-[120px]"
          style={{ background: `radial-gradient(circle, ${blog.accent}, transparent 70%)` }} 
        />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-3 text-xs font-label tracking-[0.3em] text-text-faint hover:text-white transition-colors uppercase"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Stories
          </Link>
        </motion.div>

        {/* Header Section */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-label tracking-widest uppercase border"
                style={{ color: blog.accent, borderColor: `${blog.accent}30`, backgroundColor: `${blog.accent}05` }}
              >
                {blog.tag}
              </span>
              <span className="text-[10px] font-label tracking-widest text-text-faint uppercase">
                {blog.date} · {blog.readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 leading-[1.1] tracking-tight">
              {blog.title}
            </h1>

            <p className="text-xl md:text-2xl text-text-muted font-body leading-relaxed opacity-80 border-l-2 border-white/10 pl-8">
              {blog.excerpt}
            </p>
          </motion.div>
        </header>

        {/* Hero Image */}
        {blog.coverImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-20 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl"
          >
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto"
            />
          </motion.div>
        )}

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none font-body text-text-muted leading-[1.8]">
          <div className="blog-content-wrapper">
            {blog.id === 'welcome-to-hashtag' && (
              <div className="space-y-12">
                <p className="first-letter:text-7xl first-letter:font-display first-letter:mr-3 first-letter:float-left first-letter:text-white">
                  Founded in the year 2019, HashTag aims to nurture knowledge, opportunities,
                  experience and collaborations within students. With a vision rooted in enriching the
                  student coding culture, Hashtag pulses with ideas, energy and moments that
                  unite learners.
                </p>
                <p>
                  Hashtag is not just a technical society, it's a platform that
                  welcomes students across all levels of experience, fostering a culture of peer
                  learning and inclusive growth. The society welcomes participants from all technical
                  domains eager to build, learn and grow. 
                </p>
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 italic text-white/90 text-xl">
                  "With every passing year, Hashtag continues to grow — inspiring creativity, building a community and shaping the future of student innovation."
                </div>
                <p>
                  The society has been actively organizing events, hackathons, and tech competitions felicitating its participants and the winners for their efforts and creativity.
                </p>
              </div>
            )}

            {blog.id === 'defuse-or-die-the-ultimate-valorant-showdown' && (
              <div className="space-y-12">
                <p>
                  The HashTag Technical Society's event, <strong className="text-white">"VCT Hashtag"</strong>, was held on 24th March,
                  2025. It was a competitive Valorant gaming event that
                  brought together five teams, each consisting of five players, competing in a
                  series of matches to determine the champion. 
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
                  <img src="/images/Blogs/vct-action.jpg" alt="VCT Action" className="rounded-3xl border border-white/10" />
                  <img src="/images/Blogs/players.jpg" alt="Players" className="rounded-3xl border border-white/10" />
                </div>
                
                <h3 className="text-3xl text-white font-display font-bold mt-16 mb-8">Strategic Outcomes</h3>
                <ul className="space-y-4 list-none p-0">
                  {[
                    "Promote Esports Culture: To encourage participation in esports.",
                    "Enhance Teamwork and Strategy: Real-time coordination challenges.",
                    "Skill Development: Enhancing gaming and decision-making skills.",
                    "Community Engagement: Fostering connections among enthusiasts."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start text-white/80">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary text-[10px] mt-1">✓</div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[32px] my-16">
                  <h4 className="text-xl font-display font-bold text-white mb-8">Event Brief</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
                    {[
                      { l: "Department", v: "Computer Science & Engineering" },
                      { l: "Date", v: "24 March 2025" },
                      { l: "Venue", v: "AI Lab" },
                      { l: "Students", v: "50+ Participants" }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-text-faint font-label uppercase tracking-widest text-[10px]">{item.l}</span>
                        <span className="text-white font-medium">{item.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p>
                  Participants and spectators praised the event for its smooth execution and
                  competitive spirit. The HashTag Technical Society looks forward to organizing more engaging and
                  inclusive events in the future.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Footer Navigation */}
        <footer className="mt-24 pt-12 border-t border-white/5 text-center">
          <Link to="/blogs" className="text-xs font-label tracking-[0.4em] text-text-faint hover:text-white transition-colors uppercase">
            Browse more stories
          </Link>
        </footer>
      </div>
    </div>
  )
}
