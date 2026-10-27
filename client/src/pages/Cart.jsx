import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [coupon, setCoupon]           = useState('')
  const [discount, setDiscount]       = useState(0)
  const [couponMsg, setCouponMsg]     = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === 'VELVET10') {
      setDiscount(10)
      setCouponMsg('✓ 10% discount applied!')
    } else {
      setDiscount(0)
      setCouponMsg('Invalid coupon code.')
    }
  }

  const discountAmt = Math.round(cartTotal * discount / 100)
  const finalTotal  = cartTotal - discountAmt

  if (cart.length === 0) return (
    <div className="page-wrapper">
      <div className="container">
        <EmptyState icon="🛍" title="Your bag is empty"
          subtitle="Discover our luxury fragrance collection and find your signature scent."
          ctaLabel="Shop Now" onCta={() => navigate('/shop')} />
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="section-title">Your Bag</h1>
          <button onClick={() => setConfirmClear(true)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer' }}>
            Clear all
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.map(item => (
              <div key={`${item._id}_${item.size}`} className="glass-card" style={{ padding: '1.1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{item.size} · ₹{item.price.toLocaleString('en-IN')}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQty(item._id, item.size, item.qty - 1)} disabled={item.qty <= 1}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--gold-dim)', background: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.size, item.qty + 1)}
                      style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--gold-dim)', background: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontWeight: 700 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  <button onClick={() => { removeFromCart(item._id, item.size); showToast('Item removed', 'error') }}
                    style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', marginTop: '0.5rem' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--emerald)', fontSize: '0.9rem' }}>
                  <span>Discount (VELVET10)</span>
                  <span>−₹{discountAmt.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--emerald)' }}>{cartTotal >= 4000 ? 'Free' : '₹199'}</span>
              </div>
              <hr className="divider-gold" style={{ margin: '0.25rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>
                  ₹{(finalTotal + (cartTotal < 4000 ? 199 : 0)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Coupon */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input-luxury" placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ flex: 1 }} />
                <button className="btn-outline btn-sm" onClick={applyCoupon}>Apply</button>
              </div>
              {couponMsg && <p style={{ fontSize: '0.82rem', marginTop: '0.4rem', color: discount > 0 ? 'var(--emerald)' : 'var(--red)' }}>{couponMsg}</p>}
            </div>

            <button className="btn-gold" style={{ width: '100%', fontSize: '1rem', padding: '0.9rem' }}
              onClick={() => navigate('/checkout', { state: { coupon: discount > 0 ? 'VELVET10' : '' } })}>
              Proceed to Checkout →
            </button>
            <button className="btn-outline" style={{ width: '100%', marginTop: '0.75rem' }} onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>
          </div>
        </div>

        <ConfirmDialog
          isOpen={confirmClear}
          onClose={() => setConfirmClear(false)}
          onConfirm={() => { clearCart(); showToast('Bag cleared', 'error') }}
          title="Clear your bag?"
          message="All items will be removed from your bag. This action cannot be undone."
        />
      </div>
    </div>
  )
}
