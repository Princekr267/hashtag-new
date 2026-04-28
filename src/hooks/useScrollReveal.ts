import { useEffect, useRef } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  staggerMs?: number
  rootMargin?: string
}

/**
 * Attach to a container ref — every [data-reveal] child inside it will
 * animate in when it enters the viewport, staggered by `staggerMs`.
 *
 * Also handles .reveal-word spans (for WordReveal component).
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.15, staggerMs = 80, rootMargin = '0px' } = options
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // MOBILE INTERACTION ADDED: Apply Intersection Observer to mobile/tap only elements too
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement

          if (prefersReduced) {
            el.classList.add('reveal-visible')
            el.classList.remove('reveal-hidden')
            observer.unobserve(el)
            return
          }

          // Stagger based on index within siblings
          const siblings = Array.from(el.parentElement?.querySelectorAll('[data-reveal]') ?? [])
          const idx = siblings.indexOf(el)
          const delay = idx * staggerMs

          setTimeout(() => {
            el.classList.add('reveal-visible')
            el.classList.remove('reveal-hidden')
          }, delay)

          observer.unobserve(el)
        })
      },
      { threshold, rootMargin }
    )

    targets.forEach((el) => {
      el.classList.add('reveal-hidden')
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [threshold, staggerMs, rootMargin])

  return containerRef
}
