import React, { useEffect, useRef, useState } from 'react'
import TopBar from '../../components/shalat/TopBar'

const AbsensiShalat = () => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const [foto, setFoto] = useState(null)
  const [shalat, setShalat] = useState('')
  const [stream, setStream] = useState(null)

  // AKTIFKAN KAMERA
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'user' },
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
  const ambilFoto = () => {
    if (!shalat) {
      alert('Pilih shalat terlebih dahulu')
      return
    }

    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)

    setFoto(canvas.toDataURL('image/png'))
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
    <>
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
                className="rounded-lg border w-[450px]"
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
                className="rounded-lg border w-[320px] "
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
    </>
  )
}

export default AbsensiShalat
