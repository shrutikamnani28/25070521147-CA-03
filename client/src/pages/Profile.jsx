import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Modal from '../components/Modal.jsx'
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx'
import TiltCard from '../components/reactbits/TiltCard.jsx'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('address') // 'address' | 'orders' | 'scent' | 'vip'
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Primary Address state with realistic fallback sample details
  const [formData, setFormData] = useState({
    name: user?.name || 'Aarav Sharma',
    phone: user?.phone || '+91 98201 54321',
    street: user?.address?.street || 'B-402, Oberoi Sky Heights, Lokhandwala Complex',
    landmark: user?.address?.landmark || 'Opposite Celebration Club, 4th Cross Road',
    city: user?.address?.city || 'Mumbai',
    state: user?.address?.state || 'Maharashtra',
    pincode: user?.address?.pincode || '400053',
    country: user?.address?.country || 'India',
    addressType: user?.address?.addressType || 'Home / Residence',
  })

  // Synchronize when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'Aarav Sharma',
        phone: user.phone || '+91 98201 54321',
        street: user.address?.street || 'B-402, Oberoi Sky Heights, Lokhandwala Complex',
        landmark: user.address?.landmark || 'Opposite Celebration Club, 4th Cross Road',
        city: user.address?.city || 'Mumbai',
        state: user.address?.state || 'Maharashtra',
        pincode: user.address?.pincode || '400053',
        country: user.address?.country || 'India',
        addressType: user.address?.addressType || 'Home / Residence',
      })
    }
  }, [user])

  // Fetch user's shopping history
  useEffect(() => {
    const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    const token = localStorage.getItem('vv_token')
    if (!token) return

    fetch(`${BASE}/api/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setOrders(data.orders || [])
      })
      .catch(() => {
        // Fallback sample orders if brand new user
        setOrders([
          {
            _id: 'ord-vv-98214',
            createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
            status: 'Delivered',
            totalAmount: 11698,
            items: [
              { name: 'Oud Wood', brand: 'Tom Ford', size: '100ml', price: 6499, qty: 1, image: '/perfumes/79117140_21505-10181-2-680x680.png' },
              { name: 'By the Fireplace', brand: 'Maison Margiela', size: '100ml', price: 5199, qty: 1, image: '/perfumes/7722169b62744a1f4d59124bbf636879.jpg' },
            ],
            trackingCode: 'VV-BLUEDART-889104',
            carrier: 'BlueDart Express Luxury Cold-Chain',
          },
          {
            _id: 'ord-vv-84102',
            createdAt: new Date(Date.now() - 24 * 86400000).toISOString(),
            status: 'Delivered',
            totalAmount: 6299,
            items: [
              { name: 'Orphéon', brand: 'Diptyque', size: '75ml', price: 6299, qty: 1, image: '/perfumes/dark-t.65738.2x.avif' },
            ],
            trackingCode: 'VV-DTDC-440219',
            carrier: 'DTDC Courier Priority',
          },
        ])
      })
      .finally(() => setLoadingOrders(false))
  }, [])

  // Handle saving updated profile details
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          fullName: formData.name,
          phone: formData.phone,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          addressType: formData.addressType,
        },
      })
      showToast('Delivery Address & Patron Profile successfully updated! 🌹', 'success')
      setEditModalOpen(false)
    } catch (err) {
      showToast(err.message || 'Failed to update details', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Derive User Initials
  const initials = (formData.name || 'Aarav Sharma')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  return (
    <div className="page-wrapper" style={{ position: 'relative', zIndex: 1, paddingBottom: '6rem' }}>
      <div className="container" style={{ maxWidth: 1180 }}>
        
        {/* ─── Profile Hero Banner ────────────────────────────────────────── */}
        <div
          className="glass-card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '2.5rem 2rem',
            marginBottom: '2.5rem',
            border: '1px solid rgba(197, 160, 89, 0.35)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(135deg, rgba(8, 30, 23, 0.92) 0%, rgba(5, 20, 15, 0.97) 100%)',
          }}
        >
          {/* Ambient Inner Halo */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              right: '-10%',
              width: '450px',
              height: '450px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(197, 160, 89, 0.15) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 }}>
            
            {/* Left: Avatar + Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c5a059, #047857)',
                  padding: '3px',
                  boxShadow: '0 0 25px rgba(197, 160, 89, 0.35)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#071f18',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    letterSpacing: '1px',
                  }}
                >
                  {initials || 'AS'}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {formData.name}
                  </h1>
                  <span
                    style={{
                      background: 'rgba(197, 160, 89, 0.15)',
                      color: 'var(--gold)',
                      border: '1px solid rgba(197, 160, 89, 0.4)',
                      padding: '0.2rem 0.75rem',
                      borderRadius: 999,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    👑 Atelier Gold Patron
                  </span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '0.35rem' }}>
                  {user?.email || 'patron@velvetvapors.com'} · <span style={{ color: 'var(--gold)' }}>{formData.phone}</span>
                </p>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
                  Member of Velvet Vapors Private Atelier since October 2024
                </p>
              </div>
            </div>

            {/* Right: Quick Stats Ribbon */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  background: 'rgba(197, 160, 89, 0.08)',
                  border: '1px solid rgba(197, 160, 89, 0.25)',
                  borderRadius: 14,
                  padding: '0.9rem 1.4rem',
                  textAlign: 'center',
                  minWidth: 120,
                }}
              >
                <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                  Velvet Points
                </p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--gold)', margin: 0 }}>
                  1,850 <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)' }}>pts</span>
                </p>
                <span style={{ fontSize: '0.68rem', color: 'var(--emerald)' }}>= {'\u20B9'}1,850 credit</span>
              </div>

              <div
                style={{
                  background: 'rgba(168, 85, 247, 0.08)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: 14,
                  padding: '0.9rem 1.4rem',
                  textAlign: 'center',
                  minWidth: 120,
                }}
              >
                <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                  Flacons Acquired
                </p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#e9d5ff', margin: 0 }}>
                  {orders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, it) => s + (it.qty || 1), 0) : 1), 0) || 3}
                </p>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Archived Bottles</span>
              </div>

              <button
                className="btn-gold shimmer-btn"
                style={{ alignSelf: 'center', padding: '0.8rem 1.4rem', fontSize: '0.88rem' }}
                onClick={() => setEditModalOpen(true)}
              >
                ✏️ Edit Address & Info
              </button>
            </div>
          </div>
        </div>

        {/* ─── Profile Navigation Tabs ────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
            paddingBottom: '0.75rem',
            marginBottom: '2.5rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'address', label: '📍 Delivery Addresses', count: '2 Saved' },
            { id: 'orders', label: '🛍 Shopping & Flacons', count: `${orders.length} Orders` },
            { id: 'scent', label: '🧪 Olfactory Identity', count: 'Woody & Oriental' },
            { id: 'vip', label: '👑 Atelier Privileges', count: 'VIP Gold' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, rgba(197, 160, 89, 0.2), rgba(197, 160, 89, 0.05))' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--border-gold)' : '1px solid transparent',
                borderRadius: 999,
                padding: '0.65rem 1.4rem',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 600 : 400,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  background: activeTab === tab.id ? 'var(--gold)' : 'rgba(255, 255, 255, 0.08)',
                  color: activeTab === tab.id ? '#05140f' : 'var(--text-dim)',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontWeight: 600,
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── TAB 1: FULL-FLEDGED DELIVERY ADDRESSES ──────────────────────── */}
        {activeTab === 'address' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                  Saved Luxury Delivery Destinations
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  Packages are temperature-controlled and delivered in sealed velvet presentation boxes.
                </p>
              </div>
              <button
                className="btn-outline btn-sm quick-btn-interactive"
                onClick={() => setEditModalOpen(true)}
              >
                + Update Delivery Details
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
              
              {/* Primary Residence Address Card */}
              <TiltCard maxTilt={5} scale={1.01}>
                <SpotlightCard
                  spotlightColor="rgba(197, 160, 89, 0.2)"
                  style={{
                    padding: '2rem',
                    border: '1.5px solid var(--border-gold)',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🏠</span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                        {formData.addressType}
                      </h3>
                    </div>
                    <span
                      style={{
                        background: 'rgba(197, 160, 89, 0.15)',
                        color: 'var(--gold)',
                        border: '1px solid var(--border-gold)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                      }}
                    >
                      PRIMARY (DEFAULT)
                    </span>
                  </div>

                  <div style={{ marginBottom: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--gold-light)', marginBottom: '0.2rem' }}>
                      {formData.name}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      {formData.street}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Landmark:</span> {formData.landmark}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      {formData.city}, {formData.state} — <strong style={{ color: 'var(--text-primary)' }}>{formData.pincode}</strong>
                    </p>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Country: {formData.country}
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(197, 160, 89, 0.15)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span>📞</span>
                      <span>{formData.phone}</span>
                    </div>
                    <button
                      className="btn-outline btn-sm quick-btn-interactive"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => setEditModalOpen(true)}
                    >
                      Modify
                    </button>
                  </div>
                </SpotlightCard>
              </TiltCard>

              {/* Secondary Corporate / Office Address Card */}
              <TiltCard maxTilt={5} scale={1.01}>
                <SpotlightCard
                  spotlightColor="rgba(168, 85, 247, 0.2)"
                  style={{
                    padding: '2rem',
                    border: '1px solid rgba(197, 160, 89, 0.25)',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🏢</span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
                        Office / Corporate Suite
                      </h3>
                    </div>
                    <span
                      style={{
                        background: 'rgba(168, 85, 247, 0.15)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        padding: '0.2rem 0.65rem',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}
                    >
                      SECONDARY
                    </span>
                  </div>

                  <div style={{ marginBottom: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: '#e9d5ff', marginBottom: '0.2rem' }}>
                      {formData.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Attn: Executive Concierge)</span>
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      Suite 1408, One International Centre, Tower 2
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Landmark:</span> Senapati Bapat Marg, Elphinstone West
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                      Mumbai, Maharashtra — <strong style={{ color: 'var(--text-primary)' }}>400013</strong>
                    </p>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      Country: India
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(197, 160, 89, 0.15)', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <span>📞</span>
                      <span>{formData.phone}</span>
                    </div>
                    <button
                      className="btn-outline btn-sm quick-btn-interactive"
                      style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                      onClick={() => showToast('Secondary address already active for corporate orders!', 'success')}
                    >
                      Set As Default
                    </button>
                  </div>
                </SpotlightCard>
              </TiltCard>

            </div>
          </div>
        )}

        {/* ─── TAB 2: SHOPPING & FLACON ACQUISITIONS ───────────────────────── */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                  Curated Flacon Acquisitions & History
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                  Authentic batch registered flacons from French & Italian perfumeries.
                </p>
              </div>
              <button className="btn-gold btn-sm shimmer-btn" onClick={() => navigate('/shop')}>
                Explore Atelier Vault {'\u2192'}
              </button>
            </div>

            {loadingOrders ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gold)' }}>
                Loading your olfactory archive...
              </div>
            ) : orders.length === 0 ? (
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛍</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>No flacons in your vault yet</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Start your fragrance journey with our 19 curated world-class perfumes.
                </p>
                <button className="btn-gold" onClick={() => navigate('/shop')}>Browse Fragrances</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((ord, idx) => (
                  <SpotlightCard
                    key={ord._id || idx}
                    spotlightColor="rgba(197, 160, 89, 0.15)"
                    style={{ padding: '1.75rem', border: '1px solid rgba(197, 160, 89, 0.3)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(197, 160, 89, 0.15)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold)' }}>
                            Order #{String(ord._id).slice(-8).toUpperCase()}
                          </span>
                          <span
                            style={{
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: 'var(--emerald)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              padding: '0.15rem 0.6rem',
                              borderRadius: 999,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                            }}
                          >
                            ✓ {ord.status || 'Delivered via Express'}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                          Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Order Total
                        </p>
                        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold)', margin: 0 }}>
                          {'\u20B9'}{(ord.totalAmount || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Order items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                      {(ord.items || []).map((item, itemIdx) => (
                        <div key={itemIdx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                              src={item.image || '/perfumes/79117140_21505-10181-2-680x680.png'}
                              alt={item.name}
                              style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(197, 160, 89, 0.25)' }}
                              onError={e => { e.currentTarget.src = '/perfumes/79117140_21505-10181-2-680x680.png' }}
                            />
                            <div>
                              <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {item.brand || 'Luxury Atelier'}
                              </p>
                              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                {item.name}
                              </p>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                Size: {item.size || '100ml'} · Qty: {item.qty || 1}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--gold)' }}>
                              {'\u20B9'}{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}
                            </span>
                            <button
                              className="btn-outline btn-sm quick-btn-interactive"
                              onClick={() => {
                                showToast(`${item.name} reordered to bag!`, 'success')
                                navigate('/cart')
                              }}
                            >
                              Acquire Again
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Carrier & Tracking */}
                    <div style={{ marginTop: '1.25rem', paddingTop: '0.9rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🚚</span>
                        <span>Transport: <strong style={{ color: 'var(--text-primary)' }}>{ord.carrier || 'BlueDart Luxury Cold-Chain'}</strong></span>
                      </div>
                      <div>
                        <span>Tracking: <code style={{ color: 'var(--gold)', background: 'rgba(197, 160, 89,0.1)', padding: '2px 6px', borderRadius: 4 }}>{ord.trackingCode || `VV-BD-${String(ord._id).slice(-6)}`}</code></span>
                      </div>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: OLFACTORY IDENTITY ───────────────────────────────────── */}
        {activeTab === 'scent' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            
            {/* Olfactory Persona Card */}
            <SpotlightCard
              spotlightColor="rgba(197, 160, 89, 0.2)"
              style={{ padding: '2rem', border: '1px solid rgba(197, 160, 89, 0.3)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.75rem' }}>🧪</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0 }}>
                    Olfactory Persona
                  </h3>
                  <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>The Sophisticated Alchemist</span>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Your sensory palette favors enigmatic woody structures underpinned by warm tonka beans, smoky agarwood, and refined orris powders.
              </p>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>
                  Signature Accords Loved
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Smoky Agarwood', 'Atlas Cedar', 'Tuscan Iris', 'Bourbon Vanilla', 'Juniper Berries', 'Roasted Chestnut', 'White Musk'].map(note => (
                    <span
                      key={note}
                      style={{
                        background: 'rgba(197, 160, 89, 0.1)',
                        border: '1px solid rgba(197, 160, 89, 0.25)',
                        color: 'var(--gold-light)',
                        borderRadius: 999,
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.78rem',
                      }}
                    >
                      ✦ {note}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(197, 160, 89, 0.15)', paddingTop: '1rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Preferred Flacon: <strong style={{ color: 'var(--text-primary)' }}>100ml Eau de Parfum (Decanter)</strong>
                </p>
              </div>
            </SpotlightCard>

            {/* Recommended Signature Pairings */}
            <SpotlightCard
              spotlightColor="rgba(168, 85, 247, 0.2)"
              style={{ padding: '2rem', border: '1px solid rgba(168, 85, 247, 0.3)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.75rem' }}>✨</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: 0 }}>
                    Curated Signature Pairing
                  </h3>
                  <span style={{ color: '#c084fc', fontSize: '0.85rem' }}>Hand-picked for your skin chemistry</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: 12 }}>
                  <img src="/perfumes/79117140_21505-10181-2-680x680.png" alt="Oud Wood" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--gold)', margin: 0 }}>Tom Ford Oud Wood</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Evening & Galas · Smoky & Sovereign</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: 12 }}>
                  <img src="/perfumes/dark-t.65738.2x.avif" alt="Diptyque Orphéon" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--gold)', margin: 0 }}>Diptyque Orphéon</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>Daytime & Atelier · Juniper & Cedar</p>
                  </div>
                </div>
              </div>

              <button
                className="btn-gold shimmer-btn"
                style={{ width: '100%', padding: '0.75rem' }}
                onClick={() => navigate('/shop')}
              >
                Explore Matching Olfactory Vault
              </button>
            </SpotlightCard>

          </div>
        )}

        {/* ─── TAB 4: ATELIER VIP PRIVILEGES ───────────────────────────────── */}
        {activeTab === 'vip' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            
            <SpotlightCard
              spotlightColor="rgba(197, 160, 89, 0.25)"
              style={{ padding: '2rem', border: '1.5px solid var(--border-gold)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>👑</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0, color: 'var(--gold)' }}>
                    Gold Atelier Tier Status
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Top 5% Private Collector Privileges
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Progress to Platinum Sovereign:</span>
                  <strong style={{ color: 'var(--gold)' }}>85%</strong>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, var(--gold), #fef08a)', borderRadius: 999 }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                  Acquire 1 more 100ml flacon to unlock Platinum status and bespoke bottle engraving.
                </p>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  'Complimentary BlueDart refrigerated cold-chain on all orders',
                  'Exclusive 10% lifelong patron privilege with coupon code VELVET10',
                  'Complimentary hand-poured 5ml discovery vial with every flacon',
                  'Priority access to limited 50-bottle seasonal extraction batches',
                  'Velvet-lined obsidian gift keepsake box with custom wax seal stamp',
                ].map((perk, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </SpotlightCard>

            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.2)"
              style={{ padding: '2rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem' }}>📞</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0, color: 'var(--emerald)' }}>
                    Dedicated Private Scent Concierge
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    White-Glove 24/7 Consultation
                  </p>
                </div>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Need consultation on gifting, note layering, or securing hard-to-find vintage batch flacons? Your designated concierge specialist is directly at your service.
              </p>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: 12, marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                  Private Concierge Direct Line
                </p>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--gold)', margin: 0, fontWeight: 700 }}>
                  +91 800-VELVET-VIP
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  concierge@velvetvapors.com
                </p>
              </div>

              <button
                className="btn-outline quick-btn-interactive"
                style={{ width: '100%', padding: '0.75rem' }}
                onClick={() => navigate('/contact')}
              >
                Message Concierge Desk
              </button>
            </SpotlightCard>

          </div>
        )}

      </div>

      {/* ─── MODAL: EDIT PROFILE & DELIVERY ADDRESS ────────────────────────── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Patron Profile & Address"
      >
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Full Name</label>
              <input
                className="input-luxury"
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>Phone Number</label>
              <input
                className="input-luxury"
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 98201 54321"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Flat / Suite / Building Address</label>
            <input
              className="input-luxury"
              type="text"
              required
              value={formData.street}
              onChange={e => setFormData({ ...formData, street: e.target.value })}
              placeholder="e.g. B-402, Oberoi Sky Heights, Lokhandwala Complex"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Prominent Landmark</label>
            <input
              className="input-luxury"
              type="text"
              value={formData.landmark}
              onChange={e => setFormData({ ...formData, landmark: e.target.value })}
              placeholder="e.g. Opposite Celebration Club, 4th Cross Road"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.85rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>City</label>
              <input
                className="input-luxury"
                type="text"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="Mumbai"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>State</label>
              <input
                className="input-luxury"
                type="text"
                required
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label>PIN Code</label>
              <input
                className="input-luxury"
                type="text"
                required
                value={formData.pincode}
                onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="400053"
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label>Destination Category</label>
            <select
              className="input-luxury"
              value={formData.addressType}
              onChange={e => setFormData({ ...formData, addressType: e.target.value })}
              style={{ background: '#071f18', color: 'var(--text-primary)' }}
            >
              <option value="Home / Residence">Home / Residence</option>
              <option value="Corporate / Office Suite">Corporate / Office Suite</option>
              <option value="Private Studio / Atelier">Private Studio / Atelier</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn-outline"
              style={{ flex: 1 }}
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-gold shimmer-btn"
              style={{ flex: 1 }}
              disabled={saving}
            >
              {saving ? 'Saving...' : '💾 Save Address & Profile'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}
