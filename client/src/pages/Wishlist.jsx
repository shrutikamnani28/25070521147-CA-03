import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Badge from '../components/Badge.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Wishlist() {
  const { authFetch } = useAuth()
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading]   = useState(true)

  function loadWishlist() {
    authFetch('/api/wishlist')
      .then(r => r.json())
      .then(d => { setWishlist(d.wishlist || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { loadWishlist() }, [])

  function removeItem(id) {
    authFetch(`/api/wishlist/${id}`, { method: 'POST' })
      .then(() => { setWishlist(prev => prev.filter(p => String(p._id) !== id)); showToast('Removed from wishlist', 'error') })
      .catch(() => showToast('Failed', 'error'))
  }

  function moveToBag(p) {
    addToCart(p, p.size || '100ml', 1)
    removeItem(String(p._id))
    showToast(`${p.name} moved to bag! 🛍`)
  }

  if (loading) return (
    <div className="page-wrapper">
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '2rem' }}>♡</div>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading your wishlist…</p>
      </div>
    </div>
  )

  if (wishlist.length === 0) return (
    <div className="page-wrapper">
      <div className="container">
        <EmptyState icon="♡" title="Your wishlist is empty"
          subtitle="Save fragrances you love to your wishlist and find them here."
          ctaLabel="Explore Fragrances" onCta={() => navigate('/shop')} />
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>My Wishlist</h1>
        <p className="section-subtitle">{wishlist.length} saved fragrance{wishlist.length !== 1 ? 's' : ''}</p>

        <div className="product-grid">
          {wishlist.map(p => (
            <div key={p._id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: 210, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/product/${p._id}`)}>
                <img
                  src={p.image || '/perfumes/floral/01_velvet_rose.png'}
                  alt={p.name}
                  onError={(e) => { e.currentTarget.src = '/perfumes/floral/01_velvet_rose.png' }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: 8, left: 8 }}><Badge type={p.category} /></div>
                <button
                  onClick={e => { e.stopPropagation(); removeItem(String(p._id)) }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(11,5,16,0.7)', border: 'none', color: '#f87171', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove from wishlist"
                >♥</button>
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.brand}</p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}
                  onClick={() => navigate(`/product/${p._id}`)}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = ''}
                  style={{ cursor: 'pointer', fontFamily: 'var(--font-serif)', fontSize: '1.05rem', transition: 'color 0.2s' }}>
                  {p.name}
                </h3>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>{'\u2605'.repeat(Math.round(p.rating || 5))}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.rating || 5.0}</span>
                </div>
                <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  {'\u20B9'}{p.price.toLocaleString('en-IN')}
                </p>
              </div>
              <div style={{ padding: '0 1rem 1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn-gold" style={{ flex: 1, padding: '0.6rem' }} onClick={() => moveToBag(p)}>
                  Move to Bag 🛍
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
