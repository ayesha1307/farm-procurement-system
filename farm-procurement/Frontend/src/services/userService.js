import api from "./api";

export const getAllUsers = () => api.get("/users").then(r => r.data);
export const createUser = (data) => api.post("/users", data).then(r => r.data);