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

// 1. ฟังก์ชันอัปโหลดรูป (ที่เราแก้กันไปก่อนหน้า)
export const uploadCleaningEvidence = async ({
  jobId,
  filesByType,
}: {
  jobId: number;
  filesByType: Record<string, File[]>;
}) => {
  const requests = Object.entries(filesByType).map(([type, files]) => {
    const formData = new FormData();
    formData.append("jobId", String(jobId));
    formData.append("labelType", type); // ✅ แก้ตรงนี้

    files.forEach((file) => {
      formData.append("files", file);
    });

    return api.post("/cleaning/step3/evidence", formData);
  });

  await Promise.all(requests);
};

// 2. ฟังก์ชันบันทึก Checklist (เพิ่ม EXPORT ตรงนี้!)
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

export const downloadCleaningZip = async (jobIds: number[]): Promise<{ success: boolean; message?: string }> => {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const ids = jobIds.join(",");

  try {
    const res = await fetch(`${base}/api/cleaning/jobs/download-zip?jobIds=${ids}`);

    // ✅ เช็ค content-type ถ้าเป็น JSON แสดงว่า error
    const contentType = res.headers.get("content-type") ?? "";

    if (!res.ok || contentType.includes("application/json")) {
      const json = await res.json();
      return { success: false, message: json.message };
    }

    // ✅ เป็น zip จริง → trigger download
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cleaning-reports-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    return { success: true };

  } catch (err) {
    return { success: false, message: "เกิดข้อผิดพลาดในการเชื่อมต่อ" };
  }
};

