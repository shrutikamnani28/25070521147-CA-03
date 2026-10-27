import { useEffect, useRef } from 'react'

export default function Particles({
  particleCount = 50,
  particleColors = ['#c5a059', '#e6ca85', '#34d399', '#10b981', '#6ee7b7', '#ffffff'],
  speed = 0.45,
  interactive = true,
  connectLines = true,
  maxConnectDistance = 80,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const mouse = { x: -1000, y: -1000, radius: 130 }

    const onResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const onMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', onResize)
    const parent = canvas.parentElement
    if (interactive && parent) {
      parent.addEventListener('mousemove', onMouseMove)
      parent.addEventListener('mouseleave', onMouseLeave)
    }

    // Helper: convert hex to rgb
    const hexToRgb = (hex) => {
      let c = hex.replace('#', '')
      if (c.length === 3) c = c.split('').map((x) => x + x).join('')
      const num = parseInt(c, 16)
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      }
    }

    // Initialize particles with glowing layers, twinkle and luxury sparkle flares
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      const isSparkle = Math.random() < 0.28 // 28% of particles have 4-point star flare
      const isLarge = Math.random() < 0.25
      const radius = isLarge ? Math.random() * 2.2 + 2.4 : Math.random() * 1.4 + 1.0
      const colorHex = particleColors[Math.floor(Math.random() * particleColors.length)]
      const rgb = hexToRgb(colorHex)

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        colorHex,
        rgb,
        vx: (Math.random() - 0.5) * speed * 0.7,
        vy: -Math.abs((Math.random() * 0.45 + 0.15) * speed), // gentle upward fragrance vapor float
        swaySpeed: Math.random() * 0.018 + 0.008,
        swayAmp: Math.random() * 1.2 + 0.4,
        swayPhase: Math.random() * Math.PI * 2,
        baseAlpha: Math.random() * 0.35 + 0.55,
        alpha: Math.random() * 0.35 + 0.55,
        isSparkle,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
      })
    }

    let time = 0

    const render = () => {
      time += 0.025
      ctx.clearRect(0, 0, width, height)

      // Additive screen blending for rich, radiant overlapping glows
      ctx.globalCompositeOperation = 'lighter'

      // Subtle constellation / ethereal fragrance accord linkages
      if (connectLines) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i]
            const p2 = particles[j]
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < maxConnectDistance) {
              const alphaFactor = (1 - dist / maxConnectDistance) * 0.22 * Math.min(p1.alpha, p2.alpha)
              ctx.strokeStyle = `rgba(197, 160, 89, ${alphaFactor})`
              ctx.lineWidth = 0.85
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }
      }

      // Render individual glowing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Motion update with delicate scent vapor sway
        p.swayPhase += p.swaySpeed
        p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp * 0.3
        p.y += p.vy
        p.rotation += p.rotationSpeed

        // Organic pulsating shimmer
        const pulse = Math.sin(time * 2.5 + p.swayPhase) * 0.22
        p.alpha = Math.max(0.2, Math.min(1, p.baseAlpha + pulse))

        // Screen wraps smoothly
        if (p.x < -25) p.x = width + 25
        if (p.x > width + 25) p.x = -25
        if (p.y < -25) p.y = height + 25
        if (p.y > height + 25) p.y = -25

        // Interactive mouse bloom & subtle repulsion
        let extraAlpha = 0
        if (interactive && mouse.x > 0) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 2.2
            p.x -= (dx / dist) * force
            p.y -= (dy / dist) * force
            extraAlpha = (1 - dist / mouse.radius) * 0.45
          }
        }

        const currentAlpha = Math.min(1, p.alpha + extraAlpha)
        const { r, g, b } = p.rgb

        ctx.save()

        // 1. Broad soft radiant aura (Bloom glow)
        const outerGlowRadius = p.radius * 4.8
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, outerGlowRadius)
        radGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.95})`)
        radGrad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.55})`)
        radGrad.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.15})`)
        radGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = radGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, outerGlowRadius, 0, Math.PI * 2)
        ctx.fill()

        // 2. High-brilliance diamond core
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, currentAlpha * 1.3)})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2)
        ctx.fill()

        // 3. Four-point luxury starlight sparkle flare on key accent particles
        if (p.isSparkle && p.radius > 1.8) {
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.85})`
          ctx.lineWidth = 1.1

          const flareLen = p.radius * 3.5
          // Main cross spikes
          ctx.beginPath()
          ctx.moveTo(-flareLen, 0)
          ctx.lineTo(flareLen, 0)
          ctx.moveTo(0, -flareLen)
          ctx.lineTo(0, flareLen)
          ctx.stroke()

          // Diagonal micro-spikes for brilliant crystal shimmer
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.5})`
          ctx.lineWidth = 0.7
          const diagLen = flareLen * 0.5
          ctx.beginPath()
          ctx.moveTo(-diagLen, -diagLen)
          ctx.lineTo(diagLen, diagLen)
          ctx.moveTo(-diagLen, diagLen)
          ctx.lineTo(diagLen, -diagLen)
          ctx.stroke()
        }

        ctx.restore()
      }

      ctx.globalCompositeOperation = 'source-over'
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', onResize)
      if (interactive && parent) {
        parent.removeEventListener('mousemove', onMouseMove)
        parent.removeEventListener('mouseleave', onMouseLeave)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, speed, interactive, connectLines, maxConnectDistance])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  )
}
