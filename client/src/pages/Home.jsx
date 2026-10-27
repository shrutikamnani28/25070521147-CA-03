import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Badge from '../components/Badge.jsx'
import Modal from '../components/Modal.jsx'

/* ─── Aurora Background ─── */
function Aurora() {
  return (
    <div className="aurora-bg">
      <div className="aurora-orb" style={{
        width: 500, height: 500, left: '-10%', top: '-20%',
        background: 'radial-gradient(circle, #6b21a8, #2d1b4e)',
        animation: 'drift1 12s ease-in-out infinite',
      }} />
      <div className="aurora-orb" style={{
        width: 400, height: 400, right: '-5%', top: '10%',
        background: 'radial-gradient(circle, #d4af37, #92400e)',
        animation: 'drift2 15s ease-in-out infinite',
      }} />
      <div className="aurora-orb" style={{
        width: 350, height: 350, left: '30%', bottom: '-10%',
        background: 'radial-gradient(circle, #1e1b4b, #4c1d95)',
        animation: 'drift1 18s ease-in-out infinite',
      }} />
    </div>
  )
}

/* ─── Blur Text Animation ─── */
function BlurText({ text, delay = 60 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t) }, [])
  return (
    <span>
      {text.split('').map((ch, i) => (
        <span key={i} style={{
          display: 'inline-block',
          filter: visible ? 'blur(0)' : 'blur(8px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: `all 0.5s ease ${i * delay}ms`,
        }}>{ch === ' ' ? '\u00a0' : ch}</span>
      ))}
    </span>
  )
}

/* ─── CountUp ─── */
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

