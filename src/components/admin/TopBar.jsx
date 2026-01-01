import React from 'react'
import { NavLink } from 'react-router-dom'

const TopBar = () => {
  return (
      <div className="flex justify-center">
        <nav className='text-slate-50 lg:w-[50%] w-[98%] lg:text-lg text-xs mt-6 flex bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-500 rounded-t-lg overflow-hidden'>
              <NavLink
                to='/admin/user-list'
                className={({ isActive }) =>
                  `w-60 h-10 flex justify-center items-center font-semibold border-b-4 transition-border duration-300 ${
                    isActive ? 'border-yellow-500 bg-amber-950' : 'border-transparent hover:border-yellow-100'
                  }`
                }
              >
                Daftar User
              </NavLink>
              <NavLink
                to='/admin/shalat'
                className={({ isActive }) =>
                  `w-60 h-10 flex justify-center items-center font-semibold border-b-4 transition-border duration-300 ${
                    isActive ? 'border-yellow-500 bg-amber-950' : 'border-transparent hover:border-yellow-100'
                  }`
                }
              >
                Absen Shalat
              </NavLink>
              <NavLink
                to='/admin/kajian'
                className={({ isActive }) =>
                  `w-60 h-10 flex justify-center items-center font-semibold border-b-4 transition-border duration-300 ${
                    isActive ? 'border-yellow-500 bg-amber-950' : 'border-transparent hover:border-yellow-100'
                  }`
                }
              >
                Absen Kajian
              </NavLink>
          </nav>
      </div>
  )
}

export default TopBar
