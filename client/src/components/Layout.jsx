import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import MobileDock from './MobileDock.jsx'
import AmbientBackdrop from './AmbientBackdrop.jsx'

export default function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      <AmbientBackdrop />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      <MobileDock />
    </div>
  )
}
