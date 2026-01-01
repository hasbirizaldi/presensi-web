import { Link } from 'react-router-dom'
import TopBar from '../../components/admin/TopBar'

const AdminKajian = () => {
  return (
    <div className="py-14">
      <TopBar/>
      <div className="lg:w-[90%] w-[98%] mx-auto mt-6 rounded-lg shadow-ku overflow-x-auto">
          <div className="bg-white lg:px-10 px-1 lg:py-5 py-4">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                Admin Absensi Kajian
                </h1>

                <Link
                to="/superadmin/users/create"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                >
                + Tambah User
                </Link>
            </div>

            {/* SEARCH */}
            <div className="mb-4">
                <input
                type="text"
                placeholder="Cari nama / username / email..."
                className="w-full sm:w-80 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm text-gray-600">
                    <tr>
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">Nama</th>
                    <th className="px-4 py-3 text-left">Unit</th>
                    <th className="px-4 py-3 text-left">Waktu</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                </thead>

                <tbody className="text-sm text-gray-700">
                    {/* CONTOH DATA DUMMY */}
                    {[1, 2, 3].map((item, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">Samsul</td>
                        <td className="px-4 py-3">Unit</td>
                        <td className="px-4 py-3">Waktu</td>
                        <td className="px-4 py-3">Active</td>
                        <td className="px-4 py-3 text-center space-x-2">
                        <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded">
                            Edit
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded">
                            Hapus
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                <span>Menampilkan 1–10 dari 50 data</span>
                <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                    Prev
                </button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">
                    Next
                </button>
                </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default AdminKajian
