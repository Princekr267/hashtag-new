import { useEffect } from 'react'

export function useSmoothScroll(): void {
  useEffect(() => {
    // Smooth scroll polyfill for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return

      e.preventDefault()
      const id = anchor.getAttribute('href')?.slice(1)
      if (!id) return

      const element = document.getElementById(id)
      if (!element) return

      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
