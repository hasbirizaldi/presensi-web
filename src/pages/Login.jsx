import React, { useState } from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      
      {/* CARD LOGIN */}
      <div className="bg-white w-[35%] rounded-xl shadow-ku p-8">
        
        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
          Login
        </h2>
        <p className="text-center text-slate-500 mb-6">
          Sistem Absensi Shalat & Kajian
        </p>

        {/* FORM */}
        <form className="space-y-4">
          {/* USERNAME */}
          <div>
            <label className="text-sm text-slate-600">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-slate-600">Password</label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                className="w-full mt-1 px-4 py-2 border rounded-lg pr-12
                           focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              {/* TOGGLE BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2
                            text-slate-500  hover:text-green-900 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash className='text-lg'/> : <FaEye  className='text-lg'/>}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-900 text-white py-2 rounded-lg font-semibold transition cursor-pointer"
          >
            Masuk
          </button>
        </form>

        {/* FOOTER */}
        <div className="text-center mt-4 text-sm text-slate-500">
          © 2025 Sistem Absensi
        </div>
      </div>
    </div>
  )
}

export default Login
