import { useEffect, useRef, useState } from 'react'

interface CursorState {
  type: 'default' | 'hover' | 'text'
}

export default function CustomCursor(): JSX.Element | null {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [cursorState, setCursorState] = useState<CursorState>({ type: 'default' })
  const [isTouch, setIsTouch] = useState(false)

  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const outerX = useRef(0)
  const outerY = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    setIsTouch(isTouchDevice)

    if (isTouchDevice) return

    const onMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX
      mouseY.current = e.clientY

      const inner = innerRef.current
      if (inner) {
        inner.style.left = `${e.clientX}px`
        inner.style.top = `${e.clientY}px`
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('[data-cursor]') !== null
      ) {
        setCursorState({ type: 'hover' })
      } else if (
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2'
      ) {
        setCursorState({ type: 'text' })
      } else {
        setCursorState({ type: 'default' })
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      outerX.current = lerp(outerX.current, mouseX.current, 0.12)
      outerY.current = lerp(outerY.current, mouseY.current, 0.12)

      const outer = outerRef.current
      if (outer) {
        outer.style.left = `${outerX.current}px`
        outer.style.top = `${outerY.current}px`
      }
      rafId.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    rafId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  const isHover = cursorState.type === 'hover'
  const isText = cursorState.type === 'text'

  if (isTouch) return null

  return (
    <>
      {/* Outer trailing ring */}
      <div
        ref={outerRef}
        className="custom-cursor fixed pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background,border-radius] duration-200 ease-out"
        style={{
          width: isHover ? '56px' : isText ? '40px' : '28px',
          height: isHover ? '56px' : isText ? '6px' : '28px',
          borderRadius: isText ? '2px' : '50%',
          border: `1px solid ${isHover ? 'rgba(96,165,250,0.7)' : 'rgba(96,165,250,0.45)'}`,
          background: isHover ? 'rgba(96,165,250,0.10)' : 'transparent',
          willChange: 'transform',
        }}
      />
      {/* Inner precise dot */}
      <div
        ref={innerRef}
        className="custom-cursor fixed pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-150"
        style={{
          width: '5px',
          height: '5px',
          background: '#818cf8',
          opacity: isHover ? 0 : 1,
          willChange: 'transform',
        }}
      />
    </>
  )
}
