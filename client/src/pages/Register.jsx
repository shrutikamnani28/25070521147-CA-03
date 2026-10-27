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

function evaluateStrength(pass) {
  if (!pass) return { score: 0, label: '', color: 'transparent' }
  let score = 0
  if (pass.length >= 6) score += 1
  if (pass.length >= 10) score += 1
  if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1
  if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1

  if (score <= 1) return { score: 25, label: 'Weak', color: '#ef4444' }
  if (score === 2) return { score: 50, label: 'Fair', color: '#f59e0b' }
  if (score === 3) return { score: 75, label: 'Good', color: '#d4af37' }
  return { score: 100, label: 'Strong & Secure ✨', color: '#10b981' }
}

export default function Register() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm]                 = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState('')

  const strength = evaluateStrength(form.password)
  const passwordsMatch = form.confirm && form.password === form.confirm

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return }
    if (form.name.trim().length < 2) { setError('Name must be at least 2 characters'); return }
    if (form.password.length < 6)    { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      showToast('Welcome to Velvet Vapors! ✦')
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
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
        {/* Interactive Olfactory Particle Field */}
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

        {/* 3D Interactive Tilt Card */}
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
            <div className="floating-rose" style={{ fontSize: '4.5rem', marginBottom: '1.25rem', userSelect: 'none' }}>
              ✨
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
              <ShinyText text="Join the Experience" speed={3.5} />
            </h1>

            <p style={{ color: 'var(--gold-light)', fontSize: '1rem', fontStyle: 'italic', letterSpacing: '0.05em', marginBottom: '1.5rem', opacity: 0.9 }}>
              “Every great scent is a personal story.”
            </p>

            <hr style={{ border: 'none', borderTop: '1px solid var(--gold-dim)', margin: '1.25rem auto', width: 90 }} />

            {/* Interactive Benefits List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left', maxWidth: 320, margin: '0 auto' }}>
              {[
                { icon: '🌹', text: 'Access 12+ signature formulations' },
                { icon: '🎁', text: '10% off with exclusive code VELVET10' },
                { icon: '📦', text: 'Live 4-stage olfactory order tracking' },
                { icon: '✨', text: 'Wishlist & scent profiling recommendations' },
              ].map(f => (
                <div
                  key={f.text}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    color: 'var(--text-muted)', fontSize: '0.88rem',
                    background: 'rgba(255,255,255,0.03)', padding: '0.55rem 0.85rem',
                    borderRadius: 10, border: '1px solid rgba(197, 160, 89,0.15)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--gold)'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(197, 160, 89,0.15)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                  <span style={{ color: '#f3e8ff' }}>{f.text}</span>
                </div>
              ))}
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
          style={{ width: '100%', maxWidth: 460, padding: '2.5rem 2.25rem', zIndex: 2 }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
              Create Account
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>Begin your luxury fragrance journey today</p>
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
            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                Full Name
              </label>
              <input
                className="input-luxury"
                type="text"
                placeholder="Lord Byron / Lady Eleanor"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ marginTop: '0.35rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <label style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                Email Address
              </label>
              <input
                className="input-luxury"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ marginTop: '0.35rem' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                  Password
                </label>
                {form.password && (
                  <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>
                    {strength.label}
                  </span>
                )}
              </div>
              <div className="interactive-input-wrap" style={{ marginTop: '0.35rem' }}>
                <input
                  className="input-luxury"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{ width: '100%', paddingRight: '46px' }}
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

              {/* Interactive Strength Meter Bar */}
              {form.password && (
                <div className="strength-bar-track">
                  <div
                    className="strength-bar-fill"
                    style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                  />
                </div>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                  Confirm Password
                </label>
                {form.confirm && (
                  <span style={{ fontSize: '0.75rem', color: passwordsMatch ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {passwordsMatch ? '✓ Passwords Match' : '✗ Passwords Differ'}
                  </span>
                )}
              </div>
              <div className="interactive-input-wrap" style={{ marginTop: '0.35rem' }}>
                <input
                  className="input-luxury"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                  style={{
                    width: '100%',
                    paddingRight: '46px',
                    borderColor: form.confirm ? (passwordsMatch ? '#10b981' : '#ef4444') : undefined,
                  }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirm(s => !s)}
                  title={showConfirm ? 'Hide password' : 'Show password'}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <EyeIcon show={showConfirm} />
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
              {loading ? 'Creating Your Patron Account…' : 'Create Account 🌹'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold-light)', fontWeight: 600, textDecoration: 'underline' }}>
              Sign in
            </Link>
          </p>
        </SpotlightCard>
      </div>

    </div>
  )
}
