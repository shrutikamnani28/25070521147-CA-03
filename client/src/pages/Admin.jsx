import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthProvider.jsx'
import { useToast } from '../context/ToastProvider.jsx'
import Modal from '../components/Modal.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Badge from '../components/Badge.jsx'

const CATEGORIES = ['Floral', 'Woody', 'Fresh', 'Oriental']
const GENDERS = ['Unisex', 'For Her', 'For Him']
const STATUS_OPTIONS = ['Placed', 'Packed', 'Shipped', 'Delivered']

export default function Admin() {
  const { authFetch } = useAuth()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('stats') // 'stats' | 'perfumes' | 'orders' | 'customers'

  // Data states
  const [stats, setStats] = useState({ totalUsers: 0, totalPerfumes: 0, totalOrders: 0, totalRevenue: 0 })
  const [perfumes, setPerfumes] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [perfumeModalOpen, setPerfumeModalOpen] = useState(false)
  const [editingPerfume, setEditingPerfume] = useState(null)
  const [perfumeForm, setPerfumeForm] = useState({
    name: '',
    brand: 'Velvet Vapors',
    price: 3999,
    size: '100ml',
    category: 'Woody',
    gender: 'Unisex',
    topNotes: 'Bergamot, Black Pepper',
    heartNotes: 'Cedarwood, Rose',
    baseNotes: 'Amber, Sandalwood',
    longevity: '8+ hours',
    sillage: 'Moderate',
    stock: 20,
    rating: 4.8,
    description: '',
    image: '/perfumes/woody/16_sandal_noir.png'
  })

  // Delete Confirm Dialog
  const [deleteConfirm, setDeleteConfirm] = useState({
    open: false,
    title: '',
    message: '',
    action: null
  })

  // Fetch Stats
  const loadStats = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // ignore
    }
  }, [authFetch])

  // Fetch Perfumes
  const loadPerfumes = useCallback(async () => {
    try {
      const res = await authFetch('/api/perfumes')
      if (res.ok) {
        const data = await res.json()
        setPerfumes(data.perfumes || [])
      }
    } catch {
      // ignore
    }
  }, [authFetch])

  // Fetch Orders
  const loadOrders = useCallback(async () => {
    try {
      const res = await authFetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch {
      // ignore
    }
  }, [authFetch])

  // Fetch Customers
  const loadUsers = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch {
      // ignore
    }
  }, [authFetch])

  // Initial load
  useEffect(() => {
    setLoading(true)
    Promise.all([loadStats(), loadPerfumes(), loadOrders(), loadUsers()])
      .finally(() => setLoading(false))
  }, [loadStats, loadPerfumes, loadOrders, loadUsers])

  // Handlers for Perfume Modal
  const openNewPerfumeModal = () => {
    setEditingPerfume(null)
    setPerfumeForm({
      name: '',
      brand: 'Velvet Vapors',
      price: 3999,
      size: '100ml',
      category: 'Woody',
      gender: 'Unisex',
      topNotes: 'Bergamot, Black Pepper',
      heartNotes: 'Cedarwood, Rose',
      baseNotes: 'Amber, Sandalwood',
      longevity: '8+ hours',
      sillage: 'Moderate',
      stock: 20,
      rating: 4.8,
      description: '',
      image: '/perfumes/woody/16_sandal_noir.png'
    })
    setPerfumeModalOpen(true)
  }

  const openEditPerfumeModal = (p) => {
    setEditingPerfume(p)
    setPerfumeForm({
      name: p.name,
      brand: p.brand,
      price: p.price,
      size: p.size || '100ml',
      category: p.category,
      gender: p.gender,
      topNotes: (p.scentPyramid?.topNotes || []).join(', '),
      heartNotes: (p.scentPyramid?.heartNotes || []).join(', '),
      baseNotes: (p.scentPyramid?.baseNotes || []).join(', '),
      longevity: p.longevity || '8+ hours',
      sillage: p.sillage || 'Moderate',
      stock: p.stock ?? 20,
      rating: p.rating ?? 4.8,
      description: p.description || '',
      image: p.image || ''
    })
    setPerfumeModalOpen(true)
  }

  const handleSavePerfume = async (e) => {
    e.preventDefault()
    if (!perfumeForm.name.trim()) {
      showToast('Name is required', 'error')
      return
    }

    const payload = {
      name: perfumeForm.name.trim(),
      brand: perfumeForm.brand.trim(),
      price: Number(perfumeForm.price),
      size: perfumeForm.size,
      category: perfumeForm.category,
      gender: perfumeForm.gender,
      scentPyramid: {
        topNotes: perfumeForm.topNotes.split(',').map(s => s.trim()).filter(Boolean),
        heartNotes: perfumeForm.heartNotes.split(',').map(s => s.trim()).filter(Boolean),
        baseNotes: perfumeForm.baseNotes.split(',').map(s => s.trim()).filter(Boolean)
      },
      longevity: perfumeForm.longevity,
      sillage: perfumeForm.sillage,
      stock: Number(perfumeForm.stock),
      rating: Number(perfumeForm.rating),
      description: perfumeForm.description.trim(),
      image: perfumeForm.image.trim()
    }

    try {
      if (editingPerfume) {
        const res = await authFetch(`/api/perfumes/${editingPerfume._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to update perfume')
        showToast(`Updated "${payload.name}"`)
      } else {
        const res = await authFetch('/api/perfumes', {
          method: 'POST',
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Failed to create perfume')
        showToast(`Created "${payload.name}"`)
      }
      setPerfumeModalOpen(false)
      loadPerfumes()
      loadStats()
    } catch (err) {
      showToast(err.message || 'Error saving fragrance', 'error')
    }
  }

  // Delete Perfume
  const handleDeletePerfumePrompt = (p) => {
    setDeleteConfirm({
      open: true,
      title: `Delete Fragrance: ${p.name}?`,
      message: `Are you sure you want to permanently delete "${p.name}"? This action cannot be reversed.`,
      action: async () => {
        try {
          const res = await authFetch(`/api/perfumes/${p._id}`, { method: 'DELETE' })
          if (res.ok) {
            showToast(`Deleted ${p.name}`, 'error')
            loadPerfumes()
            loadStats()
          } else {
            showToast('Failed to delete perfume', 'error')
          }
        } catch {
          showToast('Failed to delete perfume', 'error')
        }
      }
    })
  }

  // Quick Stock Adjustment
  const handleStockUpdate = async (p, delta) => {
    const newStock = Math.max(0, (p.stock || 0) + delta)
    try {
      const res = await authFetch(`/api/perfumes/${p._id}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: newStock })
      })
      if (res.ok) {
        showToast(`Stock updated to ${newStock} for ${p.name}`)
        setPerfumes(prev => prev.map(item => item._id === p._id ? { ...item, stock: newStock } : item))
      }
    } catch {
      showToast('Error updating stock', 'error')
    }
  }

  // Update Order Status
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await authFetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        showToast(`Order status updated to "${newStatus}"`)
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      }
    } catch {
      showToast('Failed to update order status', 'error')
    }
  }

  // Toggle User Role
  const handleUserRoleToggle = async (u) => {
    const targetRole = u.role === 'admin' ? 'customer' : 'admin'
    try {
      const res = await authFetch(`/api/admin/users/${u._id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: targetRole })
      })
      if (res.ok) {
        showToast(`Updated ${u.name}'s role to ${targetRole}`)
        setUsers(prev => prev.map(item => item._id === u._id ? { ...item, role: targetRole } : item))
      } else {
        const d = await res.json()
        showToast(d.msg || 'Cannot update role', 'error')
      }
    } catch {
      showToast('Failed to change role', 'error')
    }
  }

  // Delete User
  const handleDeleteUserPrompt = (u) => {
    setDeleteConfirm({
      open: true,
      title: `Delete User: ${u.name}?`,
      message: `Are you sure you want to remove ${u.name} (${u.email}) from the database?`,
      action: async () => {
        try {
          const res = await authFetch(`/api/admin/users/${u._id}`, { method: 'DELETE' })
          if (res.ok) {
            showToast(`User ${u.name} removed`)
            loadUsers()
            loadStats()
          } else {
            const d = await res.json()
            showToast(d.msg || 'Failed to delete user', 'error')
          }
        } catch {
          showToast('Failed to delete user', 'error')
        }
      }
    })
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '1.5rem' }}>👑</span>
              <h1 className="section-title" style={{ margin: 0 }}>Executive Maison Dashboard</h1>
            </div>
            <p className="section-subtitle" style={{ margin: 0 }}>
              Master inventory controls, order tracking dispatch, and clientele database
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="btn-gold btn-sm" onClick={openNewPerfumeModal}>
              + Add New Fragrance
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.6rem', borderBottom: '1px solid var(--gold-dim)', paddingBottom: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
          {[
            { id: 'stats', label: '📊 Atelier Overview', count: null },
            { id: 'perfumes', label: '🌹 Fragrance Catalog', count: perfumes.length },
            { id: 'orders', label: '📦 Orders & Dispatch', count: orders.length },
            { id: 'customers', label: '👥 Registered Patrons', count: users.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.55rem 1.2rem',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 600,
                border: activeTab === tab.id ? '1px solid var(--gold)' : '1px solid transparent',
                background: activeTab === tab.id ? 'var(--gold-dim)' : 'transparent',
                color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label} {tab.count !== null && <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>({tab.count})</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌹</div>
            <p style={{ color: 'var(--text-muted)' }}>Syncing Atelier records...</p>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW & STATS */}
            {activeTab === 'stats' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                  <div className="glass-card" style={{ padding: '1.8rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Gross Revenue</p>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: '2.2rem', margin: '0.5rem 0' }}>
                      ₹{stats.totalRevenue.toLocaleString('en-IN')}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--emerald)' }}>↑ Verified Sales</span>
                  </div>

                  <div className="glass-card" style={{ padding: '1.8rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Orders</p>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '2.2rem', margin: '0.5rem 0' }}>
                      {stats.totalOrders}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold)' }}>Dispatch Tracking Live</span>
                  </div>

                  <div className="glass-card" style={{ padding: '1.8rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fragrance Master SKUs</p>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '2.2rem', margin: '0.5rem 0' }}>
                      {stats.totalPerfumes}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Catalog Active</span>
                  </div>

                  <div className="glass-card" style={{ padding: '1.8rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Registered Patrons</p>
                    <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', fontSize: '2.2rem', margin: '0.5rem 0' }}>
                      {stats.totalUsers}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--emerald)' }}>Clientele Base</span>
                  </div>
                </div>

                {/* Recent Orders Sneak Peek */}
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--gold)' }}>
                  Recent Orders & Fast Status Toggles
                </h3>
                <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--gold-dim)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '0.75rem' }}>Order ID</th>
                        <th style={{ padding: '0.75rem' }}>Patron</th>
                        <th style={{ padding: '0.75rem' }}>Total</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Quick Transition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id} style={{ borderBottom: '1px solid rgba(197, 160, 89,0.08)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '0.75rem', fontFamily: 'monospace', color: 'var(--gold)' }}>
                            #{String(o._id).slice(-6).toUpperCase()}
                          </td>
                          <td style={{ padding: '0.75rem' }}>{o.userName || o.shippingAddress?.name || 'Patron'}</td>
                          <td style={{ padding: '0.75rem', fontWeight: 600 }}>₹{o.totalAmount?.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: 999,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: o.status === 'Delivered' ? 'var(--emerald-dim)' : 'rgba(197, 160, 89,0.15)',
                              color: o.status === 'Delivered' ? 'var(--emerald)' : 'var(--gold)'
                            }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <select
                              className="input-luxury"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', width: 'auto' }}
                              value={o.status}
                              onChange={e => handleOrderStatusUpdate(o._id, e.target.value)}
                            >
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PERFUMES INVENTORY */}
            {activeTab === 'perfumes' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {perfumes.map(p => (
                    <div key={p._id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid var(--gold-dim)' }}>
                        <img
                          src={p.image || '/perfumes/floral/01_velvet_rose.png'}
                          alt={p.name}
                          onError={(e) => { e.currentTarget.src = '/perfumes/floral/01_velvet_rose.png' }}
                          style={{ width: 70, height: 70, borderRadius: 10, objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', margin: '0 0 0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </h4>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                            <Badge type={p.category} />
                            <Badge type={p.gender} />
                          </div>
                          <span style={{ color: 'var(--gold)', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>
                            ₹{p.price?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Stock Adjuster */}
                      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Stock Count:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleStockUpdate(p, -1)}
                              style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--gold-dim)', border: 'none', color: 'var(--gold)', cursor: 'pointer' }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: 700, minWidth: 28, textAlign: 'center', color: p.stock <= 5 ? 'var(--red)' : 'var(--emerald)' }}>
                              {p.stock}
                            </span>
                            <button
                              onClick={() => handleStockUpdate(p, 1)}
                              style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--gold-dim)', border: 'none', color: 'var(--gold)', cursor: 'pointer' }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Top / Heart / Base Notes Pill */}
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                          <strong>Notes:</strong> {p.scentPyramid?.topNotes?.slice(0, 2).join(', ')} • {p.scentPyramid?.baseNotes?.slice(0, 2).join(', ')}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                          <button
                            className="btn-outline btn-sm"
                            style={{ flex: 1 }}
                            onClick={() => openEditPerfumeModal(p)}
                          >
                            ✎ Edit Formula
                          </button>
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => handleDeletePerfumePrompt(p)}
                          >
                            ✕ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ORDERS & TRACKING */}
            {activeTab === 'orders' && (
              <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 700 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--gold-dim)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.85rem' }}>Order Details</th>
                      <th style={{ padding: '0.85rem' }}>Recipient & Address</th>
                      <th style={{ padding: '0.85rem' }}>Items Breakdown</th>
                      <th style={{ padding: '0.85rem' }}>Amount</th>
                      <th style={{ padding: '0.85rem' }}>Live Tracking Stage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(197, 160, 89,0.08)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '0.85rem', verticalAlign: 'top' }}>
                          <span style={{ fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 600 }}>
                            #{String(o._id).slice(-8).toUpperCase()}
                          </span>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                            {new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                          </div>
                          {o.discountApplied && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--emerald)', background: 'var(--emerald-dim)', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 4 }}>
                              VELVET10 Applied
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '0.85rem', verticalAlign: 'top' }}>
                          <strong>{o.shippingAddress?.name || o.userName}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 3 }}>
                            {o.shippingAddress?.line1}, {o.shippingAddress?.city} - {o.shippingAddress?.pincode}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            📞 {o.shippingAddress?.phone}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {(o.items || []).map((item, idx) => (
                              <span key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                • {item.name} ({item.size}) × <strong>{item.qty}</strong>
                              </span>
                            ))}
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem', verticalAlign: 'top', fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>
                          ₹{o.totalAmount?.toLocaleString('en-IN')}
                        </td>

                        <td style={{ padding: '0.85rem', verticalAlign: 'top' }}>
                          <select
                            className="input-luxury"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: '100%', minWidth: 120 }}
                            value={o.status}
                            onChange={e => handleOrderStatusUpdate(o._id, e.target.value)}
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: CLIENTELE & USERS */}
            {activeTab === 'customers' && (
              <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--gold-dim)', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.85rem' }}>Patron Name</th>
                      <th style={{ padding: '0.85rem' }}>Email Address</th>
                      <th style={{ padding: '0.85rem' }}>Access Tier</th>
                      <th style={{ padding: '0.85rem' }}>Member Since</th>
                      <th style={{ padding: '0.85rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(197, 160, 89,0.08)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '0.85rem', fontWeight: 600 }}>
                          {u.name}
                        </td>
                        <td style={{ padding: '0.85rem', color: 'var(--text-muted)' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '0.85rem' }}>
                          <Badge type={u.role === 'admin' ? 'admin' : 'Unisex'}>
                            {u.role.toUpperCase()}
                          </Badge>
                        </td>
                        <td style={{ padding: '0.85rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{ padding: '0.85rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="btn-outline btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                              onClick={() => handleUserRoleToggle(u)}
                            >
                              Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                            </button>
                            <button
                              className="btn-danger btn-sm"
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                              onClick={() => handleDeleteUserPrompt(u)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Modal: Create / Edit Perfume */}
        <Modal
          isOpen={perfumeModalOpen}
          onClose={() => setPerfumeModalOpen(false)}
          title={editingPerfume ? `Edit Fragrance: ${editingPerfume.name}` : 'Formulate New Fragrance'}
          maxWidth="640px"
        >
          <form onSubmit={handleSavePerfume}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Fragrance Title</label>
                <input
                  type="text"
                  className="input-luxury"
                  placeholder="e.g. Saffron Noir"
                  value={perfumeForm.name}
                  onChange={e => setPerfumeForm({ ...perfumeForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  className="input-luxury"
                  value={perfumeForm.price}
                  onChange={e => setPerfumeForm({ ...perfumeForm, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Family</label>
                <select
                  className="input-luxury"
                  value={perfumeForm.category}
                  onChange={e => setPerfumeForm({ ...perfumeForm, category: e.target.value })}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Audience</label>
                <select
                  className="input-luxury"
                  value={perfumeForm.gender}
                  onChange={e => setPerfumeForm({ ...perfumeForm, gender: e.target.value })}
                >
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Stock Count</label>
                <input
                  type="number"
                  className="input-luxury"
                  value={perfumeForm.stock}
                  onChange={e => setPerfumeForm({ ...perfumeForm, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Olfactory Pyramid Inputs */}
            <div className="form-group">
              <label>△ Top Notes (comma separated)</label>
              <input
                type="text"
                className="input-luxury"
                placeholder="Bergamot, Cardamom, Pink Pepper"
                value={perfumeForm.topNotes}
                onChange={e => setPerfumeForm({ ...perfumeForm, topNotes: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>◆ Heart Notes (comma separated)</label>
              <input
                type="text"
                className="input-luxury"
                placeholder="Rose Absolute, Bulgarian Jasmine, Oud"
                value={perfumeForm.heartNotes}
                onChange={e => setPerfumeForm({ ...perfumeForm, heartNotes: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>▽ Base Notes (comma separated)</label>
              <input
                type="text"
                className="input-luxury"
                placeholder="Atlas Cedar, Amber, Haitian Vetiver"
                value={perfumeForm.baseNotes}
                onChange={e => setPerfumeForm({ ...perfumeForm, baseNotes: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>High-Res Image URL</label>
              <input
                type="url"
                className="input-luxury"
                placeholder="https://images.unsplash.com/..."
                value={perfumeForm.image}
                onChange={e => setPerfumeForm({ ...perfumeForm, image: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Fragrance Narrative & Description</label>
              <textarea
                className="input-luxury"
                rows="3"
                placeholder="Describe the mood, atmosphere, and sensory evolution..."
                value={perfumeForm.description}
                onChange={e => setPerfumeForm({ ...perfumeForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button type="button" className="btn-outline" onClick={() => setPerfumeModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-gold">
                {editingPerfume ? 'Save Modifications' : 'Publish Fragrance'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Custom Confirmation Modal (No window.confirm) */}
        <ConfirmDialog
          isOpen={deleteConfirm.open}
          onClose={() => setDeleteConfirm({ ...deleteConfirm, open: false })}
          title={deleteConfirm.title}
          message={deleteConfirm.message}
          onConfirm={() => {
            if (deleteConfirm.action) deleteConfirm.action()
          }}
        />
      </div>
    </div>
  )
}
