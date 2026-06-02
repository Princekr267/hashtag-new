import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { TEAM, DEPARTMENTS } from '../constants/data'
import TeamCard3D, { TeamMember } from '../components/ui/TeamCard3D'

const DEPT_ACCENTS: Record<string, { color: string; glow: string; tag: string }> = {
  Leadership:   { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
  Technical:    { color: '#38bdf8', glow: 'rgba(56,189,248,0.15)',  tag: 'bg-sky-500/10 text-sky-300' },
  Graphics:     { color: '#818cf8', glow: 'rgba(129,140,248,0.15)', tag: 'bg-indigo-500/10 text-indigo-300' },
  Management:   { color: '#f472b6', glow: 'rgba(244,114,182,0.15)', tag: 'bg-pink-500/10 text-pink-300' },
  Content:      { color: '#fbbf24', glow: 'rgba(251,191,36,0.15)',  tag: 'bg-yellow-500/10 text-yellow-300' },
  Social:       { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)',  tag: 'bg-blue-500/10 text-blue-300' },
  'Social Media': { color: '#60a5fa', glow: 'rgba(96,165,250,0.15)', tag: 'bg-blue-500/10 text-blue-300' },
  Member:       { color: '#94a3b8', glow: 'rgba(148,163,184,0.15)', tag: 'bg-slate-500/10 text-slate-300' },
}

function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const handleMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mouse-x', '-999px')
    el.style.setProperty('--mouse-y', '-999px')
  }

  return (
    <div
      ref={ref}
      className="team-spotlight-card h-full w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

function useResponsiveColumns() {
  const [cols, setCols] = useState(4);
  
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(1);
      else if (w < 1024) setCols(2);
      else if (w < 1280) setCols(3);
      else setCols(4);
    };
    check(); // Initial
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  
  return cols;
}

type NodeType = 'header' | 'member';
interface TimelineNode {
  type: NodeType;
  id: string;
  data: string | TeamMember;
  dept: string;
  y: number;
  colPercent: number;
}

