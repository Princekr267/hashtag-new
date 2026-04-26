import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

// Detect touch-primary devices — on these we skip Lenis and use native scroll
const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)

export function useSmoothScroll(): void {
  const { pathname } = useLocation()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Skip Lenis on touch/mobile — native scroll is better there
    if (isTouchDevice()) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      e.preventDefault()
      const id = anchor.getAttribute('href')?.slice(1)
      if (!id) return

      const element = document.getElementById(id)
      if (!element) return

      lenis.scrollTo(element, { offset: -50 })
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Reset scroll on route change
  useEffect(() => {
    if (!lenisRef.current) return

    // Stop Lenis to halt any ongoing momentum
    lenisRef.current.stop()

    // Immediate jump
    lenisRef.current.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)

    // Wait a tiny frame for React to mount new route, then restart Lenis
    const timer = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
        lenisRef.current.start()
      }
      window.scrollTo(0, 0)
    }, 50)

    return () => {
      clearTimeout(timer)
      if (lenisRef.current) lenisRef.current.start()
    }
  }, [pathname])
}
