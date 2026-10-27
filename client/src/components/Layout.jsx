import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import MobileDock from './MobileDock.jsx'

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <MobileDock />
    </div>
  )
}
