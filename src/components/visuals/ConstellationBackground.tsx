import { useEffect, useRef } from 'react'

export default function ConstellationBackground(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let W: number, H: number, nodes: any[] = []
    const N = 28
    let raf: number

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      cv.width = W * devicePixelRatio
      cv.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      
      nodes = Array.from({ length: N }, () => ({
        x: 40 + Math.random() * (W - 80),
        y: 20 + Math.random() * (H - 40),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2,
        pulse: Math.random() * Math.PI * 2,
        pspeed: 0.03 + Math.random() * 0.02
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += n.pspeed
        if (n.x < 20 || n.x > W - 20) n.vx *= -1
        if (n.y < 10 || n.y > H - 10) n.vy *= -1
      })

      // Edges
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.5
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
      nodes.forEach(n => {
        const pulse = (Math.sin(n.pulse) + 1) / 2
        // Outer ring
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + 3 + pulse * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(10,60,180,${0.08 + pulse * 0.08})`
        ctx.fill()
        // Core
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${Math.round(80 + pulse * 120)},${Math.round(140 + pulse * 80)},255,${0.7 + pulse * 0.3})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <canvas ref={canvasRef} className="block w-full h-full opacity-40" />
    </div>
  )
}
