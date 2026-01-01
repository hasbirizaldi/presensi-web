import { useEffect, useState } from 'react'
import TopBar from '../../components/shalat/TopBar'
import axios from 'axios'
import { alertError } from '../../utils/alert'
import { capitalize } from '../../utils/helper'

const MINIMAL_ABSEN = 12

const RekapBulanShalat = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [fotoModal, setFotoModal] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const jumlahAbsen = data.length

  const jumlahApproved = data.filter(item => item.status).length

  const persentaseApproved = jumlahAbsen
    ? Math.round((jumlahApproved / jumlahAbsen) * 100)
    : 0

  const persentaseAbsen = Math.min(
    Math.round((jumlahAbsen / MINIMAL_ABSEN) * 100),
    100
  )


  const now = new Date()
  const API_URL = 'https://brewokode.site'

  const namaBulan = now.toLocaleString('id-ID', { month: 'long' })
  const tahun = now.getFullYear()

  const fetchData = async (page = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const bulan = String(now.getMonth() + 1).padStart(2, '0')

      const res = await axios.get(
        `https://brewokode.site/api/presensi-shalat/riwayat`,
        {
          params: {
            page,
            bulan,
            tahun
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
      console.log(err)
      alertError('Gagal mengambil data')
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
          className={`px-3 py-1 text-sm rounded transition
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
  }, [])

  return (
    <div className="sm:py-14 py-8">
      <TopBar />

      <div className="lg:w-[90%] w-[98%] mx-auto sm:mt-6 mt-3 rounded-lg shadow-ku overflow-x-auto">
        <div className="bg-white lg:px-10 px-1 lg:py-5 sm:py-4 py-2">
         <p className="lg:text-lg text-sm font-semibold text-slate-700 mb-3 capitalize">
          Rekap Absensi Shalat {namaBulan} {tahun}
        </p>
        <div className="sm:mb-4 mb-2 sm:p-3 p-2 rounded-lg bg-green-50 border border-green-200">
          <p className="text-xs sm:text-sm text-slate-700">
            Total Kehadiran: 
            <span className="font-semibold text-yellow-700 mx-1">
               {jumlahAbsen} kali
            </span>
            dari minimal {MINIMAL_ABSEN} kali
          </p>
          <div className="w-full bg-gray-200 rounded-full sm:h-3 h-2 sm:mt-2">
            <div
              className={`sm:h-3 h-2 rounded-full transition-all duration-300 
                ${
                  persentaseAbsen >= 100
                    ? 'bg-green-500'
                    : persentaseAbsen >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              style={{ width: `${persentaseAbsen}%` }}
            ></div>
          </div>

          <p className="text-xs text-right sm:mt-1 text-slate-600">
            {persentaseAbsen}%
          </p>
          <div className="rounded-lg">
            <p className="text-xs sm:text-sm text-slate-700">
              Approved:
              <span className="font-semibold text-green-700 mx-1">
                {jumlahApproved} dari <span className='text-yellow-700'>{jumlahAbsen} data</span>
              </span>
            </p>

            <div className="w-full bg-gray-200 rounded-full sm:h-3 h-2 mt-2">
              <div
                className="sm:h-3 h-2 rounded-full bg-green-600 transition-all duration-300"
                style={{ width: `${persentaseApproved}%` }}
              ></div>
            </div>

            <p className="text-xs text-right mt-1 text-slate-600">
              {persentaseApproved}%
            </p>
          </div>
        </div>


          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <span className="loader"></span>
              <p className="mt-14 text-sm text-gray-500">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              Tidak ada data absensi
            </p>
          ) : (
            
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 text-white">
                  <th className="sm:w-14 sm:px-4 sm:py-3 text-center text-[10px] lg:text-base">
                    No
                  </th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center  text-[10px] lg:text-base">
                    Tanggal & Waktu
                  </th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center  text-[10px] lg:text-base">
                    Shalat
                  </th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center  text-[10px] lg:text-base">
                    Status
                  </th>
                  <th className="sm:px-6 sm:py-3 py-2 text-center  text-[10px] lg:text-base">
                    Foto
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-100'
                    } hover:bg-slate-200`}
                  >
                    <td className="sm:px-4 px-2 sm:py-2 text-center border sm:text-base text-[10px]">
                      {index + 1}
                    </td>
                    <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px]">
                      {item.tanggal}  ({item.jam} WIB)
                    </td>
                    <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px]">
                      {capitalize(item.shalat)}
                    </td>
                    <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px] capitalize">
                      {!item.status?(
                        <span className='text-yellow-600'>Uploaded</span>
                      ):(
                        <span className='text-green-500'>Approved</span>
                      )}
                    </td>
                   <td className="sm:px-6 py-2 text-center border sm:text-base text-[10px]">
                      {item.foto ? (
                        <button
                          onClick={() => setFotoModal(`${API_URL}${item.foto}`)}
                          className="sm:text-xs text-[8px] bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Lihat Foto
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
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
      {fotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setFotoModal(null)}
        >
          <div
            className="sm:mx-auto mx-2 bg-white rounded-lg shadow-lg p-4 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setFotoModal(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
            >
              ✕
            </button>

            <p className="text-center font-semibold text-slate-700 mb-3">
              Foto Absensi Shalat
            </p>

            <img
              src={fotoModal}
              alt="Foto Shalat"
              className="w-full max-h-[70vh] object-contain rounded"
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default RekapBulanShalat
