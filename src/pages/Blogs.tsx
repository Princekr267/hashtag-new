import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SubpageHeroVisual from '../components/visuals/SubpageHeroVisual'
import InteractiveCard3D from '../components/ui/InteractiveCard3D'

const BLOGS = [
  {
    id: 'why-every-cs-student',
    title: 'Why Every CS Student Should Attend Hackathons',
    excerpt: "Hackathons aren't just about building things in 24 hours — they're about growth, networking, and learning to ship under pressure. Here's why you should start attending.",
    tag: 'Career',
    readTime: '5 min read',
    accent: '#8ff5ff',
    date: 'March 2025',
    featured: true,
  },
  {
    id: 'design-thinking',
    title: 'Design Thinking for Engineers',
    excerpt: 'Technical skills get you hired. Design thinking makes you irreplaceable. A brief guide to how Hashtag approaches product thinking.',
    tag: 'Design',
    readTime: '4 min read',
    accent: '#ac89ff',
    date: 'Feb 2025',
    featured: false,
  },
  {
    id: 'roadmap-web-dev',
    title: 'The 2025 Web Dev Roadmap',
    excerpt: 'From HTML basics to full-stack deployment — a straight path curated by the Hashtag Technical team.',
    tag: 'Development',
    readTime: '7 min read',
    accent: '#00fc40',
    date: 'Jan 2025',
    featured: false,
  },
  {
    id: 'career-in-ux',
    title: 'Breaking Into UX Without a Design Degree',
    excerpt: "Portfolio over degree. Here's how Hashtag's Graphics team thinks about building a UX career from zero.",
    tag: 'Career',
    readTime: '6 min read',
    accent: '#ff6b9b',
    date: 'Dec 2024',
    featured: false,
  },
  {
    id: 'open-source',
    title: 'How to Make Your First Open Source Contribution',
    excerpt: 'Step-by-step walkthrough to contributing to GitHub repos, getting your first PR merged, and building a public portfolio.',
    tag: 'Development',
    readTime: '8 min read',
    accent: '#00fc40',
    date: 'Nov 2024',
    featured: false,
  },
]

export default function Blogs(): JSX.Element {
  const featured = BLOGS.find((b) => b.featured)!
  const others   = BLOGS.filter((b) => !b.featured)

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
            <span className="pill pill-cyan mb-6 inline-flex">Blog</span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Ideas Worth<br />
              <span className="text-gradient">Sharing</span>
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-xl font-body leading-relaxed">
              Thoughts on tech, design, careers, and culture — from the Hashtag team.
            </p>
          </motion.div>

          <div className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block">
            <SubpageHeroVisual type="gyro" />
          </div>
        </div>
      </section>

      {/* ── FEATURED POST ─────────────────────────────────────── */}
      <section className="section-sm px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <span className="text-xs font-label text-primary tracking-widest">FEATURED</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-[1px] rounded-3xl group"
            style={{ background: `linear-gradient(135deg, ${featured.accent}70, transparent 60%, ${featured.accent}20)` }}
          >
            <div className="w-full bg-bg-container rounded-3xl h-full transition-all duration-500 group-hover:bg-[#060d1c]">
              <div className="p-12 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full relative overflow-hidden">
                {/* Neon corner accent */}
                <div
                  className="absolute top-0 left-0 w-24 h-24 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${featured.accent}20, transparent 70%)`,
                  }}
                />
                {/* Bottom right accent */}
                <div
                  className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 100% 100%, ${featured.accent}10, transparent 70%)`,
                  }}
                />
                {/* Hover glow */}
                <div 
                  className="absolute -inset-24 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-full blur-3xl"
                  style={{ background: `radial-gradient(circle at 30% 50%, ${featured.accent}18, transparent 50%)` }}
                />
                
                <div className="flex-1 relative z-10">
                  <span
                    className="text-xs font-label tracking-widest mb-4 block"
                    style={{ color: featured.accent }}
                  >
                    {featured.tag.toUpperCase()} · {featured.date} · {featured.readTime}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary mb-6 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-text-muted font-body leading-relaxed max-w-2xl">
                    {featured.excerpt}
                  </p>
                </div>
                <button
                  className="btn-ghost flex items-center gap-2 self-end flex-shrink-0 relative z-10 hover:-translate-y-1 transition-transform"
                  style={{ color: featured.accent, borderColor: `${featured.accent}50` }}
                >
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OTHER POSTS GRID ──────────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-display font-bold mb-12">
              More <span className="text-gradient-green">Posts</span>
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
                <InteractiveCard3D accentColor={blog.accent} className="h-full">
                  <div className="p-8 flex flex-col h-full">
                    <div
                      className="h-0.5 w-12 mb-6"
                      style={{ background: `linear-gradient(90deg, ${blog.accent}, transparent)` }}
                    />
                    <span className="text-xs font-label tracking-widest mb-3 block" style={{ color: blog.accent }}>
                      {blog.tag.toUpperCase()} · {blog.date}
                    </span>
                    <h3 className="text-xl font-display font-bold text-text-primary mb-3 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-text-muted text-sm font-body leading-relaxed mb-6 flex-grow">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      <span className="text-text-faint text-xs font-label">{blog.readTime}</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <ArrowRight size={16} style={{ color: blog.accent }} />
                      </div>
                    </div>
                  </div>
                </InteractiveCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
