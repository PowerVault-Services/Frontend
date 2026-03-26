import api from "./api";

export const getHomepageSummary = async () => {
  const res = await api.get("/homepage/summary");
  return res.data.data;
};

export const getHomepagePlants = async (
  page = 1,
  pageSize = 20,
  q?: string
) => {

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize)
  });

  if (q) params.append("q", q);

  const res = await api.get(`/homepage/plants?${params.toString()}`);

  return res.data.data;
};