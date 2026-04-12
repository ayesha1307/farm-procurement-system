import api from "./api";

export const loginUser = async (data) => {
  const res = await fetch("http://localhost:8080/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // only name + role
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
};
export const registerUser = async (userData) => {
  try {
    const res = await api.post("/users", userData);
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.response?.data || "Registration failed";
    throw new Error(typeof msg === "string" ? msg : "Registration failed");
  }
};