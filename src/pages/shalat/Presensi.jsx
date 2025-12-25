import React, { useEffect, useRef, useState } from 'react'
import TopBar from '../../components/shalat/TopBar'

const AbsensiShalat = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [foto, setFoto] = useState(null)
  const [shalat, setShalat] = useState('')
  const [stream, setStream] = useState(null)

  // ================== AMBIL LOKASI ==================
  const ambilLokasi = async () => {
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

            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              '-'

            const district =
              data.address.suburb ||
              data.address.city_district ||
              data.address.county ||
              '-'

            resolve({
              lat: lat.toFixed(6),
              lng: lng.toFixed(6),
              city,
              district,
            })
          } catch {
            resolve({
              lat: lat.toFixed(6),
              lng: lng.toFixed(6),
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

  // ================== AKTIFKAN KAMERA ==================
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 1280 },
          aspectRatio: 9 / 16,
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

  // ================== AMBIL FOTO (PORTRAIT FIX) ==================
  const ambilFoto = async () => {
    if (!shalat) {
      alert('Pilih shalat terlebih dahulu')
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

      const WIDTH = 720
      const HEIGHT = 1280

      canvas.width = WIDTH
      canvas.height = HEIGHT

      const ctx = canvas.getContext('2d')

      // ===== CROP TENGAH (ANTI LANDSCAPE) =====
      const videoRatio = video.videoWidth / video.videoHeight
      const canvasRatio = WIDTH / HEIGHT

      let sx, sy, sWidth, sHeight

      if (videoRatio > canvasRatio) {
        sHeight = video.videoHeight
        sWidth = sHeight * canvasRatio
        sx = (video.videoWidth - sWidth) / 2
        sy = 0
      } else {
        sWidth = video.videoWidth
        sHeight = sWidth / canvasRatio
        sx = 0
        sy = (video.videoHeight - sHeight) / 2
      }

      ctx.drawImage(
        video,
        sx,
        sy,
        sWidth,
        sHeight,
        0,
        0,
        WIDTH,
        HEIGHT
      )

      // ===== TEKS INFO =====
      const waktu = new Date().toLocaleString('id-ID')

      ctx.fillStyle = 'rgba(0,0,0,0.6)'
      ctx.fillRect(0, HEIGHT - 200, WIDTH, 200)

      ctx.fillStyle = '#fff'
      ctx.font = '24px Arial'

      ctx.fillText(`Shalat     : ${shalat}`, 30, HEIGHT - 150)
      ctx.fillText(`Waktu      : ${waktu}`, 30, HEIGHT - 115)
      ctx.fillText(`Kota       : ${lokasi.city}`, 30, HEIGHT - 80)
      ctx.fillText(`Kecamatan  : ${lokasi.district}`, 30, HEIGHT - 45)

      setFoto(canvas.toDataURL('image/jpeg', 0.9))
    } catch (err) {
      alert(err)
    }
  }

  // ================== RESET ==================
  const refreshAbsensi = () => {
    setFoto(null)
    setShalat('')
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
    }
    startCamera()
  }

  // ================== UI ==================
  return (
    <div className="py-14">
      <TopBar />

      <div className="w-[95%] max-w-md mx-auto mt-6 bg-white rounded-lg shadow p-6">
        <p className="text-lg font-semibold text-center mb-4">
          Absensi Shalat
        </p>

        <div className="flex flex-col items-center gap-4">
          <select
            value={shalat}
            onChange={(e) => setShalat(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">-- Pilih Shalat --</option>
            <option value="Subuh">Subuh</option>
            <option value="Dzuhur">Dzuhur</option>
            <option value="Ashar">Ashar</option>
            <option value="Maghrib">Maghrib</option>
            <option value="Isya">Isya</option>
            <option value="Jumat">Jumat</option>
          </select>

          {!foto ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-[240px] h-[420px] rounded-lg border object-cover"
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
              <img
                src={foto}
                alt="Selfie"
                className="w-[240px] rounded-lg border"
              />
              <button
                onClick={refreshAbsensi}
                className="text-sm text-red-600"
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
