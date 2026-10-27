import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Badge from '../components/Badge.jsx'
import Skeleton from '../components/Skeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx'
import TiltCard from '../components/reactbits/TiltCard.jsx'

function ProductCard({ p }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const lowStock = p.stock > 0 && p.stock <= 5
  const outStock = p.stock === 0

  return (
    <TiltCard maxTilt={6} perspective={900} scale={1.02} style={{ width: '100%', height: '100%', display: 'flex' }}>
      <SpotlightCard
        spotlightColor="rgba(197, 160, 89, 0.22)"
        spotlightSize={250}
        style={{
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          border: '1px solid rgba(197, 160, 89, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', height: 230, overflow: 'hidden', background: '#0e0716' }}>
            <img
              src={p.image || '/perfumes/79117140_21505-10181-2-680x680.png'}
              alt={p.name}
              onError={(e) => { e.currentTarget.src = '/perfumes/79117140_21505-10181-2-680x680.png' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5, flexWrap: 'wrap', zIndex: 2 }}>
              <Badge type={p.category} />
              <Badge type={p.gender} />
              {lowStock && <Badge type="low-stock">Only {p.stock} left</Badge>}
              {outStock && <Badge type="out-stock">Sold Out</Badge>}
            </div>
          </div>

          <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {p.brand}
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-primary)', margin: 0 }}>
              {p.name}
            </h3>
            
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="stars" style={{ fontSize: '0.82rem', color: 'var(--gold)' }}>
                {'\u2605'.repeat(Math.min(5, Math.max(0, Math.round(p.rating || 5))))}{'\u2606'.repeat(Math.max(0, 5 - Math.round(p.rating || 5)))}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.rating || 5.0}</span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '0.8rem', borderTop: '1px solid rgba(197, 160, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--gold)', fontWeight: 700 }}>
                {'\u20B9'}{p.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {p.size || '100ml'}
              </span>
            </div>
          </div>
        </Link>

        <div style={{ padding: '0 1.2rem 1.2rem' }}>
          <button
            className="btn-gold shimmer-btn"
            style={{ width: '100%', padding: '0.65rem' }}
            disabled={outStock}
            onClick={() => { addToCart(p, p.size || '100ml', 1); showToast(`${p.name} added to bag! 🌹`) }}
          >
            {outStock ? 'Sold Out' : '🛍 Add to Bag'}
          </button>
        </div>
      </SpotlightCard>
    </TiltCard>
  )
}

export default function Shop() {
  const { authFetch } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [perfumes, setPerfumes] = useState([])
  const [loading, setLoading]   = useState(true)

  const [search,   setSearch]   = useState(searchParams.get('search')   || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [gender,   setGender]   = useState(searchParams.get('gender')   || '')
  const [sort,     setSort]     = useState(searchParams.get('sort')     || 'newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search)   params.set('search', search)
    if (category) params.set('category', category)
    if (gender)   params.set('gender', gender)
    if (sort)     params.set('sort', sort)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    authFetch(`/api/perfumes?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setPerfumes(d.perfumes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [search, category, gender, sort, minPrice, maxPrice, authFetch])

  function clearFilters() {
    setSearch(''); setCategory(''); setGender('')
    setSort('newest'); setMinPrice(''); setMaxPrice('')
  }

  const categoryOptions = [
    { label: 'All Moods', value: '' },
    { label: 'Woody & Smoky', value: 'Woody' },
    { label: 'Floral & Feminine', value: 'Floral' },
    { label: 'Oriental & Amber', value: 'Oriental' },
    { label: 'Fresh & Crisp', value: 'Fresh' },
  ]

  return (
    <div className="page-wrapper" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        
        {/* ─── Luxury Shop Header Banner ─────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197, 160, 89,0.1)', border: '1px solid rgba(197, 160, 89,0.3)', borderRadius: 999, padding: '0.35rem 1.25rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.9rem' }}>👑</span>
            <span style={{ color: 'var(--gold-light)', fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              Curated Royal Olfactory Library
            </span>
          </div>
          
          <h1 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)' }}>
            The Atelier Collection
          </h1>
          <p className="section-subtitle" style={{ maxWidth: 620, margin: '0 auto 1.5rem' }}>
            19 rare artisanal fragrances sourced directly from French and Italian master perfumeries. Every flacon is batch-verified with certificates of origin.
          </p>

          {/* Quick Category Mood Filters Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {categoryOptions.map(cat => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                style={{
                  background: category === cat.value ? 'linear-gradient(135deg, var(--gold), var(--gold-light))' : 'rgba(13, 9, 28, 0.8)',
                  color: category === cat.value ? '#05140f' : 'var(--text-muted)',
                  border: category === cat.value ? '1px solid var(--gold)' : '1px solid rgba(197, 160, 89, 0.25)',
                  borderRadius: 999,
                  padding: '0.45rem 1.25rem',
                  fontSize: '0.85rem',
                  fontWeight: category === cat.value ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: category === cat.value ? '0 4px 15px rgba(197, 160, 89, 0.35)' : 'none',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* ─ Sidebar ─ */}
          <aside className="glass-card" style={{ minWidth: 240, width: 240, padding: '1.75rem', flexShrink: 0, border: '1px solid rgba(197, 160, 89, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold)' }}>Refine Vault</h3>
              <button onClick={clearFilters} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Reset all</button>
            </div>

            {/* Search */}
            <div className="form-group">
              <label>Search Fragrance</label>
              <input className="input-luxury" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tom Ford, notes, iris…" />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Intended For</label>
              <select className="input-luxury" value={gender} onChange={e => setGender(e.target.value)} style={{ background: '#091d17', color: 'var(--text-primary)' }}>
                <option value="">All Genders</option>
                <option value="For Her">For Her (Feminine)</option>
                <option value="For Him">For Him (Masculine)</option>
                <option value="Unisex">Unisex (Harmonious)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="form-group">
              <label>Order By</label>
              <select className="input-luxury" value={sort} onChange={e => setSort(e.target.value)} style={{ background: '#091d17', color: 'var(--text-primary)' }}>
                <option value="newest">Latest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Patron Rating</option>
              </select>
            </div>

            <hr className="divider-gold" />

            {/* Price range */}
            <div className="form-group">
              <label>Price Range ({'\u20B9'})</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input-luxury" type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ width: '50%' }} />
                <input className="input-luxury" type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ width: '50%' }} />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', background: 'rgba(197, 160, 89, 0.06)', border: '1px solid rgba(197, 160, 89, 0.2)', borderRadius: 10, padding: '0.9rem', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              📦 <strong style={{ color: 'var(--gold)' }}>Express Refrigeration:</strong> Orders over {'\u20B9'}4,000 include complimentary courier temperature control.
            </div>
          </aside>

          {/* ─ Main content ─ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <div className="product-grid">
                {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
              </div>
            ) : perfumes.length === 0 ? (
              <EmptyState
                icon="🌹"
                title="No fragrances match your criteria"
                message="Try adjusting your filters or search keywords to discover matching flacons."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Presenting <strong style={{ color: 'var(--gold)' }}>{perfumes.length}</strong> artisanal flacons
                  </p>
                </div>
                <div className="product-grid">
                  {perfumes.map(p => <ProductCard key={p._id} p={p} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
