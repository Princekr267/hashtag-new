import { motion } from 'framer-motion'
import AlumniCard3D from '../components/ui/AlumniCard3D'

const ALUMNI = [
  {
    name: 'Asmit Kumar Roy',
    role: 'President',
    photo: '/images/Alumni/Asmit.png',
    accent: '#8ff5ff',
    social: {
      github: 'https://github.com/asmitkumarroy',
      linkedin: 'https://www.linkedin.com/in/asmit-kumar-roy',
      instagram: 'https://www.instagram.com/_asmit_2304'
    }
  },
  {
    name: 'Neelesh Kumar',
    role: 'Vice-President',
    photo: '/images/Alumni/Neelesh.png',
    accent: '#00fc40',
    social: {
      github: 'https://github.com/neeleshkr22',
      linkedin: 'https://www.linkedin.com/in/neelesh-kumar-rana/',
      instagram: 'https://www.instagram.com/i.neeleshk'
    }
  },
  {
    name: 'Akshat Tyagi',
    role: 'Secretary',
    photo: '/images/Alumni/Akshat_Tyagi.png',
    accent: '#ac89ff',
    social: {
      github: 'https://github.com/DastroG/',
      linkedin: 'https://www.linkedin.com/in/xyz/',
      instagram: 'https://www.instagram.com/akshattyagi_17/'
    }
  },
  {
    name: 'Kangna Shrivastava',
    role: 'Treasurer',
    photo: '/images/Alumni/Kangna.png',
    accent: '#ff6b9b',
    social: {
      github: 'https://github.com/KangnaShrivastva',
      linkedin: 'http://www.linkedin.com/in/kangna-shrivastva-9b542523a',
      instagram: 'https://www.instagram.com/kangnaa._?igsh=MWVuNmcwMzFtMzc0aw=='
    }
  },
  {
    name: 'Rishabh Verma',
    role: 'Deputy Head',
    photo: '/images/Alumni/Rishabh.png',
    accent: '#8ff5ff',
    social: {
      github: 'https://github.com/RishabhV28',
      linkedin: 'https://www.linkedin.com/in/rishabh-verma-9a4997262/',
      instagram: 'https://www.instagram.com/wh0.zip__'
    }
  },
  {
    name: 'Alok Kumar Jha',
    role: 'Head',
    photo: '/images/Alumni/Alok.png',
    accent: '#00fc40',
    social: {
      github: 'https://github.com/alokjha099',
      linkedin: 'https://www.linkedin.com/in/alok-kumar-jha-3521a1265',
      instagram: 'https://www.instagram.com/alokjha245'
    }
  },
  {
    name: 'Harsh Naagar',
    role: 'Co-Head',
    photo: '/images/Alumni/Harsh.png',
    accent: '#ac89ff',
    social: {
      github: 'https://github.com/HarshNaagar77',
      linkedin: 'https://www.linkedin.com/in/harsh-naagar-a4b5b8207',
      instagram: 'https://www.instagram.com/hnaagar04'
    }
  },
  {
    name: 'Sanskriti Bishnoi',
    role: 'Head',
    photo: '/images/Alumni/Sanskriti.png',
    accent: '#ff6b9b',
    social: {
      github: 'https://github.com/Sanskriti-Vishnoi',
      linkedin: 'https://www.linkedin.com/in/sanskriti-vishnoi-00866926a',
      instagram: 'https://www.instagram.com/sanskriti_bishnoi/'
    }
  },
  { name: 'Nishit Mehta', role: 'Application Engineer @Quadrafort', photo: '/images/Alumni/Nishit.png', accent: '#8ff5ff', email: 'nishit@example.com', linkedin: 'https://linkedin.com/in/nishit' },
  { name: 'Manav Sharma', role: 'Software Engineer @ Irdeto', photo: '/images/Alumni/Manav.jpeg', accent: '#00fc40', email: 'manav@example.com', linkedin: 'https://linkedin.com/in/manav' },
  { name: 'Agamjot Singh', role: 'Full Stack Developer @ Mojo Web', photo: '/images/Alumni/Agamjot.jpg', accent: '#ac89ff', email: 'agamjot@example.com', linkedin: 'https://linkedin.com/in/agamjot' },
  { name: 'Divyanshu S', role: 'Founder @2ByteCode', photo: '/images/Alumni/Divyanshu.jpeg', accent: '#ff6b9b', email: 'divyanshu@example.com', linkedin: 'https://linkedin.com/in/divyanshu' },
  { name: 'Satyajeet Sau', role: 'Engineer @IUS Digital Solutions', photo: '/images/Alumni/satya.jpg', accent: '#8ff5ff', email: 'satyajeet@example.com', linkedin: 'https://linkedin.com/in/satyajeet' },
  { name: 'Mayank Pruthi', role: 'Frontend Dev @White Light IT', photo: '/images/Alumni/Mayank.jpg', accent: '#00fc40', email: 'mayank@example.com', linkedin: 'https://linkedin.com/in/mayank' },
  { name: 'Mehul Anand', role: 'Intern @IIT Delhi', photo: '/images/Alumni/Mehul.jpeg', accent: '#ac89ff', email: 'mehul@example.com', linkedin: 'https://linkedin.com/in/mehul' },
  { name: 'Harsh Nainwaya', role: 'Intern @BirchStreet Systems', photo: '/images/Alumni/Harsh_Nainwaya.jpg', accent: '#ff6b9b', email: 'harsh@example.com', linkedin: 'https://linkedin.com/in/harsh' },
  { name: 'Tanuja Pujari', role: 'Ex Software Dev Intern @SUEZ', photo: '/images/Alumni/Tanuja.jpg', accent: '#8ff5ff', email: 'tanuja@example.com', linkedin: 'https://linkedin.com/in/tanuja' },
  { name: 'Charu Aggarwal', role: 'System Engineer @TCS', photo: '/images/Alumni/charu.jpeg', accent: '#00fc40', email: 'charu@example.com', linkedin: 'https://linkedin.com/in/charu' },
  { name: 'Nikhil Aswal', role: 'Frontend Dev @Staar Payout', photo: '/images/Alumni/Nikhil.jpg', accent: '#ac89ff', email: 'nikhil@example.com', linkedin: 'https://linkedin.com/in/nikhil' },
  { name: 'Kunal Singh', role: 'Tech Intern @ Spay India', photo: '/images/Alumni/Kunal.jpg', accent: '#ff6b9b', email: 'kunal@example.com', linkedin: 'https://linkedin.com/in/kunal' },
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
