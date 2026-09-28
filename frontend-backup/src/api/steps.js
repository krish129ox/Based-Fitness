import api from "./axios";

export const saveStepsRequest = async (payload) => {
  const { data } = await api.post("/steps", payload);
  return data;
};

export const fetchSteps = async (range) => {
  const { data } = await api.get("/steps", { params: range ? { range } : undefined });
  return data;
};
