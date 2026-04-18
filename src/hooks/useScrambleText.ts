import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>/'

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

interface UseScrambleTextOptions {
  /** Number of random iterations per character before settling */
  iterations?: number
  /** Delay between each character starting its scramble (ms) */
  staggerMs?: number
  /** Initial delay before scramble begins (ms) */
  initialDelay?: number
}

/**
 * Scrambles each character through random ASCII chars before settling on the real letter.
 * Respects `prefers-reduced-motion` — returns the final text immediately if set.
 */
export function useScrambleText(text: string, options: UseScrambleTextOptions = {}) {
  const { iterations = 8, staggerMs = 30, initialDelay = 300 } = options
  const [displayText, setDisplayText] = useState(() => {
    // Non-animated fallback: show final text immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return text
    }
    // Fill with spaces to avoid layout shift
    return text.replace(/[^\s]/g, ' ')
  })
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayText(text)
      return
    }

    const chars = text.split('')
    // Track how many iterations each char has done
    const iterCount = chars.map(() => 0)
    const settled = chars.map((c) => c === ' ') // spaces settle immediately

    let allSettled = false
    let animFrame: number

    const tick = () => {
      if (allSettled) return

      setDisplayText(() => {
        return chars
          .map((realChar, i) => {
            if (settled[i]) return realChar
            return randomChar()
          })
          .join('')
      })

      // Advance iterations per char based on stagger
      chars.forEach((realChar, i) => {
        if (settled[i] || realChar === ' ') return
        // Start character scramble only after its stagger delay
        const charDelay = i * staggerMs
        // We use a simple counter approach: each tick advances by ~16ms
        // So we simulate stagger via iterCount
        if (iterCount[i] < charDelay / 16) {
          iterCount[i]++
          return
        }
        iterCount[i]++
        if (iterCount[i] >= (charDelay / 16) + iterations * 2) {
          settled[i] = true
        }
      })

      allSettled = settled.every(Boolean)
      if (!allSettled) {
        animFrame = requestAnimationFrame(tick)
      } else {
        setDisplayText(text)
      }
    }

    const timer = setTimeout(() => {
      animFrame = requestAnimationFrame(tick)
    }, initialDelay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animFrame)
    }
  }, [text, iterations, staggerMs, initialDelay])

  return displayText
}
