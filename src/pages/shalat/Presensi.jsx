import React, { useEffect, useRef, useState } from 'react'
import TopBar from '../../components/shalat/TopBar'

const AbsensiShalat = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [lokasi, setLokasi] = useState(null)


  const [foto, setFoto] = useState(null)
  const [shalat, setShalat] = useState('')
  const [stream, setStream] = useState(null)

    const ambilLokasi = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation tidak didukung')
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude

          try {
            // Reverse geocoding (OpenStreetMap)
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            )
            const data = await res.json()

            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              '-'

            resolve({
              lat: lat.toFixed(6),
              lng: lng.toFixed(6),
              city,
            })
          } catch {
            resolve({
              lat: lat.toFixed(6),
              lng: lng.toFixed(6),
              city: '-',
            })
          }
        },
        () => reject('Izin lokasi ditolak'),
        { enableHighAccuracy: true }
      )
    })
  }


  // AKTIFKAN KAMERA
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 1280 },
          aspectRatio: 9 / 16, // portrait selfie
        },
        audio: false,
      })
      .then((mediaStream) => {
        setStream(mediaStream)
        videoRef.current.srcObject = mediaStream
      })
      .catch(() => {
        alert('Kamera tidak dapat diakses')
      })
  }


  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // AMBIL FOTO
  const ambilFoto = async () => {
    if (!shalat) {
      alert('Pilih shalat terlebih dahulu')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current

    // PASTIKAN VIDEO SIAP
    if (!video.videoWidth || !video.videoHeight) {
      alert('Kamera belum siap, tunggu sebentar')
      return
    }

    try {
      const lokasi = await ambilLokasi()

      // ===== PAKSA PORTRAIT =====
      const WIDTH = 720
      const HEIGHT = 1280
      canvas.width = WIDTH
      canvas.height = HEIGHT

      const ctx = canvas.getContext('2d')

      // ===== CROP TENGAH VIDEO =====
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

    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, HEIGHT - 160, WIDTH, 160)

    ctx.fillStyle = '#fff'
    ctx.font = '26px Arial'
    ctx.fillText(`Shalat : ${shalat}`, 30, HEIGHT - 110)
    ctx.fillText(`Waktu  : ${waktu}`, 30, HEIGHT - 75)
    ctx.fillText(`Kota   : ${lokasi.city}`, 30, HEIGHT - 40)

    setFoto(canvas.toDataURL('image/jpeg', 0.9))
  } catch (err) {
    alert(err)
  }
}



  // REFRESH ABSENSI
  const refreshAbsensi = () => {
    setFoto(null)
    setShalat('')
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    startCamera()
  }

  return (
    <div className='py-14'>
      <TopBar />

      <div className="lg:w-[60%] w-[98%] mx-auto mt-6 bg-white rounded-lg shadow-ku p-6">
        <p className="lg:text-lg font-semibold text-slate-700 mb-6 text-center">
          Absensi Shalat
        </p>

        <div className="flex flex-col items-center gap-4">
          {/* SELECT SHALAT */}
          <select
            value={shalat}
            onChange={(e) => setShalat(e.target.value)}
            className="border-2 border-green-800 cursor-pointer rounded px-3 py-1 text-slate-800
                       hover:bg-green-800 hover:text-white transition"
          >
            <option value="">-- Pilih Shalat --</option>
            <option value="Subuh">Subuh</option>
            <option value="Dzuhur">Dzuhur</option>
            <option value="Ashar">Ashar</option>
            <option value="Maghrib">Maghrib</option>
            <option value="Isya">Isya</option>
            <option value="Jumat">Jumat</option>
          </select>

          {/* KAMERA */}
          {!foto ? (
            <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="
              rounded-lg border
              w-[240px] h-[420px]
              aspect-[9/16]
              object-cover
            "
          />



              <div className="flex gap-3">
                <button
                  onClick={ambilFoto}
                  className="bg-green-700 cursor-pointer hover:bg-green-800 text-white lg:px-6 px-5 lg:py-2 py-1.5 lg:text-base text-sm rounded font-semibold"
                >
                  Ambil Foto
                </button>
                <button
                  onClick={refreshAbsensi}
                  className="bg-slate-600 cursor-pointer hover:bg-slate-700 text-white lg:px-6 px-5 lg:py-2 py-1.5 lg:text-base text-sm rounded font-semibold"
                >
                  Refresh
                </button>
              </div>
            </>
          ) : (
            <>
              <img
                src={foto}
                alt="Selfie"
                className="rounded-lg border w-[250px]"
              />
              <p className="text-slate-600 text-sm">
                Shalat: <span className="font-semibold">{shalat}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setFoto(null)}
                  className="text-sm text-red-600 cursor-pointer"
                >
                  Ulangi Foto
                </button>
                <button
                  onClick={refreshAbsensi}
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  Refresh
                </button>
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

export default AbsensiShalat
