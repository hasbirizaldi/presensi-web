import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const TopNavbar = () => {
  const location = useLocation()

  // cek apakah path termasuk absensi shalat
  const isAbsensiShalat =
    location.pathname.startsWith('/absensi-shalat')

  const baseClass =
    'px-4 py-2 rounded transition text-xs sm:text-base'
  const activeClass =
    'bg-gradient-to-r from-green-800 via-green-600 to-green-800 text-white'
  const inactiveClass =
    'hover:bg-yellow-600'

  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 text-white shadow-ku">
      
      <div className="flex justify-center">
        <nav className="px-2 sm:px-8 py-2 flex  justify-center gap-2 sm:gap-4">
          
          {/* HOME */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseClass} ${
                isActive ? activeClass : inactiveClass
              } w-full sm:w-40 text-center`
            }
          >
            Home
          </NavLink>

          {/* ABSENSI SHALAT */}
          <NavLink
            to="/absensi-shalat/rekap-shalat-bulan"
            className={`${baseClass} ${
              isAbsensiShalat ? activeClass : inactiveClass
            } w-full sm:w-40 text-center`}
          >
            Absensi Shalat
          </NavLink>

          {/* KAJIAN */}
          <NavLink
            to="/presensi-kajian"
            className={({ isActive }) =>
              `${baseClass} ${
                isActive ? activeClass : inactiveClass
              } w-full sm:w-40 text-center`
            }
          >
            Presensi Kajian
          </NavLink>

        </nav>
      </div>
    </div>
  )
}

export default TopNavbar
