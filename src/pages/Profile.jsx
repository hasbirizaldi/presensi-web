import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      // jika tidak login, tendang ke login
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 pt-28 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-ku p-6">
        
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-green-700 text-7xl mb-3" />
          <h2 className="text-xl font-bold text-slate-800">
            Profil Pengguna
          </h2>
          <p className="text-sm text-slate-500">
            Informasi akun Anda
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-500">Nama</label>
            <div className="border rounded-lg px-4 py-2 bg-slate-50">
              {user.name || "-"}, {user.title}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500">Username</label>
            <div className="border rounded-lg px-4 py-2 bg-slate-50">
              {user.username}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-500">Role</label>
            <div className="border rounded-lg px-4 py-2 bg-slate-50">
              {user.role || "User"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-green-700 hover:bg-green-900 text-white py-2 rounded-lg"
          >
            Kembali
          </button>

          <button
            onClick={() => navigate("/logout")}
            className="flex-1 bg-red-600 hover:bg-red-800 text-white py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
