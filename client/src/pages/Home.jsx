import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Badge from '../components/Badge.jsx'
import Modal from '../components/Modal.jsx'
import Particles from '../components/reactbits/Particles.jsx'
import ShinyText from '../components/reactbits/ShinyText.jsx'
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx'
import TiltCard from '../components/reactbits/TiltCard.jsx'

/* --- Aurora Background --- */
function Aurora() {
  return (
    <div className="aurora-bg">
      <div className="aurora-orb" style={{
        width: 520, height: 520, left: '-10%', top: '-20%',
        background: 'radial-gradient(circle, #059669, #064e3b)',
        animation: 'drift1 12s ease-in-out infinite',
      }} />
      <div className="aurora-orb" style={{
        width: 440, height: 440, right: '-5%', top: '10%',
        background: 'radial-gradient(circle, #c5a059, #78350f)',
        animation: 'drift2 15s ease-in-out infinite',
      }} />
      <div className="aurora-orb" style={{
        width: 380, height: 380, left: '30%', bottom: '-10%',
        background: 'radial-gradient(circle, #047857, #022c22)',
        animation: 'drift1 18s ease-in-out infinite',
      }} />
    </div>
  )
}

/* --- Blur Text Animation --- */
function BlurText({ text, delay = 50 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t) }, [])
  return (
    <span>
      {text.split('').map((ch, i) => (
        <span key={i} style={{
          display: 'inline-block',
          filter: visible ? 'blur(0)' : 'blur(10px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: `all 0.6s cubic-bezier(0.25, 1, 0.5, 1) ${i * delay}ms`,
        }}>{ch === ' ' ? '\u00a0' : ch}</span>
      ))}
    </span>
  )
}

/* --- CountUp --- */
function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      observer.disconnect()
      const start = Date.now()
      const tick = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) requestAnimationFrame(tick)
        else setCount(end)
      }
      requestAnimationFrame(tick)
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])
  return <span ref={ref}>{count}{suffix}</span>
}

/* --- Scent Quiz Modal --- */
function ScentQuiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()
  const questions = [
    { q: 'What mood are you dressing for?', opts: ['Bold & Powerful', 'Romantic & Soft', 'Fresh & Energetic', 'Mysterious & Deep'] },
    { q: 'Which note family calls to you?', opts: ['Woody & Earthy', 'Floral & Feminine', 'Citrus & Green', 'Spicy & Oriental'] },
    { q: 'How long do you want it to last?', opts: ['All day (12h+)', '8-10 hours', '5-7 hours', 'Light & airy'] },
  ]
  const categoryMap = {
    'Bold & Powerful':     'Woody',
    'Romantic & Soft':     'Floral',
    'Fresh & Energetic':   'Fresh',
    'Mysterious & Deep':   'Oriental',
    'Woody & Earthy':      'Woody',
    'Floral & Feminine':   'Floral',
    'Citrus & Green':      'Fresh',
    'Spicy & Oriental':    'Oriental',
  }
  function answer(opt) {
    const next = { ...answers, [step]: opt }
    setAnswers(next)
    if (step < questions.length - 1) { setStep(s => s + 1) }
    else {
      const cat = categoryMap[next[0]] || ''
      onClose()
      setStep(0); setAnswers({})
      navigate(`/shop?category=${cat}`)
    }
  }
  if (!isOpen) return null
  const q = questions[step]
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Find Your Signature Scent">
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{
          height: 4, width: '100%', background: 'rgba(255,255,255,0.1)',
          borderRadius: 2, overflow: 'hidden', marginBottom: '1rem',
        }}>
          <div style={{
            height: '100%', width: `${((step + 1) / questions.length) * 100}%`,
            background: 'var(--gold)', transition: 'width 0.3s ease',
          }} />
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Step {step + 1} of {questions.length}
        </p>
      </div>

      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        {q.q}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {q.opts.map(opt => (
          <button
            key={opt}
            className="btn-outline quick-btn-interactive"
            style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '0.85rem 1.25rem' }}
            onClick={() => answer(opt)}
          >
            <span style={{ color: 'var(--gold)' }}>✦</span> {opt}
          </button>
        ))}
      </div>
    </Modal>
  )
}

