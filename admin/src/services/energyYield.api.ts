import api from "./api";

// ดึง site list
export const getEnergyYieldSites = () => {
  return api.get("/api/reports/energy-yield/sites");
};

// ดึง report
export const getEnergyYieldReport = (
  siteId: number,
  month: string
) => {
  return api.get(`/api/reports/energy-yield/${siteId}`, {
    params: { month },
  });
};