import { useEffect, useRef } from 'react'

export default function WarpSpeed(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    let W: number, H: number, streaks: any[] = []
    let raf: number

    const mkStreak = (w: number, h: number) => {
      const a = Math.random() * Math.PI * 2
      const d = 5 + Math.random() * 80
      return {
        x: w / 2 + Math.cos(a) * d,
        y: h / 2 + Math.sin(a) * d,
        a,
        speed: 2 + Math.random() * 5,
        len: 20 + Math.random() * 60,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        bright: 0.4 + Math.random() * 0.6
      }
    }

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      cv.width = W * devicePixelRatio
      cv.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      
      streaks = Array.from({ length: 120 }, () => {
        const s = mkStreak(W, H)
        s.life = Math.random() * s.maxLife
        return s
      })
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(0, 0, W, H)
      
      streaks.forEach((s, i) => {
        s.life++
        const prog = s.life / s.maxLife
        const spd = s.speed * (0.5 + prog * 1.5)
        
        s.x += Math.cos(s.a) * spd
        s.y += Math.sin(s.a) * spd
        
        const tailLen = s.len * prog
        const tx = s.x - Math.cos(s.a) * tailLen
        const ty = s.y - Math.sin(s.a) * tailLen
        const alpha = s.bright * (1 - prog * 0.3)
        
        const gr = ctx.createLinearGradient(tx, ty, s.x, s.y)
        gr.addColorStop(0, 'rgba(0,30,120,0)')
        gr.addColorStop(0.6, `rgba(20,90,220,${alpha * 0.5})`)
        gr.addColorStop(1, `rgba(140,200,255,${alpha})`)
        
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = gr
        ctx.lineWidth = 0.8 + prog * 0.8
        ctx.stroke()
        
        if (s.life >= s.maxLife || s.x < 0 || s.x > W || s.y < 0 || s.y > H) {
          streaks[i] = mkStreak(W, H)
        }
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
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
