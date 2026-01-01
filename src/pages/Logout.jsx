import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alertSuccess } from "../utils/alert";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      // hapus data login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      await alertSuccess("Logout berhasil");

      navigate("/login", { replace: true });
    };

    doLogout();
  }, [navigate]);

  return null;
};

export default Logout;
