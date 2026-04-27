import { type ReactNode, useState } from 'react'

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
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div
      className={`flip-card-root group cursor-pointer sm:cursor-default ${isFlipped ? 'flipped-root' : ''} ${className}`}
      style={{ height, perspective: '800px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
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
            zIndex: 2, // Ensure front face stays above backface normally
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
            zIndex: 1, // Start behind front face
          }}
        >
          {back}
        </div>
      </div>

      <style>{`
        /* MOBILE INTERACTION ADDED: Separate desktop hover */
        @media (hover: hover) and (pointer: fine) {
          .flip-card-root:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
          .flip-card-root:hover .flip-card-front {
            z-index: 1; /* Drop behind */
          }
          .flip-card-root:hover .flip-card-back {
            z-index: 2; /* Bring to front to fix iOS click-through bug */
          }
        }
        
        .flip-card-inner.flipped { transform: rotateY(180deg); }
        .flip-card-root.flipped-root .flip-card-front { z-index: 1; }
        .flip-card-root.flipped-root .flip-card-back { z-index: 2; }
        
        /* Fix the :active state wiping out the rotation on mobile! */
        .flip-card-root:not(.flipped-root):active .flip-card-inner { transform: scale(0.97); }
        .flip-card-root.flipped-root:active .flip-card-inner { transform: rotateY(180deg) scale(0.97); }

        @media (prefers-reduced-motion: reduce) {
          @media (hover: hover) and (pointer: fine) {
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
          }
          .flip-card-inner.flipped { transform: none; }
          .flip-card-root.flipped-root .flip-card-front { opacity: 0; }
          .flip-card-root.flipped-root .flip-card-back { opacity: 1 !important; }

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
