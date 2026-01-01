import { useState } from "react";
import api from "../../api/api";
import { alertError, alertSuccess } from "../../utils/alert";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nik: "",
    nip: "",
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    gender: "pria",
    jenis_pegawai: "nonmedis",
    alamat: "",
    tlp: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/users-super-admin", form);

      await alertSuccess('User baru berhasil dibuat')
      navigate('/admin/user-list')

      setForm({
        nik: "",
        nip: "",
        name: "",
        username: "",
        email: "",
        password: "",
        role: "user",
        gender: "pria",
        jenis_pegawai: "nonmedis",
        alamat: "",
        tlp: "",
      });
    } catch (error) {
      console.log(error)
     await alertError('Terjadi kesalahan saat menyimpan data!!')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="max-w-4xl sm:mx-auto mx-2 sm:p-6 p-3 bg-white rounded-xl shadow">
      <h1 className="text-lg sm:text-2xl font-bold sm:mb-6 mb-3">Tambah User Raru</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-4 gap-2">
        <input name="nik" value={form.nik} onChange={handleChange} placeholder="NIK" className="input px-2 py-1" required />
        <input name="nip" value={form.nip} onChange={handleChange} placeholder="NIP" className="input px-2 py-1" required />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nama Lengkap" className="input px-2 py-1" required />
        <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="input px-2 py-1" required />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="input px-2 py-1" required />
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="input px-2 py-1" required />

        <select name="role" value={form.role} onChange={handleChange} className="input px-2 py-1">
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>

        <select name="gender" value={form.gender} onChange={handleChange} className="input px-2 py-1">
          <option value="pria">Pria</option>
          <option value="wanita">Wanita</option>
        </select>

        <select name="jenis_pegawai" value={form.jenis_pegawai} onChange={handleChange} className="input px-2 py-1">
          <option value="medis">Medis</option>
          <option value="nonmedis">Non Medis</option>
        </select>

        <input name="tlp" value={form.tlp} onChange={handleChange} placeholder="No. Telp" className="input px-2 py-1" />
        <textarea name="alamat" value={form.alamat} onChange={handleChange} placeholder="Alamat" className="input px-2 py-1 col-span-2" />

        <button
          disabled={loading}
          className="col-span-2 bg-green-600 cursor-pointer text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan User"}
        </button>
      </form>
      </div>
    </div>
  );
};

export default CreateUser;
