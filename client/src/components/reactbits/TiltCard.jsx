import { useState, useRef } from 'react'

export default function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  style = {},
  ...props
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scaleVal: 1 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setTilt({
      rx: -y * maxTilt,
      ry: x * maxTilt,
      scaleVal: scale,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, scaleVal: 1 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card ${className}`}
      style={{
        transform: `perspective(${perspective}px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${tilt.scaleVal}, ${tilt.scaleVal}, 1)`,
        transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
