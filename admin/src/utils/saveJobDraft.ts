import { saveDraft } from "../services/draft.api";
import { createCleaningStep1 } from "../services/cleaning.api";

type SaveCleaningDraftParams = {
  projectId: string;
  project: any;
  date: string;
  time: string;
  remark: string;
  contractor: string;
  projectType: string;
  step: number;
  navigate: (path: string) => void;
};

export async function saveCleaningDraft({
  projectId,
  project,
  date,
  time,
  remark,
  contractor,
  projectType,
  step,
  navigate,
}: SaveCleaningDraftParams) {
  try {
    if (!projectId) {
      alert("กรุณาเลือก Project");
      return;
    }

    if (!date || !time) {
      alert("กรุณาเลือกวันที่และเวลา");
      return;
    }

    let jobId = localStorage.getItem("jobId");

    // ถ้ายังไม่มี jobId ให้สร้าง job ก่อน
    if (!jobId) {
      const result = await createCleaningStep1({
        siteId: Number(projectId),
        projectType,
        contactPhone: project?.contactPhone ?? "",
        contactEmail: project?.contactEmail ?? "",
        workDate: date,
        workTimeText: time,
        customerName: project?.projectName ?? "",
        note: remark,
      });

      jobId = result.data.jobId;
      localStorage.setItem("jobId", String(jobId));
    }

    // เรียก Draft API
    await saveDraft(Number(jobId), step);

    // backup form data
    const payload = {
      jobId,
      projectId,
      projectName: project?.projectName,
      date,
      time,
      remark,
      contractor,
      projectType,
    };

    localStorage.setItem("cleaning_step1", JSON.stringify(payload));

    alert("บันทึกเรียบร้อยแล้ว");

    navigate("/cleaning");
  } catch (err) {
    console.error(err);
    alert("Save Draft ไม่สำเร็จ");
  }
}