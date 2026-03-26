import api from "./api";

export const getPlants = async () => {
  const res = await api.get("/plants");
  return res.data.data;
};

export const createForecast = async (payload:any) => {
  const res = await api.post("/pr/forecast", payload);
  return res.data;
};
