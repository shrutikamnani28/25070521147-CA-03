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
      showToast('Welcome back to Velvet Vapors! ✦')
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
          background: 'linear-gradient(135deg, #05140f 0%, #1a0b26 50%, #2a113d 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden', minHeight: '100vh',
        }}
      >
        {/* Interactive Floating Gold & Plum Olfactory Particles */}
        <Particles
          particleCount={55}
          particleColors={['#c5a059', '#e6ca85', '#34d399', '#6ee7b7', '#ffffff']}
          speed={0.45}
          interactive={true}
          connectLines={true}
          maxConnectDistance={90}
        />

        {/* Ambient Radial Aura */}
        <div style={{
          position: 'absolute',
          width: 550, height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89,0.22) 0%, rgba(5, 150, 105,0.18) 50%, transparent 75%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        {/* 3D Interactive Tilt Centerpiece */}
        <TiltCard maxTilt={14} perspective={900} scale={1.03} style={{ zIndex: 1, maxWidth: 440, width: '100%' }}>
          <div style={{
            background: 'rgba(8, 28, 21, 0.65)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(197, 160, 89, 0.35)',
            borderRadius: '28px',
            padding: '3rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(197, 160, 89, 0.15)',
          }}>
            {/* Animated Insignia Emblem */}
            <div className="floating-rose" style={{ marginBottom: '1.25rem', userSelect: 'none' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 76,
                height: 76,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.2), rgba(6, 78, 59, 0.15))',
                border: '1.5px solid var(--border-gold)',
                boxShadow: '0 0 35px rgba(197, 160, 89, 0.35)',
              }}>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold-light)' }}>
                  <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
                </svg>
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--font-brand)", fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              <ShinyText text="Velvet Vapors" speed={3.5} />
            </h1>

            <p style={{ color: 'var(--gold-light)', fontSize: '0.92rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '1.5rem', opacity: 0.9 }}>
              Haute Parfumerie Atelier
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid var(--gold-dim)', margin: '1.25rem auto', width: 90 }} />

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              India’s premier luxury fragrance house. Artisanal niche perfumery crafted with rare olfactory pyramids.
            </p>

            {/* Interactive Feature Pills */}
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(197, 160, 89,0.12)', border: '1px solid rgba(197, 160, 89,0.3)',
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
          background: 'linear-gradient(135deg, #0d0614 0%, #170b24 50%, #05140f 100%)',
          borderLeft: '1px solid rgba(197, 160, 89, 0.15)',
        }}
      >
        {/* Ambient Particles in Form Background */}
        <Particles
          particleCount={45}
          particleColors={['#d4af37', '#ffd700', '#f6e05e', '#c084fc', '#f472b6', '#ffffff']}
          speed={0.4}
          interactive={true}
          connectLines={true}
          maxConnectDistance={85}
        />

        {/* Ambient Floating Aurora Glowing Orbs behind the Card */}
        <div style={{
          position: 'absolute',
          width: 520, height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5, 150, 105, 0.22) 0%, rgba(197, 160, 89, 0.16) 40%, transparent 70%)',
          top: '45%', left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
          animation: 'drift2 14s ease-in-out infinite',
        }} />

        <div style={{
          position: 'absolute',
          width: 360, height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.18) 0%, rgba(236, 72, 153, 0.12) 50%, transparent 70%)',
          bottom: '-10%', right: '-10%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          animation: 'drift1 18s ease-in-out infinite',
        }} />

        <SpotlightCard
          spotlightColor="rgba(197, 160, 89, 0.28)"
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
                  boxShadow: quickFmt ? '0 0 12px rgba(197, 160, 89,0.4)' : undefined,
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
                    boxShadow: quickFmt ? '0 0 12px rgba(197, 160, 89,0.4)' : undefined,
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
                boxShadow: '0 4px 20px rgba(197, 160, 89, 0.35)',
              }}
              disabled={loading}
            >
              {loading ? 'Authenticating…' : 'Sign In ✦'}
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
