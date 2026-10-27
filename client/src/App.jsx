import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthProvider.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Orders from './pages/Orders.jsx'
import Wishlist from './pages/Wishlist.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Reviews from './pages/Reviews.jsx'
import Profile from './pages/Profile.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05140f' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(197, 160, 89, 0.1)', border: '1.5px solid var(--border-gold)', boxShadow: '0 0 30px rgba(197, 160, 89, 0.25)', marginBottom: '1.25rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold-light)' }}>
              <path d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z" />
            </svg>
          </div>
          <p style={{ color: 'var(--gold)', fontFamily: "'Cinzel', serif", fontSize: '1.35rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 800 }}>Velvet Vapors</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', letterSpacing: '0.05em' }}>Atelier Niche Parfumerie…</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public root */}
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

      {/* Auth pages */}
      <Route path="/login"    element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />

      {/* Protected pages wrapped in Layout (Navbar) */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/home"        element={<Home />} />
        <Route path="/shop"        element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart"        element={<Cart />} />
        <Route path="/checkout"    element={<Checkout />} />
        <Route path="/orders"      element={<Orders />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/wishlist"    element={<Wishlist />} />
        <Route path="/reviews"     element={<Reviews />} />
        <Route path="/about"       element={<About />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/admin"       element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
