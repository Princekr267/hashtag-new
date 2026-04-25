import { useState, useEffect } from 'react'

export interface CountdownValues {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

function getTimeLeft(target: Date): CountdownValues {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days:    Math.floor(totalSeconds / 86400),
    hours:   Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isExpired: false,
  }
}

/**
 * Live countdown to a target date. Updates every second.
 * Returns { days, hours, minutes, seconds, isExpired }.
 */
export function useCountdown(targetDate: Date | string): CountdownValues {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate

  const [values, setValues] = useState<CountdownValues>(() => getTimeLeft(target))

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(getTimeLeft(target))
    }, 1000)
    return () => clearInterval(interval)
  }, [target.getTime()])

  return values
}
