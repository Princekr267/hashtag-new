import { type ReactNode } from 'react'

interface FlipCardProps {
  front: ReactNode
  back: ReactNode
  className?: string
  /** Height CSS string, e.g. '280px'. Needed because flip requires explicit height. */
  height?: string
}

/**
 * CSS 3D perspective flip card.
 * Front: shown by default. Back: revealed on hover.
 * Respects reduced-motion: disables rotation, just crossfades.
 */
export default function FlipCard({
  front,
  back,
  className = '',
  height = '280px',
}: FlipCardProps): JSX.Element {
  return (
    <div
      className={`flip-card-root group ${className}`}
      style={{ height, perspective: '800px' }}
    >
      <div
        className="flip-card-inner"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Front face */}
        <div
          className="flip-card-front"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          {front}
        </div>

        {/* Back face */}
        <div
          className="flip-card-back"
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>

      <style>{`
        .flip-card-root:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .flip-card-root:hover .flip-card-inner {
            transform: none;
          }
          .flip-card-root:hover .flip-card-front {
            opacity: 0;
          }
          .flip-card-root:hover .flip-card-back {
            opacity: 1 !important;
            transform: none !important;
          }
          .flip-card-back {
            opacity: 0;
            transition: opacity 0.3s ease;
            transform: none !important;
            backface-visibility: visible !important;
          }
          .flip-card-front {
            transition: opacity 0.3s ease;
          }
          .flip-card-inner {
            transform-style: flat !important;
          }
        }
      `}</style>
    </div>
  )
}
