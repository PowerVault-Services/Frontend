import api from "./api";

export const getInspectionProjects = async () => {
  const res = await api.get("/inspection/projects");
  return res.data;
};

/* =========================
   GET Inspection Jobs
========================= */

export const getInspectionJobs = async (query?: string) => {
  const res = await api.get(`/inspection/jobs${query ?? ""}`);
  return res;
};

export const createInspectionStep1 = async (payload: {
  siteId: number;
  projectType: string;
  contactPhone: string;
  contactEmail: string;
  workDate: string;
  workTimeText: string;
  customerName: string;
  note: string;
}) => {
  const res = await api.post("/inspection/step1", payload);
  return res.data;
};

export const sendInspectionStep2 = async (jobId: number) => {
  const res = await api.post("/inspection/step2/send", { jobId });
  return res.data;
};