import api from "./api";

export const gradeInspection = (produceId, grade) =>
  api.post(`/inspection/${produceId}/${grade}`);

export const getAllInspections = async () => {
  const res = await api.get("/inspection");
  return Array.isArray(res.data) ? res.data : [];
};