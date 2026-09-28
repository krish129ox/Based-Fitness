import api from "./axios";

export const signupRequest = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  return data;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get("/users/me");
  return data;
};
