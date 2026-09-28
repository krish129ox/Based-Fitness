import api from "./axios";

export const createWorkoutRequest = async (payload) => {
  const { data } = await api.post("/workouts", payload);
  return data;
};

export const fetchWorkouts = async () => {
  const { data } = await api.get("/workouts");
  return data;
};

export const deleteWorkoutRequest = async (id) => {
  const { data } = await api.delete(`/workouts/${id}`);
  return data;
};
