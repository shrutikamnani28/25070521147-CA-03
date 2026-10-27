import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Badge from '../components/Badge.jsx'
import Skeleton from '../components/Skeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'

const CATEGORIES = ['Floral', 'Woody', 'Fresh', 'Oriental']
const GENDERS    = ['Unisex', 'For Her', 'For Him']
const SORTS      = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
]

function ProductCard({ p }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const lowStock = p.stock > 0 && p.stock <= 5
  const outStock = p.stock === 0
  return (
    <div className="glass-card tilt-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Badge type={p.category} />
            <Badge type={p.gender} />
            {lowStock && <Badge type="low-stock">Only {p.stock} left</Badge>}
            {outStock && <Badge type="out-stock">Sold Out</Badge>}
          </div>
        </div>
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.brand}</p>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--text-primary)' }}>{p.name}</h3>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <span className="stars" style={{ fontSize: '0.8rem' }}>{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5-Math.round(p.rating))}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.rating}</span>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold)', fontWeight: 700 }}>
              ₹{p.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 1rem 1rem' }}>
        <button className="btn-gold" style={{ width: '100%' }}
          disabled={outStock}
          onClick={() => { addToCart(p, p.size || '100ml', 1); showToast(`${p.name} added to bag!`) }}>
          {outStock ? 'Sold Out' : '🛍 Add to Bag'}
        </button>
      </div>
    </div>
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

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">The Collection</h1>
          <p className="section-subtitle">Discover your perfect scent from our curated library of luxury fragrances</p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* ─ Sidebar ─ */}
          <aside className="glass-card" style={{ minWidth: 230, width: 230, padding: '1.5rem', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>Filters</h3>
              <button onClick={clearFilters} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>Clear all</button>
            </div>

            {/* Search */}
            <div className="form-group">
              <label>Search</label>
              <input className="input-luxury" value={search} onChange={e => setSearch(e.target.value)} placeholder="Name, brand, notes…" />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Scent Family</label>
              {CATEGORIES.map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 6, color: category === c ? 'var(--gold)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <input type="radio" name="cat" checked={category === c} onChange={() => setCategory(c === category ? '' : c)} style={{ accentColor: 'var(--gold)' }} />
                  {c}
                </label>
              ))}
            </div>

            <hr className="divider-gold" />

            {/* Gender */}
            <div className="form-group">
              <label>Gender</label>
              {GENDERS.map(g => (
                <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 6, color: gender === g ? 'var(--gold)' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <input type="radio" name="gen" checked={gender === g} onChange={() => setGender(g === gender ? '' : g)} style={{ accentColor: 'var(--gold)' }} />
                  {g}
                </label>
              ))}
            </div>

            <hr className="divider-gold" />

            {/* Price range */}
            <div className="form-group">
              <label>Price Range (₹)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input-luxury" type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ width: '50%' }} />
                <input className="input-luxury" type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ width: '50%' }} />
              </div>
            </div>
          </aside>

          {/* ─ Main content ─ */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Sort bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {loading ? 'Loading…' : `${perfumes.length} fragrance${perfumes.length !== 1 ? 's' : ''} found`}
              </p>
              <select className="input-luxury" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {loading ? (
              <Skeleton count={6} />
            ) : perfumes.length === 0 ? (
              <EmptyState icon="🔍" title="No fragrances found" subtitle="Try adjusting your search or filter criteria." ctaLabel="Clear Filters" onCta={clearFilters} />
            ) : (
              <div className="product-grid">
                {perfumes.map(p => <ProductCard key={p._id} p={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
