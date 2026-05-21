import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ArrowDown } from 'lucide-react';
import ParticleField from './ParticleField';
import ConstellationBackground from '../visuals/ConstellationBackground';
import { animateSplitText, isReducedMotion } from '../../utils/animations';
import { motion } from 'framer-motion';

interface HeroData {
  headline: string;
  subheadline: string;
  cta_primary: string;
  cta_secondary: string;
}

interface SocietyData {
  name: string;
  tagline: string;
}

const Hero: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [heroData, setHeroData] = React.useState<HeroData | null>(null);
  const [society, setSociety] = React.useState<SocietyData | null>(null);

  useEffect(() => {
    fetch('/data/data.json')
      .then((r) => r.json())
      .then((d) => {
        setHeroData(d.hero);
        setSociety(d.society);
      });
  }, []);

  useEffect(() => {
    if (heroData && headlineRef.current) {
      animateSplitText(headlineRef as any, { stagger: 0.03, delay: 0.3 });
    }
  }, [heroData]);

  const [isMobile, setIsMobile] = React.useState(typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const particleCount = isMobile ? 600 : 1500;

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── 3D Background Canvas ────────────────────────────────── */}
      <div className="absolute inset-0 z-0" style={{ background: 'var(--color-bg)' }}>
        {!isReducedMotion() && (
          <React.Suspense fallback={<div className="absolute inset-0" style={{ background: 'var(--color-bg)' }} />}>
            {isMobile ? (
              <ConstellationBackground />
            ) : (
              <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                dpr={[1, 1.5]} // Performance: cap at 1.5, not 2
                className="pointer-events-none"
                gl={{ antialias: false, alpha: true }}
              >
                <ParticleField count={particleCount} />
              </Canvas>
            )}
          </React.Suspense>
        )}
        {/* Radial vignette to blend edges */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, var(--color-bg) 100%)',
            opacity: 0.9,
          }}
        />
        {/* Bottom gradient fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg))' }}
        />
      </div>

      {/* ── Foreground Content ────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-20">

        {/* Society badge */}
        {society && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{
              background: 'rgba(96, 165, 250, 0.07)',
              borderColor: 'rgba(96, 165, 250, 0.2)',
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              color: 'var(--primary)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--primary)' }}
            />
            {society.name} — {society.tagline}
          </motion.div>
        )}

        {/* GSAP split-text headline */}
        <h1
          ref={headlineRef}
          className="mb-6 font-bold leading-none tracking-tight"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.8rem, 8vw, 7rem)',
            color: '#F0EDE6',
            maxWidth: '14ch',
          }}
        >
          {heroData?.headline ?? 'Build. Ship. Repeat.'}
        </h1>

        {/* Sub-headline — geometric sans for contrast against serif headline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mb-10 max-w-2xl leading-relaxed"
          style={{
            fontFamily: 'DM Sans, Inter, sans-serif',
            fontSize: '1.1rem',
            color: 'var(--color-muted)',
          }}
        >
          {heroData?.subheadline ?? 'A technical society powered by curiosity, caffeine, and code.'}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="https://forms.gle/YOUR_APPLICATION_LINK"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-full transition-all duration-300"
            style={{
              background: 'var(--primary)',
              color: '#080808',
              fontFamily: 'DM Sans, sans-serif',
              boxShadow: '0 0 0 0 rgba(96,165,250,0)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(96,165,250,0.3)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 rgba(96,165,250,0)';
              (e.currentTarget as HTMLElement).style.transform = '';
            }}
          >
            {heroData?.cta_primary ?? 'Join Us'}
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="/projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-medium rounded-full border transition-all duration-300"
            style={{
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#F0EDE6',
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(96,165,250,0.3)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(96,165,250,0.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLElement).style.background = '';
            }}
          >
            {heroData?.cta_secondary ?? 'Learn More'}
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ color: 'var(--color-muted)' }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12"
          style={{ background: 'linear-gradient(to bottom, var(--primary), transparent)' }}
        />
        <span
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.6
          }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
