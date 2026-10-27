import { NavLink } from 'react-router-dom'

export default function MobileDock() {
  const items = [
    { to: '/home',    icon: '🏠', label: 'Home' },
    { to: '/shop',    icon: '✦',  label: 'Shop' },
    { to: '/cart',    icon: '🛍', label: 'Bag' },
    { to: '/wishlist',icon: '♡',  label: 'Wish' },
    { to: '/orders',  icon: '📦', label: 'Orders' },
    { to: '/profile', icon: '👑', label: 'Profile' },
  ]
  return (
    <div className="mobile-dock">
      {items.map(i => (
        <NavLink
          key={i.to}
          to={i.to}
          className={({ isActive }) => `dock-item${isActive ? ' active' : ''}`}
        >
          <span>{i.icon}</span>
          <span className="dock-label">{i.label}</span>
        </NavLink>
      ))}
    </div>
  )
}
