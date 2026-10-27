import { useEffect, useRef } from 'react'

export default function Particles({
  particleCount = 35,
  particleColors = ['#d4af37', '#f0d060', '#a855f7', '#ec4899', '#ffffff'],
  speed = 0.5,
  interactive = true,
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

    const mouse = { x: -1000, y: -1000, radius: 100 }

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
    if (interactive) {
      canvas.parentElement?.addEventListener('mousemove', onMouseMove)
      canvas.parentElement?.addEventListener('mouseleave', onMouseLeave)
    }

    // Initialize particles
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed - 0.2, // slight upward float like fragrance vapor
        alpha: Math.random() * 0.7 + 0.2,
        baseAlpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Update positions
        p.x += p.vx
        p.y += p.vy

        // Alpha pulsing
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005
        if (p.alpha < 0.1) p.alpha = 0.1
        if (p.alpha > 0.9) p.alpha = 0.9

        // Screen wraps
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        // Mouse interaction
        if (interactive && mouse.x > 0) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 1.5
            p.x -= (dx / dist) * force
            p.y -= (dy / dist) * force
          }
        }

        // Draw particle with glow
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', onResize)
      if (interactive && canvas.parentElement) {
        canvas.parentElement.removeEventListener('mousemove', onMouseMove)
        canvas.parentElement.removeEventListener('mouseleave', onMouseLeave)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, speed, interactive])

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
