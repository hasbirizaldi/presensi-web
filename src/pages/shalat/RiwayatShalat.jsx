import React, { useState } from 'react'
import { dummyShalatData } from '../../api/data'
import TopBar from '../../components/shalat/TopBar'

// ambil bulan sekarang (01 - 12)
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')

const RiwayatShalat = () => {
  const [bulan, setBulan] = useState(currentMonth)

  // filter data berdasarkan bulan (tahun 2025)
  const filteredData = dummyShalatData.filter(item => {
    return item.tanggal.startsWith(`2025-${bulan}`)
  })

  return (
    <div className='py-14'>
      <TopBar />

      <div className="lg:w-[70%] w-[98%] mx-auto mt-6 rounded-lg shadow-ku overflow-x-auto">
        <div className="bg-white lg:px-10 px-1 lg:py-5 py-4">
          <div className="flex lg:flex-row flex-col justify-between  mb-3">
            <p className="lg:text-lg text-sm font-semibold text-slate-700 lg:mb-0 mb-3">
              Riwayat Absensi Shalat Tahun 2025
            </p>

            <select
              className="border-2 border-green-800 cursor-pointer rounded px-3 py-1 text-slate-800 hover:bg-green-800 hover:text-slate-50"
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

          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-800 via-green-600 to-green-800 text-white lg:text-base text-xs">
                <th className="lg:w-14 lg:px-4 py-3 text-center border-b">No</th>
                <th className="px-6 py-3 text-center border-b">Tanggal</th>
                <th className="px-6 py-3 text-center border-b">Jam</th>
                <th className="px-6 py-3 text-center border-b">Shalat</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-100'} hover:bg-slate-200`}
                  >
                    <td className="lg:px-4 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border">{index + 1}</td>
                    <td className="lg:px-6 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border">{item.tanggal}</td>
                    <td className="lg:px-6 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border">{item.jam}</td>
                    <td className="lg:px-6 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border">{item.shalat}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-slate-500">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RiwayatShalat
