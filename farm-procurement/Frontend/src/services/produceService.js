import api from "./api";

export const addProduce = (data) => api.post("/produce", data);
export const getAllProduce = async () => {
  const res = await api.get("/produce");
  return Array.isArray(res.data) ? res.data : [];
};
export const getProduceById = (id) => api.get(`/produce/${id}`);