/* --- Interactive Product Card with Spotlight & 3D Tilt --- */
function ProductCard({ p }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addToCart(p, p.size || '100ml', 1)
    showToast(`${p.name} added to bag! ✦`)
  }

  const lowStock = p.stock > 0 && p.stock <= 5
  const outStock = p.stock === 0

  return (
    <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', display: 'flex' }}>
      <TiltCard
        maxTilt={8}
        perspective={800}
        scale={1.02}
        style={{ width: '100%', height: '100%', display: 'flex' }}
      >
        <SpotlightCard
          spotlightColor="rgba(197, 160, 89, 0.22)"
          spotlightSize={260}
          style={{
            overflow: 'hidden',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'relative', height: 230, overflow: 'hidden' }}>
            <img
              src={p.image}
              alt={p.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap', zIndex: 3 }}>
              <Badge type={p.category} />
              {lowStock && <Badge type="low-stock">Only {p.stock} left</Badge>}
              {outStock && <Badge type="out-stock">Out of Stock</Badge>}
            </div>
          </div>

          <div style={{ padding: '1.25rem 1.2rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.45rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {p.brand}
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              {p.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="stars" style={{ color: 'var(--gold)', letterSpacing: '1px' }}>
                {'\u2605'.repeat(Math.min(5, Math.max(0, Math.round(p.rating || 5))))}{'\u2606'.repeat(Math.max(0, 5 - Math.round(p.rating || 5)))}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.rating || 5.0}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(197, 160, 89,0.15)' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--gold)', fontWeight: 700 }}>
                {'\u20B9'}{p.price.toLocaleString('en-IN')}
              </span>
              <button
                className="btn-gold btn-sm shimmer-btn"
                onClick={handleAdd}
                disabled={outStock}
                style={{ opacity: outStock ? 0.5 : 1, padding: '0.45rem 1rem' }}
              >
                {outStock ? 'Sold Out' : '+ Bag'}
              </button>
            </div>
          </div>
        </SpotlightCard>
      </TiltCard>
    </Link>
  )
}

