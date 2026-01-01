import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import TopNavbar from './components/TopNavbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Logout from './pages/Logout'
import PresensiKajian from './pages/PresensiKajian'
import RekapBulanShalat from './pages/shalat/RekapBulanShalat'
import Presensi from './pages/shalat/Presensi'
import RiwayatShalat from './pages/shalat/RiwayatShalat'
import PrivateRoute from './routes/PrivateRoute'
import PublicRoute from './routes/PublicRoute'
import NotFound from './pages/NotFound'
import SuperAdminRoute from './routes/SuperAdminRoute'
import UserList from './pages/admin/UserList'
import AdminShalat from './pages/admin/AdminShalat'
import AdminKajian from './pages/admin/AdminKajian'
import CreateUser from './pages/admin/CreateUser'

// =========================
// LAYOUT
// =========================
const Layout = () => {
  const location = useLocation()

  const hideNavbar =
    location.pathname === '/login'

  return (
    <div className="relative min-h-screen pb-6 bg-yellow-50 poppins-medium">
      {!hideNavbar && <TopNavbar />}

      <Routes>

        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* PRIVATE */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* SHALAT */}
        <Route
          path="/absensi-shalat/rekap-shalat-bulan"
          element={
            <PrivateRoute>
              <RekapBulanShalat />
            </PrivateRoute>
          }
        />

        <Route
          path="/absensi-shalat/absensi"
          element={
            <PrivateRoute>
              <Presensi />
            </PrivateRoute>
          }
        />

        <Route
          path="/absensi-shalat/riwayat-absen-shalat"
          element={
            <PrivateRoute>
              <RiwayatShalat />
            </PrivateRoute>
          }
        />

        {/* KAJIAN */}
        <Route
          path="/presensi-kajian"
          element={
            <PrivateRoute>
              <PresensiKajian />
            </PrivateRoute>
          }
        />

        {/* LOGOUT */}
        <Route path="/logout" element={<Logout />} />

        {/* NOT FOUND */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <NotFound />
            </PrivateRoute>
          }
        />

        {/* -----------------------------Route Super admin ---------------------*/}
         <Route
          path="/admin/shalat"
          element={
            <SuperAdminRoute role="super_admin">
              <AdminShalat />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/admin/user-list"
          element={
            <SuperAdminRoute role="super_admin">
              <UserList />
            </SuperAdminRoute>
          }
        />

        <Route
          path="/admin/kajian"
          element={
            <SuperAdminRoute role="super_admin">
              <AdminKajian />
            </SuperAdminRoute>
          }
        />

         <Route
          path="/admin/create-user"
          element={
            <SuperAdminRoute role="super_admin">
              <CreateUser />
            </SuperAdminRoute>
          }
        />

      </Routes>
{/* ------------------------------Routes Super Admin------------------------------------------------------------ */}
      {!hideNavbar && <Footer />}
    </div>
  )
}

const App = () => (
  <Router>
    <Layout />
  </Router>
)

export default App
