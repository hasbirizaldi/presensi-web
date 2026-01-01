import React, { useState } from 'react'
import axios from 'axios'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { alertError, alertSuccess } from '../utils/alert';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await axios.post('https://brewokode.site/api/login', {
        username,
        password
      })

      // simpan token ke localStorage
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      // SweetAlert sukses (dari alert.js)
      await alertSuccess('Login berhasil mantap')

      // redirect (jika pakai react-router)
      navigate('/')

    } catch (err) {
      const message =
        err.response?.data?.message || 'Terjadi kesalahan pada server'

      // SweetAlert error (dari alert.js)
      alertError(message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white sm:w-[35%] w-[90%] rounded-xl shadow-ku sm:p-8 p-6">
        <h2 className="sm:text-2xl text-xl font-bold text-center text-green-800 mb-2">
          Login
        </h2>
        <p className="text-center text-slate-500 mb-6 sm:text-base text-sm">
          Sistem Absensi Shalat & Kajian
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="text-xs sm:text-sm text-slate-600">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 sm:px-4 px-2 sm:py-2 py-1 border rounded text-sm sm:text-base focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm text-slate-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 sm:px-4 px-2 sm:py-2 py-1 border rounded text-sm sm:text-base pr-12 focus:ring-2 focus:ring-green-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 cursor-pointer hover:bg-green-900 text-white py-2 rounded sm:text-base text-sm font-semibold"
          >
            {loading ? 'Loading...' : 'Masuk'}
          </button>
        </form>

        <div className="text-center mt-4 sm:text-sm text-[10px] text-slate-500">
          © 2025 Hasbi Rizaldi
        </div>
      </div>
    </div>
  )
}

export default Login
