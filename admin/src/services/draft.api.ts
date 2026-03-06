import api from "./api";

export const saveDraft = async (jobId: number, step: number) => {
  const res = await api.post("/drafts/save", {
    jobId,
    step
  });

  return res.data;
};