import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Badge from '../components/Badge.jsx'

function Stars({ rating, interactive, onRate }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}
          style={{ fontSize: interactive ? '1.5rem' : '1rem', cursor: interactive ? 'pointer' : 'default', color: n <= (interactive ? (hover || rating) : Math.round(rating)) ? 'var(--gold)' : 'var(--gold-dim)', transition: 'color 0.15s' }}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate(n)}
        >{'\u2605'}</span>
      ))}
    </div>
  )
}

function MeterBar({ label, value, max = 5, unit = '' }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
        <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>{value}{unit}</span>
      </div>
      <div className="meter-bar">
        <div className="meter-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function NotesPyramid({ pyramid }) {
  const tiers = [
    {
      label: 'Top Notes',
      stage: 'First Impression · 15–30 Mins',
      desc: 'The initial radiant burst upon first contact with skin',
      notes: pyramid?.topNotes || [],
      color: '#c5a059',
      bg: 'linear-gradient(135deg, rgba(197, 160, 89, 0.12) 0%, rgba(9, 29, 23, 0.75) 100%)',
      borderColor: 'rgba(197, 160, 89, 0.35)',
      badgeBg: 'rgba(197, 160, 89, 0.15)',
      icon: '△',
      width: '80%',
    },
    {
      label: 'Heart Notes',
      stage: 'The Signature Soul · 2–4 Hours',
      desc: 'The true emotional core that defines the fragrance profile',
      notes: pyramid?.heartNotes || [],
      color: '#34d399',
      bg: 'linear-gradient(135deg, rgba(52, 211, 153, 0.1) 0%, rgba(9, 29, 23, 0.75) 100%)',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      badgeBg: 'rgba(52, 211, 153, 0.15)',
      icon: '◆',
      width: '90%',
    },
    {
      label: 'Base Notes',
      stage: 'The Lingering Memory · 6–12+ Hours',
      desc: 'Deep balsamic resins and precious woods that bond with skin',
      notes: pyramid?.baseNotes || [],
      color: '#e6ca85',
      bg: 'linear-gradient(135deg, rgba(230, 202, 133, 0.1) 0%, rgba(9, 29, 23, 0.75) 100%)',
      borderColor: 'rgba(230, 202, 133, 0.28)',
      badgeBg: 'rgba(230, 202, 133, 0.15)',
      icon: '▽',
      width: '100%',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
      {tiers.map((t) => (
        <div
          key={t.label}
          className="glass-card"
          style={{
            width: t.width,
            maxWidth: '100%',
            background: t.bg,
            border: `1px solid ${t.borderColor}`,
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
            transition: 'transform 0.3s ease, border-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = t.color
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = t.borderColor
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: t.color, fontSize: '0.9rem', fontWeight: 'bold' }}>{t.icon}</span>
              <span style={{ color: t.color, fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                {t.label}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.65rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)' }}>
              {t.stage}
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.85rem', fontStyle: 'italic', lineHeight: 1.5 }}>
            {t.desc}
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {t.notes.map((n) => (
              <span
                key={n}
                style={{
                  background: t.badgeBg,
                  color: '#fff',
                  border: `1px solid ${t.borderColor}`,
                  padding: '0.35rem 0.85rem',
                  borderRadius: 999,
                  fontSize: '0.84rem',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const longevityMap = { '5-6 hours': 2, '6-7 hours': 2.5, '8+ hours': 3, '9+ hours': 3.5, '10+ hours': 4, '12+ hours': 5 }
const sillageMap   = { 'Light': 1.5, 'Moderate': 3, 'Strong': 4, 'Projection': 5 }

export default function ProductDetail() {
  const { id } = useParams()
  const { authFetch, user } = useAuth()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [perfume, setPerfume]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [reviews, setReviews]       = useState([])
  const [size, setSize]             = useState('100ml')
  const [wishlist, setWishlist]     = useState([])
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      authFetch(`/api/perfumes/${id}`).then(r => r.json()),
      authFetch(`/api/reviews/${id}`).then(r => r.json()),
      authFetch('/api/wishlist').then(r => r.json()),
    ]).then(([pd, rd, wd]) => {
      setPerfume(pd.perfume)
      setReviews(rd.reviews || [])
      setWishlist((wd.wishlist || []).map(i => String(i._id)))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, authFetch])

  function toggleWishlist() {
    authFetch(`/api/wishlist/${id}`, { method: 'POST' })
      .then(r => r.json())
      .then(d => {
        setWishlist(d.wishlist || [])
        showToast(d.action === 'added' ? 'Added to wishlist ♡' : 'Removed from wishlist', d.action === 'added' ? 'success' : 'error')
      })
      .catch(() => showToast('Failed', 'error'))
  }

  async function submitReview(e) {
    e.preventDefault()
    if (!reviewRating) return showToast('Please select a rating', 'error')
    if (!reviewComment.trim()) return showToast('Please write a comment', 'error')
    setSubmitting(true)
    try {
      const res = await authFetch(`/api/reviews/${id}`, {
        method: 'POST',
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg)
      setReviews(prev => [data.review, ...prev])
      setReviewRating(0); setComment('')
      showToast('Review submitted!')
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="page-wrapper"><div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌹</div>
      <p style={{ color: 'var(--text-muted)' }}>Loading fragrance details…</p>
    </div></div>
  )

  if (!perfume) return (
    <div className="page-wrapper"><div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <p style={{ color: 'var(--red)' }}>Fragrance not found.</p>
      <button className="btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/shop')}>Back to Shop</button>
    </div></div>
  )

  const isWishlisted = wishlist.includes(String(id))
  const prices = { '50ml': Math.round(perfume.price * 0.65), '100ml': perfume.price }
  const displayPrice = prices[size] || perfume.price
  const outStock = perfume.stock === 0

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', color: 'var(--gold)', cursor: 'pointer' }}>← Shop</button>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>{perfume.category}</span>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>{perfume.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Image */}
          <div>
            <div className="glass-card" style={{ overflow: 'hidden', padding: 0, height: 420 }}>
              <img
                src={perfume.image || '/perfumes/floral/01_velvet_rose.png'}
                alt={perfume.name}
                onError={(e) => { e.currentTarget.src = '/perfumes/floral/01_velvet_rose.png' }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <Badge type={perfume.category} />
              <Badge type={perfume.gender} />
              {perfume.stock > 0 && perfume.stock <= 5 && <Badge type="low-stock">Only {perfume.stock} left</Badge>}
              {outStock && <Badge type="out-stock">Sold Out</Badge>}
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{perfume.brand}</p>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>{perfume.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <Stars rating={perfume.rating} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{perfume.rating} ({reviews.length} reviews)</span>
            </div>

            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--gold)', fontWeight: 700, marginBottom: '1.25rem' }}>
              {'\u20B9'}{displayPrice.toLocaleString('en-IN')}
            </div>

            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.95rem' }}>{perfume.description}</p>

            {/* Size selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>Select Size</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['50ml', '100ml'].map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    style={{
                      padding: '0.5rem 1.2rem', borderRadius: 999, cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
                      background: size === s ? 'var(--gold)' : 'transparent',
                      color: size === s ? '#05140f' : 'var(--gold)',
                      border: '1.5px solid var(--border-gold)',
                      transition: 'all 0.2s',
                    }}>{s} {'\u2014'} {'\u20B9'}{prices[s].toLocaleString('en-IN')}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button className="btn-gold" style={{ flex: 1, padding: '0.9rem' }}
                disabled={outStock}
                onClick={() => { addToCart(perfume, size, 1); showToast(`${perfume.name} (${size}) added to bag!`) }}>
                {outStock ? 'Sold Out' : '🛍 Add to Bag'}
              </button>
              <button onClick={toggleWishlist} className="btn-outline" style={{ padding: '0.9rem 1.4rem', fontSize: '1.1rem' }}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}>
                {isWishlisted ? '♥' : '♡'}
              </button>
            </div>

            {/* Longevity / Sillage */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <MeterBar label="Longevity" value={longevityMap[perfume.longevity] || 3} max={5} unit={` (${perfume.longevity})`} />
              <MeterBar label="Sillage" value={sillageMap[perfume.sillage] || 3} max={5} unit={` (${perfume.sillage})`} />
            </div>
          </div>
        </div>

        {/* Scent Pyramid */}
        <div style={{ marginTop: '3.5rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.85rem', marginBottom: '0.4rem' }}>Olfactory Pyramid</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              How the fragrance composition evolves across skin over time
            </p>
          </div>
          <div style={{ maxWidth: 820, width: '100%' }}>
            <NotesPyramid pyramid={perfume.scentPyramid} />
          </div>
        </div>

        <hr className="divider-gold" style={{ margin: '3rem 0' }} />

        {/* Reviews */}
        <div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.7rem', marginBottom: '1.75rem' }}>
            Customer Reviews ({reviews.length})
          </h2>

          {/* Submit review */}
          <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', maxWidth: 600 }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Leave a Review</h4>
            <form onSubmit={submitReview}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Your Rating</p>
                <Stars rating={reviewRating} interactive onRate={setReviewRating} />
              </div>
              <div className="form-group">
                <textarea className="input-luxury" rows={3} placeholder="Share your thoughts on this fragrance…"
                  value={reviewComment} onChange={e => setComment(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <button className="btn-gold" type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Review list */}
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((r, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.userName}</span>
                      <Stars rating={r.rating} />
                    </div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
