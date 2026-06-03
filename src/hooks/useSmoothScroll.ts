import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Detect touch-primary devices — on these we skip Lenis and use native scroll
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  )
}

export function useSmoothScroll(): void {
  const { pathname } = useLocation()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Only set scrollRestoration to manual if Lenis is active
    // Otherwise keep it 'auto' so native scroll works as expected
    const isTouch = isTouchDevice()

    if (!isTouch && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Skip Lenis on touch/mobile — native scroll is better there
    if (isTouch) {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    // Sync Lenis scroll updates with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    // Align Lenis rendering cycles with GSAP ticker loop
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

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

    const handleGalleryHijack = (event: Event) => {
      const customEvent = event as CustomEvent<{ active?: boolean }>
      const active = Boolean(customEvent.detail?.active)
      if (active) {
        lenis.stop()
      } else {
        lenis.start()
      }
    }

    const onRevealed = () => {
      // Small delay to allow DOM to settle
      setTimeout(() => lenis.resize(), 100)
    }

    document.addEventListener('click', handleClick)
    window.addEventListener('horizontal-gallery-hijack', handleGalleryHijack as EventListener)
    window.addEventListener('site-revealed', onRevealed)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('horizontal-gallery-hijack', handleGalleryHijack as EventListener)
      window.removeEventListener('site-revealed', onRevealed)
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Reset scroll on route change
  useEffect(() => {
    // If Lenis is active, use it to reset
    if (lenisRef.current) {
      lenisRef.current.stop()
      lenisRef.current.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)

      const timer = setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true })
          lenisRef.current.start()
        }
        window.scrollTo(0, 0)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      // Native scroll reset for mobile
      window.scrollTo(0, 0)
      // Extra safety for some mobile browsers
      const timer = setTimeout(() => window.scrollTo(0, 0), 10)
      return () => clearTimeout(timer)
    }
  }, [pathname])
}

