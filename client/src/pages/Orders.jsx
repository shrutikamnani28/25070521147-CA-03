import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useNavigate } from 'react-router-dom'

const STAGES = ['Placed', 'Packed', 'Shipped', 'Delivered']

function TrackBar({ status }) {
  const idx = STAGES.indexOf(status)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '0.5rem 0' }}>
      {STAGES.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', minWidth: 60 }}>
            <div style={{
              width: 14, height: 14, borderRadius: '50%',
              background: i <= idx ? 'var(--gold)' : 'var(--gold-dim)',
              border: `2px solid ${i <= idx ? 'var(--gold)' : 'rgba(212,175,55,0.3)'}`,
              boxShadow: i <= idx ? '0 0 8px rgba(212,175,55,0.5)' : 'none',
              transition: 'all 0.3s',
            }} />
            <span style={{ fontSize: '0.65rem', color: i <= idx ? 'var(--gold)' : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{s}</span>
          </div>
          {i < STAGES.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < idx ? 'var(--gold)' : 'var(--gold-dim)', marginBottom: '1.3rem', transition: 'all 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Orders() {
  const { authFetch } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    authFetch('/api/orders/my')
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authFetch])

  if (loading) return (
    <div className="page-wrapper">
      <div className="container" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📦</div>
        <p style={{ color: 'var(--text-muted)' }}>Loading your orders…</p>
      </div>
    </div>
  )

  if (orders.length === 0) return (
    <div className="page-wrapper">
      <div className="container">
        <EmptyState icon="📦" title="No orders yet"
          subtitle="Your fragrance orders will appear here once you make a purchase."
          ctaLabel="Shop Now" onCta={() => navigate('/shop')} />
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>My Orders</h1>
        <p className="section-subtitle">Track your luxury fragrance deliveries</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(order => (
            <div key={order._id} className="glass-card" style={{ overflow: 'hidden' }}>
              {/* Header */}
              <button
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                style={{ width: '100%', background: 'none', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', cursor: 'pointer', textAlign: 'left' }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    Order #{String(order._id).slice(-8).toUpperCase()}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.8rem', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600,
                    background: order.status === 'Delivered' ? 'var(--emerald-dim)' : 'rgba(212,175,55,0.15)',
                    color: order.status === 'Delivered' ? 'var(--emerald)' : 'var(--gold)',
                    border: `1px solid ${order.status === 'Delivered' ? 'rgba(16,185,129,0.4)' : 'rgba(212,175,55,0.4)'}`,
                  }}>
                    {order.status}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {expanded === order._id ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {/* Expanded */}
              {expanded === order._id && (
                <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--gold-dim)' }}>
                  {/* Tracking */}
                  <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Delivery Tracking</p>
                    <TrackBar status={order.status} />
                  </div>

                  {/* Items */}
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Items Ordered</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                    {(order.items || []).map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.92rem', fontFamily: 'var(--font-serif)' }}>{item.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{item.size} × {item.qty}</p>
                        </div>
                        <span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem' }}>
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address */}
                  {order.shippingAddress && (
                    <div style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid var(--gold-dim)', borderRadius: 10, padding: '0.9rem 1.1rem' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Shipping To</p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {order.shippingAddress.name}, {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
