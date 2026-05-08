import { useEffect, useRef } from 'react'

export default function CosmosHero(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d', { alpha: true })
    if (!ctx) return

    let W = 0, H = 0, stars: any[] = []
    let t = 0
    let raf: number
    // Cache isMobile once — never re-query in draw loop
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const glowSteps = isMobile ? 3 : 5        // reduced from 8→5 on desktop
    const glowRadius = isMobile ? 22 : 16
    const glowAlpha  = isMobile ? 0.05 : 0.03
    const glowWidth  = isMobile ? 20 : 15

    // Mouse / scroll state — updated only by events
    let mouseX = 0, mouseY = 0
    let rotX = 0, rotY = 0
    let targetRotX = 0, targetRotY = 0
    let scrollY = 0

    const resize = () => {
      W = cv.offsetWidth
      H = cv.offsetHeight
      cv.width  = Math.round(W * devicePixelRatio)
      cv.height = Math.round(H * devicePixelRatio)
      ctx.scale(devicePixelRatio, devicePixelRatio)

      // 200 stars on desktop (was 280), 60 on mobile (was 80)
      const starCount = isMobile ? 60 : 200
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.025,  // slightly slower
      }))
      // Center mouse initially
      if (mouseX === 0 && mouseY === 0) {
        mouseX = W / 2
        mouseY = H / 2
      }
    }

    // Throttled mouse — only fire at most once per rAF via a flag
    let pendingMouse = false
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      pendingMouse = true
    }

    const onScroll = () => { scrollY = window.scrollY }

    const draw = () => {
      // Only recalculate rotation when mouse actually moved
      if (pendingMouse) {
        targetRotX = (mouseX / (W || 1) - 0.5) * 0.4
        targetRotY = (mouseY / (H || 1) - 0.5) * 0.2
        pendingMouse = false
      }

      // Skip lerp if already close enough (saves arithmetic when idle)
      const dX = targetRotX - rotX, dY = targetRotY - rotY
      if (Math.abs(dX) > 0.0001) rotX += dX * 0.05
      if (Math.abs(dY) > 0.0001) rotY += dY * 0.05

      const parallaxX = rotX * 40
      const parallaxY = rotY * 25

      const scrollOpacity = Math.max(0.15, 0.85 - (scrollY / 400) * 0.7)
      const scrollScale   = Math.max(0.7,  1    - (scrollY / 400) * 0.3)
      const breathe       = 1 + Math.sin(t * 0.0064) * 0.03
      const hueShift      = Math.sin(t * 0.00126) * 15

      ctx.clearRect(0, 0, W, H)

      ctx.save()
      ctx.globalAlpha = scrollOpacity
      ctx.translate(W / 2, H / 2)
      ctx.scale(scrollScale * breathe, scrollScale * breathe)
      ctx.translate(-W / 2, -H / 2)

      // Star field
      for (let si = 0; si < stars.length; si++) {
        const s = stars[si]
        s.twinkle += s.speed
        const alpha = 0.3 + 0.7 * ((Math.sin(s.twinkle) + 1) / 2)
        const b = 180 + (alpha * 75) | 0
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${(b * 0.7) | 0},${(b * 0.85) | 0},${b},${alpha})`
        ctx.fill()
      }

      // Planet
      const cx = W / 2 + parallaxX, cy = H / 2 + 10 + parallaxY, pr = 110

      // Atmosphere glow (fewer steps cached outside draw)
      for (let i = glowSteps; i >= 1; i--) {
        ctx.beginPath()
        ctx.arc(cx, cy, pr + i * glowRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${(14 + hueShift) | 0},100,240,${glowAlpha * (glowSteps + 1 - i)})`
        ctx.lineWidth = glowWidth
        ctx.stroke()
      }

      // Planet body
      const pg = ctx.createRadialGradient(cx - 30, cy - 30, 0, cx, cy, pr)
      pg.addColorStop(0,   `hsl(${210 + hueShift},60%,35%)`)
      pg.addColorStop(0.3, `hsl(${220 + hueShift},65%,22%)`)
      pg.addColorStop(0.7, `hsl(${230 + hueShift},70%,10%)`)
      pg.addColorStop(1,   '#000')
      ctx.beginPath()
      ctx.arc(cx, cy, pr, 0, Math.PI * 2)
      ctx.fillStyle = pg
      ctx.fill()

      // Surface lines (clipped)
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, pr, 0, Math.PI * 2)
      ctx.clip()
      for (let i = 0; i < 7; i++) {
        const yy = cy - pr + i * (pr * 2 / 6)
        const halfWInRange = pr * pr - (yy - cy) * (yy - cy)
        const halfW = Math.sqrt(Math.max(0, halfWInRange))
        ctx.beginPath()
        ctx.ellipse(cx, yy, halfW * 0.92, halfW * 0.08, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(20,100,255,${0.06 + 0.04 * (i % 3)})`
        ctx.lineWidth = 0.8
        ctx.stroke()
      }
      // Shimmer
      const sg = ctx.createRadialGradient(cx - 45, cy - 45, 0, cx - 20, cy - 20, 75)
      sg.addColorStop(0, 'rgba(100,160,255,0.18)')
      sg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.arc(cx, cy, pr, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Rings
      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(1, 0.22)
      for (let ri = 0; ri < 3; ri++) {
        const r1 = pr + 20 + ri * 18, r2 = pr + 30 + ri * 18
        const rg = ctx.createRadialGradient(0, 0, r1, 0, 0, r2)
        rg.addColorStop(0, `rgba(10,60,180,${0.5 - ri * 0.12})`)
        rg.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(0, 0, r2, 0, Math.PI * 2)
        ctx.arc(0, 0, r1, 0, Math.PI * 2, true)
        ctx.fillStyle = rg
        ctx.fill()
      }
      ctx.restore()

      ctx.restore()

      t++
      raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
