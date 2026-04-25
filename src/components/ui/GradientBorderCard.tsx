import { type ReactNode } from 'react'

interface GradientBorderCardProps {
  children: ReactNode
  className?: string
  borderRadius?: string
  /** Animation duration for border spin (default: 4s) */
  duration?: string
  /** Gradient colors override */
  colors?: string
  /** Padding of the border (default: 2px) */
  borderWidth?: number
}

/**
 * Wraps children in a rotating conic-gradient animated border.
 * Uses a pseudo-element technique: outer div has the gradient background,
 * inner div sits on top with the card's own background.
 *
 * Reduced motion: border is static (no spin animation).
 */
export default function GradientBorderCard({
  children,
  className = '',
  borderRadius = '20px',
  duration = '4s',
  colors = '60a5fa, 818cf8, 38bdf8, 60a5fa',
  borderWidth = 2,
}: GradientBorderCardProps): JSX.Element {
  return (
    <div
      className={`gradient-border-card ${className}`}
      style={{
        position: 'relative',
        borderRadius,
        padding: `${borderWidth}px`,
        background: `conic-gradient(from 0deg, #${colors})`,
        '--gbc-duration': duration,
      } as React.CSSProperties}
    >
      {/* Spinning gradient overlay */}
      <div
        className="gradient-border-spin"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `conic-gradient(from 0deg, #${colors})`,
          animation: `gradientBorderSpin ${duration} linear infinite`,
          zIndex: 0,
        }}
      />
      {/* Inner card content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes gradientBorderSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .gradient-border-spin {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
