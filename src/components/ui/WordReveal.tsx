import { useEffect, useRef } from 'react'

interface WordRevealProps {
  children: string
  className?: string
  staggerMs?: number
  threshold?: number
}

/**
 * Splits text into words, wraps each in a `<span>`,
 * then uses IntersectionObserver to stagger fade-in.
 * Respects `prefers-reduced-motion` — shows all words immediately.
 */
export default function WordReveal({
  children,
  className = '',
  staggerMs = 40,
  threshold = 0.15,
}: WordRevealProps): JSX.Element {
  const containerRef = useRef<HTMLParagraphElement>(null)
  const observed     = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || observed.current) return
    observed.current = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      el.querySelectorAll<HTMLSpanElement>('.word-reveal-span').forEach((span) => {
        span.style.opacity = '1'
        span.style.transform = 'none'
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const spans = el.querySelectorAll<HTMLSpanElement>('.word-reveal-span')
          spans.forEach((span, i) => {
            setTimeout(() => {
              span.style.opacity = '1'
              span.style.transform = 'translateY(0)'
            }, i * staggerMs)
          })
          observer.unobserve(el)
        })
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [staggerMs, threshold])

  const words = children.split(' ')

  return (
    <p ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="word-reveal-span"
          style={{
            display: 'inline-block',
            opacity: 0,
            transform: 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            marginRight: i < words.length - 1 ? '0.3em' : '0',
          }}
        >
          {word}
        </span>
      ))}
    </p>
  )
}
