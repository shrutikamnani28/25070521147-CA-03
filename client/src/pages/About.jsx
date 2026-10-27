import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return ref
}

function RevealSection({ children, delay = 0 }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default function About() {
  const navigate = useNavigate()

  const values = [
    { icon: '🌹', title: 'Rare Ingredients', desc: 'We source only the finest raw materials: Bulgarian rose absolute, Haitian vetiver, Iranian saffron, and aged Indian oud.' },
    { icon: '⚗️', title: 'Master Perfumers', desc: 'Each formula is created in collaboration with IFRA-certified perfumers with decades of artisanal experience.' },
    { icon: '✦', title: 'Zero Compromise', desc: 'No shortcuts. No synthetic shortcuts passed off as naturals. Every note is intentional, every accord balanced to perfection.' },
    { icon: '🌿', title: 'Conscious Luxury', desc: 'Our packaging is 100% recyclable. We pledge 2% of every sale to reforestation of raw-ingredient source regions.' },
  ]

  const timeline = [
    { year: '2018', event: 'Velvet Vapors is founded in Bangalore with a vision to democratize luxury perfumery in India.' },
    { year: '2020', event: 'Launch of Noir Mystique and Saffron Dreams — our first two signature scents. Sold out in 72 hours.' },
    { year: '2022', event: 'Expanded to 12 signature scents. Featured in Vogue India and GQ as "The Best Niche Fragrance Brand."' },
    { year: '2024', event: 'Crossed 500 happy customers. Launched the Velvet Vapors Bespoke Service for custom formulations.' },
  ]

  return (
    <div className="page-wrapper" style={{ overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '5rem 1.5rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(45,27,78,0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ color: 'var(--gold)', fontSize: '0.82rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1rem' }}>Our Story</p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 900, marginBottom: '1.25rem', lineHeight: 1.15 }}>
            The Art of Wearing<br />
            <span style={{ color: 'var(--gold)' }}>Your Mood</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.75 }}>
            Velvet Vapors was born from one belief: that fragrance is the most intimate form of self-expression. We craft scents that don't just smell beautiful — they tell your story.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Brand Story */}
        <RevealSection>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
            <div>
              <div className="glass-card" style={{ height: 380, overflow: 'hidden', padding: 0 }}>
                <img src="https://images.unsplash.com/photo-1588514912908-b6b7bbe21ace?w=600&auto=format&fit=crop" alt="Perfume lab"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '1.25rem' }}>
                Born from Obsession
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>
                Our founder, Ananya Mehta, spent six years travelling the fragrance capitals of the world — Grasse, Dubai, Tokyo — studying under master perfumers before returning to India with one mission: to create luxury that belongs here.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Every Velvet Vapors bottle is numbered, quality-checked, and wrapped by hand. We believe the ritual of perfumery — the pour, the spray, the bloom on skin — deserves to feel sacred.
              </p>
            </div>
          </div>
        </RevealSection>

        {/* Values */}
        <RevealSection delay={100}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Our Values</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>What drives every formula we create</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
            {values.map(v => (
              <div key={v.title} className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{v.icon}</div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '0.6rem', color: 'var(--gold)' }}>{v.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* Timeline */}
        <RevealSection delay={150}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Our Journey</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Milestones that shaped Velvet Vapors</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 680, margin: '0 auto 5rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
            {timeline.map((t, i) => (
              <div key={t.year} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-card-solid)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--gold)', fontSize: '0.78rem', flexShrink: 0, zIndex: 1 }}>
                  {t.year}
                </div>
                <div className="glass-card" style={{ padding: '1rem 1.25rem', flex: 1 }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>

        {/* CTA */}
        <RevealSection delay={200}>
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
              Ready to Find <span style={{ color: 'var(--gold)' }}>Your Scent?</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
              Explore our full collection of 12 luxury fragrances, each crafted to evoke a distinct mood and memory.
            </p>
            <button className="btn-gold" style={{ fontSize: '1rem', padding: '0.9rem 2.5rem' }} onClick={() => navigate('/shop')}>
              Explore the Collection →
            </button>
          </div>
        </RevealSection>
      </div>
    </div>
  )
}
