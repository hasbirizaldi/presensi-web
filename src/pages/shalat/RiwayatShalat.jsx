import { useEffect, useState } from 'react'
import axios from 'axios'
import TopBar from '../../components/shalat/TopBar'
import { alertError } from '../../utils/alert'
import { capitalize } from '../../utils/helper'

// ambil bulan sekarang
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')

const RiwayatShalat = () => {
  const [bulan, setBulan] = useState(currentMonth)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalFoto, setModalFoto] = useState(null) // url foto yang mau ditampilkan modal
  const API_URL = 'https://brewokode.site'

  const tahun = new Date().getFullYear()

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)


  const fetchData = async (page = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const res = await axios.get(
        'https://brewokode.site/api/presensi-shalat/riwayat',
        {
          params: {
            bulan,
            tahun,
            page
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setData(res.data.data.data)
      setCurrentPage(res.data.data.current_page)
      setLastPage(res.data.data.last_page)

    } catch (err) {
      console.error(err)
      alertError('Gagal mengambil data riwayat')
    } finally {
      setLoading(false)
    }
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    let start = Math.max(1, currentPage - 2)
    let end = Math.min(lastPage, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => fetchData(i)}
          className={`px-3 py-1 text-sm rounded
            ${
              currentPage === i
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  useEffect(() => {
    fetchData(1)
  }, [bulan])

  return (
    <div className="sm:py-14 py-8">
      <TopBar />

      <div className="lg:w-[90%] w-[98%] mx-auto sm:mt-6 mt-3 rounded-lg shadow-ku overflow-x-auto">
        <div className="bg-white sm:px-10 px-1 lg:py-5 sm:py-4 py-3">
          <div className="flex lg:flex-row flex-col justify-between mb-3">
            <p className="lg:text-lg text-sm font-semibold text-slate-900">
              Riwayat Absensi Shalat Tahun {tahun}
            </p>

            <select
              className="border-2 sm:text-base text-sm border-green-800 rounded px-3 py-1"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
            >
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>

          {loading ? (
           <div className="flex flex-col items-center justify-center py-10">
              <span className="loader"></span>
              <p className="mt-14 text-sm text-gray-500">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
           <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 text-white text-[10px] sm:text-base">
                  <th className="sm:px-4 px-1 sm:py-3 text-center">No</th>
                  <th className="sm:px-6 px-2 py-2 sm:py-3 text-center">Tanggal & Waktu</th>
                  <th className="sm:px-6 px-2 py-2 sm:py-3 text-center">Shalat</th>
                  <th className="sm:px-6 px-2 py-2 sm:py-3 text-center">Status</th>
                  <th className="sm:px-6 px-2 py-2 sm:py-3 text-center">Foto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className='text-center sm:text-base text-xs text-red-600 pt-3'>Data tidak ditemukan</td>
                </tr>
              </tbody>
              </table>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 text-white text-[10px] lg:text-base">
                  <th className="sm:px-4 sm:py-3 py-2 text-center">No</th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center">Tanggal & Waktu</th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center">Shalat</th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center">Jam</th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center">Foto</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-100'} hover:bg-slate-200`}
                  >
                    <td className="sm:px-4 px-1 py-2 text-center border sm:text-base text-[10px]">
                       {(currentPage - 1) * 12 + index + 1}
                    </td>
                    <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px]">
                      {item.tanggal} ( {item.jam})
                    </td>
                    <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px]">
                      {capitalize(item.shalat)}
                    </td>
                    <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px] capitalize">
                      {!item.status?(
                        <span className='text-yellow-600'>Uploaded</span>
                      ):(
                        <span className='text-green-700'>Approved</span>
                      )}
                    </td>
                    <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px]">
                      {item.foto ? (
                        <button
                          className="sm:text-xs text-[8px] bg-green-600 hover:bg-green-700 text-white sm:px-3 px-1 py-1 rounded"
                          onClick={() => setModalFoto(`${API_URL}${item.foto}`)}
                        >
                          Lihat foto
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {lastPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-5 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchData(currentPage - 1)}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Prev
              </button>

              {renderPageNumbers()}

              <button
                disabled={currentPage === lastPage}
                onClick={() => fetchData(currentPage + 1)}
                className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}


        </div>
      </div>

      {/* MODAL FOTO */}
       {modalFoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setModalFoto(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalFoto(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ✕
            </button>

            <p className="text-center font-semibold text-slate-700 mb-3">
              Foto Absensi Shalat
            </p>

            <img
              src={modalFoto}
              alt="Foto Shalat"
              className="w-full max-h-[70vh] object-contain rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RiwayatShalat
