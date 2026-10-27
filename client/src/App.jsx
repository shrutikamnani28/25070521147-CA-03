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
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0510' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌹</div>
          <p style={{ color: '#d4af37', fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>Velvet Vapors</p>
          <p style={{ color: '#a89bc2', fontSize: '0.85rem', marginTop: '0.5rem' }}>Preparing your experience…</p>
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
        <Route path="/wishlist"    element={<Wishlist />} />
        <Route path="/about"       element={<About />} />
        <Route path="/contact"     element={<Contact />} />
        <Route path="/admin"       element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
