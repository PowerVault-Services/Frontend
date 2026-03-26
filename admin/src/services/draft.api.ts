import api from "./api";

/**
 * Save current step progress (Draft)
 */
export const saveDraftStep = async (jobId: number, step: number) => {
  if (!jobId) throw new Error("jobId is required");

  const res = await api.post("/drafts/save", {
    jobId,
    step,
  });

  return res.data;
};

/**
 * (optional) get current draft step
 */
export const getDraftStep = async (jobId: number) => {
  const res = await api.get(`/drafts/${jobId}`);
  return res.data;
};