import api from "./api";

/* =========================================================
   STEP 1: CREATE / UPDATE JOB
========================================================= */

export const saveCleaningStep1 = async (payload: {
  siteId: number;
  projectType: string;
  contactPhone: string;
  contactEmail: string;
  workDate: string;
  startTime: string;
  endTime: string;
  contractor: string;
  problem: string;
  customerName: string;
  note: string;
  jobId?: number;
}) => {
  const res = await api.post("/cleaning/step1", payload);
  return res.data;
};

/* =========================================================
   STEP 2: EMAIL PLAN (DRAFT)
========================================================= */

export const saveCleaningStep2Draft = async (data: {
  jobId: number;
  to?: string;
  subject?: string;
  body?: string;
  files?: File[];
  signatureName?: string;
}) => {
  const formData = new FormData();

  formData.append("jobId", String(data.jobId));
  formData.append("to", data.to || "");
  formData.append("subject", data.subject || "");
  formData.append("body", data.body || "");
  formData.append("signatureName", data.signatureName || "");

  if (data.files?.length) {
    data.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const res = await api.post("/cleaning/step2/draft", formData);
  return res.data;
};

export const sendCleaningStep2 = async (jobId: number) => {
  const res = await api.post("/cleaning/step2/send", { jobId });
  return res.data;
};

/* =========================================================
   STEP 3: EVIDENCE + CHECKLIST
========================================================= */

export const uploadCleaningEvidence = async ({
  jobId,
  labelType,
  files,
}: {
  jobId: number;
  labelType?: string;
  files: File[];
}) => {
  if (files.length > 30) {
    throw new Error("ไฟล์เกิน 30 รายการ");
  }

  const formData = new FormData();
  formData.append("jobId", String(jobId));

  if (labelType) {
    formData.append("labelType", labelType);
  }

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await api.post("/cleaning/step3/evidence", formData);
  return res.data;
};

export const saveCleaningChecklist = async (payload: {
  jobId: number;
  checklistJson: any;
  step3SummaryNote: string;
}) => {
  const res = await api.post("/cleaning/step3/checklist", payload);
  return res.data;
};

/* =========================================================
   STEP 4: GENERATE REPORT
========================================================= */

export const generateCleaningReport = async (jobId: number) => {
  const res = await api.post("/cleaning/step4/generate", { jobId });
  return res.data;
};

/* =========================================================
   STEP 5: EMAIL REPORT
========================================================= */

export const saveCleaningStep5Draft = async (payload: {
  jobId: number;
  to?: string;
  subject?: string;
  body?: string;
}) => {
  const res = await api.post("/cleaning/step5/draft", payload);
  return res.data;
};

export const sendCleaningStep5 = async (payload: {
  jobId: number;
  to: string;
  subject: string;
  body: string;
}) => {
  const res = await api.post("/cleaning/step5/send", payload);
  return res.data;
};

/* =========================================================
   COMMON
========================================================= */

export const getCleaningProjects = async () => {
  const res = await api.get("/cleaning/projects", {
    params: { pageSize: 5000 },
  });
  return res.data;
};

export const getCleaningJobs = async (query?: string) => {
  const res = await api.get(`/cleaning/jobs${query ?? ""}`);
  return res.data;
};

export const getCleaningReportDownloadUrl = (jobId: number) => {
  return `/api/cleaning/step4/download/${jobId}`;
};

export const downloadCleaningZip = (jobIds: number[]) => {
  const ids = jobIds.join(",");
  window.open(`/api/cleaning/jobs/download-zip?jobIds=${ids}`, "_blank");
};

