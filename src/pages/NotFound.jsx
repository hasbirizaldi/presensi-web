import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 text-center px-4">
      <FaExclamationTriangle className="text-yellow-600 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-slate-800">404</h1>
      <p className="text-slate-600 mt-2">
        Halaman tidak ditemukan
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-green-700 hover:bg-green-900 text-white px-6 py-2 rounded-lg"
      >
        Kembali ke Home
      </button>
    </div>
  );
};

export default NotFound;
