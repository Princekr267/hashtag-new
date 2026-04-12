import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
//  AnimatedBackground — full-screen canvas particle field
//
//  Particle types: dots, crosses (+), small squares
//  Behaviours:
//    · Ambient drift - every particle floats slowly
//    · Mouse repulsion - particles flee the cursor
//    · Linked grid edges between nearby particles
//    · 3 ambient glow orbs that wander
// ─────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  baseAlpha: number
  type: 'dot' | 'cross' | 'square'
  color: string
  phase: number
}

interface Orb { x: number; y: number; vx: number; vy: number; r: number; color: string }

export default function AnimatedBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    let W = 0, H = 0
    const mouse = { x: -9999, y: -9999 }

    const COLORS = ['96,165,250', '129,140,248', '56,189,248']
    const NUM    = Math.min(100, Math.floor(window.innerWidth * 0.06))

    let particles: Particle[] = []
    let orbs: Orb[] = []

    const init = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W * devicePixelRatio
      canvas.height = H * devicePixelRatio
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.scale(devicePixelRatio, devicePixelRatio)

      const types: Particle['type'][] = ['dot', 'dot', 'dot', 'cross', 'square']

      particles = Array.from({ length: NUM }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: 1 + Math.random() * 2.5,
        baseAlpha: 0.15 + Math.random() * 0.35,
        type: types[Math.floor(Math.random() * types.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      }))

      orbs = [
        { x: W * 0.2, y: H * 0.3, vx: 0.18, vy: 0.12, r: 300, color: '96,165,250' },
        { x: W * 0.8, y: H * 0.6, vx: -0.14, vy: 0.09, r: 240, color: '129,140,248' },
        { x: W * 0.5, y: H * 0.8, vx: 0.10, vy: -0.16, r: 280, color: '56,189,248' },
      ]
    }

    let t = 0
    let raf = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.008

      // ── Ambient orbs ──────────────────────────────────────
      orbs.forEach((orb) => {
        orb.x += orb.vx
        orb.y += orb.vy
        if (orb.x < -orb.r || orb.x > W + orb.r) orb.vx *= -1
        if (orb.y < -orb.r || orb.y > H + orb.r) orb.vy *= -1

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r)
        g.addColorStop(0,    `rgba(${orb.color},0.04)`)
        g.addColorStop(0.5,  `rgba(${orb.color},0.015)`)
        g.addColorStop(1,    'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── Particles ─────────────────────────────────────────
      particles.forEach((p) => {
        // drift
        p.x += p.vx + Math.sin(t + p.phase) * 0.08
        p.y += p.vy + Math.cos(t + p.phase * 0.7) * 0.06

        // bounce
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > W) { p.x = W; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > H) { p.y = H; p.vy *= -1 }

        // mouse repulsion
        const dx  = p.x - mouse.x
        const dy  = p.y - mouse.y
        const d2  = dx * dx + dy * dy
        const REP = 9000
        if (d2 < REP) {
          const f = (1 - d2 / REP) * 0.8
          p.vx += dx / Math.sqrt(d2 + 1) * f
          p.vy += dy / Math.sqrt(d2 + 1) * f
        }

        // speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > 1.5) { p.vx /= speed; p.vy /= speed }

        // pulsing alpha
        const alpha = p.baseAlpha * (0.7 + 0.3 * Math.sin(t * 1.5 + p.phase))

        ctx.globalAlpha = alpha
        ctx.fillStyle   = `rgb(${p.color})`

        if (p.type === 'dot') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === 'cross') {
          const s = p.size * 2.5
          ctx.lineWidth   = 0.8
          ctx.strokeStyle = `rgb(${p.color})`
          ctx.beginPath()
          ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y)
          ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s)
          ctx.stroke()
        } else {
          const s = p.size * 1.8
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s)
        }

        ctx.globalAlpha = 1
      })

      // ── Connection edges ──────────────────────────────────
      const LINK_DIST = 130
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a  = particles[i]
          const b  = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.12
            ctx.globalAlpha = alpha
            ctx.strokeStyle = `rgb(${a.color})`
            ctx.lineWidth   = 0.5
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onResize = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); init() }

    init()
    draw()
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'var(--bg-base)' }}
    />
  )
}
