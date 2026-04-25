import { useEffect, useRef } from 'react'

/**
 * Tracks mouse position over a container and sets CSS variables
 * `--mouse-x` and `--mouse-y` (in px) on that container element.
 *
 * Cards inside can use these variables to render a spotlight effect via
 * radial-gradient in their ::before pseudo-element.
 */
export function useCursorSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return
    // Respect reduced motion — still show but disable glow if reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--mouse-x', `${x}px`)
      el.style.setProperty('--mouse-y', `${y}px`)
    }

    const onMouseLeave = () => {
      el.style.setProperty('--mouse-x', '-999px')
      el.style.setProperty('--mouse-y', '-999px')
    }

    el.addEventListener('mousemove', onMouseMove, { passive: true })
    el.addEventListener('mouseleave', onMouseLeave, { passive: true })

    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return containerRef
}
