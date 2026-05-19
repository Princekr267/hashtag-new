import { useEffect, useRef } from 'react'

export default function OrbitalRings(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let W: number, H: number
    let raf: number

    const orbits = [
      { r: 42, tilt: 0.2, speed: 0.022, dotR: 4, color: [160, 210, 255], dotCount: 1 },
      { r: 68, tilt: 0.45, speed: -0.014, dotR: 3, color: [100, 180, 255], dotCount: 2 },
      { r: 100, tilt: 0.7, speed: 0.009, dotR: 3.5, color: [60, 130, 240], dotCount: 3 },
    ]
    const orbitAngles = orbits.map(() => Math.random() * Math.PI * 2)
    let t = 0

    const resize = () => {
      const parent = cv.parentElement
      if (!parent) return
      W = parent.clientWidth
      H = parent.clientHeight
      cv.width = W * devicePixelRatio
      cv.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2

      // Central sphere
      const cg = ctx.createRadialGradient(cx - 15, cy - 15, 2, cx, cy, 38)
      cg.addColorStop(0, '#7bbfff')
      cg.addColorStop(0.4, '#2a70d0')
      cg.addColorStop(1, '#000000')
      ctx.beginPath()
      ctx.arc(cx, cy, 38, 0, Math.PI * 2)
      ctx.fillStyle = cg
      ctx.fill()
      
      // Specular
      const sg = ctx.createRadialGradient(cx - 14, cy - 14, 1, cx - 10, cy - 10, 18)
      sg.addColorStop(0, 'rgba(180,220,255,0.4)')
      sg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.arc(cx, cy, 38, 0, Math.PI * 2)
      ctx.fill()

      orbits.forEach((o, oi) => {
        orbitAngles[oi] += o.speed
        const scaleY = Math.abs(Math.sin(o.tilt + t * 0.002)) * 0.35 + 0.18

        // Orbit path
        ctx.beginPath()
        ctx.ellipse(cx, cy, o.r, o.r * scaleY, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${o.color[0]},${o.color[1]},${o.color[2]},0.35)`
        ctx.lineWidth = 1.0
        ctx.stroke()

        // Dots and trails
        for (let d = 0; d < o.dotCount; d++) {
          const ang = orbitAngles[oi] + d * (Math.PI * 2 / o.dotCount)
          const dx = cx + Math.cos(ang) * o.r
          const dy = cy + Math.sin(ang) * o.r * scaleY
          const depth = (Math.sin(ang) + 1) / 2

          for (let tr = 1; tr <= 8; tr++) {
            const ta = ang - tr * 0.12
            const tdx = cx + Math.cos(ta) * o.r
            const tdy = cy + Math.sin(ta) * o.r * scaleY
            ctx.beginPath()
            ctx.arc(tdx, tdy, o.dotR * (0.3 + depth * 0.3) * (1 - tr / 9), 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${o.color[0]},${o.color[1]},${o.color[2]},${(1 - tr / 9) * 0.3 * depth})`
            ctx.fill()
          }
          
          ctx.beginPath()
          ctx.arc(dx, dy, o.dotR * (0.5 + depth * 0.7), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${Math.round(o.color[0] * 0.5 + 128 * depth)},${Math.round(o.color[1] * 0.5 + 100 * depth)},255,${0.5 + depth * 0.5})`
          ctx.fill()
        }
      })

      t++
      if (isVisible) {
        raf = requestAnimationFrame(draw)
      }
    }

    resize()

    // Intersection Observer to pause/resume loop
    let isVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting
          if (isVisible) {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(draw)
          } else {
            cancelAnimationFrame(raf)
          }
        })
      },
      { threshold: 0 }
    )
    observer.observe(cv)

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
