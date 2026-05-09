// ══════════════════════════════════════════════════════════════
//  Site Data — Hashtag Official
//  All real data sourced from To-be-added/team.json & Events.json
// ══════════════════════════════════════════════════════════════

// ── Types ──────────────────────────────────────────────────────
export interface SocialLinks {
  github?: string
  linkedin?: string
  instagram?: string
}

export interface TeamMember {
  id: string
  name: string
  title: string
  avatarUrl: string
  social: SocialLinks
  department: string
  isLeader?: boolean
}

export interface Event {
  id: string
  title: string
  description: string
  tag: 'Hackathon' | 'Workshop' | 'Ideathon' | 'Gaming' | 'Coding' | 'Design' | 'Hunt'
  status: 'upcoming' | 'past'
  poster?: string
  registerUrl?: string
  gradientFrom: string
  gradientTo: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface Milestone {
  year: string
  title: string
  description: string
}

// ── Team Data ──────────────────────────────────────────────────
export const TEAM: TeamMember[] = [
  // Leadership
  {
    id: 'anwesha',
    name: 'Anwesha Sen',
    title: 'President',
    avatarUrl: '/Photos/Anwesha.png',
    department: 'Leadership',
    isLeader: true,
    social: {
      github: 'https://github.com/anwesha1367',
      linkedin: 'https://www.linkedin.com/in/anwesha-sen-97170227b',
      instagram: 'https://www.instagram.com/anwesha_sen9405',
    },
  },
  {
    id: 'abdullah',
    name: 'M. Abdullah Meraj',
    title: 'Vice President',
    avatarUrl: '/Photos/Abdullah.png',
    department: 'Leadership',
    isLeader: true,
    social: {
      github: 'https://github.com/mohdabdullahmeraj',
      linkedin: 'https://www.linkedin.com/in/mohdabdullahmeraj/',
      instagram: 'https://www.instagram.com/mohdabdullahmeraj/',
    },
  },
  {
    id: 'priyal',
    name: 'Priyal Jain',
    title: 'Secretary',
    avatarUrl: '/Photos/Priyal.png',
    department: 'Leadership',
    isLeader: true,
    social: {
      github: 'https://github.com/pihu404',
      linkedin: 'https://www.linkedin.com/in/priyal-jain-92863b282',
      instagram: 'https://www.instagram.com/priyal2936',
    },
  },
  {
    id: 'vanshika',
    name: 'Vanshika S.',
    title: 'Treasurer',
    avatarUrl: '/Photos/Vanshika.png',
    department: 'Leadership',
    isLeader: true,
    social: {
      github: 'https://github.com/Vanshika-Srivastava79',
      linkedin: 'https://www.linkedin.com/in/vanshikasrivastava79',
      instagram: 'https://www.instagram.com/vannssszzz/',
    },
  },
  // Technical
  {
    id: 'ayush-kumar',
    name: 'Ayush Kumar S.',
    title: 'Technical Head',
    avatarUrl: '/Photos/Ayush_Kumar.png',
    department: 'Technical',
    social: {
      github: 'https://github.com/ayushkumarsingh14',
      linkedin: 'https://www.linkedin.com/in/ayush-kumar-singh-7ba5862ba',
      instagram: 'https://www.instagram.com/ayush.feb14/',
    },
  },
  {
    id: 'ankit',
    name: 'Ankit Choudhary',
    title: 'Technical Co-Head',
    avatarUrl: '/Photos/Ankit.png',
    department: 'Technical',
    social: {
      github: 'https://github.com/ankit77003',
      linkedin: 'https://www.linkedin.com/in/ankit-choudhary-978a11266/',
      instagram: 'https://www.instagram.com/ankitchoudhary4141/',
    },
  },
  // Graphics
  {
    id: 'avishka',
    name: 'Avishka Bhardwaj',
    title: 'Graphics Head',
    avatarUrl: '/Photos/Avishka.png',
    department: 'Graphics',
    social: {
      github: 'https://github.com/avishkabhardwaj',
      linkedin: 'https://www.linkedin.com/in/avishka-bhardwaj-091807327',
      instagram: 'https://www.instagram.com/avishka.20',
    },
  },
  {
    id: 'arin',
    name: 'Anantabh Kashyap',
    title: 'Graphics Co-Head',
    avatarUrl: '/Photos/Arin.png',
    department: 'Graphics',
    social: {
      github: 'https://github.com/arxnkshyp/',
      linkedin: 'https://www.linkedin.com/in/arin-kashyap/',
      instagram: 'https://www.instagram.com/arxnkshyp/',
    },
  },
  // Management
  {
    id: 'atulya',
    name: 'Atulya Mukesh',
    title: 'Management Head',
    avatarUrl: '/Photos/Atulya.png',
    department: 'Management',
    social: {
      github: 'https://github.com/atulya-mukesh',
      linkedin: 'https://www.linkedin.com/in/atulya-mukesh-12716a2ba',
      instagram: 'https://www.instagram.com/atulya.mukesh/',
    },
  },
  {
    id: 'akshat-jain',
    name: 'Akshat Jain',
    title: 'Management Co-Head',
    avatarUrl: '/Photos/Akshat_Jain.png',
    department: 'Management',
    social: {
      github: 'https://github.com/Akshatjain2411',
      linkedin: 'https://www.linkedin.com/in/Akshatjain',
      instagram: 'https://www.instagram.com/akshatjain2411',
    },
  },
  // Content
  {
    id: 'shreya',
    name: 'Shreya Sai',
    title: 'Content Head',
    avatarUrl: '/Photos/Shreya.png',
    department: 'Content',
    social: {
      github: 'https://github.com/sst2105',
      linkedin: 'https://www.linkedin.com/in/shreya-sai-thanikella/',
      instagram: 'https://www.instagram.com/l_.shreya._l',
    },
  },
  {
    id: 'rimi',
    name: 'Rimi Kumari',
    title: 'Content Co-Head',
    avatarUrl: '/Photos/Rimi.png',
    department: 'Content',
    social: {
      github: 'https://github.com/rimikumari',
      linkedin: 'https://www.linkedin.com/in/rimi-kumari-technical/',
      instagram: 'https://www.instagram.com/rimikumari.tech/',
    },
  },
  // Social Media
  {
    id: 'pratyush',
    name: 'Pratyush Patwal',
    title: 'Social Media Head',
    avatarUrl: '/Photos/Pratyush.png',
    department: 'Social Media',
    social: {
      github: 'https://github.com/pratyush1279',
      linkedin: 'https://www.linkedin.com/in/pratyush-patwal-198144333',
      instagram: 'https://www.instagram.com/ohhpratyush',
    },
  },
  {
    id: 'ayush-parashar',
    name: 'Ayush Parashar',
    title: 'Social Media Co-Head',
    avatarUrl: '/Photos/Ayush_Parashar.png',
    department: 'Social Media',
    social: {
      github: 'https://github.com/ayushparashar91',
      linkedin: 'https://www.linkedin.com/in/ayush-parashar-49a596213',
      instagram: 'https://www.instagram.com/ayushparashar19',
    },
  },
  // Members
  {
    id: 'amisha',
    name: 'Amisha',
    title: 'Member',
    avatarUrl: '/Photos/Amisha.png',
    department: 'Member',
    social: {
      github: 'https://github.com/Amisha1kumari',
      linkedin: 'https://www.linkedin.com/in/amisha-kumari-04bb10328',
      instagram: 'https://www.instagram.com/amixh.aa',
    },
  },
  {
    id: 'kartik',
    name: 'Kartik Mishra',
    title: 'Member',
    avatarUrl: '/Photos/Kartik.png',
    department: 'Member',
    social: {
      github: 'https://github.com/codelawyer-max',
      linkedin: 'https://www.linkedin.com/in/kartik-mishra-6139b9335',
      instagram: 'https://www.instagram.com/kartikkmishraaa',
    },
  },
  {
    id: 'prince',
    name: 'Prince Kumar',
    title: 'Member',
    avatarUrl: '/Photos/Prince.png',
    department: 'Member',
    social: {
      github: 'https://github.com/Princekr267',
      linkedin: 'https://www.linkedin.com/in/prince-kumar-27a12b315',
      instagram: 'https://www.instagram.com/princekrr267',
    },
  },
  {
    id: 'dilawar',
    name: 'Dilawar Ali',
    title: 'Member',
    avatarUrl: '/Photos/Dilawar.png',
    department: 'Member',
    social: {
      github: 'https://github.com/Dilawar-ali313',
      linkedin: 'https://www.linkedin.com/in/dilawar-ali-4533ab335',
      instagram: 'https://www.instagram.com/dilawarzaidi._',
    },
  },
  {
    id: 'suhani',
    name: 'Suhani Mittal',
    title: 'Member',
    avatarUrl: '/Photos/Suhani.png',
    department: 'Member',
    social: {
      github: 'https://github.com/suhani-ux123',
      linkedin: 'https://www.linkedin.com/in/suhani-mittal-a650a2381',
      instagram: 'https://www.instagram.com/suuhanii__m',
    },
  },
  {
    id: 'kushagra',
    name: 'Kushagra Pandey',
    title: 'Member',
    avatarUrl: '/Photos/Kushagra.png',
    department: 'Member',
    social: {
      github: 'https://github.com/kushagra0333',
      linkedin: "https://www.linkedin.com/in/its-kushagra-pandey",
      instagram: 'https://www.instagram.com/its_kushagra_pandey',
    },
  },
  {
    id: 'tanvi',
    name: 'Tanvi Salhotra',
    title: 'Member',
    avatarUrl: '/Photos/tanvi_salhotra.png',
    department: 'Member',
    social: {
      github: 'https://github.com/tan07vi',
      linkedin: 'http://www.linkedin.com/in/tanvi7709',
      instagram: 'https://www.instagram.com/nikoniko_7t',
    },
  },
  {
    id: 'anushka',
    name: 'Anushka Dua',
    title: 'Member',
    avatarUrl: '/Photos/Anushka_Dua.png',
    department: 'Member',
    social: {
      github: 'https://github.com/anushkadua23',
      linkedin: 'https://www.linkedin.com/in/anushka-dua-06427131a',
      instagram: 'https://www.instagram.com/anushkaa_dua',
    },
  },
  {
    id: 'rimjhim',
    name: 'Rimjhim Shukla',
    title: 'Member',
    avatarUrl: '/Photos/Rimjhim.png',
    department: 'Member',
    social: {
      github: 'https://github.com/shuklarimjhim87-a11y',
      linkedin: 'https://www.linkedin.com/in/rimjhim-shukla-a264203a8',
      instagram: 'https://www.instagram.com/_rimjhimshuklaa_',
    },
  },
  {
    id: 'bhumika',
    name: 'Bhumika Dobha',
    title: 'Member',
    avatarUrl: '/Photos/Bhumika_Dobhal.png',
    department: 'Member',
    social: {
      github: 'https://github.com/dobhalbhumikaaa',
      linkedin: 'https://www.linkedin.com/in/bhumika-dobhal-06118b381',
      instagram: 'https://www.instagram.com/bhumika_dobhal',
    },
  },
]

// ── Events Data ────────────────────────────────────────────────
export const EVENTS: Event[] = [
  {
    id: 'troubleshoot',
    title: 'TroubleShoot Ideathon',
    description:
      'A flagship ideathon hosted with Microsoft where students pitched real product ideas to industry experts. Attendees sharpened their problem framing, delivery, and presentation skills under professional mentorship.',
    tag: 'Ideathon',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/cs-CL4FeSij.jpg',
    registerUrl: 'https://reskilll.com/hack/troubleshoot',
    gradientFrom: '#8ff5ff',
    gradientTo: '#00fc40',
  },
  {
    id: 'hack-battle',
    title: 'Hack Battle',
    description:
      'A high-energy Valorant tournament that brought competitive tech culture to campus. The event reinforced teamwork, strategy, and community spirit while celebrating the energy of student gaming culture.',
    tag: 'Gaming',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/vct-CFqoO1u7.jpg',
    gradientFrom: '#ac89ff',
    gradientTo: '#ff6b9b',
  },
  {
    id: 'ideautsav',
    title: 'IdeaUtsav',
    description:
      'Our flagship innovation festival where teams turned insights into solutions. Participants pitched creative technology concepts and received expert feedback, recognition, and growth opportunities.',
    tag: 'Ideathon',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/ideautsav-1JXVl_ej.jpg',
    gradientFrom: '#00fc40',
    gradientTo: '#8ff5ff',
  },
  {
    id: 'brand-brawl',
    title: 'Brand Brawl',
    description:
      'A design-driven build challenge where students created websites with bold themes and strong brand storytelling. Teams were evaluated on usability, visual polish, and creativity under tight timelines.',
    tag: 'Design',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/brandbrawl-XMbxOCOp.jpg',
    gradientFrom: '#ac89ff',
    gradientTo: '#8ff5ff',
  },
  {
    id: 'cryptic-hunt',
    title: 'Cryptic Hunt',
    description:
      'A strategic puzzle challenge that tested logic, teamwork, and problem solving. Participants decoded clues across multiple rounds, sharpening analytical thinking and rapid decision-making.',
    tag: 'Hunt',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/cryptichunt-DwtjWL7t.jpg',
    gradientFrom: '#ff6b9b',
    gradientTo: '#ac89ff',
  },
  {
    id: 'treasure-hunt',
    title: 'Treasure Hunt',
    description:
      'A campus adventure designed around suspense and clever challenges. Teams navigated hidden clues, collaborated under pressure, and competed for the final prize with sharp problem solving.',
    tag: 'Hunt',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/treasurehunt-eDbFKxXs.jpg',
    gradientFrom: '#8ff5ff',
    gradientTo: '#ac89ff',
  },
  {
    id: 'relay-coding',
    title: 'Relay Coding',
    description:
      'CodeTrek 25 challenged participants with relay-style coding rounds. Teams collaborated to solve timed problems, balancing speed, clarity, and accuracy under event pressure.',
    tag: 'Coding',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/codetrekrelay-Dv_602Cy.jpg',
    gradientFrom: '#00fc40',
    gradientTo: '#ac89ff',
  },
  {
    id: 'codetrek',
    title: 'CodeTrek',
    description:
      'A flagship coding competition where teams raced through real-time algorithmic challenges. The event highlighted technical skill, teamwork, and a strong drive to deliver polished solutions.',
    tag: 'Coding',
    status: 'past',
    poster: 'https://hashtag-official.vercel.app/assets/codetrek-CNHi5dxE.jpg',
    gradientFrom: '#ac89ff',
    gradientTo: '#00fc40',
  },
]

// ── Blogs Data ────────────────────────────────────────────────
export interface Blog {
  id: string
  title: string
  excerpt: string
  tag: string
  readTime: string
  accent: string
  date: string
  featured: boolean
  coverImage?: string
}

export const BLOGS: Blog[] = [
  {
    id: 'defuse-or-die-the-ultimate-valorant-showdown',
    title: 'Defuse Or Die: The Ultimate Valorant Showdown',
    excerpt: 'A competitive Valorant event hosted by Hashtag Technical Society, showcasing team strategy, esports spirit, and campus gaming culture.',
    tag: 'Gaming',
    readTime: '6 min read',
    accent: '#ff8b5a',
    date: 'March 2025',
    featured: true,
    coverImage: 'https://cdn.sanity.io/images/4czbk8j7/production/deea2612b2b9021206ababb56515bfca0f466cee-4032x2268.jpg',
  },
  {
    id: 'welcome-to-hashtag',
    title: 'Welcome To Hashtag',
    excerpt: 'An introduction to HashTag Technical Society, its mission, culture, and student-led innovation at JIMS Greater Noida.',
    tag: 'Culture',
    readTime: '5 min read',
    accent: '#6f82ff',
    date: '2024',
    featured: false,
    coverImage: 'https://cdn.sanity.io/images/4czbk8j7/production/6badacb22cf366eb5b2e366feceb6a5090d0a626-128x74.png',
  },
]


// ── Stats ──────────────────────────────────────────────────────
export const STATS: Stat[] = [
  { value: 24, suffix: '', label: 'Members' },
  { value: 5, suffix: '+', label: 'Events' },
  { value: 10, suffix: '+', label: 'Industry Partners' },
]

// ── Timeline Milestones ────────────────────────────────────────
export const MILESTONES: Milestone[] = [
  {
    year: '2019',
    title: 'Founded',
    description: 'Hashtag Official was born at JIMS Greater Noida with a vision to bridge the gap between academics and industry.',
  },
  {
    year: '2019',
    title: 'First Event — Treasure Hunt',
    description: 'Our debut event was a mystery-filled adventure that set the tone for everything that followed.',
  },
  {
    year: '2024',
    title: 'CodeTrek & Brand Brawl',
    description: 'Expanded into technical events — coding challenges, web design competitions, and collaboration with industry.',
  },
  {
    year: '2024',
    title: 'IdeaUtsav',
    description: 'Hosted our flagship ideation festival, celebrating innovation and problem-solving across departments.',
  },
  {
    year: '2025',
    title: 'Microsoft Partnership',
    description: 'Partnered with Microsoft for the TroubleShoot Ideathon — students pitching live at Microsoft Office Noida.',
  },
]

// ── Marquee Events (for scrolling banner) ─────────────────────
export const MARQUEE_EVENTS: string[] = [
  'TroubleShoot Ideathon',
  'Brand Brawl',
  'IdeaUtsav',
  'CodeTrek',
  'Cryptic Hunt',
  'Relay Coding',
  'Hack Battle',
  'Treasure Hunt',
]

// ── Departments ────────────────────────────────────────────────
export const DEPARTMENTS = [
  'All',
  'Leadership',
  'Technical',
  'Graphics',
  'Management',
  'Content',
  'Social Media',
  'Member',
] as const

export type Department = (typeof DEPARTMENTS)[number]

// ── About Content ──────────────────────────────────────────────

export const ABOUT_CONTENT = `Hashtag Society is a student-run technical community at JIMS Greater Noida that stands for hands-on learning, collaborative problem-solving, and inclusive tech leadership. We are committed to empowering members through workshops, projects, and partnerships that make technology education more accessible and career-ready.

Our mission is to bridge the gap between academic learning and industry standards, empowering students to build real-world projects, host exciting hackathons, and foster a thriving community of tech enthusiasts.`

export const JIMS_RELATION = `Hashtag is JIMS Greater Noida's premier technical society, dedicated to cultivating a thriving community of developers, designers, and innovators. We work closely with the institution to provide students with opportunities to learn cutting-edge technologies, collaborate on meaningful projects, and prepare for successful careers in the tech industry.`
