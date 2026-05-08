import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import './index.css'

function App() {
  return (
    <Router basename="/ibrali-tours">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
