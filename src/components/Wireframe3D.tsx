import { useEffect, useRef } from 'react'

export type WireframeVariant = 'cube' | 'diamond' | 'network' | 'torus' | 'icosahedron'

interface Wireframe3DProps {
  variant: WireframeVariant
  colorStr?: string // e.g. '143,245,255'
}

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

export default function Wireframe3D({ variant, colorStr = '143,245,255' }: Wireframe3DProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rotRef = useRef({ x: 0.3, y: 0 })
  const velRef = useRef({ x: 0.0008, y: 0.004 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')!

    const W = wrap.clientWidth
    const H = wrap.clientHeight
    canvas.width = W * devicePixelRatio
    canvas.height = H * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'

    const R = Math.min(W, H) * 0.35
    let t = 0

    // GEOMETRIES
    let edges: [number, number][] = []
    let nodes: Vec3[] = []

    if (variant === 'cube') {
      const s = R * 0.8
      nodes = [
        [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
        [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
      ]
      edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ]
    } else if (variant === 'diamond') {
      const s = R * 1.1
      nodes = [
        [0, -s, 0], // Top
        [0, s, 0],  // Bottom
        [-s, 0, 0], [s, 0, 0], [0, 0, -s], [0, 0, s] // Equator
      ]
      edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2]
      ]
    } else if (variant === 'network') {
      for (let i = 0; i < 20; i++) {
        nodes.push([
          (Math.random() - 0.5) * R * 2,
          (Math.random() - 0.5) * R * 2,
          (Math.random() - 0.5) * R * 2
        ])
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i][0] - nodes[j][0]
          const dy = nodes[i][1] - nodes[j][1]
          const dz = nodes[i][2] - nodes[j][2]
          if (Math.sqrt(dx * dx + dy * dy + dz * dz) < R * 1.2) {
            edges.push([i, j])
          }
        }
      }
    } else if (variant === 'torus') {
      const outerR = R * 0.9
      const innerR = R * 0.4
      const segs = 16
      const tubeSegs = 8
      for (let i = 0; i < segs; i++) {
        const u = (i / segs) * Math.PI * 2
        for (let j = 0; j < tubeSegs; j++) {
          const v = (j / tubeSegs) * Math.PI * 2
          nodes.push([
            (outerR + innerR * Math.cos(v)) * Math.cos(u),
            innerR * Math.sin(v),
            (outerR + innerR * Math.cos(v)) * Math.sin(u)
          ])
          const current = i * tubeSegs + j
          const nextJ = i * tubeSegs + ((j + 1) % tubeSegs)
          const nextI = ((i + 1) % segs) * tubeSegs + j
          edges.push([current, nextJ])
          edges.push([current, nextI])
        }
      }
    } else if (variant === 'icosahedron') {
      const phi = (1 + Math.sqrt(5)) / 2
      const a = R * 0.6
      const b = R * 0.6 * phi
      nodes = [
        [-a, b, 0], [a, b, 0], [-a, -b, 0], [a, -b, 0],
        [0, -a, b], [0, a, b], [0, -a, -b], [0, a, -b],
        [b, 0, a], [-b, 0, a], [b, 0, -a], [-b, 0, -a]
      ]
      edges = [
        [0, 1], [0, 5], [0, 7], [0, 9], [0, 11],
        [1, 5], [1, 7], [1, 8], [1, 10],
        [2, 3], [2, 4], [2, 6], [2, 9], [2, 11],
        [3, 4], [3, 6], [3, 8], [3, 10],
        [4, 5], [4, 8], [4, 9],
        [5, 8], [5, 9],
        [6, 7], [6, 10], [6, 11],
        [7, 10], [7, 11],
        [8, 10],
        [9, 11]
      ]
    }

    const draw = () => {
      const CW = canvas.width / devicePixelRatio
      const CH = canvas.height / devicePixelRatio

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      velRef.current.y += (mx - 0.5) * 0.00008
      velRef.current.x += (my - 0.5) * 0.00008
      velRef.current.x *= 0.984
      velRef.current.y *= 0.984
      velRef.current.y += 0.0005
      rotRef.current.x += velRef.current.x
      rotRef.current.y += velRef.current.y

      ctx.clearRect(0, 0, CW, CH)
      t += 0.004

      const mdx = (mx - 0.5) * 1
      const mdy = (my - 0.5) * 1

      ctx.beginPath()
      edges.forEach(([i, j]) => {
        let v1 = [...nodes[i]] as Vec3
        let v2 = [...nodes[j]] as Vec3

        // subtle floating wave based on geometry
        const wave1 = Math.sin(t * 1.5 + v1[1] * 0.01) * 5
        const wave2 = Math.sin(t * 1.5 + v2[1] * 0.01) * 5
        v1 = [v1[0] + mdx * wave1, v1[1] + mdy * wave1, v1[2]]
        v2 = [v2[0] + mdx * wave2, v2[1] + mdy * wave2, v2[2]]

        v1 = rotX(v1, rotRef.current.x)
        v1 = rotY(v1, rotRef.current.y)
        v2 = rotX(v2, rotRef.current.x)
        v2 = rotY(v2, rotRef.current.y)

        const p1 = project(v1, R, CW, CH)
        const p2 = project(v2, R, CW, CH)

        ctx.moveTo(p1[0], p1[1])
        ctx.lineTo(p2[0], p2[1])
      })

      ctx.strokeStyle = `rgba(${colorStr},0.35)`
      ctx.lineWidth = 1.3
      ctx.shadowBlur = 10
      ctx.shadowColor = `rgba(${colorStr}, 0.8)`
      ctx.stroke()
      ctx.shadowBlur = 0

      // Core glow
      const cg = ctx.createRadialGradient(CW / 2, CH / 2, 0, CW / 2, CH / 2, R * 0.7)
      cg.addColorStop(0, `rgba(${colorStr},0.1)`)
      cg.addColorStop(1, 'transparent')
      ctx.fillStyle = cg
      ctx.beginPath()
      ctx.arc(CW / 2, CH / 2, R * 0.7, 0, Math.PI * 2)
      ctx.fill()

      animRef.current = requestAnimationFrame(draw)
    }

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect()
      mouseRef.current = {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    draw()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animRef.current)
    }
  }, [variant, colorStr])

  return (
    <div ref={wrapRef} className="relative w-full h-full min-h-[300px]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, rgba(${colorStr},0.05) 0%, transparent 68%)` }}
      />
      <canvas ref={canvasRef} className="w-full h-full" style={{ cursor: 'crosshair' }} />
    </div>
  )
}
