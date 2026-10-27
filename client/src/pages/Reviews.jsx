import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Modal from '../components/Modal.jsx'

export default function Reviews() {
  const { authFetch, user } = useAuth()
  const { showToast } = useToast()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    patronName: user?.name || '',
    city: 'Mumbai',
    category: 'Product Quality',
    rating: 5,
    title: '',
    comment: '',
    verifiedPurchase: 'Artisanal Fragrance Selection',
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  async function fetchReviews() {
    setLoading(true)
    try {
      const res = await authFetch('/api/site-reviews')
      const data = await res.json()
      if (data.siteReviews && data.siteReviews.length > 0) {
        setReviews(data.siteReviews)
      } else {
        // Fallback reviews if API has no records yet
        setReviews(defaultSiteReviews)
      }
    } catch {
      setReviews(defaultSiteReviews)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.comment.trim() || !formData.patronName.trim()) {
      showToast('Please enter your name and review details', 'error')
      return
    }
    setSubmitting(true)
    try {
      const res = await authFetch('/api/site-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        showToast('Thank you! Your atelier review has been published.', 'success')
        setModalOpen(false)
        setFormData({
          patronName: user?.name || '',
          city: 'Mumbai',
          category: 'Product Quality',
          rating: 5,
          title: '',
          comment: '',
          verifiedPurchase: 'Artisanal Fragrance Selection',
        })
        fetchReviews()
      } else {
        showToast('Could not submit review', 'error')
      }
    } catch {
      showToast('Connection error', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const categories = [
    'All',
    'Product Quality',
    'Bespoke Packaging',
    'Express Delivery',
    'Customer Concierge',
    'Site Experience',
  ]

  const filteredReviews = activeFilter === 'All'
    ? reviews
    : reviews.filter(r => r.category === activeFilter)

  return (
    <div className="page-wrapper" style={{ overflowX: 'hidden' }}>
      
      {/* ── Header Hero ── */}
      <section style={{ textAlign: 'center', padding: '4.5rem 1.5rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.15) 0%, rgba(197, 160, 89, 0.1) 40%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ position: 'relative', maxWidth: 840, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(197, 160, 89, 0.12)', border: '1px solid rgba(197, 160, 89, 0.35)',
            borderRadius: 999, padding: '0.4rem 1.25rem', marginBottom: '1.25rem'
          }}>
            <span style={{ fontSize: '1rem' }}>⭐</span>
            <span style={{ color: 'var(--gold-light)', fontSize: '0.82rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
              Verified Patron Testimonials
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.3rem, 5vw, 3.8rem)', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.15 }}>
            Voices of the <span style={{ color: 'var(--gold)' }}>Velvet Atelier</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 680, margin: '0 auto 2rem' }}>
            Unfiltered impressions on our rare olfactory pyramids, artisanal bottle craftsmanship, bespoke magnetic unboxing, express temperature-controlled transit, and dedicated white-glove concierge.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="btn-gold shimmer-btn"
            style={{ padding: '0.9rem 2.4rem', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.04em', boxShadow: '0 6px 25px rgba(197, 160, 89, 0.4)' }}
          >
            ✦ Share Your Experience
          </button>
        </div>
      </section>

      <div className="container" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 1.5rem 5rem' }}>

        {/* ── Key Metrics Overview Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3.5rem',
        }}>
          {[
            { label: 'Overall Patron Rating', val: '4.95 / 5', sub: '500+ Verified Dispatches', icon: '👑', color: '#d4af37' },
            { label: 'Product Quality', val: '5.0 / 5', sub: 'Pure Olfactory Oils & Longevity', icon: '⚜️', color: 'var(--gold)' },
            { label: 'Bespoke Packaging', val: '4.9 / 5', sub: 'Velvet-lined Magnetic Boxes', icon: '🎁', color: '#f472b6' },
            { label: 'Express Delivery', val: '4.9 / 5', sub: '48h Thermal Protected Transit', icon: '🚀', color: '#38bdf8' },
          ].map(stat => (
            <div key={stat.label} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{stat.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: stat.color, marginBottom: '0.25rem', fontWeight: 700 }}>
                {stat.val}
              </h3>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.2rem' }}>{stat.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Filter Pills ── */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2.5rem',
        }}>
          {categories.map(c => {
            const count = c === 'All' ? reviews.length : reviews.filter(r => r.category === c).length
            const active = activeFilter === c
            return (
              <button
                key={c}
                onClick={() => setActiveFilter(c)}
                style={{
                  background: active ? 'var(--gold)' : 'rgba(197, 160, 89, 0.08)',
                  color: active ? '#05140f' : 'var(--text-primary)',
                  border: active ? '1px solid var(--gold)' : '1px solid rgba(197, 160, 89, 0.22)',
                  borderRadius: 999,
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.86rem',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {c} ({count})
              </button>
            )
          })}
        </div>

        {/* ── Reviews Grid ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading patron impressions…</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}>
            {filteredReviews.map((r, i) => (
              <div
                key={r._id || i}
                className="glass-card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 18,
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  background: 'linear-gradient(135deg, rgba(19, 9, 28, 0.8) 0%, rgba(11, 5, 16, 0.95) 100%)',
                  boxShadow: '0 10px 35px rgba(0,0,0,0.4)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.6)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.25)'
                }}
              >
                <div>
                  {/* Category Pill & Stars */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{
                      fontSize: '0.74rem',
                      background: 'rgba(197, 160, 89, 0.15)',
                      color: 'var(--gold-light)',
                      border: '1px solid rgba(197, 160, 89, 0.3)',
                      borderRadius: 999,
                      padding: '0.25rem 0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}>
                      {r.category}
                    </span>
                    <div style={{ color: 'var(--gold)', fontSize: '0.95rem', letterSpacing: '2px' }}>
                      {'\u2605'.repeat(r.rating || 5)}
                    </div>
                  </div>

                  {/* Review Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.4,
                  }}>
                    "{r.title || 'Exquisite Fragrance Experience'}"
                  </h3>

                  {/* Full 50-60 Word Review Body */}
                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.92rem',
                    lineHeight: 1.75,
                    marginBottom: '1.5rem',
                    fontStyle: 'normal',
                  }}>
                    {r.comment}
                  </p>
                </div>

                {/* Footer: Patron Info & Verification */}
                <div style={{
                  borderTop: '1px solid rgba(197, 160, 89, 0.15)',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: 8,
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.92rem' }}>
                        {r.patronName}
                      </span>
                      <span style={{ color: '#4ade80', fontSize: '0.75rem', fontWeight: 600 }} title="Verified Buyer">
                        ✓ Verified
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {r.city} · {r.verifiedPurchase || 'Verified Atelier Purchase'}
                    </span>
                  </div>

                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem', padding: '2.5rem', background: 'rgba(197, 160, 89, 0.04)', borderRadius: 20, border: '1px solid rgba(197, 160, 89, 0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.6rem' }}>
            Have You Experienced Velvet Vapors?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: 520, margin: '0 auto 1.5rem' }}>
            Your olfactory journey inspires our artisans. Share your candid review on quality, unboxing, transit, or concierge service.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-gold shimmer-btn"
            style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem' }}
          >
            ✦ Share Your Experience
          </button>
        </div>

      </div>

      {/* ── Submit Review Modal ── */}
      <Modal isOpen={modalOpen} open={modalOpen} onClose={() => setModalOpen(false)} title="Share Your Atelier Experience">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Your Name
            </label>
            <input
              type="text"
              className="input-luxury"
              value={formData.patronName}
              onChange={e => setFormData({ ...formData, patronName: e.target.value })}
              placeholder="e.g. Radhika Sharma"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Your City
              </label>
              <input
                type="text"
                className="input-luxury"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Mumbai, Bangalore"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Primary Category
              </label>
              <select
                className="input-luxury"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                style={{ background: '#091d17', color: 'var(--text-primary)' }}
              >
                <option value="Product Quality">Product Quality</option>
                <option value="Bespoke Packaging">Bespoke Packaging</option>
                <option value="Express Delivery">Express Delivery</option>
                <option value="Customer Concierge">Customer Concierge</option>
                <option value="Site Experience">Site Experience</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.6rem',
                    cursor: 'pointer',
                    color: star <= formData.rating ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {'\u2605'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Review Title
            </label>
            <input
              type="text"
              className="input-luxury"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Masterclass Fragrance Craftsmanship"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Detailed Impression (50-60 words on product, packing, transit, or service)
            </label>
            <textarea
              className="input-luxury"
              rows={4}
              value={formData.comment}
              onChange={e => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Describe your olfactory impression, packaging delight, or customer care experience…"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-gold shimmer-btn">
              {submitting ? 'Submitting…' : 'Publish Review'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

// Fallback site reviews matching the exact 50-60 words criteria
const defaultSiteReviews = [
  {
    patronName: 'Dr. Meera Nambiar',
    city: 'Bangalore',
    category: 'Product Quality',
    rating: 5,
    title: 'Artisanal Purity Rivaling Historic European Maisons',
    comment:
      'I was initially skeptical ordering niche luxury perfumery online, but Velvet Vapors completely exceeded my expectations. The oil concentration and ingredient purity in Creed Aventus are astonishing. The website guided me effortlessly through scent notes with their olfactory quiz, making discovery enjoyable. This is truly masterclass craftsmanship that easily rivals heritage European houses.',
    verifiedPurchase: 'Creed Aventus 100ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Rohan Malhotra',
    city: 'Mumbai',
    category: 'Bespoke Packaging',
    rating: 5,
    title: 'Unboxing That Feels Like High Haute Horlogerie',
    comment:
      'Unboxing my order felt like receiving fine bespoke jewelry. The bottle arrived cushioned in a magnetic velvet-lined presentation box adorned with champagne gold hot-stamping and a personalized handwritten parchment seal. Even the glass bottle has reassuring heft with a precision ultra-fine atomizer. You can instantly perceive the uncompromised devotion to artistic luxury.',
    verifiedPurchase: 'MFK Baccarat Rouge 540 100ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Sunita Krishnamurthy',
    city: 'Chennai',
    category: 'Express Delivery',
    rating: 5,
    title: 'Lightning Dispatch with Flawless Temperature Control',
    comment:
      'Express delivery to Chennai was lightning fast, arriving within 48 hours of placing the order online. The outer transit carton was heavily insulated, shock-proof, and tamper-sealed, ensuring the delicate fragrance glass remained pristine and temperature-controlled throughout transit. The live step-by-step courier dispatch tracking gave complete peace of mind from dispatch to doorstep.',
    verifiedPurchase: 'Tom Ford Neroli Portofino 50ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Kabir Singhania',
    city: 'New Delhi',
    category: 'Customer Concierge',
    rating: 5,
    title: 'White-Glove Guidance and Knowledgeable Scent Advice',
    comment:
      'The customer concierge service here sets a gold standard. When I contacted them for consultation on choosing between Baccarat Rouge 540 and Tom Ford Oud Wood for my brother\'s wedding, their scent specialist responded within minutes with detailed guidance and even included complimentary sample vials in my package. Courteous, knowledgeable, and genuinely passionate about fine fragrance curation.',
    verifiedPurchase: 'Tom Ford Oud Wood 100ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Avantika Deshmukh',
    city: 'Pune',
    category: 'Product Quality',
    rating: 5,
    title: 'Extraordinary Tenacity and All-Day Projection',
    comment:
      'The sheer longevity of Chanel Coco Mademoiselle is extraordinary. I sprayed it before my morning commute and could still savor soft May rose and Indonesian patchouli notes at dinner ten hours later. There are zero synthetic alcohol overtones, just pure, intoxicating botanical elegance that blooms on skin. Velvet Vapors has gained a devoted lifelong collector in me.',
    verifiedPurchase: 'Chanel Coco Mademoiselle 100ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Siddharth Khurana',
    city: 'Hyderabad',
    category: 'Site Experience',
    rating: 5,
    title: 'A Digital Sanctuary for Fragrance Connoisseurs',
    comment:
      'Navigating the Velvet Vapors platform is pure pleasure. The noir aesthetic paired with the visual olfactory pyramid breakdown helped me understand how each note evolves before buying. Applying promotional vouchers, selecting custom bottle sizes, and completing checkout was completely frictionless. Finding an artisanal luxury brand with this level of digital polish in India is refreshing.',
    verifiedPurchase: 'Le Labo Santal 33 100ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Tanya Roy',
    city: 'Kolkata',
    category: 'Bespoke Packaging',
    rating: 5,
    title: 'Breathtaking Presentation Worthy of Gifting Royalty',
    comment:
      'Every single detail reflects pure luxury. The magnetic velvet case, the embossed gold emblem, and the protective satin sleeve make it an unforgettable gifting experience. You genuinely feel valued as a patron from the moment the courier hands you the parcel. Velvet Vapors transforms perfume purchasing into an elevated sensory journey.',
    verifiedPurchase: 'Dior J\'adore 100ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Vikramaditya Verma',
    city: 'Jaipur',
    category: 'Express Delivery',
    rating: 5,
    title: 'Thermal Cushioning and Precision Logistical Execution',
    comment:
      'Living in Rajasthan, I was concerned about heat exposure during fragrance transit, but Velvet Vapors took extreme care. The package was air-cushioned and double-boxed with thermal insulation. Dispatch notifications were prompt, and the courier delivered directly to my desk without delay. Flawless logistical execution that matches the prestige of the brand.',
    verifiedPurchase: 'Maison Margiela By the Fireplace 100ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Ananya Joshi',
    city: 'Gurugram',
    category: 'Customer Concierge',
    rating: 5,
    title: 'Unmatched Post-Purchase Attention and Warm Care',
    comment:
      'I made a typo in my shipping address during late-night checkout, but their concierge team replied instantly over support chat and rectified it before morning dispatch. They even followed up post-delivery to ensure I loved the formulation. That proactive warmth and professionalism is unheard of in contemporary retail. A five-star atelier in every regard.',
    verifiedPurchase: 'YSL Black Opium 50ml',
    createdAt: new Date(),
  },
  {
    patronName: 'Farhan Merchant',
    city: 'Ahmedabad',
    category: 'Product Quality',
    rating: 5,
    title: 'World-Class Sillage Backed by Genuine Raw Ingredients',
    comment:
      'Finding authentic artisanal perfumes with natural agarwood, Iranian saffron, and Haitian vetiver at transparent pricing is rare. Velvet Vapors proves that homegrown luxury can compete on the world stage. From seamless online browsing to prompt delivery and heavenly sillage, every rupee spent feels thoroughly rewarded. My vanity will never be without their signature scents.',
    verifiedPurchase: 'Bleu de Chanel 100ml',
    createdAt: new Date(),
  },
]
