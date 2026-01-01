import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import TopBar from "../../components/admin/TopBar";

const TableSkeleton = () => {
  return (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-t">
          {[...Array(7)].map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-3 w-full bg-gray-200 animate-pulse rounded"></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // penting: kasih default biar tidak undefined
  const [pagination, setPagination] = useState({
    from: 0,
    to: 0,
    total: 0,
    current_page: 1,
    per_page: 10,
    last_page: 1,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("https://brewokode.site/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          search,
          page,
        },
      });

      const paginator = res.data.data;

      setUsers(paginator.data);
      setPagination(paginator);
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // fetch saat search / page berubah + debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delay);
  }, [search, page]);

  return (
    <div className="sm:py-14 py-8">
      <TopBar />

      <div className="lg:w-[90%] w-[98%] mx-auto lg:mt-6 mt-3 rounded-lg shadow-ku overflow-x-auto">
        <div className="bg-white lg:px-10 px-1 sm:py-5 py-2">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 mb-3 gap-4">
            <h1 className="sm:text-2xl text-sm font-bold text-gray-800">
              Manajemen Users
            </h1>

            <Link
              to="/admin/create-user"
              className="bg-green-600 hover:bg-green-700 text-white sm:px-4 px-2 py-2  rounded sm:text-sm text-xs"
            >
              + Tambah User
            </Link>
          </div>

          {/* SEARCH */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari nama / username ..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full  sm:px-4 px-2 sm:py-2 py-1 border-2 border-green-600 rounded focus:ring-2 focus:ring-green-500 outline-none sm:text-base text-sm"
            />
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr className="h-8 bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 text-white">
                  <th className="sm:px-4 px-1 sm:py-3 py-2 text-[10px] sm:text-base text-left">No</th>
                  <th className="sm:px-4 px-1 sm:py-3 py-2 text-[10px] sm:text-base text-left">Nama</th>
                  <th className="sm:px-4 px-1 sm:py-3 py-2 text-[10px] sm:text-base text-left">Unit</th>
                  <th className="sm:px-4 px-1 sm:py-3 py-2 text-[10px] sm:text-base text-left">Role</th>
                  <th className="sm:px-4 px-1 sm:py-3 py-2 text-[10px] sm:text-base text-left">Status</th>
                  <th className="sm:px-4 px-1 sm:py-3 py-2 text-[10px] sm:text-base text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-sm text-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-6">
                       <div className="flex flex-col items-center justify-center py-10">
                      <span className="loader"></span>
                      <p className="mt-14 text-sm text-gray-500">Memuat data...</p>
                    </div>
                    </td>
                  </tr>
                  
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center sm:text-base text-xs py-6">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  users.map((item, index) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="sm:px-4 px-1 sm:py-3 py-2 sm:text-base text-[10px]">
                        {(pagination.current_page - 1) *
                          pagination.per_page +
                          index +
                          1}
                      </td>
                      <td className="sm:px-4 px-1 sm:py-3 py-2 sm:text-base text-[10px]">{item.name}</td>
                      <td className="sm:px-4 px-1 sm:py-3 py-2 sm:text-base text-[10px]">Disini Unit</td>
                     <td className="sm:px-4 px-1 sm:py-3 py-2 sm:text-base text-[10px]">
                      {{
                        super_admin: "Super Admin",
                        admin: "Admin",
                        user: "User",
                      }[item.role] ?? "User"}
                    </td>

                      <td className="sm:px-4 px-1 sm:py-3 py-2 sm:text-base text-[8px]">
                        {item.status === 1 ? (
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 sm:text-xs text-[10px]">
                          Aktif
                        </span>
                        ):(
                           <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 sm:text-xs text-[10px]">
                          Tidak Aktif
                        </span>
                        )}
                      </td>
                      <td className="sm:px-4 px-1 sm:py-3 py-2 sm:text-base text-[10px] text-center space-x-2">
                        <button className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white sm:text-xs text-[8px] rounded">
                          Edit
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white sm:text-xs text-[8px] rounded">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>
              Menampilkan {pagination.from}–{pagination.to} dari{" "}
              {pagination.total} data
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === pagination.last_page}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
