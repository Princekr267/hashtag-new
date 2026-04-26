import { useEffect, useRef } from 'react'

export default function CosmosHero(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d', { alpha: false })
    if (!ctx) return

    let W: number, H: number
    let raf: number
    let mouseX = 0, mouseY = 0
    let targetX = 0, targetY = 0

    // Optimized particle count to run at 60fps, increased slightly for better density
    const NUM_STARS = 700
    const stars: { x: number, y: number, z: number, r: number, g: number, b: number, baseZ: number, size: number }[] = []

    // Helper for Hex to RGB conversion
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 255, g: 255, b: 255 }
    }

    // Match brand colors (Primary, Secondary, Tertiary)
    const c1 = hexToRgb('#60a5fa') // Electric Blue
    const c2 = hexToRgb('#818cf8') // Indigo
    const c3 = hexToRgb('#38bdf8') // Sky Cyan

    const resize = () => {
      W = cv.offsetWidth
      H = cv.offsetHeight
      // Optimization: dpr limited closely for heavy particle counts, exact same as draft-2
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      cv.width = W * dpr
      cv.height = H * dpr
      ctx.scale(dpr, dpr)
      
      // Initialize stars if empty
      if (stars.length === 0) {
        for (let i = 0; i < NUM_STARS; i++) {
          
          // Spiral galaxy distribution matching draft-2
          const radius = (Math.random() * 20 + 1) * 45 // Scaled up canvas coordinates
          const branch = (i % 3) * ((Math.PI * 2) / 3)
          const spin = (radius / 45) * 0.4
          
          const x = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * 150
          const y = (Math.random() - 0.5) * 200 // Flattened galaxy
          const z = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * 150
          
          // Mix colors: lime near center, violet toward edges
          const t = Math.random()
          let mixR, mixG, mixB
          if (t < 0.4) {
            const lerp = Math.random()
            mixR = c1.r + (c2.r - c1.r) * lerp
            mixG = c1.g + (c2.g - c1.g) * lerp
            mixB = c1.b + (c2.b - c1.b) * lerp
          } else if (t < 0.7) {
            const lerp = Math.random()
            mixR = c2.r + (c3.r - c2.r) * lerp
            mixG = c2.g + (c3.g - c2.g) * lerp
            mixB = c2.b + (c3.b - c2.b) * lerp
          } else {
            const lerp = Math.random()
            mixR = c1.r + (c3.r - c1.r) * lerp
            mixG = c1.g + (c3.g - c1.g) * lerp
            mixB = c1.b + (c3.b - c1.b) * lerp
          }

          stars.push({
            x,
            y,
            z,
            r: Math.round(mixR),
            g: Math.round(mixG),
            b: Math.round(mixB),
            baseZ: z,
            // Increased base size for better visibility
            size: Math.random() * 3 + 1.2
          })
        }
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      // Parallax interaction mimicking draft-2
      mouseX = (e.clientX - W / 2) * 0.3
      mouseY = (e.clientY - H / 2) * 0.1
    }

    const draw = () => {
      // Clean pure black base to avoid overlapping frame smears over time
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, W, H)

      // Additive blending for glow effect without post-processing
      ctx.globalCompositeOperation = 'lighter'

      targetX += (mouseX - targetX) * 0.02
      targetY += (mouseY - targetY) * 0.02

      // Slowed down the rotation speed to be more mesmerizing
      const time = Date.now() * 0.00012

      const cx = W / 2
      const cy = H / 2

      // Render stars
      stars.forEach(star => {
        // Rotate around Y axis
        const rx = star.x * Math.cos(time) - star.baseZ * Math.sin(time)
        let rz = star.x * Math.sin(time) + star.baseZ * Math.cos(time)
        const ry = star.y

        // Add mouse parallax equivalent to rotation
        const px = rx + targetX * (rz * 0.002)
        const py = ry + targetY * (rz * 0.002)

        // Simple 3D500 // Increased Field of View to make the background appear largerojection
        const fov = 400
        const z = rz + 1000 // Push back to see the spiral
        
        if (z < 20) return // Behind camera

        const scale = fov / z
        const x2d = cx + px * scale
        const y2d = cy + py * scale

        // Don't draw if too far off screen
        if (z < 2500 && x2d > -50 && x2d < W + 50 && y2d > -50 && y2d < H + 50) {
          ctx.beginPath()
          const radius = Math.max(0.5, star.size * scale)
          ctx.arc(x2d, y2d, radius, 0, Math.PI * 2)
          
          // Improved visibility for distant particles so background feels much deeper
          let alpha = Math.max(0.15, 1 - (z - 20) / 2500)
          
          ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha})`
          
          // Removed shadowBlur to fix performance lag entirely
          ctx.fill()
        }
      })

      raf = requestAnimationFrame(draw)
    }

    resize()
    setTimeout(() => { requestAnimationFrame(draw) }, 100)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block w-full h-full object-cover" />
    </div>
  )
}