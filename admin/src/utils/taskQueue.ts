// src/utils/taskQueue.ts

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
        const res = await fetch(`/api/tasks/${taskId}?queue=${queue}`);
        const json = await res.json();

        const data = json.data;

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
): Promise<any> {                            // ✅ เพิ่ม return type
  const res = await apiCall;
  const data = res.data?.data;

  // 🟡 Queue mode
  if (data?.taskId) {
    const result = await pollTask(data.taskId, queue, onProgress);
    onSuccess(result);
    return result;                           // ✅ return ออกมา
  }

  // 🟢 Sync mode
  else {
    onSuccess(data);
    return data;                             // ✅ return ออกมา
  }
}