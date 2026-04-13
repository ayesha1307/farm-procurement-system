import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  console.log("USER:", user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const role = user.role ? user.role.toUpperCase() : "";

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;