/* --- HOME PAGE --- */
export default function Home() {
  const { authFetch } = useAuth()
  const [perfumes, setPerfumes] = useState([])
  const [quizOpen, setQuizOpen] = useState(false)
  const [activeMood, setActiveMood] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('/api/perfumes?sort=rating')
      .then(r => r.json())
      .then(d => setPerfumes((d.perfumes || []).slice(0, 6)))
      .catch(() => {})
  }, [authFetch])

  const stats = [
    { end: 19, suffix: '+', label: 'Artisanal Scents' },
    { end: 500, suffix: '+', label: 'Happy Customers' },
    { end: 4.9, suffix: '/5', label: 'Average Rating' },
  ]

  const scentFamilies = [
    { category: 'Woody', icon: '🌲', label: 'Woody & Earthy', desc: 'Cedarwood, Vetiver, Dark Leather' },
    { category: 'Floral', icon: '🌸', label: 'Floral & Powdery', desc: 'Florentine Iris, Lilac, Jasmine' },
    { category: 'Oriental', icon: '🌙', label: 'Spicy & Oriental', desc: 'Saffron, Oud, Warm Amber' },
    { category: 'Fresh', icon: '🌿', label: 'Citrus & Fresh', desc: 'Bergamot, Marine Sea Salt, Mint' },
  ]

  const testimonials = [
    { name: 'Aanya R.', stars: 5, text: 'Diptyque Orphéon is absolutely divine. The juniper berries and cedarwood get compliments every single day. Worth every rupee!' },
    { name: 'Mihir P.', stars: 5, text: 'Tom Ford Oud Wood is the most masculine, rich scent I have ever worn. Smoky, smooth, and lasts more than 12 hours!' },
    { name: 'Priya S.', stars: 5, text: 'Narciso Rodriguez Pure Musc is pure elegance bottled. The white flowers and clean cashmeran are heavenly.' },
  ]

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* -- HERO SECTION -- */}
      <section style={{
        position: 'relative',
        minHeight: '94vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '5rem 1.5rem',
        overflow: 'hidden',
      }}>
        <Aurora />
        
        {/* Interactive Fragrance Vapor Particles */}
        <Particles
          particleCount={45}
          particleColors={['#c5a059', '#e6ca85', '#34d399', '#6ee7b7', '#ffffff']}
          speed={0.45}
          interactive={true}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 780 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(197, 160, 89,0.1)', border: '1px solid rgba(197, 160, 89,0.3)',
            borderRadius: 999, padding: '0.4rem 1.25rem', marginBottom: '1.5rem',
          }}>
            <span style={{ color: 'var(--gold)' }}>✦</span>
            <span style={{ color: 'var(--gold-light)', fontSize: '0.82rem', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
              Atelier Niche Perfumery
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.8rem, 8vw, 5.2rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            textShadow: '0 0 50px rgba(197, 160, 89,0.25)',
          }}>
            <BlurText text="Wear the mood." delay={50} />
          </h1>

          <p style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            maxWidth: 540,
            margin: '0 auto 2.5rem',
            lineHeight: 1.8,
          }}>
            Discover rare olfactory elixirs crafted for the modern connoisseur.{' '}
            <ShinyText text="Every bottle carries an unspoken secret." speed={4} />
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn-gold shimmer-btn"
              style={{ fontSize: '1rem', padding: '0.95rem 2.4rem', boxShadow: '0 6px 25px rgba(197, 160, 89, 0.4)' }}
              onClick={() => navigate('/shop')}
            >
              Explore Collection →
            </button>
            <button
              className="btn-outline quick-btn-interactive"
              style={{ fontSize: '1rem', padding: '0.95rem 2.2rem' }}
              onClick={() => setQuizOpen(true)}
            >
              Find Your Scent ✨
            </button>
          </div>
        </div>
      </section>

      {/* -- INTERACTIVE OLFACTORY MOOD SELECTOR -- */}
      <section style={{ padding: '3.5rem 1.5rem', background: 'rgba(8, 28, 21, 0.75)', borderTop: '1px solid var(--gold-dim)', borderBottom: '1px solid var(--gold-dim)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Olfactory Families
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>Choose Your Fragrance Mood</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {scentFamilies.map(fam => (
              <div
                key={fam.category}
                onClick={() => navigate(`/shop?category=${fam.category}`)}
                onMouseEnter={() => setActiveMood(fam.category)}
                onMouseLeave={() => setActiveMood(null)}
                style={{
                  background: activeMood === fam.category ? 'rgba(197, 160, 89,0.14)' : 'rgba(13,9,28,0.85)',
                  border: `1px solid ${activeMood === fam.category ? 'var(--gold)' : 'rgba(197, 160, 89,0.25)'}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  transform: activeMood === fam.category ? 'translateY(-6px)' : 'none',
                  boxShadow: activeMood === fam.category ? '0 12px 30px rgba(197, 160, 89,0.2)' : 'none',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{fam.icon}</div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold)', marginBottom: '0.35rem' }}>
                  {fam.label}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {fam.desc}
                </p>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                  Explore Notes →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- STATS SECTION -- */}
      <section style={{ background: 'rgba(197, 160, 89,0.03)', padding: '3.5rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 700, color: 'var(--gold)' }}>
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.3rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- BESTSELLERS GRID -- */}
      <section style={{ padding: '5.5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="section-title">Bestselling Scents</h2>
            <p className="section-subtitle">Our most-loved formulas, adored by fragrance connoisseurs</p>
          </div>
          <div className="product-grid">
            {perfumes.map(p => <ProductCard key={p._id} p={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button className="btn-gold shimmer-btn" style={{ padding: '0.9rem 2.5rem' }} onClick={() => navigate('/shop')}>
              View Full Collection →
            </button>
          </div>
        </div>
      </section>

      {/* -- EXCLUSIVE OFFERS WITH SPOTLIGHT CARDS -- */}
      <section style={{ padding: '4rem 1.5rem', background: 'rgba(197, 160, 89,0.02)', borderTop: '1px solid var(--gold-dim)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Exclusive Atelier Offers</h2>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <SpotlightCard
              spotlightColor="rgba(197, 160, 89, 0.25)"
              style={{ flex: 1, minWidth: 260, padding: '2rem' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>🎁</div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--gold)' }}>
                First Order Discount
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Apply coupon code at checkout for 10% off your entire bag.
              </p>
              <span style={{
                background: 'var(--gold-dim)', color: 'var(--gold)',
                padding: '0.35rem 0.9rem', borderRadius: 999,
                fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.1em'
              }}>
                VELVET10
              </span>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.25)"
              style={{ flex: 1, minWidth: 260, padding: '2rem' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>🚚</div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem', color: '#e9d5ff' }}>
                Complimentary Express Delivery
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Orders above {'\u20B9'}4,000 qualify for rapid refrigerated luxury transport across all major cities in India.
              </p>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.25)"
              style={{ flex: 1, minWidth: 260, padding: '2rem' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>🌹</div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '0.5rem', color: '#a7f3d0' }}>
                Signature Obsidian Wrapping
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every flacon is sealed in a velvet-lined noir keepsake box with custom wax seal stamp.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* -- TESTIMONIALS -- */}
      <section style={{ padding: '5.5rem 1.5rem' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>What Our Patrons Say</h2>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {testimonials.map(t => (
              <SpotlightCard
                key={t.name}
                spotlightColor="rgba(197, 160, 89, 0.2)"
                style={{ flex: 1, minWidth: 260, padding: '2rem' }}
              >
                <div className="stars" style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--gold)' }}>
                  {'\u2605'.repeat(t.stars || 5)}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gold)' }}>
                  {'\u2014'} {t.name}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      <ScentQuiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  )
}
