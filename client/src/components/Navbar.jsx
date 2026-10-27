import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider.jsx'
import { useCart } from '../context/CartProvider.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/home',    label: 'Home' },
    { to: '/shop',    label: 'Shop' },
    { to: '/reviews', label: 'Reviews' },
    { to: '/about',   label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/home" className="navbar-logo">
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.28), rgba(6, 78, 59, 0.2))',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 0 12px rgba(197, 160, 89, 0.3)',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold-light)' }}>
                <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
              </svg>
            </span>
            <span style={{
              background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 55%, #a27b38 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.18em',
            }}>
              Velvet Vapors
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar-links">
            {links.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            {user?.role === 'admin' && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
                >
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <Link to="/wishlist" className="icon-btn" title="Wishlist">♡</Link>
            <Link to="/cart" className="icon-btn" title="Cart">
              🛍
              {cartCount > 0 && <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>
            <Link to="/orders" className="icon-btn" title="My Orders" style={{ fontSize: '0.82rem', fontWeight: 500, padding: '0.4rem 0.7rem', color: 'var(--text-muted)' }}>
              Orders
            </Link>
            <Link
              to="/profile"
              title="Patron Profile & Delivery Address"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, rgba(197, 160, 89, 0.18), rgba(197, 160, 89, 0.05))',
                border: '1px solid var(--border-gold)',
                borderRadius: 999,
                padding: '0.32rem 0.85rem',
                color: 'var(--gold-light)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 0 12px rgba(197, 160, 89, 0.15)',
                transition: 'all 0.25s ease',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>👑</span>
              <span style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name?.split(' ')[0] || 'Patron'}
              </span>
            </Link>
            <button onClick={handleLogout} className="btn-outline btn-sm" style={{ padding: '0.35rem 0.9rem' }}>
              Logout
            </button>
            <button
              className="hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink to="/admin" className="navbar-link" onClick={() => setMenuOpen(false)}>Admin</NavLink>
        )}
        <NavLink to="/profile" className="navbar-link" onClick={() => setMenuOpen(false)}>👑 My Profile & Address</NavLink>
        <NavLink to="/wishlist" className="navbar-link" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
        <NavLink to="/orders" className="navbar-link" onClick={() => setMenuOpen(false)}>My Orders</NavLink>
        <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="navbar-link" style={{ background: 'none', textAlign: 'left', color: 'var(--red)', width: '100%' }}>
          Logout
        </button>
      </div>
    </>
  )
}
