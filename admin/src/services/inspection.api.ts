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
  return res.data;
};

export const downloadInspectionZip = (jobIds: number[]) => {
  const ids = jobIds.join(",");
  window.open(`/api/inspection/jobs/download-zip?jobIds=${ids}`, "_blank");
};

export const createInspectionStep1 = async (payload: {
  siteId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  contractor: string;
  problem: string;
  jobId?: number; // ✅ สำหรับ edit mode
}) => {
  const res = await api.post("/inspection/step1", payload);
  return res.data;
};

export const sendInspectionStep2 = async (jobId: number) => {
  const res = await api.post("/inspection/step2/send", { jobId });
  return res.data;
};

export const saveInspectionStep2Draft = async (payload: {
  jobId: number;
  to: string;
  subject: string;
  body: string;
  signatureName?: string;
  attachments?: File[];
}) => {
  const form = new FormData();

  form.append("jobId", String(payload.jobId));
  form.append("to", payload.to);
  form.append("subject", payload.subject);
  form.append("body", payload.body);

  if (payload.signatureName) {
    form.append("signatureName", payload.signatureName);
  }

  if (payload.attachments) {
    payload.attachments.forEach((file) => {
      form.append("attachments", file);
    });
  }

  const res = await api.post("/inspection/step2/draft", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const saveInspectionStep3Draft = async (payload: {
  jobId: number;
  to: string;
  subject: string;
  body: string;
  report?: File | null;
}) => {
  const form = new FormData();

  form.append("jobId", String(payload.jobId));
  form.append("to", payload.to);
  form.append("subject", payload.subject);
  form.append("body", payload.body);

  if (payload.report) {
    form.append("report", payload.report);
  }

  const res = await api.post("/inspection/step3/draft", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const sendInspectionStep3 = async (jobId: number) => {
  const res = await api.post("/inspection/step3/send", { jobId });
  return res.data;
};