import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
//  HeroOrb — 3-D wireframe sphere that reacts to cursor
//   · Continuous rotation (auto-spin + mouse inertia)
//   · Mouse causes wave ripple on sphere surface
//   · Glowing equator ring + tilted orbital ring
//   · 38 floating particles orbiting outside
//   · Core radial glow
// ─────────────────────────────────────────────────────────────

type Vec3 = [number, number, number]

const project = (v: Vec3, R: number, W: number, H: number, fov = 900): [number, number, number] => {
  const z = v[2] + R * 2.2
  const s = fov / z
  return [v[0] * s + W / 2, v[1] * s + H / 2, z]
}

const rotX = (v: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a)
  return [v[0], c * v[1] - s * v[2], s * v[1] + c * v[2]]
}

const rotY = (v: Vec3, a: number): Vec3 => {
  const c = Math.cos(a), s = Math.sin(a)
  return [c * v[0] + s * v[2], v[1], -s * v[0] + c * v[2]]
}

export default function HeroOrb(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const mouseRef  = useRef({ x: 0.5, y: 0.5 })
  const rotRef    = useRef({ x: 0.3, y: 0 })
  const velRef    = useRef({ x: 0.0008, y: 0.004 })
  const animRef   = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!

    const W = wrap.clientWidth
    const H = wrap.clientHeight
    canvas.width  = W * devicePixelRatio
    canvas.height = H * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    canvas.style.width  = W + 'px'
    canvas.style.height = H + 'px'

    const LAT = 18
    const LON = 28
    const R   = Math.min(W, H) * 0.34

    const spherePt = (lat: number, lon: number): Vec3 => {
      const phi   = (lat / LAT) * Math.PI
      const theta = (lon / LON) * 2 * Math.PI
      return [
        R * Math.sin(phi) * Math.cos(theta),
        R * Math.cos(phi),
        R * Math.sin(phi) * Math.sin(theta),
      ]
    }

    // Floating orbit particles
    const orbitPts = Array.from({ length: 40 }, () => ({
      phi:   Math.random() * Math.PI,
      theta: Math.random() * 2 * Math.PI,
      r:     R * (1.18 + Math.random() * 0.55),
      speed: (Math.random() - 0.5) * 0.009,
      phase: Math.random() * Math.PI * 2,
      size:  0.8 + Math.random() * 2,
    }))

    let t = 0

    const draw = () => {
      const CW = canvas.width  / devicePixelRatio
      const CH = canvas.height / devicePixelRatio

      // Spin physics
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      velRef.current.y += (mx - 0.5) * 0.00015
      velRef.current.x += (my - 0.5) * 0.00015
      velRef.current.x *= 0.984
      velRef.current.y *= 0.984
      velRef.current.y += 0.0018   // constant rightward drift
      rotRef.current.x += velRef.current.x
      rotRef.current.y += velRef.current.y

      ctx.clearRect(0, 0, CW, CH)
      t += 0.013

      const mdx = (mx - 0.5) * 2
      const mdy = (my - 0.5) * 2

      // ── Latitude circles ───────────────────────────────────
      for (let la = 1; la < LAT; la++) {
        const pts: [number, number, number][] = []
        for (let lo = 0; lo <= LON; lo++) {
          let v = spherePt(la, lo % LON)
          const wave = Math.sin(t * 2 + (lo / LON) * Math.PI * 4) * 7
          const rStr = 0.12 + 0.14 * (1 - Math.abs((la / LAT) - 0.5) * 2)
          v = [v[0] + mdx * rStr * wave, v[1] + mdy * rStr * wave, v[2]]
          v = rotX(v, rotRef.current.x)
          v = rotY(v, rotRef.current.y)
          pts.push(project(v, R, CW, CH))
        }
        const latNorm = la / LAT
        const alpha   = 0.10 + 0.30 * Math.sin(latNorm * Math.PI)
        ctx.beginPath()
        pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
        ctx.strokeStyle = la % 3 === 0 ? `rgba(0,252,64,${alpha * 0.7})` : `rgba(143,245,255,${alpha})`
        ctx.lineWidth   = la % 3 === 0 ? 0.55 : 0.42
        ctx.globalAlpha = 1
        ctx.stroke()
      }

      // ── Longitude lines ────────────────────────────────────
      for (let lo = 0; lo < LON; lo++) {
        const pts: [number, number, number][] = []
        for (let la = 0; la <= LAT; la++) {
          let v = spherePt(la, lo)
          const wave = Math.sin(t * 1.5 + (la / LAT) * Math.PI * 3) * 9
          const rStr = 0.16 * (0.5 + 0.5 * Math.cos((lo / LON) * Math.PI * 2))
          v = [v[0] + mdx * rStr * wave, v[1] + mdy * rStr * wave, v[2]]
          v = rotX(v, rotRef.current.x)
          v = rotY(v, rotRef.current.y)
          pts.push(project(v, R, CW, CH))
        }
        const lonNorm = lo / LON
        const alpha   = 0.07 + 0.18 * Math.abs(Math.sin(lonNorm * Math.PI))
        ctx.beginPath()
        pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
        ctx.strokeStyle = lo % 4 === 0 ? `rgba(172,137,255,${alpha * 1.4})` : `rgba(143,245,255,${alpha})`
        ctx.lineWidth   = lo % 4 === 0 ? 0.65 : 0.38
        ctx.globalAlpha = 1
        ctx.stroke()
      }

      // ── Glowing equator ────────────────────────────────────
      {
        const pts: [number, number, number][] = []
        for (let lo = 0; lo <= LON * 2; lo++) {
          let v: Vec3 = [
            R * 1.04 * Math.cos((lo / (LON * 2)) * 2 * Math.PI),
            0,
            R * 1.04 * Math.sin((lo / (LON * 2)) * 2 * Math.PI),
          ]
          v = rotX(v, rotRef.current.x)
          v = rotY(v, rotRef.current.y)
          pts.push(project(v, R, CW, CH))
        }
        ctx.beginPath()
        pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
        ctx.strokeStyle = 'rgba(143,245,255,0.55)'
        ctx.lineWidth   = 1.8
        ctx.shadowBlur  = 18
        ctx.shadowColor = '#8ff5ff'
        ctx.globalAlpha = 1
        ctx.stroke()
        ctx.shadowBlur  = 0
      }

      // ── Tilted orbital ring ────────────────────────────────
      {
        const TILT = 0.65
        const pts: [number, number, number][] = []
        for (let lo = 0; lo <= LON * 2; lo++) {
          const a = (lo / (LON * 2)) * 2 * Math.PI
          let v: Vec3 = [
            R * 1.4 * Math.cos(a),
            R * 1.4 * Math.sin(a) * Math.sin(TILT),
            R * 1.4 * Math.sin(a) * Math.cos(TILT),
          ]
          v = rotX(v, rotRef.current.x * 0.3)
          v = rotY(v, rotRef.current.y * 0.3 + t * 0.08)
          pts.push(project(v, R, CW, CH))
        }
        ctx.beginPath()
        pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
        ctx.strokeStyle = 'rgba(0,252,64,0.28)'
        ctx.lineWidth   = 1.0
        ctx.shadowBlur  = 10
        ctx.shadowColor = '#00fc40'
        ctx.globalAlpha = 0.9
        ctx.stroke()
        ctx.shadowBlur  = 0
        ctx.globalAlpha = 1
      }

      // ── Second diagonal ring (violet) ──────────────────────
      {
        const TILT = -0.4
        const pts: [number, number, number][] = []
        for (let lo = 0; lo <= LON * 2; lo++) {
          const a = (lo / (LON * 2)) * 2 * Math.PI
          let v: Vec3 = [
            R * 1.2 * Math.cos(a) * Math.cos(TILT),
            R * 1.2 * Math.sin(a),
            R * 1.2 * Math.cos(a) * Math.sin(TILT),
          ]
          v = rotX(v, rotRef.current.x * 0.5)
          v = rotY(v, rotRef.current.y * 0.5 - t * 0.05)
          pts.push(project(v, R, CW, CH))
        }
        ctx.beginPath()
        pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py))
        ctx.strokeStyle = 'rgba(172,137,255,0.22)'
        ctx.lineWidth   = 0.8
        ctx.shadowBlur  = 8
        ctx.shadowColor = '#ac89ff'
        ctx.globalAlpha = 0.8
        ctx.stroke()
        ctx.shadowBlur  = 0
        ctx.globalAlpha = 1
      }

      // ── Floating orbit dots ────────────────────────────────
      const COLORS = ['143,245,255', '0,252,64', '172,137,255']
      orbitPts.forEach((p, idx) => {
        p.theta += p.speed
        const pulse = 1 + 0.1 * Math.sin(t * 1.6 + p.phase)
        let v: Vec3 = [
          p.r * pulse * Math.sin(p.phi) * Math.cos(p.theta),
          p.r * pulse * Math.cos(p.phi),
          p.r * pulse * Math.sin(p.phi) * Math.sin(p.theta),
        ]
        v = rotX(v, rotRef.current.x)
        v = rotY(v, rotRef.current.y)
        const [px, py, pz] = project(v, R, CW, CH)
        const da = Math.max(0.08, Math.min(0.9, (pz - R * 0.4) / (R * 3.5)))
        const col = COLORS[idx % 3]
        ctx.beginPath()
        ctx.arc(px, py, p.size * (0.4 + da * 0.6), 0, Math.PI * 2)
        ctx.fillStyle   = `rgba(${col},${da})`
        ctx.shadowBlur  = 10
        ctx.shadowColor = `rgba(${col},0.8)`
        ctx.fill()
        ctx.shadowBlur  = 0
      })

      // ── Core atmospheric glow ──────────────────────────────
      const cg = ctx.createRadialGradient(CW / 2, CH / 2, 0, CW / 2, CH / 2, R * 0.65)
      cg.addColorStop(0,   'rgba(143,245,255,0.12)')
      cg.addColorStop(0.5, 'rgba(0,252,64,0.05)')
      cg.addColorStop(1,   'transparent')
      ctx.fillStyle = cg
      ctx.globalAlpha = 1
      ctx.beginPath()
      ctx.arc(CW / 2, CH / 2, R * 0.65, 0, Math.PI * 2)
      ctx.fill()

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
    <div ref={wrapRef} className="relative w-full h-full" style={{ minHeight: 420 }}>
      {/* Ambient radial backing */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, rgba(143,245,255,0.05) 0%, transparent 68%)' }}
      />
      <canvas ref={canvasRef} className="w-full h-full" style={{ cursor: 'crosshair' }} />

      {/* Bottom labels */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none select-none">
        {[
          { l: 'DEV',    c: '#8ff5ff', bc: 'rgba(143,245,255,0.2)' },
          { l: 'DESIGN', c: '#ac89ff', bc: 'rgba(172,137,255,0.2)' },
          { l: 'IMPACT', c: '#00fc40', bc: 'rgba(0,252,64,0.2)' },
        ].map(({ l, c, bc }) => (
          <span
            key={l}
            className="text-xs font-label tracking-widest px-3 py-1"
            style={{ color: c, border: `1px solid ${bc}`, background: 'rgba(14,14,16,0.75)' }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  )
}
