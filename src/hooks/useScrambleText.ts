import { useState, useEffect, useCallback } from 'react'

const glyphs = 'ABCDE FGHIJKLMNOPQRSTUVWXYZ 0123456789 <>/#%!@[]{}*+='

export function useScrambleText(text: string, duration: number = 2, delay: number = 0) {
  const [output, setOutput] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const scramble = useCallback(() => {
    let frame = 0
    const totalFrames = duration * 60
    setIsAnimating(true)

    const tick = () => {
      frame++
      const progress = frame / totalFrames

      if (progress < 1) {
        const current = text.split('').map((char, index) => {
          if (char === ' ') return char
          if (progress > index / text.length) return char
          return glyphs[Math.floor(Math.random() * glyphs.length)]
        }).join('')

        setOutput(current)
        requestAnimationFrame(tick)
      } else {
        setOutput(text)
        setIsAnimating(false)
      }
    }

    const delayTimeout = setTimeout(() => {
      requestAnimationFrame(tick)
    }, delay * 1000)

    return () => clearTimeout(delayTimeout)
  }, [text, duration, delay])

  useEffect(() => {
    return scramble()
  }, [scramble])

  return { output, isAnimating }
}
