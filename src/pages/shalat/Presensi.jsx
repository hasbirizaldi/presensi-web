import React, { useEffect, useRef, useState } from 'react'
import TopBar from '../../components/shalat/TopBar'

/* ================== DATA MASJID ================== */
const MASJID = {
  nama: 'Masjid Al-Ikhlas',
  lat: -7.6307742457761965,
  lng: 109.53022138272348,
}
/* ================== HITUNG JARAK ================== */
const hitungJarak = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // KM
  const toRad = (v) => (v * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const AbsensiShalat = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [foto, setFoto] = useState(null)
  const [shalat, setShalat] = useState('')
  const [stream, setStream] = useState(null)

  /* ================== AMBIL LOKASI ================== */
  const ambilLokasi = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation tidak didukung')
        return
      }

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
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                '-',
              district:
                data.address.suburb ||
                data.address.city_district ||
                data.address.county ||
                '-',
            })
          } catch {
            resolve({
              lat,
              lng,
              city: '-',
              district: '-',
            })
          }
        },
        () => reject('Izin lokasi ditolak'),
        { enableHighAccuracy: true }
      )
    })
  }

  /* ================== KAMERA ================== */
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 960 },
        },
        audio: false,
      })
      .then((mediaStream) => {
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      })
      .catch(() => alert('Kamera tidak dapat diakses'))
  }

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  /* ================== AMBIL FOTO ================== */
  const ambilFoto = async () => {
    if (!shalat) {
      alert('Pilih shalat dulu')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !video.videoWidth) {
      alert('Kamera belum siap')
      return
    }

    try {
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

      const WIDTH = 720
      const HEIGHT = 960

      canvas.width = WIDTH
      canvas.height = HEIGHT

      const ctx = canvas.getContext('2d')

      /* ===== CROP PORTRAIT ===== */
      const vr = video.videoWidth / video.videoHeight
      const cr = WIDTH / HEIGHT
      let sx, sy, sw, sh

      if (vr > cr) {
        sh = video.videoHeight
        sw = sh * cr
        sx = (video.videoWidth - sw) / 2
        sy = 0
      } else {
        sw = video.videoWidth
        sh = sw / cr
        sx = 0
        sy = (video.videoHeight - sh) / 2
      }

      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, WIDTH, HEIGHT)

      /* ===== OVERLAY ===== */
      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(0, HEIGHT - 180, WIDTH, 180)

      ctx.fillStyle = '#fff'
      ctx.font = '22px Arial'

      const waktu = new Date().toLocaleString('id-ID')

      ctx.fillText(`Shalat      : ${shalat}`, 24, HEIGHT - 130)
      ctx.fillText(`Waktu       : ${waktu}`, 24, HEIGHT - 100)
      ctx.fillText(
        `Lokasi      : ${lokasi.city}, ${lokasi.district}`,
        24,
        HEIGHT - 70
      )
      ctx.fillText(
        `Jarak Masjid: ${jarakText}`,
        24,
        HEIGHT - 40
      )

      setFoto(canvas.toDataURL('image/jpeg', 0.9))
    } catch (err) {
      alert(err)
    }
  }

  /* ================== RESET ================== */
  const refreshAbsensi = () => {
    setFoto(null)
    setShalat('')
    if (stream) stream.getTracks().forEach((t) => t.stop())
    startCamera()
  }

  /* ================== UI ================== */
  return (
    <div className="py-14">
      <TopBar />

      <div className="lg:w-[70%] w-[98%] mx-auto mt-6 bg-white rounded-lg shadow p-6">
        <p className="text-lg font-semibold text-center mb-4">
          Absensi Shalat
        </p>

        <div className="flex flex-col items-center gap-4">
          <select
            value={shalat}
            onChange={(e) => setShalat(e.target.value)}
            className="border rounded px-3 py-2 lg:w-[50%] w-full"
          >
            <option value="">-- Pilih Shalat --</option>
            <option>Subuh</option>
            <option>Dzuhur</option>
            <option>Ashar</option>
            <option>Maghrib</option>
            <option>Isya</option>
            <option>Jumat</option>
          </select>

          {!foto ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-[340px] h-[420px] rounded-lg border object-cover"
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
