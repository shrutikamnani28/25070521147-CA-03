import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Particles from '../components/reactbits/Particles.jsx'
import ShinyText from '../components/reactbits/ShinyText.jsx'
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx'
import TiltCard from '../components/reactbits/TiltCard.jsx'

function EyeIcon({ show }) {
  if (show) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function Login() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm]                 = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')
  const [quickFmt, setQuickFmt]         = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Email and password are required'); return }
    setLoading(true)
    try {
      await login(form.email, form.password)
      showToast('Welcome back to Velvet Vapors! 🌹')
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function quickLogin(email, pass) {
    setForm({ email, password: pass })
    setQuickFmt(true)
    setTimeout(() => setQuickFmt(false), 600)
    showToast('Admin credentials filled! Click "Sign In" or press Enter. 👑')
  }

  return (
    <div className="auth-page-container">
      
      {/* ── LEFT INTERACTIVE HERO PANEL ── */}
      <div
        className="auth-hero-panel"
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #0b0510 0%, #1a0b26 50%, #2a113d 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden', minHeight: '100vh',
        }}
      >
        {/* Interactive Floating Gold & Plum Olfactory Particles */}
        <Particles
          particleCount={40}
          particleColors={['#d4af37', '#f0d060', '#c084fc', '#e879f9', '#ffffff']}
          speed={0.4}
          interactive={true}
        />

        {/* Ambient Radial Aura */}
        <div style={{
          position: 'absolute',
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.14) 0%, rgba(147,51,234,0.12) 50%, transparent 75%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        {/* 3D Interactive Tilt Centerpiece */}
        <TiltCard maxTilt={14} perspective={900} scale={1.03} style={{ zIndex: 1, maxWidth: 440, width: '100%' }}>
          <div style={{
            background: 'rgba(19, 9, 28, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '28px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.15)',
          }}>
            {/* Animated Floating Rose */}
            <div className="floating-rose" style={{ fontSize: '4.5rem', marginBottom: '1.25rem', userSelect: 'none' }}>
              🌹
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
              <ShinyText text="Velvet Vapors" speed={3.5} />
            </h1>

            <p style={{ color: 'var(--gold-light)', fontSize: '1.1rem', fontStyle: 'italic', letterSpacing: '0.06em', marginBottom: '1.5rem', opacity: 0.9 }}>
              “Wear the mood.”
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid var(--gold-dim)', margin: '1.25rem auto', width: 90 }} />

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              India’s premier luxury fragrance house. Artisanal niche perfumery crafted with rare olfactory pyramids.
            </p>

            {/* Interactive Feature Pills */}
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: 999, padding: '0.35rem 0.85rem', fontSize: '0.78rem', color: 'var(--gold-light)',
                display: 'inline-flex', alignItems: 'center', gap: '5px'
              }}>
                ✨ 12 Niche Scents
              </span>
              <span style={{
                background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)',
                borderRadius: 999, padding: '0.35rem 0.85rem', fontSize: '0.78rem', color: '#e9d5ff',
                display: 'inline-flex', alignItems: 'center', gap: '5px'
              }}>
                ⭐ 4.9 Patron Rating
              </span>
              <span style={{
                background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)',
                borderRadius: 999, padding: '0.35rem 0.85rem', fontSize: '0.78rem', color: '#a7f3d0',
                display: 'inline-flex', alignItems: 'center', gap: '5px'
              }}>
                🚚 Express Delivery
              </span>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* ── RIGHT INTERACTIVE FORM PANEL WITH ATMOSPHERIC AURORA & PARTICLES ── */}
      <div
        className="auth-form-panel"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem',
          minWidth: 0,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0d0614 0%, #170b24 50%, #0b0510 100%)',
          borderLeft: '1px solid rgba(212, 175, 55, 0.15)',
        }}
      >
        {/* Ambient Particles in Form Background */}
        <Particles
          particleCount={30}
          particleColors={['#d4af37', '#f0d060', '#c084fc', '#ffffff']}
          speed={0.35}
          interactive={true}
        />

        {/* Ambient Floating Aurora Glowing Orbs behind the Card */}
        <div style={{
          position: 'absolute',
          width: 480, height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.16) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 70%)',
          top: '45%', left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          animation: 'drift2 14s ease-in-out infinite',
        }} />

        <div style={{
          position: 'absolute',
          width: 320, height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
          bottom: '-10%', right: '-10%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          animation: 'drift1 18s ease-in-out infinite',
        }} />

        <SpotlightCard
          spotlightColor="rgba(212, 175, 55, 0.28)"
          spotlightSize={340}
          style={{ width: '100%', maxWidth: 440, padding: '2.5rem 2.25rem', zIndex: 2 }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Sign in to access your atelier collection</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid var(--red)',
              borderRadius: 12,
              padding: '0.85rem 1.1rem',
              marginBottom: '1.5rem',
              color: '#fca5a5',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'pulse-gold-glow 2s infinite',
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                Email Address
              </label>
              <input
                className="input-luxury"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{
                  marginTop: '0.4rem',
                  borderColor: quickFmt ? 'var(--gold)' : undefined,
                  boxShadow: quickFmt ? '0 0 12px rgba(212,175,55,0.4)' : undefined,
                  transition: 'all 0.3s ease',
                }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                Password
              </label>
              <div className="interactive-input-wrap" style={{ marginTop: '0.4rem' }}>
                <input
                  className="input-luxury"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{
                    width: '100%',
                    paddingRight: '46px',
                    borderColor: quickFmt ? 'var(--gold)' : undefined,
                    boxShadow: quickFmt ? '0 0 12px rgba(212,175,55,0.4)' : undefined,
                    transition: 'all 0.3s ease',
                  }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(s => !s)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            <button
              className="btn-gold shimmer-btn"
              type="submit"
              style={{
                width: '100%',
                padding: '0.95rem',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
              }}
              disabled={loading}
            >
              {loading ? 'Authenticating…' : 'Sign In 🌹'}
            </button>
          </form>

          <hr className="divider-gold" style={{ margin: '1.75rem 0' }} />

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Quick Credentials
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-outline btn-sm quick-btn-interactive"
              style={{ flex: 1, padding: '0.65rem 0.8rem' }}
              onClick={() => quickLogin('admin@velvetvapors.com', 'admin123')}
            >
              👑 Admin Login
            </button>
            <button
              type="button"
              className="btn-outline btn-sm quick-btn-interactive"
              style={{ flex: 1, padding: '0.65rem 0.8rem' }}
              onClick={() => navigate('/register')}
            >
              ✨ Register
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold-light)', fontWeight: 600, textDecoration: 'underline' }}>
              Create one
            </Link>
          </p>
        </SpotlightCard>
      </div>

    </div>
  )
}
