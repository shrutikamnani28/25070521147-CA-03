import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import EmptyState from '../components/EmptyState.jsx'

const STEPS = ['Bag Review', 'Shipping', 'Payment', 'Confirmation']

function Stepper({ current }) {
  return (
    <div className="step-track">
      {STEPS.map((label, i) => (
        <>
          {i > 0 && <div key={`line-${i}`} className={`step-line${i <= current ? ' done' : ''}`} />}
          <div key={label} className={`step-item${i === current ? ' active' : ''}${i < current ? ' done' : ''}`}>
            <div className="step-circle">{i < current ? '✓' : i + 1}</div>
            <span className="step-label">{label}</span>
          </div>
        </>
      ))}
    </div>
  )
}

export default function Checkout() {
  const { authFetch } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [step, setStep] = useState(0)
  const [orderId, setOrderId] = useState(null)
  const [loading, setLoading] = useState(false)

  const couponFromCart = location.state?.coupon || ''
  const [coupon] = useState(couponFromCart)

  const discount = coupon.toUpperCase() === 'VELVET10' ? 0.1 : 0
  const discountAmt = Math.round(cartTotal * discount)
  const shipping = cartTotal >= 4000 ? 0 : 199
  const finalTotal = cartTotal - discountAmt + shipping

  const [address, setAddress] = useState({ name: '', phone: '', line1: '', city: '', state: '', pincode: '' })
  const [payment, setPayment] = useState('COD')

  const addressFields = [
    { key: 'name',    label: 'Full Name',    placeholder: 'Your name' },
    { key: 'phone',   label: 'Phone Number', placeholder: '10-digit mobile' },
    { key: 'line1',   label: 'Address',      placeholder: 'House, Street, Area' },
    { key: 'city',    label: 'City',         placeholder: 'City' },
    { key: 'state',   label: 'State',        placeholder: 'State' },
    { key: 'pincode', label: 'PIN Code',     placeholder: '6-digit PIN' },
  ]

  if (cart.length === 0 && step < 3) return (
    <div className="page-wrapper">
      <div className="container">
        <EmptyState icon="🛍" title="Your bag is empty" ctaLabel="Go to Shop" onCta={() => navigate('/shop')} />
      </div>
    </div>
  )

  function validateAddress() {
    for (const f of addressFields) {
      if (!address[f.key]?.trim()) { showToast(`${f.label} is required`, 'error'); return false }
    }
    if (!/^\d{10}$/.test(address.phone)) { showToast('Enter a valid 10-digit phone number', 'error'); return false }
    if (!/^\d{6}$/.test(address.pincode)) { showToast('Enter a valid 6-digit PIN code', 'error'); return false }
    return true
  }

  async function placeOrder() {
    setLoading(true)
    try {
      const res = await authFetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cart.map(i => ({ _id: i._id, name: i.name, price: i.price, size: i.size, qty: i.qty, image: i.image })),
          totalAmount: finalTotal,
          shippingAddress: address,
          couponCode: coupon || null,
          paymentMethod: payment,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.msg)
      setOrderId(data.order._id)
      clearCart()
      setStep(3)
    } catch (err) {
      showToast(err.message || 'Order failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Checkout</h1>
        <Stepper current={step} />

        {/* Step 0: Bag Review */}
        {step === 0 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Review Your Bag</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {cart.map(item => (
                <div key={`${item._id}_${item.size}`} className="glass-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>{item.name}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{item.size} × {item.qty}</p>
                  </div>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            {/* Price breakdown */}
            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
              {[
                ['Subtotal', `₹${cartTotal.toLocaleString('en-IN')}`],
                discount > 0 ? ['Coupon Discount', `−₹${discountAmt.toLocaleString('en-IN')}`] : null,
                ['Shipping', shipping === 0 ? 'Free' : `₹${shipping}`],
                ['Total', `₹${finalTotal.toLocaleString('en-IN')}`],
              ].filter(Boolean).map(([label, val], i, arr) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', color: i === arr.length-1 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === arr.length-1 ? 700 : 400, fontSize: i === arr.length-1 ? '1.05rem' : '0.9rem', paddingBottom: '0.5rem' }}>
                  <span>{label}</span><span style={{ color: label === 'Total' ? 'var(--gold)' : undefined }}>{val}</span>
                </div>
              ))}
            </div>
            <button className="btn-gold" style={{ width: '100%', padding: '0.9rem' }} onClick={() => setStep(1)}>Continue to Shipping →</button>
          </div>
        )}

        {/* Step 1: Shipping */}
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Shipping Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {addressFields.map(f => (
                <div key={f.key} className="form-group" style={{ marginBottom: 0 }}>
                  <label>{f.label}</label>
                  <input className="input-luxury" placeholder={f.placeholder}
                    value={address[f.key]} onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-outline" onClick={() => setStep(0)}>← Back</button>
              <button className="btn-gold" style={{ flex: 1, padding: '0.9rem' }} onClick={() => { if (validateAddress()) setStep(2) }}>Continue to Payment →</button>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1.25rem' }}>Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { val: 'COD', icon: '💵', label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
                { val: 'UPI', icon: '📱', label: 'UPI / QR Code',    sub: 'Instant payment via any UPI app' },
                { val: 'CARD', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay accepted' },
              ].map(o => (
                <label key={o.val} className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', border: payment === o.val ? '1px solid var(--gold)' : '1px solid var(--gold-dim)' }}>
                  <input type="radio" name="payment" value={o.val} checked={payment === o.val} onChange={() => setPayment(o.val)} style={{ accentColor: 'var(--gold)', flexShrink: 0 }} />
                  <span style={{ fontSize: '1.4rem' }}>{o.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{o.label}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{o.sub}</p>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-gold" style={{ flex: 1, padding: '0.9rem' }} disabled={loading}
                onClick={placeOrder}>
                {loading ? 'Placing Order…' : `Place Order — ₹${finalTotal.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--gold)' }}>Order Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Your luxury fragrances are on their way.</p>
            {orderId && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Order ID: <span style={{ color: 'var(--gold)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{orderId}</span>
              </p>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-gold" onClick={() => navigate('/orders')}>Track Your Order</button>
              <button className="btn-outline" onClick={() => navigate('/shop')}>Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
