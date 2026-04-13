import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

<<<<<<< HEAD
  console.log("USER:", user);

=======
>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32
  if (!user) {
    return <Navigate to="/login" />;
  }

<<<<<<< HEAD
  const role = user.role ? user.role.toUpperCase() : "";

  if (allowedRoles && !allowedRoles.includes(role)) {
=======
  if (allowedRoles && !allowedRoles.includes(user.role)) {
>>>>>>> 9fc93fc775d3f99bd4cee8a477dec371a48afc32
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;