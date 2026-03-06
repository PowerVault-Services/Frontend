import api from "./api";

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

export const createCleaningStep1 = async (payload: {
    siteId: number;
    projectType: string;
    contactPhone: string;
    contactEmail: string;
    workDate: string;
    workTimeText: string;
    customerName: string;
    note: string;
}) => {
    const res = await api.post("/cleaning/step1", payload);
    return res.data;
};

export const sendCleaningStep2 = async (jobId: number) => {
    const res = await api.post("/cleaning/step2/send", { jobId });
    return res.data;
};

export async function saveCleaningStep2Draft(data: {
    jobId: number;
    to: string;
    subject: string;
    body: string;
    file?: File | null;
}) {

    const formData = new FormData();

    formData.append("jobId", String(data.jobId));
    formData.append("to", data.to);
    formData.append("subject", data.subject);
    formData.append("body", data.body);

    if (data.file) {
        formData.append("files", data.file);
    }

    const res = await api.post("/cleaning/step2/draft", formData);

    return res.data;
}

export async function uploadCleaningEvidence({
    jobId,
    labelType,
    files,
}: {
    jobId: string;
    labelType: string;
    files: File[];
}) {
    const formData = new FormData();

    formData.append("jobId", jobId);
    formData.append("labelType", labelType);

    files.forEach((file) => {
        formData.append("files", file);
    });

    const res = await api.post("/cleaning/step3/evidence", formData);

    return res.data;
}

export const generateCleaningReport = async (jobId: number) => {
    const res = await api.post("/cleaning/step4/generate", {
        jobId,
    });

    return res.data;
};

export const saveCleaningChecklist = async (payload: {
  jobId: number;
  checklistJson: string;
  step3SummaryNote: string;
}) => {

  const res = await api.post("/cleaning/step3/checklist", payload);

  return res.data;

};