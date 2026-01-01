import { useEffect, useState } from "react";
import axios from "axios";
import TopBar from "../../components/admin/TopBar";
import { formatDateISOToIndo } from "../../utils/helper";
import { alertSuccess } from "../../utils/alert";

const API_URL = "https://brewokode.site";

const AdminShalat = () => {
  const [data, setData] = useState([]);
  const [fotoModal, setFotoModal] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    last_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [shalat, setShalat] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [tanggalFrom, setTanggalFrom] = useState("");
  const [tanggalTo, setTanggalTo] = useState("");

  const getData = async (page = 1, keyword = "") => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/get-all-shalat`,
        {
          params: {
            page,
            search: keyword,
            shalat: shalat || undefined,
            tanggal: tanggal || undefined,
            tanggal_from: tanggalFrom || undefined,
            tanggal_to: tanggalTo || undefined,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData(res.data.data.data);
      setMeta({
        total: res.data.data.total,
        last_page: res.data.data.last_page,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearch("");
    setShalat("");
    setTanggal("");
    setTanggalFrom("");
    setTanggalTo("");
    setPage(1);

    getData(1, "");
  };


  useEffect(() => {
  const t = setTimeout(() => {
    setPage(1);
    getData(1, search);
  }, 400);

  return () => clearTimeout(t);
}, [search, shalat, tanggal, tanggalFrom, tanggalTo]);


  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      getData(1, search);
    }, 500);

    return () => clearTimeout(t);
  }, [search]);

  const handleApprove = async (id) => {
    try {
      await axios.post(
        `${API_URL}/api/approve-shalat/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 1 } : item
        )
      );

      await alertSuccess("Data berhasil di-approve");
    } catch (err) {
      console.log(err);
      alert("Gagal approve presensi");
    }
  };

  return (
    <div className="sm:py-14 py-8">
      <TopBar />

      <div className="lg:w-[90%] w-[98%] mx-auto sm:mt-6 mt-3 rounded-lg shadow-ku overflow-x-auto">
        <div className="bg-white lg:px-10 px-1 lg:py-5 sm:py-4 py-2">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 mb-3 gap-4">
            <h1 className="sm:text-2xl text-sm font-bold text-gray-800">
              Admin Absensi Shalat
            </h1>
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:gap-3 gap-2 sm:mb-4 mb-2">
            
             {/* SEARCH */}
            <div>
              <input
                type="text"
                placeholder="Cari nama / username ..."
                className="w-full  sm:px-4 px-2 sm:py-2 py-1 border-2 border-green-600 rounded focus:ring-2 focus:ring-green-500 outline-none sm:text-base text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* FILTER SHALAT */}
            <select
              className="w-full  sm:px-4 px-1 sm:py-2 py-1 border-2 border-green-600 rounded focus:ring-2 focus:ring-green-500 outline-none sm:text-base text-sm"
              value={shalat}
              onChange={(e) => setShalat(e.target.value)}
            >
              <option value="">Semua Shalat</option>
              <option value="subuh">Subuh</option>
              <option value="dzuhur">Dzuhur</option>
              <option value="ashar">Ashar</option>
              <option value="maghrib">Maghrib</option>
              <option value="isya">Isya</option>
            </select>

            {/* TANGGAL SINGLE */}
            <input type="date" className="w-full  sm:px-4 px-2 sm:py-2 py-1 border-2 border-green-600 rounded focus:ring-2 focus:ring-green-500 outline-none sm:text-base text-sm"
                value={tanggal}
                onChange={(e) => {
                  setTanggal(e.target.value);
                  setTanggalFrom("");
                  setTanggalTo("");
                }}
              />
          </div>
           {/* RANGE TANGGAL */}
            <div className="grid sm:grid-cols-3 gap-2 mb-5">
             <div className="flex flex-col">
                <label className="sm:text-base text-xs">Dari Tanggal</label>
                <input
                  type="date"
                  className="w-full  sm:px-4 px-2 sm:py-2 py-1 border-2 border-green-600 rounded focus:ring-2 focus:ring-green-500 outline-none sm:text-base text-sm"
                  value={tanggalFrom}
                  onChange={(e) => {
                    setTanggal("");
                    setTanggalFrom(e.target.value);
                  }}
                />
             </div>

              <div className="flex flex-col">
                <label className="sm:text-base text-xs">Sampai tanggal</label>
                <input
                  type="date"
                  className="w-full  sm:px-4 px-2 sm:py-2 py-1 border-2 border-green-600 rounded focus:ring-2 focus:ring-green-500 outline-none sm:text-base text-sm"
                  value={tanggalTo}
                  onChange={(e) => {
                    setTanggal("");
                    setTanggalTo(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-end sm:ml-5">
                <button
                  onClick={handleReset}
                  className="sm:px-4 px-2 sm:py-2 py-1  bg-slate-500 hover:bg-slate-600 text-white rounded sm:text-sm text-xs"
                >
                  Reset Filter
                </button>
              </div>
            </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white rounded shadow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <span className="loader"></span>
                <p className="mt-14 text-sm text-gray-500">Memuat data...</p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr className="bg-gradient-to-r from-amber-950 via-amber-800 to-amber-950 text-white h-8">
                    <th className="sm:px-2 px-1 sm:py-3 py2 text-left sm:text-base text-[10px]">#</th>
                    <th className="sm:px-2 px-1 sm:py-3 py2 text-left sm:text-base text-[10px]">Nama</th>
                    <th className="sm:px-2 px-1 sm:py-3 py2 text-left sm:text-base text-[10px]">Unit</th>
                    <th className="sm:px-2 px-1 sm:py-3 py2 text-left sm:text-base text-[10px]">Shalat</th>
                    <th className="sm:px-2 px-1 sm:py-3 py2 text-left sm:text-base text-[10px]">Waktu</th>
                    <th className="sm:px-2 px-1 sm:py-3 py2 text-left sm:text-base text-[10px]">Status</th>
                    <th className="sm:px-2 px-1 sm:py-3 py2 text-left sm:text-base text-[10px]">Aksi</th>
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-700">
                  {data.map((item, index) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="sm:px-2 px-1 sm:py-3 py-2 sm:text-base text-[10px]">
                        {(page - 1) * 15 + (index + 1)}
                      </td>

                      <td className="sm:px-2 px-1 sm:py-3 py-2 sm:text-base text-[10px] capitalize">
                        {item.user?.name ?? "-"}
                      </td>

                       <td className="sm:px-2 px-1 sm:py-3 py-2 sm:text-base text-[10px] capitalize">
                        Unit
                      </td>

                      <td className="sm:px-2 px-1 sm:py-3 py-2 sm:text-base text-[10px] capitalize">
                        {item.shalat}
                      </td>

                      <td className="sm:px-2 px-1 sm:py-3 py-2 sm:text-base text-[10px]">
                        {formatDateISOToIndo(item.tanggal)} ({item.waktu} WIB)
                      </td>

                      <td className="sm:px-2 px-1 sm:py-3 py-2 sm:text-base text-[10px]">
                        {item.status ? (
                          <span className="text-green-500 text-[8px] sm:text-xs">
                            Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="text-[8px] sm:text-xs bg-yellow-500 hover:bg-yellow-600 text-white sm:px-3 px-1 py-1 rounded"
                          >
                            Uploaded
                          </button>
                        )}
                      </td>

                      <td className="sm:px-2 px-1 sm:py-3 py-2 sm:text-base text-[10px]">
                        {item.foto && (
                          <button
                            onClick={() =>
                              setFotoModal(
                                `${API_URL}/storage/${item.foto}`
                              )
                            }
                            className="ml-2 sm:text-xs text-[8px] bg-green-500 hover:bg-green-600 text-white sm:px-3 px-1 py-1 rounded"
                          >
                            Lihat Foto
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>Total {meta.total} data</span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={page === meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL FOTO */}
      {fotoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setFotoModal(null)}
        >
          <div
            className="bg-white sm:mx-auto mx-2 rounded-lg shadow-lg p-4 max-w-md w-full relative"
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
  );
};

export default AdminShalat;
