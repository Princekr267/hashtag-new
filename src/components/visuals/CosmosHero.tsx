import { useEffect, useRef } from 'react'

export default function CosmosHero(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let W: number, H: number, stars: any[] = []
    let t = 0
    let raf: number

    // Change 6B: animation state
    let mouseX = 0, mouseY = 0
    let rotX = 0, rotY = 0
    let targetRotX = 0, targetRotY = 0
    let scrollY = 0

    const resize = () => {
      W = cv.offsetWidth
      H = cv.offsetHeight
      cv.width = W * devicePixelRatio
      cv.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      
      stars = Array.from({ length: 280 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03
      }))
    }

    // Change 6B — mouse parallax
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Change 6B — scroll reaction
    const onScroll = () => { scrollY = window.scrollY }

    const draw = () => {
      // Change 6B: update rotation targets from mouse
      targetRotX = (mouseX / (W || 1) - 0.5) * 0.4
      targetRotY = (mouseY / (H || 1) - 0.5) * 0.2

      // Lerp current toward target
      rotX += (targetRotX - rotX) * 0.05
      rotY += (targetRotY - rotY) * 0.05

      // Derived offsets for planet/ring position
      const parallaxX = rotX * 40   // subtle left/right shift
      const parallaxY = rotY * 25   // subtle up/down shift

      // Change 6B: scroll-driven opacity (0.8 → 0.2 over first 400px)
      const scrollOpacity = Math.max(0.15, 0.85 - (scrollY / 400) * 0.7)

      // Change 6B: scroll-driven scale (1 → 0.7 over first 400px)
      const scrollScale = Math.max(0.7, 1 - (scrollY / 400) * 0.3)

      // Change 6B: breathing scale
      const breathe = 1 + Math.sin(t * 0.008 * 0.8) * 0.03

      const hueShift = Math.sin(t * 0.008 / 20 * Math.PI * 2) * 15  // ±15 deg

      ctx.clearRect(0, 0, W, H)

      // Global opacity & scale
      ctx.save()
      ctx.globalAlpha = scrollOpacity
      ctx.translate(W / 2, H / 2)
      ctx.scale(scrollScale * breathe, scrollScale * breathe)
      ctx.translate(-W / 2, -H / 2)

      // Star field
      stars.forEach(s => {
        s.twinkle += s.speed
        const alpha = 0.3 + 0.7 * ((Math.sin(s.twinkle) + 1) / 2)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        const b = Math.round(180 + alpha * 75)
        ctx.fillStyle = `rgba(${Math.round(b * 0.7)},${Math.round(b * 0.85)},${b},${alpha})`
        ctx.fill()
      })

      // Planet center with parallax offset
      const cx = W / 2 + parallaxX, cy = H / 2 + 10 + parallaxY, pr = 110

      // Atmosphere glow
      for (let i = 8; i >= 1; i--) {
        ctx.beginPath()
        ctx.arc(cx, cy, pr + i * 16, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${Math.round(14 + hueShift)}, 100, 240, ${0.03 * (9-i)})`
        ctx.lineWidth = 15
        ctx.stroke()
      }
      
      // Planet body — hue-shifted gradient
      const pg = ctx.createRadialGradient(cx - 30, cy - 30, 0, cx, cy, pr)
      pg.addColorStop(0, `hsl(${210 + hueShift}, 60%, 35%)`)
      pg.addColorStop(0.3, `hsl(${220 + hueShift}, 65%, 22%)`)
      pg.addColorStop(0.7, `hsl(${230 + hueShift}, 70%, 10%)`)
      pg.addColorStop(1, '#000000')
      ctx.beginPath()
      ctx.arc(cx, cy, pr, 0, Math.PI * 2)
      ctx.fillStyle = pg
      ctx.fill()

      // Surface lines
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

      // Ring (with parallax)
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

      ctx.restore() // end global opacity/scale

      t++
      raf = requestAnimationFrame(draw)
    }

    resize()
    requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