/* ─── Scent Quiz Modal ─── */
function ScentQuiz({ isOpen, onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()
  const questions = [
    { q: 'What mood are you dressing for?', opts: ['Bold & Powerful', 'Romantic & Soft', 'Fresh & Energetic', 'Mysterious & Deep'] },
    { q: 'Which note family calls to you?', opts: ['Woody & Earthy', 'Floral & Feminine', 'Citrus & Green', 'Spicy & Oriental'] },
    { q: 'How long do you want it to last?', opts: ['All day (12h+)', '8–10 hours', '5–7 hours', 'Light & airy'] },
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
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center' }}>
        Step {step + 1} of {questions.length}
      </p>
      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1.2rem', textAlign: 'center' }}>
        {q.q}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {q.opts.map(opt => (
          <button key={opt} className="btn-outline" style={{ textAlign: 'left', justifyContent: 'flex-start' }}
            onClick={() => answer(opt)}>{opt}</button>
        ))}
      </div>
    </Modal>
  )
}

/* ─── Spotlight Offer Card ─── */
function SpotlightCard({ icon, title, desc, code }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef(null)
  function onMove(e) {
    const r = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }
  return (
    <div ref={ref} onMouseMove={onMove}
      className="glass-card spotlight-card"
      style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden', flex: 1, minWidth: 220 }}
    >
      <div style={{
        position: 'absolute', width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, transparent 70%)',
        left: pos.x, top: pos.y, transform: 'translate(-50%,-50%)',
        pointerEvents: 'none', transition: 'left 0.05s, top 0.05s',
      }} />
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.4rem' }}>{title}</h4>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>{desc}</p>
      {code && <span style={{ background: 'var(--gold-dim)', color: 'var(--gold)', padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em' }}>{code}</span>}
    </div>
  )
}

/* ─── Product Card ─── */
function ProductCard({ p }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const ref = useRef(null)

  function onMove(e) {
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setTilt({ rx: -y * 12, ry: x * 12 })
  }

  function onLeave() { setTilt({ rx: 0, ry: 0 }) }

  function handleAdd(e) {
    e.preventDefault()
    addToCart(p, p.size || '100ml', 1)
    showToast(`${p.name} added to bag!`)
  }

  const lowStock = p.stock > 0 && p.stock <= 5
  const outStock = p.stock === 0

  return (
    <Link to={`/product/${p._id}`} style={{ textDecoration: 'none' }}>
      <div
        ref={ref}
        className="glass-card tilt-card"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 0.15s ease',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img
            src={p.image}
            alt={p.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Badge type={p.category} />
            {lowStock && <Badge type="low-stock">Only {p.stock} left</Badge>}
            {outStock && <Badge type="out-stock">Out of Stock</Badge>}
          </div>
        </div>
        <div style={{ padding: '1rem 1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.4rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.brand}</p>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{p.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="stars">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.rating}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 700 }}>
              ₹{p.price.toLocaleString('en-IN')}
            </span>
            <button
              className="btn-gold btn-sm"
              onClick={handleAdd}
              disabled={outStock}
              style={{ opacity: outStock ? 0.5 : 1 }}
            >
              {outStock ? 'Sold Out' : '+ Bag'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Testimonial Card ─── */
function Testimonial({ name, text, stars = 5 }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem', flex: 1, minWidth: 260 }}>
      <div className="stars" style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>{'★'.repeat(stars)}</div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>"{text}"</p>
      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gold)' }}>— {name}</p>
    </div>
  )
}

/* ─── HOME PAGE ─── */
export default function Home() {
  const { authFetch } = useAuth()
  const [perfumes, setPerfumes] = useState([])
  const [quizOpen, setQuizOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('/api/perfumes?sort=rating')
      .then(r => r.json())
      .then(d => setPerfumes((d.perfumes || []).slice(0, 6)))
      .catch(() => {})
  }, [authFetch])

  const stats = [
    { end: 12, suffix: '+', label: 'Signature Scents' },
    { end: 500, suffix: '+', label: 'Happy Customers' },
    { end: 4.9, suffix: '/5', label: 'Average Rating' },
  ]

  const testimonials = [
    { name: 'Aanya R.', stars: 5, text: 'Saffron Dreams is absolutely divine. I get compliments every single day. Worth every rupee!' },
    { name: 'Mihir P.', stars: 5, text: 'Oud Royale is the most masculine, rich scent I have ever worn. Lasts more than 12 hours!' },
    { name: 'Priya S.', stars: 5, text: 'Rose Velvet is elegance bottled. The packaging is stunning and the scent is pure romance.' },
  ]

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', overflow: 'hidden' }}>
        <Aurora />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <p style={{ color: 'var(--gold)', fontSize: '0.85rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Luxury Fragrance House
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.8rem, 8vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 0 40px rgba(212,175,55,0.3)' }}>
            <BlurText text="Wear the mood." delay={50} />
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Discover rare fragrances crafted for the modern connoisseur. Every bottle tells a story only you can wear.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" style={{ fontSize: '1rem', padding: '0.9rem 2.2rem' }} onClick={() => navigate('/shop')}>
              Explore Collection
            </button>
            <button className="btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2.2rem' }} onClick={() => setQuizOpen(true)}>
              Find Your Scent ✨
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'rgba(212,175,55,0.04)', borderTop: '1px solid var(--gold-dim)', borderBottom: '1px solid var(--gold-dim)', padding: '3rem 1.5rem' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center', flex: 1, minWidth: 140 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--gold)' }}>
                  <CountUp end={s.end} suffix={s.suffix} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-title">Bestselling Scents</h2>
            <p className="section-subtitle">Our most-loved fragrances, adored by thousands</p>
          </div>
          <div className="product-grid">
            {perfumes.map(p => <ProductCard key={p._id} p={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button className="btn-gold" onClick={() => navigate('/shop')}>View Full Collection →</button>
          </div>
        </div>
      </section>

      {/* ── OFFERS ── */}
      <section style={{ padding: '3rem 1.5rem', background: 'rgba(212,175,55,0.03)', borderTop: '1px solid var(--gold-dim)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Exclusive Offers</h2>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <SpotlightCard icon="🎁" title="First Fragrance Discount" desc="Use code VELVET10 at checkout to enjoy 10% off your first order." code="VELVET10" />
            <SpotlightCard icon="🚚" title="Free Express Shipping" desc="All orders above ₹4,000 qualify for complimentary express delivery across India." />
            <SpotlightCard icon="🌹" title="Luxury Gift Wrapping" desc="Every Velvet Vapors order arrives in signature obsidian gift packaging." />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '5rem 1.5rem' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>What Our Clients Say</h2>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {testimonials.map(t => <Testimonial key={t.name} {...t} />)}
          </div>
        </div>
      </section>

      <ScentQuiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  )
}
