import React, { useEffect, useRef, useState } from 'react'
import TopBar from '../../components/shalat/TopBar'
import { alertError, alertSuccess } from '../../utils/alert'
import { useNavigate } from 'react-router-dom'

/* ================== DATA MASJID ================== */
const MASJID = {
  nama: 'Masjid Baiturrahman RS PKU Muhammadiyah Sruweng',
  lat: -7.663056746749474,
  lng: 109.6093798838305,
}

/* ================== HITUNG JARAK ================== */
const hitungJarak = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const toRad = (v) => (v * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

const AbsensiShalat = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [foto, setFoto] = useState(null)
  const [shalat, setShalat] = useState('')
  const [stream, setStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  /* ================== AMBIL LOKASI ================== */
  const ambilLokasi = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
            const data = await res.json()

            resolve({
              lat,
              lng,
              posisi:
                `${data.address.city || data.address.town || data.address.village || '-'}, ` +
                `${data.address.suburb || data.address.city_district || '-'}`,
            })
          } catch {
            resolve({ lat, lng, posisi: '-' })
          }
        },
        () => reject('Izin lokasi ditolak'),
        { enableHighAccuracy: true }
      )
    })

  /* ================== KAMERA ================== */
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 720, height: 960 },
        audio: false,
      })
      setStream(mediaStream)
      videoRef.current.srcObject = mediaStream
    } catch {
      alertError('Kamera tidak dapat diakses')
    }
  }

  useEffect(() => {
    startCamera()
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [])

  /* ================== AMBIL FOTO ================== */
  const ambilFoto = async () => {
    if (!shalat) return alertError('Pilih shalat dulu')

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video.videoWidth) return alertError('Kamera belum siap')

    const lokasi = await ambilLokasi()
    const jarakKm = hitungJarak(
      lokasi.lat,
      lokasi.lng,
      MASJID.lat,
      MASJID.lng
    )

    const jarakText =
      jarakKm < 1
        ? `${(jarakKm * 1000).toFixed(0)} meter`
        : `${jarakKm.toFixed(2)} km`

    canvas.width = 720
    canvas.height = 960

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, 720, 960)

    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.fillRect(0, 780, 720, 180)

    ctx.fillStyle = '#fff'
    ctx.font = '22px Arial'
    ctx.fillText(`Shalat : ${shalat}`, 24, 820)
    ctx.fillText(`Lokasi : ${lokasi.posisi}`, 24, 850)
    ctx.fillText(`Jarak  : ${jarakText}`, 24, 880)

    setFoto(canvas.toDataURL('image/jpeg', 0.9))
  }

  /* ================== KIRIM KE BACKEND ================== */
  const kirimAbsensi = async () => {
    setLoading(true)
    const token = localStorage.getItem('token')

    try {
      const lokasi = await ambilLokasi()
      const jarakKm = hitungJarak(
        lokasi.lat,
        lokasi.lng,
        MASJID.lat,
        MASJID.lng
      )

      const res = await fetch(
        'https://brewokode.site/api/presensi-shalat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shalat: shalat.toLowerCase(),
            foto,
            latitude: lokasi.lat,
            longitude: lokasi.lng,
            posisi: lokasi.posisi,
            jarak:
              jarakKm < 1
                ? `${(jarakKm * 1000).toFixed(0)} meter`
                : `${jarakKm.toFixed(2)} km`,
          }),
        }
      )

      const data = await res.json()
      if (!res.ok) return alertError(data.message)

      alertSuccess('Absensi shalat berhasil')
      navigate('/absensi-shalat/rekap-shalat-bulan')
    } catch {
      alertError('Gagal mengirim absensi')
    } finally {
      setLoading(false)
    }
  }

  const refreshAbsensi = () => {
    setFoto(null)
    setShalat('')
    stream?.getTracks().forEach((t) => t.stop())
    startCamera()
  }

  /* ================== UI ================== */
  return (
    <div className="sm:py-14 py-8">
      <TopBar />
      <div className="lg:w-[90%] w-[98%] mx-auto sm:mt-6 mt-2 bg-white rounded-lg shadow-ku sm:p-6 p-3">
        <p className="sm:text-lg font-semibold text-center sm:mb-4 mb-2">
          Absensi Shalat
        </p>

        <div className="flex flex-col items-center sm:text-base text-sm gap-4">
          <select
            value={shalat}
            onChange={(e) => setShalat(e.target.value)}
            className="border-2 sm:text-base text-sm border-green-800 rounded px-3 py-1"
          >
            <option value="">-- Pilih Shalat --</option>
            <option>Subuh</option>
            <option>Dzuhur</option>
            <option>Ashar</option>
            <option>Maghrib</option>
            <option>Isya</option>
          </select>

          {!foto ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-[340px] h-[420px] rounded border object-cover"
              />
              <button
                onClick={ambilFoto}
                className="bg-green-700 text-white px-6 py-2 rounded"
              >
                Ambil Foto
              </button>
            </>
          ) : (
            <>
              <img src={foto} className="w-[240px] rounded border" />
              <button
                onClick={kirimAbsensi}
                disabled={loading}
                className="bg-green-700 text-white px-6 py-2 rounded"
              >
                {loading ? 'Mengirim...' : 'Kirim Absensi'}
              </button>
              <button
                onClick={refreshAbsensi}
                className="text-red-600 text-sm"
              >
                Ulangi
              </button>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default AbsensiShalat
