import React from 'react'
import { NavLink } from 'react-router-dom'

const TopBar = () => {
  return (
    <div className='flex justify-center'>
      <nav className='text-slate-50 lg:w-[50%] w-[98%] lg:text-lg text-xs mt-6 flex bg-gradient-to-r from-green-800 via-green-600 to-green-800 rounded-t-lg overflow-hidden'>
        <NavLink
          to='/absensi-shalat/rekap-shalat-bulan'
          className={({ isActive }) =>
            `w-60 h-10 flex justify-center items-center font-semibold border-b-4 transition-border duration-300 ${
              isActive ? 'border-yellow-600 bg-green-800' : 'border-transparent hover:border-yellow-100'
            }`
          }
        >
          Rekap Bulan Ini
        </NavLink>
        <NavLink
          to='/absensi-shalat/absensi'
          className={({ isActive }) =>
            `w-60 h-10 flex justify-center items-center font-semibold border-b-4 transition-border duration-300 ${
              isActive ? 'border-yellow-600 bg-green-800' : 'border-transparent hover:border-yellow-100'
            }`
          }
        >
          Absen Shalat
        </NavLink>
        <NavLink
          to='/absensi-shalat/riwayat-absen-shalat'
          className={({ isActive }) =>
            `w-60 h-10 flex justify-center items-center font-semibold border-b-4 transition-border duration-300 ${
              isActive ? 'border-yellow-600 bg-green-800' : 'border-transparent hover:border-yellow-100'
            }`
          }
        >
          Riwayat Absen
        </NavLink>
      </nav>
    </div>
  )
}

export default TopBar
