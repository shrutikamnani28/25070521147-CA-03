import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      background: 'radial-gradient(ellipse at center, #2d1b4e 0%, #0b0510 70%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        width: 380,
        height: 380,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12), transparent 70%)',
        top: '20%',
        left: '15%',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      <div className="glass-card slide-up" style={{ maxWidth: 540, padding: '3.5rem 2.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))' }}>
          🌫️🌹
        </div>
        
        <p style={{ color: 'var(--gold)', letterSpacing: '0.25em', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          404 — Olfactory Enigma
        </p>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
          Fragrance Lost in the Mist
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          The accord you are pursuing has evaporated into thin air or moved to a secret salon. Let us guide you back to our curated fragrance gallery.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/home" className="btn-gold" style={{ padding: '0.85rem 2rem' }}>
            Return to Sanctuary
          </Link>
          <Link to="/shop" className="btn-outline" style={{ padding: '0.85rem 2rem' }}>
            Explore Scents
          </Link>
        </div>
      </div>
    </div>
  )
}
