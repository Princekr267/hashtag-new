import { useEffect, useRef, useState } from 'react'

interface CursorState {
  type: 'default' | 'hover' | 'text'
}

export default function CustomCursor(): JSX.Element | null {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [cursorState, setCursorState] = useState<CursorState>({ type: 'default' })
  const [visible, setVisible] = useState(false)

  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const outerX = useRef(0)
  const outerY = useRef(0)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      // Show custom cursor and hide default cursor
      setVisible(true)
      document.documentElement.classList.add('no-cursor')

      mouseX.current = e.clientX
      mouseY.current = e.clientY

      const inner = innerRef.current
      if (inner) {
        inner.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
      }
    }

    const onTouchStart = () => {
      // Hide custom cursor and restore default cursor on touch
      setVisible(false)
      document.documentElement.classList.remove('no-cursor')
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
        outer.style.transform = `translate3d(${outerX.current}px, ${outerY.current}px, 0) translate(-50%, -50%)`
      }
      rafId.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    rafId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('mouseover', onMouseOver)
      document.documentElement.classList.remove('no-cursor')
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  const isHover = cursorState.type === 'hover'
  const isText = cursorState.type === 'text'

  if (!visible) return null

  return (
    <>
      {/* Outer trailing ring */}
      <div
        ref={outerRef}
        className="custom-cursor fixed pointer-events-none z-[99999] top-0 left-0 transition-[width,height,background,border-radius] duration-200 ease-out"
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
        className="custom-cursor fixed pointer-events-none z-[99999] top-0 left-0 rounded-full transition-opacity duration-150"
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
