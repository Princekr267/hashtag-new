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

        {blog.coverImage && (
          <div className="mb-8">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none font-body text-text-muted leading-relaxed">
          <p className="text-xl text-white/90 font-medium mb-8">
            {blog.excerpt}
          </p>
          
          {blog.id === 'welcome-to-hashtag' && (
            <div className="space-y-6">
              <p>
                Founded in the year 2019, HashTag aims to nurture knowledge, opportunities,
                experience and collaborations within students. With a vision rooted in enriching the
                student coding culture, Hashtag pulses with ideas, energy and moments that
                unite learners. Hashtag is not just a technical society, it's a platform that
                welcomes students across all levels of experience, fostering a culture of peer
                learning and inclusive growth. The society welcomes participants from all technical
                domains eager to build, learn and grow. The society has been actively organizing
                events, hackathons, and tech competitions felicitating its participants and the
                winners for their efforts and creativity. With every passing year, Hashtag
                continues to grow- inspiring creativity, building a community and shaping the future of
                student innovation.
              </p>
            </div>
          )}

          {blog.id === 'defuse-or-die-the-ultimate-valorant-showdown' && (
            <div className="space-y-6">
              <p>
                The HashTag Technical Society's event, "VCT Hashtag", was held on 24th March,
                2025, from 11:00 AM to 3:00 PM. It was a competitive Valorant gaming event that
                brought together five teams, each consisting of five players, competing in a
                series of matches to determine the champion. The atmosphere was vibrant and
                energetic, with both participants and spectators enjoying the thrilling gameplay. The
                event showcased the strategic skills, teamwork, and coordination of the players.
                The enthusiastic cheers and encouragement from the audience further enhanced the
                competitive spirit.
              </p>
              
              <img
                src="https://cdn.sanity.io/images/4czbk8j7/production/0f5efc840ca8f95588a42cdb4f14c6a817aa04a3-4032x3024.jpg"
                alt="Event venue"
                className="w-full h-auto rounded-lg mb-4"
              />
              
              <h3 className="text-2xl text-white font-bold mb-4 font-display">Key Outcomes</h3>
              <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Promote Esports Culture: To encourage participation in esports and build a competitive gaming environment.</li>
                <li>Enhance Teamwork and Strategy: To provide players an opportunity to showcase their strategic thinking and teamwork in Valorant.</li>
                <li>Skill Development: To offer a platform for students to enhance their gaming and decision-making skills.</li>
                <li>Community Engagement: To foster connections among gaming enthusiasts, promoting collaboration and sportsmanship.</li>
              </ul>
              
              <img
                src="https://cdn.sanity.io/images/4czbk8j7/production/d9b6f6ee5b850f06796536c9b74eac0aa069551b-4080x3072.jpg"
                alt="Event participants"
                className="w-full h-auto rounded-lg mb-4"
              />
              
              <h3 className="text-2xl text-white font-bold mb-4 font-display">Event Details</h3>
              <div className="bg-white/5 p-6 rounded-lg mb-6">
                <p className="mb-2"><strong>Department:</strong> Computer Science & Engineering</p>
                <p className="mb-2"><strong>Event Name:</strong> VCT HASHTAG - Defuse Or Die: The Ultimate Valorant Showdown</p>
                <p className="mb-2"><strong>Date:</strong> 24 March 2025</p>
                <p className="mb-2"><strong>Timings:</strong> 11 AM TO 3 PM</p>
                <p className="mb-2"><strong>Venue:</strong> AI Lab</p>
                <p className="mb-2"><strong>Team Size:</strong> 5 Members</p>
                <p className="mb-2"><strong>Registration Fees:</strong> Rs. 150</p>
                <p className="mb-2"><strong>Prizes:</strong> Exciting prizes for winners, with E-Certificates & custom stickers for all.</p>
              </div>
              
              <img
                src="https://cdn.sanity.io/images/4czbk8j7/production/2acd87e8c6c88d79101fd92c71c9f74719697329-1600x900.jpg"
                alt="Faculty coordinators"
                className="w-full h-auto rounded-lg mb-4"
              />
              
              <h3 className="text-2xl text-white font-bold mb-4 font-display">Feedback & Conclusion</h3>
              <p className="mb-4">
                Participants and spectators praised the event for its smooth execution and
                competitive spirit. The event successfully achieved its objective of fostering an
                esports culture and providing a platform for players to showcase their skills. The
                HashTag Technical Society looks forward to organizing more engaging and
                inclusive events in the future.
              </p>
              <p><strong>Total number of students:</strong> 50 students</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
