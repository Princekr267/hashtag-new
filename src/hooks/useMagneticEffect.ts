import { useRef, useCallback } from 'react'

interface MagneticState {
  handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void
  handleMouseLeave: () => void
  elementRef: React.RefObject<HTMLElement>
}

export function useMagneticEffect(strength: number = 0.3): MagneticState {
  const elementRef = useRef<HTMLElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const element = elementRef.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      element.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    },
    [strength],
  )

  const handleMouseLeave = useCallback(() => {
    const element = elementRef.current
    if (!element) return
    element.style.transform = 'translate(0px, 0px)'
  }, [])

  return { handleMouseMove, handleMouseLeave, elementRef }
}