export default function Team(): JSX.Element {
  const cols = useResponsiveColumns();
  const activeDepartments = DEPARTMENTS.filter(d => d !== 'All')

  // Layout Constants — smaller on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const DEPARTMENT_GAP = isMobile ? 300 : 500;
  const HEADER_TO_CARDS_GAP = isMobile ? 200 : 280;
  const ROW_HEIGHT = isMobile ? 340 : 440; 

  // Generate Timeline Nodes
  const timelineNodes: TimelineNode[] = [];
  let currentY = 0;

  activeDepartments.forEach((dept, index) => {
    const members = TEAM.filter(m => m.department === dept);
    if (members.length === 0) return;
    
    // Add large gap before a new department header
    if (index === 0) {
      currentY += 150;
    } else {
      currentY += DEPARTMENT_GAP;
    }
    
    timelineNodes.push({ 
      type: 'header', 
      id: `header-${dept}`, 
      data: dept, 
      dept, 
      y: currentY, 
      colPercent: 50 
    });
    
    let direction: 'ltr' | 'rtl' = 'ltr';
    
    // Chunk members into rows
    for (let i = 0; i < members.length; i += cols) {
      if (i === 0) {
        currentY += HEADER_TO_CARDS_GAP;
      } else {
        currentY += ROW_HEIGHT;
      }
      
      const chunk = members.slice(i, i + cols);
      
      chunk.forEach((m, chunkIdx) => {
        // Center the chunk if it has fewer cards than `cols`
        const colWidth = 100 / cols;
        const chunkTotalWidth = chunk.length * colWidth;
        const offsetX = (100 - chunkTotalWidth) / 2;

        // If RTL, visually place the first item in the chunk on the far right of the centered block.
        const visualColIndex = direction === 'ltr' ? chunkIdx : (chunk.length - 1) - chunkIdx;
        const colPercent = offsetX + (visualColIndex * colWidth) + (colWidth / 2);
        
        // Organic up/down stagger based on column index
        const staggerAmount = 50;
        const yOffset = (visualColIndex % 2 === 0) ? -staggerAmount : staggerAmount;
        
        timelineNodes.push({ 
          type: 'member', 
          id: m.id || m.name, 
          data: m, 
          dept, 
          y: currentY + yOffset, 
          colPercent 
        });
      });
      
      direction = direction === 'ltr' ? 'rtl' : 'ltr';
    }
  });

  const totalHeight = currentY + ROW_HEIGHT / 2;
  const VIEWBOX_WIDTH = 1000;

  // Generate SVG Path
  let svgPath = `M 500 0`;
  let prevX = 500;
  let prevY = 0;

  timelineNodes.forEach((node) => {
    const y = node.y;
    const x = node.colPercent * 10; // Convert percentage to viewBox 1000 base
    
    // Draw a smooth bezier curve for EVERY node.
    // This creates the beautiful wavy sine-wave effect between staggered cards in the same row,
    // and the sweeping vertical drops between rows.
    const midY = prevY + (y - prevY) / 2;
    svgPath += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`;
    
    prevX = x;
    prevY = y;
  });
  svgPath += ` L ${prevX} ${totalHeight}`; 

  // Scroll Progress
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Deep Nebula Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/3 right-0 w-[800px] h-[600px] bg-secondary/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-tertiary/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-12 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="pill pill-cyan inline-block mb-6"
              style={{ borderColor: 'rgba(56,189,248,0.3)' }}
            >
              THE CREW
            </span>
            <div className="flex flex-col gap-6 items-center">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight">
                People Who<br />
                <span className="text-gradient">Make It Happen</span>
              </h1>
              <p className="text-text-muted max-w-md text-base md:text-lg font-body leading-relaxed">
                Explore our cosmic grid. Every member is a star powering this society, connected by a single vision.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Snake Grid Area ────────────────────────────── */}
        <div 
          ref={containerRef}
          className="relative w-full mx-auto" 
          style={{ height: `${totalHeight}px` }}
        >
          {/* Background SVGs */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${totalHeight}`} 
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              {/* Faint background track */}
              <path 
                d={svgPath}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="4"
              />

              {/* Fake Glow (fast) instead of feGaussianBlur (slow) */}
              <motion.path 
                d={svgPath}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="14"
                strokeOpacity="0.2"
                style={{ pathLength: smoothProgress }}
              />
              
              {/* Sharp inner core of the thread */}
              <motion.path 
                d={svgPath}
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
                style={{ pathLength: smoothProgress }}
              />
            </svg>
          </div>

          {/* Placed Nodes */}
          {timelineNodes.map((node) => {
            const accentColor = DEPT_ACCENTS[node.dept]?.color ?? '#60a5fa';

            return (
              <div 
                key={node.id}
                className="absolute z-10 w-full px-4"
                style={{ 
                  top: `${node.y}px`, 
                  left: `${node.colPercent}%`, 
                  transform: 'translate(-50%, -50%)',
                  maxWidth: cols === 1 ? '280px' : '320px',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {node.type === 'header' ? (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-4 h-4 rounded-full bg-white mb-4 relative z-20" style={{ boxShadow: `0 0 20px ${accentColor}` }}>
                        <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ background: accentColor }} />
                      </div>
                      <h2 
                        className="text-base sm:text-xl md:text-3xl font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold bg-black/50 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border border-white/10"
                        style={{ color: accentColor, textShadow: `0 0 15px ${accentColor}80` }}
                      >
                        {node.data as string}
                      </h2>
                    </div>
                  ) : (
                    <div className="relative group w-full">
                      {/* Node connection dot behind the card */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border-2 z-[-1]" style={{ borderColor: accentColor, boxShadow: `0 0 30px ${accentColor}` }} />
                      
                      <SpotlightCard>
                        <TeamCard3D
                          member={node.data as TeamMember}
                          accentColor={accentColor}
                        />
                      </SpotlightCard>
                    </div>
                  )}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
