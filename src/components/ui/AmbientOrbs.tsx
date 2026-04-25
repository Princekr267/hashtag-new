/**
 * AmbientOrbs — Change 2
 *
 * - Each orb drifts on TWO axes (translateX + translateY) simultaneously
 * - Unique durations per orb: 22s, 38s, 29s, 45s, 33s
 * - Border-radius morphs subtly for organic feel
 * - Opacity raised to 0.20–0.25
 * - Parallax: moves at 30% of scroll speed via --scroll-y CSS var set on :root by App.tsx
 * - SVG noise texture overlay for premium texture (opacity 0.035)
 * - Reduced motion: orbs static, no parallax
 */
export default function AmbientOrbs(): JSX.Element {
  const orbs = [
    {
      id: 1,
      color: '#60a5fa',
      size: '520px',
      top: '-8%', left: '-8%',
      animation: 'orbA 22s ease-in-out infinite',
      opacity: 0.22,
      borderRadius: '50%',
    },
    {
      id: 2,
      color: '#818cf8',
      size: '440px',
      top: '12%', left: '62%',
      animation: 'orbB 38s ease-in-out infinite',
      opacity: 0.20,
      borderRadius: '50%',
    },
    {
      id: 3,
      color: '#38bdf8',
      size: '400px',
      top: '62%', left: '4%',
      animation: 'orbC 29s ease-in-out infinite',
      opacity: 0.20,
      borderRadius: '50%',
    },
    {
      id: 4,
      color: '#60a5fa',
      size: '320px',
      top: '72%', left: '70%',
      animation: 'orbD 45s ease-in-out infinite',
      opacity: 0.18,
      borderRadius: '50%',
    },
    {
      id: 5,
      color: '#818cf8',
      size: '260px',
      top: '38%', left: '42%',
      animation: 'orbE 33s ease-in-out infinite reverse',
      opacity: 0.16,
      borderRadius: '50%',
    },
  ]

  return (
    <>
      {/* Keyframes for X+Y dual-axis drift and border-radius morph */}
      <style>{`
        @keyframes orbA {
          0%,100% { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(0px, 0px); border-radius: 50%; }
          25%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(55px, -35px); border-radius: 60% 40% 40% 60% / 60% 30% 70% 40%; }
          50%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(-25px, 50px); border-radius: 40% 60% 60% 40% / 40% 70% 30% 60%; }
          75%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(40px, 20px); border-radius: 50%; }
        }
        @keyframes orbB {
          0%,100% { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(0px, 0px); border-radius: 50%; }
          33%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(-70px, 30px); border-radius: 45% 55% 55% 45% / 55% 45% 55% 45%; }
          66%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(35px, -55px); border-radius: 60% 40% 40% 60% / 40% 60% 40% 60%; }
        }
        @keyframes orbC {
          0%,100% { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(0px, 0px); border-radius: 50%; }
          40%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(45px, -60px); border-radius: 55% 45% 45% 55% / 45% 55% 45% 55%; }
          80%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(-40px, 35px); border-radius: 50%; }
        }
        @keyframes orbD {
          0%,100% { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(0px, 0px); border-radius: 50%; }
          20%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(80px, -25px); border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%; }
          60%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(-30px, 55px); border-radius: 60% 40% 40% 60% / 40% 60% 40% 60%; }
        }
        @keyframes orbE {
          0%,100% { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(0px, 0px); border-radius: 50%; }
          50%      { transform: translateY(calc(var(--scroll-y,0) * -0.3px)) translate(-50px, -45px); border-radius: 55% 45% 50% 50% / 50% 55% 45% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient-orb { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: -1, isolation: 'isolate' }}
      >
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="ambient-orb"
            style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              borderRadius: orb.borderRadius,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(55px)',
              animation: orb.animation,
              opacity: orb.opacity,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        ))}

        {/* SVG grain/noise texture overlay — premium feel at 0.035 opacity */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.035,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
    </>
  )
}
