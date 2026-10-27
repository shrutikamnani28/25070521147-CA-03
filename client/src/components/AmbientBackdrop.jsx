import { useEffect, useRef } from 'react'

export default function AmbientBackdrop() {
  const canvasRef = useRef(null)
  const spotlightRef = useRef(null)

  useEffect(() => {
    // ─── Interactive Mouse Spotlight ──────────────────────────────────
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let currentX = targetX
    let currentY = targetY
    let animId

    const handleMouseMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const updateSpotlight = () => {
      // Smooth lerp for buttery follow
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }
      animId = requestAnimationFrame(updateSpotlight)
    }
    animId = requestAnimationFrame(updateSpotlight)

    // ─── Canvas Perfume Dust Particles ───────────────────────────────
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let pAnimId

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Palette: Antique Brass, Burnished Champagne, Emerald Luminous, Mint Radiance, Pure White
    const colors = [
      { r: 197, g: 160, b: 89 },   // Antique Brass
      { r: 230, g: 202, b: 133 },  // Burnished Champagne
      { r: 52,  g: 211, b: 153 },  // Luminous Emerald
      { r: 167, g: 243, b: 208 },  // Mint Radiance
      { r: 255, g: 255, b: 255 },  // Pure Star White
    ]

    const count = Math.min(42, Math.floor((w * h) / 32000))
    const particles = []

    for (let i = 0; i < count; i++) {
      const isSparkle = Math.random() < 0.28
      const color = colors[Math.floor(Math.random() * colors.length)]
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: isSparkle ? Math.random() * 1.8 + 1.2 : Math.random() * 1.2 + 0.6,
        color,
        vx: (Math.random() - 0.5) * 0.25,
        vy: - (Math.random() * 0.35 + 0.12), // Gentle upward drift like vapor
        alpha: Math.random() * 0.4 + 0.2,
        baseAlpha: Math.random() * 0.4 + 0.2,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayAmp: Math.random() * 1.5 + 0.5,
        swayPhase: Math.random() * Math.PI * 2,
        isSparkle,
        angle: Math.random() * Math.PI,
      })
    }

    let time = 0
    const render = () => {
      time += 0.018
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.y += p.vy
        p.x += p.vx + Math.sin(time * p.swaySpeed + p.swayPhase) * (p.swayAmp * 0.2)

        // Wrap edges seamlessly
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w }
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20

        const pulse = Math.sin(time * 1.5 + p.swayPhase) * 0.15
        const curAlpha = Math.max(0.05, Math.min(0.85, p.baseAlpha + pulse))

        ctx.save()
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${curAlpha})`
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.6)`
        ctx.shadowBlur = p.isSparkle ? 10 : 4

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // 4-point brass & emerald sparkle flare
        if (p.isSparkle) {
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${curAlpha * 0.8})`
          ctx.lineWidth = 0.75
          const spike = p.radius * 3.2
          ctx.beginPath()
          ctx.moveTo(p.x - spike, p.y)
          ctx.lineTo(p.x + spike, p.y)
          ctx.moveTo(p.x, p.y - spike)
          ctx.lineTo(p.x, p.y + spike)
          ctx.stroke()
        }
        ctx.restore()
      }

      pAnimId = requestAnimationFrame(render)
    }
    pAnimId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
      cancelAnimationFrame(pAnimId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #05140f 0%, #082119 45%, #051610 100%)',
      }}
    >
      {/* ─── Ambient Radiant Orbs: Emerald Reserve & Antique Brass ────────── */}
      {/* Top Left: Deep Pine & Emerald Malachite */}
      <div
        style={{
          position: 'absolute',
          width: '680px',
          height: '680px',
          left: '-15%',
          top: '-15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5, 150, 105, 0.24) 0%, rgba(6, 78, 59, 0.08) 55%, transparent 75%)',
          filter: 'blur(90px)',
          animation: 'drift1 22s ease-in-out infinite',
        }}
      />

      {/* Top Right: Burnished Antique Brass & Warm Amber */}
      <div
        style={{
          position: 'absolute',
          width: '620px',
          height: '620px',
          right: '-10%',
          top: '5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.19) 0%, rgba(120, 53, 15, 0.05) 55%, transparent 75%)',
          filter: 'blur(100px)',
          animation: 'drift2 26s ease-in-out infinite',
        }}
      />

      {/* Bottom Center: Smoked Cedar & Dark Forest Moss */}
      <div
        style={{
          position: 'absolute',
          width: '740px',
          height: '520px',
          left: '20%',
          bottom: '-15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(4, 44, 34, 0.07) 55%, transparent 75%)',
          filter: 'blur(110px)',
          animation: 'drift1 28s ease-in-out infinite reverse',
        }}
      />

      {/* ─── Interactive Mouse Following Antique Brass Spotlight ─────────── */}
      <div
        ref={spotlightRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '540px',
          height: '540px',
          marginTop: '-270px',
          marginLeft: '-270px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.09) 0%, rgba(52, 211, 153, 0.035) 40%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform',
        }}
      />

      {/* ─── Micro Star-Dust Luxury Vignette Grid ────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(197, 160, 89, 0.07) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          opacity: 0.75,
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.2) 90%)',
        }}
      />

      {/* ─── Perfume Dust Floating Canvas ─────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
