import api from "./api";

export const getServiceJobs = async (query?: string) => {
  const res = await api.get(`/service/jobs${query ?? ""}`);
  return res.data;
};

export const getServiceProjects = async (query?: string) => {
  const res = await api.get(`/service/projects${query ?? ""}`);
  return res.data;
};

export const downloadServiceZip = (jobIds: number[]) => {
  const ids = jobIds.join(",");
  window.open(`/api/service/jobs/download-zip?jobIds=${ids}`, "_blank");
};

export const createServiceStep1 = async (payload: {
  siteId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  contractor: string;
  problem: string;
  note: string;
}) => {
  const res = await api.post("/service/step1", payload);
  return res.data;
};

export const updateServiceStep1 = async (
  jobId: number,
  payload: {
    siteId: number;
    workDate: string;
    startTime: string;
    endTime: string;
    contractor: string;
    problem: string;
    note: string;
  }
) => {
  const res = await api.put(`/service/job/${jobId}`, payload);
  return res.data;
};

export const deleteServiceJob = async (jobId: number) => {
  const res = await api.delete(`/service/job/${jobId}`);
  return res.data;
};

export const saveServiceStep2Draft = async (payload: {
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

  if (payload.attachments?.length) {
    payload.attachments.forEach(file => {
      form.append("attachments", file);
    });
  }

  const res = await api.post("/service/step2/draft", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const sendServiceStep2 = async (jobId: number) => {
  const res = await api.post("/service/step2/send", { jobId });
  return res.data;
};

export const createServiceStep3Draft = async ({
  jobId,
  reportFile,
  images,
  metaJson,
}: {
  jobId: number;
  reportFile?: File | null;
  images?: File[];
  metaJson?: {
    items?: {
      productId: number;
      quantity: number;
    }[];
  };
}) => {
  const formData = new FormData();

  formData.append("jobId", String(jobId));

  if (metaJson) {
    formData.append("metaJson", JSON.stringify(metaJson));
  }

  if (reportFile) {
    formData.append("serviceReport", reportFile); // ✅ ตรง backend
  }

  if (images?.length) {
    images.forEach(file => {
      formData.append("evidence", file); // ✅ ตรง backend
    });
  }

  const res = await api.post("/service/step3/draft", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const generateServiceReport = async (jobId: number) => {
  const res = await api.post("/service/step4/generate", { jobId });
  return res.data;
};

export const downloadServiceReport = (jobId: number) => {
  window.open(`/api/service/step4/download/${jobId}`, "_blank");
};

export const saveServiceStep5Draft = async (payload: {
  jobId: number;
  to?: string;
  subject?: string;
  body?: string;
}) => {
  const res = await api.post("/service/step5/draft", payload);
  return res.data;
};

export const sendServiceStep5 = async (payload: {
  jobId: number;
  to: string;
  subject: string;
  body: string;
}) => {
  const res = await api.post("/service/step5/send", payload);
  return res.data;
};