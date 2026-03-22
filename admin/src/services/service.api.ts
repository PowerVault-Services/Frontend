import api from "./api";

export const getServiceJobs = async (query?: string) => {
  const res = await api.get(`/service/jobs${query ?? ""}`);
  return res.data;
};

export const downloadServiceZip = (jobIds: number[]) => {
  const ids = jobIds.join(",");
  window.open(`/api/service/jobs/download-zip?jobIds=${ids}`, "_blank");
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
  metaJson?: any;
}) => {

  const formData = new FormData();

  formData.append("jobId", String(jobId));

  if (metaJson) {
    formData.append("metaJson", JSON.stringify(metaJson));
  }

  if (reportFile) {
    formData.append("serviceReport", reportFile);
  }

  if (images) {
    images.forEach(file => {
      formData.append("evidence", file);
    });
  }

  const res = await api.post("/service/step3/draft", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};