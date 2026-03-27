import api from "../services/api";

export type QueueType = "report-generation" | "email-sending";

/* =========================
   Poll Task
========================= */
export async function pollTask(
  taskId: string,
  queue: QueueType,
  onProgress?: (progress: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/tasks/${taskId}?queue=${queue}`);
        const data = res.data?.data;

        if (!data) {
          clearInterval(interval);
          reject("Task not found");
          return;
        }

        if (data.state === "waiting") {
          console.log("⏳ Waiting...");
        }

        if (data.state === "active") {
          console.log("⚙️ Processing...", data.progress);
          onProgress?.(data.progress || 0);
        }

        if (data.state === "completed") {
          clearInterval(interval);
          resolve(data.result);
        }

        if (data.state === "failed") {
          clearInterval(interval);
          reject(data.failedReason || "Task failed");
        }

      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 2000);
  });
}

/* =========================
   Handle Queue or Sync
========================= */
export async function handleQueueOrSync(
  apiCall: Promise<any>,
  queue: QueueType,
  onSuccess: (data: any) => any,
  onProgress?: (progress: number) => void
): Promise<any> {
  const res = await apiCall;

  const data = res.data;  // ✅ เปลี่ยนจาก res.data?.data → res.data

  // 🟡 Queue mode
  if (data?.taskId) {
    const result = await pollTask(data.taskId, queue, onProgress);
    onSuccess(result);
    return result;
  }

  // 🟢 Sync mode
  else {
    onSuccess(data);
    return data;
  }
}