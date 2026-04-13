import api from "./api";

export const createProcurement = (produceId, quantity, price) =>
  api.post(`/procurement/${produceId}/${quantity}/${price}`);

export const getAllProcurements = async () => {
  const res = await api.get("/procurement");
  return Array.isArray(res.data) ? res.data : [];
};