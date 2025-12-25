import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";

const Home = () => {
  const [timeNow, setTimeNow] = useState(new Date())
  const [jadwal, setJadwal] = useState(null)
  const [lokasi, setLokasi] = useState('Mencari lokasi')
  const [loading, setLoading] = useState(true)

  // JAM REALTIME
  useEffect(() => {
    const timer = setInterval(() => setTimeNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // AMBIL JADWAL SHALAT
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords

        try {
          // JADWAL SHALAT
          const res = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=20`
          )
          const json = await res.json()
          setJadwal(json.data.timings)

          // LOKASI
          try {
            const lokasiRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            )
            const lokasiData = await lokasiRes.json()
            setLokasi(
              lokasiData.address?.town ||
              lokasiData.address?.city ||
              lokasiData.address?.village ||
              'Lokasi Anda'
            )
          } catch {
            setLokasi('Lokasi Anda')
          }

          setLoading(false)
        } catch (err) {
          console.error(err)
          setLoading(false)
        }
      },
      () => {
        alert('Izin lokasi ditolak')
        setLoading(false)
      }
    )
  }, [])

  const formatDate = (date) =>
    date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const formatTime = (date) =>
    date.toLocaleTimeString('id-ID')

  return (
    <div className="lg:w-[70%] w-[98%] mx-auto pt-24 ">
      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* KIRI */}
        <div className="bg-gradient-to-r from-green-900 via-green-600 to-green-900 text-white lg:rounded-l-lg  p-6 text-center border-yellow-600 lg:border-r-2">
          <h1 className="text-2xl font-bold">Jadwal Shalat Hari Ini</h1>
          <p>{formatDate(timeNow)}</p>

          <p className="mt-4 text-4xl font-bold bg-white text-green-900 inline-block px-4 w-50 py-1 rounded">
            {formatTime(timeNow)}
          </p>

          <div className="mt-3 flex justify-center gap-2">
            <FaLocationDot />
            <span className="font-semibold">{lokasi}</span>
          </div>
        </div>

        {/* KANAN */}
        <div className="bg-white lg:rounded-r-lg rounded-b-lg">
          {loading || !jadwal ? (
            <p className="text-center text-slate-500">
              Mengambil jadwal shalat...
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-700 via-yellow-500 to-yellow-700 text-white">
                  <th className="py-3">Shalat</th>
                  <th className="py-3">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Subuh', jadwal.Fajr],
                  ['Dzuhur', jadwal.Dhuhr],
                  ['Ashar', jadwal.Asr],
                  ['Maghrib', jadwal.Maghrib],
                  ['Isya', jadwal.Isha],
                ].map(([nama, waktu], i) => (
                  <tr key={i} className="odd:bg-slate-100">
                    <td className="py-3 text-center font-semibold">{nama}</td>
                    <td className="py-3 text-center">{waktu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}

export default Home
