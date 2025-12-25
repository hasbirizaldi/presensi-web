import { dummyShalatData } from '../../api/data'
import TopBar from '../../components/shalat/TopBar'

const RekapBulanShalat = () => {
  // Filter data hanya untuk bulan Desember 2025
  const dataDesember = dummyShalatData.filter(item => {
    // Cek apakah tanggal mulai dengan "2025-12"
    return item.tanggal.startsWith('2025-12')
  })

  return (
    <div className='py-14'>
      <TopBar />
      <div className="lg:w-[70%] w-[98%] mx-auto mt-6 rounded-lg shadow-ku overflow-x-auto">
        <div className="bg-white lg:px-10 px-1 lg:py-5 py-4">
          <p className="lg:text-lg text-sm font-semibold text-slate-700 mb-1">
            Rekap Absensi Shalat Desember 2025
          </p>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-800 via-green-600 to-green-800 text-white">
                <th className="lg:w-14 lg:px-4 lg:py-3 text-center font-semibold lg:text-base text-xs tracking-wide border-b border-green-700">No</th>
                <th className="px-6 py-3 text-center font-semibold lg:text-base text-xs tracking-wide border-b border-green-700">Tanggal</th>
                <th className="px-6 py-3 text-center font-semibold lg:text-base text-xs tracking-wide border-b border-green-700">Jam</th>
                <th className="px-6 py-3 text-center font-semibold lg:text-base text-xs tracking-wide border-b border-green-700">Shalat</th>
              </tr>
            </thead>
            <tbody>
              {dataDesember.map(({ id, tanggal, jam, shalat }, index) => (
                <tr
                  key={id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-100'
                  } hover:bg-slate-200 transition-colors duration-200 cursor-pointer`}
                >
                  <td className="lg:px-4 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border border-gray-200">{index+1}</td>
                  <td className="lg:px-6 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border border-gray-200">{tanggal}</td>
                  <td className="lg:px-6 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border border-gray-200">{jam}</td>
                  <td className="lg:px-6 px-2 lg:py-3 py-2 lg:text-base text-xs text-center border border-gray-200">{shalat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RekapBulanShalat
