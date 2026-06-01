import { motion } from 'framer-motion'
import AlumniCard3D from '../components/ui/AlumniCard3D'

const ALUMNI = [
  { name: 'Nishit Mehta', role: 'Application Engineer @Quadrafort', quote: 'Building the future, one line of code at a time.', photo: '/images/Alumni/Nishit.png', accent: '#8ff5ff', email: 'nishit@example.com', linkedin: 'https://linkedin.com/in/nishit' },
  { name: 'Manav Sharma', role: 'Software Engineer @ Irdeto', quote: 'Innovation through collaboration and creativity.', photo: '/images/Alumni/Manav.jpeg', accent: '#00fc40', email: 'manav@example.com', linkedin: 'https://linkedin.com/in/manav' },
  { name: 'Agamjot Singh', role: 'Full Stack Developer @ Mojo Web', quote: 'Turning ideas into reality with technology.', photo: '/images/Alumni/Agamjot.jpg', accent: '#ac89ff', email: 'agamjot@example.com', linkedin: 'https://linkedin.com/in/agamjot' },
  { name: 'Divyanshu S', role: 'Founder @2ByteCode', quote: 'Empowering developers, one byte at a time.', photo: '/images/Alumni/Divyanshu.jpeg', accent: '#ff6b9b', email: 'divyanshu@example.com', linkedin: 'https://linkedin.com/in/divyanshu' },
  { name: 'Satyajeet Sau', role: 'Engineer @IUS Digital Solutions', quote: 'Code is poetry written in logic.', photo: '/images/Alumni/satya.jpg', accent: '#8ff5ff', email: 'satyajeet@example.com', linkedin: 'https://linkedin.com/in/satyajeet' },
  { name: 'Mayank Pruthi', role: 'Frontend Dev @White Light IT', quote: 'Creating beautiful user experiences.', photo: '/images/Alumni/Mayank.jpg', accent: '#00fc40', email: 'mayank@example.com', linkedin: 'https://linkedin.com/in/mayank' },
  { name: 'Mehul Anand', role: 'Intern @IIT Delhi', quote: 'Learning and growing every day.', photo: '/images/Alumni/Mehul.jpeg', accent: '#ac89ff', email: 'mehul@example.com', linkedin: 'https://linkedin.com/in/mehul' },
  { name: 'Harsh Nainwaya', role: 'Intern @BirchStreet Systems', quote: 'Building scalable solutions for tomorrow.', photo: '/images/Alumni/Harsh_Nainwaya.jpg', accent: '#ff6b9b', email: 'harsh@example.com', linkedin: 'https://linkedin.com/in/harsh' },
  { name: 'Tanuja Pujari', role: 'Ex Software Dev Intern @SUEZ', quote: 'Passionate about clean code and innovation.', photo: '/images/Alumni/Tanuja.jpg', accent: '#8ff5ff', email: 'tanuja@example.com', linkedin: 'https://linkedin.com/in/tanuja' },
  { name: 'Charu Aggarwal', role: 'System Engineer @TCS', quote: 'Bridging the gap between technology and business.', photo: '/images/Alumni/charu.jpeg', accent: '#00fc40', email: 'charu@example.com', linkedin: 'https://linkedin.com/in/charu' },
  { name: 'Nikhil Aswal', role: 'Frontend Dev @Staar Payout', quote: 'Crafting intuitive digital experiences.', photo: '/images/Alumni/Nikhil.jpg', accent: '#ac89ff', email: 'nikhil@example.com', linkedin: 'https://linkedin.com/in/nikhil' },
  { name: 'Kunal Singh', role: 'Tech Intern @ Spay India', quote: 'Exploring the endless possibilities of technology.', photo: '/images/Alumni/Kunal.jpg', accent: '#ff6b9b', email: 'kunal@example.com', linkedin: 'https://linkedin.com/in/kunal' },
]

export default function Alumni(): JSX.Element {

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

          <div
            className="absolute top-0 right-0 w-1/2 h-full -z-10 hidden lg:block pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 80% at 80% 40%, rgba(96,165,250,0.06), transparent 70%)' }}
          />
        </div>
      </section>

      {/* ── ALUMNI GRID ───────────────────────────────────────── */}
      <section className="section px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {ALUMNI.map((a, idx) => (
              <motion.div
                key={a.name}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <AlumniCard3D member={a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


    </div>
  )
}
