import { useEffect, useRef } from 'react'

export default function ConstellationBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    // alpha:false → browser composites solid canvas faster
    const ctx = cv.getContext('2d', { alpha: false })
    if (!ctx) return

    // Cache once — never re-query in draw loop
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const N = isMobile ? 10 : 20  // reduced from 14/28
    const EDGE_DIST = 140
    const EDGE_DIST_SQ = EDGE_DIST * EDGE_DIST
    let W: number, H: number, nodes: any[] = []
    let raf: number
    // Throttle to ~30fps — background effect doesn't need 60fps
    let lastTime = 0
    const INTERVAL = 1000 / 30

    // Shooting star state
    let shootingStar = { x: 0, y: 0, vx: 0, vy: 0, active: false }
    let lastShootingStarTime = performance.now()

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      cv.width  = Math.round(W * devicePixelRatio)
      cv.height = Math.round(H * devicePixelRatio)
      ctx.scale(devicePixelRatio, devicePixelRatio)

      nodes = Array.from({ length: N }, () => ({
        x: 40 + Math.random() * (W - 80),
        y: 20 + Math.random() * (H - 40),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2,
        pulse: Math.random() * Math.PI * 2,
        pspeed: 0.03 + Math.random() * 0.02,
      }))
    }

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw)
      // Skip frames to hold ~30fps
      if (now - lastTime < INTERVAL) return
      lastTime = now

      // Solid black fill (alpha:false context → faster than clearRect)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      for (let k = 0; k < N; k++) {
        const n = nodes[k]
        n.x += n.vx
        n.y += n.vy
        n.pulse += n.pspeed
        if (n.x < 20 || n.x > W - 20) n.vx *= -1
        if (n.y < 10 || n.y > H - 10) n.vy *= -1
      }

      // Edges — squared distance check skips sqrt for most pairs
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dSq = dx * dx + dy * dy
          if (dSq < EDGE_DIST_SQ) {
            const d = Math.sqrt(dSq)
            const alpha = (1 - d / EDGE_DIST) * 0.5
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(20,90,210,${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // Nodes
      for (let k = 0; k < N; k++) {
        const n = nodes[k]
        const pulse = (Math.sin(n.pulse) + 1) / 2
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + 3 + pulse * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(10,60,180,${0.08 + pulse * 0.08})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${(80 + pulse * 120) | 0},${(140 + pulse * 80) | 0},255,${0.7 + pulse * 0.3})`
        ctx.fill()
      }

      // Shooting star logic
      if (!shootingStar.active && now - lastShootingStarTime > 8000 + Math.random() * 4000) {
        shootingStar.active = true
        shootingStar.x = Math.random() * W
        shootingStar.y = 0
        shootingStar.vx = 20 + Math.random() * 15
        shootingStar.vy = 15 + Math.random() * 10
        // Sometimes from right to left
        if (Math.random() > 0.5) {
            shootingStar.x = W
            shootingStar.vx *= -1
        }
      }

      if (shootingStar.active) {
        shootingStar.x += shootingStar.vx
        shootingStar.y += shootingStar.vy
        
        // Draw tail
        const gradient = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y, 
            shootingStar.x - shootingStar.vx * 3, shootingStar.y - shootingStar.vy * 3
        )
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
        gradient.addColorStop(0.2, 'rgba(96, 165, 250, 0.8)')
        gradient.addColorStop(1, 'rgba(96, 165, 250, 0)')
        
        ctx.beginPath()
        ctx.moveTo(shootingStar.x, shootingStar.y)
        ctx.lineTo(shootingStar.x - shootingStar.vx * 4, shootingStar.y - shootingStar.vy * 4)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.stroke()

        if (shootingStar.x < -200 || shootingStar.x > W + 200 || shootingStar.y > H + 200) {
            shootingStar.active = false
            lastShootingStarTime = now
        }
      }
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full opacity-40" />
    </div>
  )
}
