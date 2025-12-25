import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import TopNavbar from './components/TopNavbar'
import Home from './pages/Home'
import Login from './pages/Login'
import PresensiKajian from './pages/PresensiKajian'
import RekapBulanShalat from './pages/shalat/RekapBulanShalat'
import Presensi from './pages/shalat/Presensi'
import RiwayatShalat from './pages/shalat/RiwayatShalat'
import Footer from './components/Footer'

// COMPONENT UNTUK KONTROL NAVBAR
const Layout = () => {
  const location = useLocation()

  // Navbar tidak tampil di halaman login
  const hideNavbar = location.pathname === '/login'

  return (
    <div className="relative min-h-screen pb-6 bg-yellow-50 poppins-medium">
      {!hideNavbar && <TopNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* SHALAT */}
        <Route path="/absensi-shalat/rekap-shalat-bulan" element={<RekapBulanShalat />} />
        <Route path="/absensi-shalat/absensi" element={<Presensi />} />
        <Route path="/absensi-shalat/riwayat-absen-shalat" element={<RiwayatShalat />} />

        {/* KAJIAN */}
        <Route path="/presensi-kajian" element={<PresensiKajian />} />
      </Routes>
      {!hideNavbar && <Footer/>}
      
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App
