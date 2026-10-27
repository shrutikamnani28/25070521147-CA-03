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
    { to: '/about',   label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/home" className="navbar-logo">
            🌹 Velvet Vapors
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
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name?.split(' ')[0]}
            </span>
            <button onClick={handleLogout} className="btn-outline btn-sm">
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
        <NavLink to="/wishlist" className="navbar-link" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
        <NavLink to="/orders" className="navbar-link" onClick={() => setMenuOpen(false)}>My Orders</NavLink>
        <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="navbar-link" style={{ background: 'none', textAlign: 'left', color: 'var(--red)', width: '100%' }}>
          Logout
        </button>
      </div>
    </>
  )
}
