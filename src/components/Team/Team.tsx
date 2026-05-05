import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TeamCard3D from '../ui/TeamCard3D';

gsap.registerPlugin(ScrollTrigger);

// ── Types ───────────────────────────────────────────────────
interface TeamMember {
  id?: string;
  name: string;
  title: string;
  avatarUrl: string;
  department?: string;
  social: { github?: string; linkedin?: string; instagram?: string };
}

interface DepartmentGroup {
  leads?: TeamMember[];
}

interface TeamData {
  leaders?: TeamMember[];
  technical?: DepartmentGroup;
  graphics?: DepartmentGroup;
  management?: DepartmentGroup;
  content?: DepartmentGroup;
  social?: DepartmentGroup;
  pr?: DepartmentGroup;
  members?: TeamMember[] | DepartmentGroup;
}

// ── Department definitions ──────────────────────────────────
const DEPARTMENTS = [
  { key: 'leadership', label: 'Leadership' },
  { key: 'technical',  label: 'Technical'  },
  { key: 'graphics',   label: 'Graphics'   },
  { key: 'management', label: 'Management' },
  { key: 'social',     label: 'Social'     },
  { key: 'content',    label: 'Content'    },
  { key: 'pr',         label: 'PR'         },
  { key: 'members',    label: 'Members'    },
] as const;

/** Extract members for a given department key */
function getDeptMembers(teamData: TeamData, key: string): TeamMember[] {
  switch (key) {
    case 'leadership':
      return teamData.leaders ?? [];
    case 'technical':
      return teamData.technical?.leads ?? [];
    case 'graphics':
      return teamData.graphics?.leads ?? [];
    case 'management':
      return teamData.management?.leads ?? [];
    case 'social':
      return teamData.social?.leads ?? [];
    case 'content':
      return teamData.content?.leads ?? [];
    case 'pr':
      return teamData.pr?.leads ?? [];
    case 'members': {
      const m = teamData.members;
      if (!m) return [];
      if (Array.isArray(m)) return m;
      return (m as DepartmentGroup).leads ?? [];
    }
    default:
      return [];
  }
}

// ── Main Component ──────────────────────────────────────────
const Team: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('leadership');

  // Fetch from data.json
  useEffect(() => {
    fetch('/data/data.json')
      .then((r) => r.json())
      .then((d) => setTeamData(d.team))
      .catch(console.error);
  }, []);

  // GSAP entrance animation — only once when section enters viewport
  useEffect(() => {
    if (!sectionRef.current || !teamData) return;
    const heading = sectionRef.current.querySelector('.team-heading');
    const tabs = sectionRef.current.querySelector('.team-tabs');

    gsap.fromTo(
      [heading, tabs],
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
      }
    );
  }, [teamData]);

  if (!teamData) return null;

  const deptString = DEPARTMENTS.find(d => d.key === activeTab)?.label || 'Member';
  const members = getDeptMembers(teamData, activeTab).map(m => ({ ...m, department: deptString }));

  return (
    <section ref={sectionRef} id="team" className="relative py-32 overflow-hidden" style={{ background: 'var(--color-bg)' }}>

      {/* Ghost watermark text */}
      <div className="absolute top-10 inset-x-0 text-center pointer-events-none select-none" aria-hidden>
        <span style={{
          fontSize: 'clamp(5rem, 16vw, 14rem)',
          fontFamily: '"Playfair Display", serif',
          fontWeight: 900,
          color: '#fff',
          opacity: 0.018,
          lineHeight: 1,
          display: 'block',
        }}>
          TEAM
        </span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Section Header ──────────────────────────────── */}
        <div className="team-heading mb-12">
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: 'var(--color-muted)', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            03 — People
          </p>
          <h2 style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 700,
            color: '#F0EDE6',
            lineHeight: 1.1,
            maxWidth: '14ch',
          }}>
            Meet the <em style={{ color: '#C8FF47', fontStyle: 'italic' }}>Minds</em> behind the movement
          </h2>
        </div>

        {/* ── Department Filter Tabs ───────────────────────── */}
        <div className="team-tabs flex flex-wrap gap-2 mb-12">
          {DEPARTMENTS.map((dept) => {
            const isActive = activeTab === dept.key;
            const count = getDeptMembers(teamData, dept.key).length;
            if (count === 0) return null; // hide empty departments

            return (
              <button
                key={dept.key}
                onClick={() => setActiveTab(dept.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                style={{
                  fontFamily: 'DM Sans, Inter, sans-serif',
                  background: isActive ? '#C8FF47' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#080808' : 'var(--color-muted)',
                  border: isActive ? '1px solid #C8FF47' : '1px solid rgba(255,255,255,0.08)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                {dept.label}
              </button>
            );
          })}
        </div>

        {/* ── Filtered Member Grid ─────────────────────────── */}
        {/* 
          Mobile: 2 cards per row
          Tablet: 3 cards per row
          Desktop: 4 cards per row (auto-fill)
          Always centered
        */}
        <div
          key={activeTab}
          className="grid gap-4 sm:gap-5 justify-center mx-auto"
          style={{
            gridTemplateColumns: 'repeat(2, minmax(150px, 180px))',
            animation: 'fadeInUp 0.4s ease both',
            maxWidth: 'fit-content',
          }}
        >
          {members.map((member, idx) => (
            <TeamCard3D key={`${member.name}-${idx}`} member={member} />
          ))}
        </div>

        {/* Responsive breakpoints for grid */}
        <style>{`
          @media (min-width: 640px) {
            .grid {
              grid-template-columns: repeat(2, minmax(200px, 220px)) !important;
            }
          }
          @media (min-width: 750px) {
            .grid {
              grid-template-columns: repeat(3, minmax(200px, 240px)) !important;
            }
          }
          @media (min-width: 1024px) {
            .grid {
              grid-template-columns: repeat(4, minmax(220px, 260px)) !important;
            }
          }
        `}</style>

        {/* CSS keyframe for grid entrance */}
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

      </div>
    </section>
  );
};

export default Team;
