import React, { useState, useRef, useEffect } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { IoMdArrowDropdown } from "react-icons/io"
import { CiMenuKebab } from "react-icons/ci"

const TopNavbar = () => {
  const location = useLocation()

  const [open, setOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)

  const dropdownRefUser = useRef(null)
  const dropdownRefMobile = useRef(null)

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const role = user?.role

  const isLogin = !!token

  const isAbsensiShalat =
    location.pathname.startsWith("/absensi-shalat")

  const baseClass =
    "px-4 py-2 rounded transition text-xs sm:text-base"
  const activeClass =
    "bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-400 text-white"
  const inactiveClass = "hover:bg-yellow-600"

  const toggleDropdown = () => setOpen(prev => !prev)
  const toggleDropdownMobile = () => setOpenMobile(prev => !prev)

  // klik di luar → tutup
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRefUser.current &&
        !dropdownRefUser.current.contains(e.target)
      ) {
        setOpen(false)
      }

      if (
        dropdownRefMobile.current &&
        !dropdownRefMobile.current.contains(e.target)
      ) {
        setOpenMobile(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () =>
      document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-yellow-950 via-yellow-800 to-yellow-950 text-white shadow-ku z-50">
      <div className="flex sm:justify-start justify-between relative">
        <nav className="px-2 sm:px-8 sm:py-2 py-1 flex justify-center gap-0 sm:gap-4">

          {/* HOME */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass} w-22 sm:w-40 text-center`
            }
          >
            Home
          </NavLink>

          {/* SHALAT */}
          <NavLink
            to="/absensi-shalat/rekap-shalat-bulan"
            className={`${baseClass} ${
              isAbsensiShalat ? activeClass : inactiveClass
            } w-22 sm:w-40 text-center`}
          >
            Shalat
          </NavLink>

          {/* KAJIAN */}
          <NavLink
            to="/presensi-kajian"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass} w-22 sm:w-40 text-center`
            }
          >
            Kajian
          </NavLink>

          {/* DROPDOWN USER (DESKTOP) */}
          {isLogin && (
            <div className="absolute sm:flex hidden right-20" ref={dropdownRefUser}>
              <button
                onClick={toggleDropdown}
                className="py-2 flex items-center rounded cursor-pointer font-semibold"
              >
                {user?.name || user?.username || "User"}, {user.title}
                <IoMdArrowDropdown />
              </button>

              {open && (
                <div className="absolute top-10 right-0 mt-2 w-44 bg-white text-gray-700 rounded shadow-lg overflow-hidden z-50">
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Profil
                  </NavLink>

                  {(role === "admin" || role === "super_admin") && (
                    <NavLink
                      to="/admin/shalat"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setOpen(false)}
                    >
                      Admin Panel
                    </NavLink>
                  )}

                  <NavLink
                    to="/logout"
                    className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Logout
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <div
            onClick={toggleDropdownMobile}
            className="sm:hidden flex absolute right-2 top-2 cursor-pointer"
            ref={dropdownRefMobile}
          >
            <CiMenuKebab className="text-2xl" />

            {openMobile && (
              <div className="absolute top-8 right-0 mt-2 w-44 bg-white text-gray-700 rounded shadow-lg overflow-hidden z-50 text-sm">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setOpenMobile(false)}
                >
                  Profil
                </NavLink>

                {(role === "admin" || role === "super_admin") && (
                  <NavLink
                    to="/admin/shalat"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpenMobile(false)}
                  >
                    Admin Panel
                  </NavLink>
                )}

                <NavLink
                  to="/logout"
                  className="block px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => setOpenMobile(false)}
                >
                  Logout
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default TopNavbar
