import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
//  GyroOrb — Clean modern futuristic 3D element
//
//  Design: Gyroscope / orbital ring system
//   · 3 rings tilted on different axes, each rotating
//   · Central glowing sphere with atmospheric haze
//   · Mouse causes subtle tilt of the whole system
//   · Constellation star dots on rings
//   · Soft horizon line glow
// ─────────────────────────────────────────────────────────────

type Vec3 = [number, number, number]

const rotX = (v: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a)
  return [v[0], c * v[1] - s * v[2], s * v[1] + c * v[2]]
}

const rotY = (v: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a)
  return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]]
}

const rotZ = (v: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a)
  return [c * v[0] - s * v[1], s * v[0] + c * v[1], v[2]]
}

const project = (v: Vec3, W: number, H: number, fov = 700): [number, number, number] => {
  const z = v[2] + fov
  const s = fov / z
  return [v[0] * s + W / 2, v[1] * s + H / 2, z]
}

export default function GyroOrb(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const mouseRef  = useRef({ x: 0.5, y: 0.5 })
  const animRef   = useRef<number>(0)
  const tRef      = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current!
    const wrap   = wrapRef.current!
    const ctx    = canvas.getContext('2d')!

    const setSize = () => {
      const W = wrap.clientWidth
      const H = wrap.clientHeight
      canvas.width  = W * devicePixelRatio
      canvas.height = H * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
    }
    setSize()

    const SEGS  = 128  // ring smoothness
    const mkRing = (r: number) =>
      Array.from({ length: SEGS }, (_, i) => {
        const a = (i / SEGS) * Math.PI * 2
        return [r * Math.cos(a), r * Math.sin(a), 0] as Vec3
      })

    // Star markers on each ring
    const STAR_COUNT = 12
    const mkStars = (r: number) =>
      Array.from({ length: STAR_COUNT }, (_, i) => {
        const a = (i / STAR_COUNT) * Math.PI * 2
        return [r * Math.cos(a), r * Math.sin(a), 0] as Vec3
      })

    const draw = () => {
      const W = canvas.width  / devicePixelRatio
      const H = canvas.height / devicePixelRatio
      const t = tRef.current

      ctx.clearRect(0, 0, W, H)

      // Mouse -> subtle whole-system tilt
      const mx = mouseRef.current.x  // 0-1
      const my = mouseRef.current.y
      const tiltX = (my - 0.5) * 0.35
      const tiltY = (mx - 0.5) * 0.45

      // Ring definitions: radius, tilt preset, rotation speed, colour
      const rings = [
        { r: 155, tilt: [0, 0, 0],                       speed: 0.28, color: [96, 165, 250],  alpha: 0.9,  lw: 1.5 },  // blue
        { r: 115, tilt: [Math.PI / 2.6, 0, 0],           speed: -0.18, color: [129, 140, 248], alpha: 0.80, lw: 1.1 }, // indigo
        { r: 90,  tilt: [Math.PI / 4, Math.PI / 3.5, 0], speed: 0.40, color: [56, 189, 248],  alpha: 0.70, lw: 0.9 },  // sky
      ]

      rings.forEach(({ r, tilt, speed, color, alpha, lw }) => {
        const pts   = mkRing(r)
        const stars = mkStars(r)
        const rot   = t * speed

        // Transform each point: ring tilt + time rotation + mouse tilt
        const xfm = (v: Vec3): [number, number, number] => {
          let p = rotZ(v, tilt[2])
          p = rotX(p, tilt[0])
          p = rotY(p, tilt[1])
          p = rotZ(p, rot)
          p = rotX(p, tiltX)
          p = rotY(p, tiltY)
          return project(p, W, H)
        }

        const projected = pts.map(xfm)

        // Depth-based stroke: back half dimmer, front brighter
        ctx.lineWidth = lw

        for (let i = 0; i < SEGS; i++) {
          const [ax, ay, az] = projected[i]
          const [bx, by]     = projected[(i + 1) % SEGS]
          // depth: az ranges roughly fov/2..fov*1.5
          const depth  = Math.max(0, Math.min(1, (az - 400) / 600))
          const segAlpha = alpha * (0.18 + 0.82 * depth)

          ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${segAlpha})`
          ctx.shadowBlur  = depth > 0.7 ? 10 : 0
          ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},0.6)`
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(bx, by)
          ctx.stroke()
        }
        ctx.shadowBlur = 0

        // Stars on ring
        stars.forEach((sv) => {
          const [sx, sy, sz] = xfm(sv)
          const depth  = Math.max(0, Math.min(1, (sz - 400) / 600))
          const starAlpha = 0.2 + 0.8 * depth
          const starSize  = 1.5 + depth * 2

          ctx.beginPath()
          ctx.arc(sx, sy, starSize * 0.5, 0, Math.PI * 2)
          ctx.fillStyle   = `rgba(${color[0]},${color[1]},${color[2]},${starAlpha})`
          ctx.shadowBlur  = depth > 0.6 ? 12 : 4
          ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},0.9)`
          ctx.fill()
          ctx.shadowBlur = 0
        })
      })

      // ── Central core sphere ────────────────────────────────
      const cx = W / 2, cy = H / 2
      const pulse = 1 + 0.04 * Math.sin(t * 2.1)

      // Outer atmospheric haze
      const haze = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60 * pulse)
      haze.addColorStop(0,   'rgba(96,165,250,0.25)')
      haze.addColorStop(0.45,'rgba(56,189,248,0.12)')
      haze.addColorStop(0.7, 'rgba(129,140,248,0.06)')
      haze.addColorStop(1,   'transparent')
      ctx.fillStyle = haze
      ctx.beginPath()
      ctx.arc(cx, cy, 60 * pulse, 0, Math.PI * 2)
      ctx.fill()

      // Inner core
      const core = ctx.createRadialGradient(cx - 8, cy - 8, 0, cx, cy, 28 * pulse)
      core.addColorStop(0,   'rgba(220,240,255,0.95)')
      core.addColorStop(0.35,'rgba(96,165,250,0.85)')
      core.addColorStop(0.7, 'rgba(56,189,248,0.55)')
      core.addColorStop(1,   'rgba(3,11,26,0)')
      ctx.fillStyle   = core
      ctx.shadowBlur  = 30
      ctx.shadowColor = 'rgba(96,165,250,0.7)'
      ctx.beginPath()
      ctx.arc(cx, cy, 28 * pulse, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Core rim highlight
      ctx.strokeStyle = 'rgba(200,230,255,0.25)'
      ctx.lineWidth   = 1
      ctx.beginPath()
      ctx.arc(cx, cy, 28 * pulse, 0, Math.PI * 2)
      ctx.stroke()

      tRef.current += 0.003
      animRef.current = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouseRef.current = {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top)  / rect.height)),
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    draw()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 420 }}>
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.06) 0%, rgba(96,165,250,0.03) 40%, transparent 70%)',
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Floating corner stat badges */}
      <div className="absolute top-6 right-8 pointer-events-none">
        <div
          className="pill pill-cyan text-xs"
          style={{ background: 'rgba(3,11,26,0.8)', backdropFilter: 'blur(8px)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse inline-block" />
          LIVE SYSTEM
        </div>
      </div>

      {/* DEV / DESIGN / IMPACT labels */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none select-none">
        {[
          { l: 'ORBIT-1', c: '#60a5fa', bc: 'rgba(96,165,250,0.2)' },
          { l: 'ORBIT-2', c: '#818cf8', bc: 'rgba(129,140,248,0.2)' },
          { l: 'ORBIT-3', c: '#38bdf8', bc: 'rgba(56,189,248,0.2)' },
        ].map(({ l, c, bc }) => (
          <span
            key={l}
            className="text-xs font-label tracking-widest px-3 py-1 rounded"
            style={{ color: c, border: `1px solid ${bc}`, background: 'rgba(3,11,26,0.75)' }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
