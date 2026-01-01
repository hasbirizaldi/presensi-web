import { Navigate } from "react-router-dom";

const SuperAdminRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default SuperAdminRoute;
