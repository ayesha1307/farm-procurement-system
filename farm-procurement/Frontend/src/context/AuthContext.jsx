import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import { ROLE_REDIRECTS } from "../utils/roles";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("farmUser");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  const login = async (credentials) => {
    const userData = await loginUser(credentials);
    setUser(userData);
    localStorage.setItem("farmUser", JSON.stringify(userData));
    navigate(ROLE_REDIRECTS[userData.role] || "/");
    return userData;
  };

  const register = async (userData) => {
    const newUser = await registerUser(userData);
    setUser(newUser);
    localStorage.setItem("farmUser", JSON.stringify(newUser));
    navigate(ROLE_REDIRECTS[newUser.role] || "/");
    return newUser;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("farmUser");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);