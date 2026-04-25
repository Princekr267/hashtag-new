import { useRef, useEffect } from 'react'
import { useCountdown } from '../../hooks/useCountdown'

interface CountdownTimerProps {
  targetDate: Date | string
  label?: string
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/**
 * Monospace countdown display: DD : HH : MM : SS
 * The seconds digit pulses on each tick.
 * Respects reduced-motion by removing the pulse animation.
 */
export default function CountdownTimer({ targetDate, label }: CountdownTimerProps): JSX.Element {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate)
  const secRef = useRef<HTMLSpanElement>(null)
  const prevSec = useRef<number>(-1)

  // Trigger pulse animation on seconds change
  useEffect(() => {
    const el = secRef.current
    if (!el || seconds === prevSec.current) return
    prevSec.current = seconds

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    el.classList.remove('countdown-pulse')
    // Force reflow
    void el.offsetWidth
    el.classList.add('countdown-pulse')
  }, [seconds])

  if (isExpired) {
    return (
      <div className="font-mono-custom text-text-faint text-sm tracking-widest">
        EVENT STARTED
      </div>
    )
  }

  const segments = [
    { value: pad(days),    unit: 'DD' },
    { value: pad(hours),   unit: 'HH' },
    { value: pad(minutes), unit: 'MM' },
    { value: pad(seconds), unit: 'SS', ref: secRef },
  ]

  return (
    <div>
      {label && (
        <p className="text-xs font-label tracking-[0.3em] text-text-faint uppercase mb-3">
          {label}
        </p>
      )}
      <div className="flex items-center gap-1">
        {segments.map(({ value, unit, ref }, i) => (
          <div key={unit} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span
                ref={ref}
                className="font-mono-custom text-2xl md:text-3xl font-bold text-primary tabular-nums countdown-digit"
              >
                {value}
              </span>
              <span className="text-[9px] font-label tracking-[0.2em] text-text-faint mt-0.5">
                {unit}
              </span>
            </div>
            {i < segments.length - 1 && (
              <span className="font-mono-custom text-xl text-primary/40 mb-4 mx-0.5">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
