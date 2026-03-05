import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import OperationTable from "../../components/table/OperationTable";

interface ChecklistItem {
  item: string;
  ok: boolean;
  remark?: string;
}

export default function NewCleaningStep3_02() {
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: "กรอกข้อมูล" },
    { id: 2, label: "ส่งอีเมลแจ้งแผน" },
    { id: 3, label: "แนบรูปภาพ" },
    { id: 4, label: "รายงาน" },
    { id: 5, label: "ส่งรายงาน" },
  ];

  const [currentStep] = useState(3);
  const [loading, setLoading] = useState(false);
  const [checklistData, setChecklistData] = useState<ChecklistItem[]>([]);

  // 🔥 สร้าง summary อัตโนมัติ
  const generateSummaryNote = (data: ChecklistItem[]) => {
    const total = data.length;
    const okCount = data.filter((i) => i.ok).length;
    const notOkItems = data.filter((i) => !i.ok);

    let summary = `ตรวจสอบทั้งหมด ${total} รายการ\n`;
    summary += `ผ่าน ${okCount} รายการ\n`;
    summary += `ไม่ผ่าน ${notOkItems.length} รายการ\n`;

    if (notOkItems.length > 0) {
      summary += "\nรายละเอียดที่ไม่ผ่าน:\n";

      notOkItems.forEach((item, index) => {
        summary += `${index + 1}. ${item.item}`;
        if (item.remark) {
          summary += ` - หมายเหตุ: ${item.remark}`;
        }
        summary += "\n";
      });
    }

    return summary;
  };

  const handleSubmitChecklist = async () => {
    if (loading) return;

    const jobId = localStorage.getItem("jobId");
    const token = localStorage.getItem("token");

    if (!jobId) {
      alert("ไม่พบ jobId");
      return;
    }

    if (checklistData.length === 0) {
      alert("กรุณากรอก Checklist");
      return;
    }

    const autoSummary = generateSummaryNote(checklistData);

    try {
      setLoading(true);

      const response = await fetch("/api/cleaning/step3/checklist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          jobId: Number(jobId),
          checklistJson: JSON.stringify(checklistData),
          step3SummaryNote: autoSummary,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("API Error");
      }

      alert("บันทึก Checklist สำเร็จ");

      // 👉 ไป Step4 ทันที
      navigate("/cleaning/new/step4", { replace: true });

    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between pb-9">
        <h1 className="text-green-800">New Cleaning Job</h1>

        <button
          className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
          text-green-700 bg-white border-2 border-green-700 rounded-md"
        >
          <img src={SaveDraftIcon} alt="save draft" />
          Save Draft
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl items-center justify-between">
        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* Checklist Table */}
        <div className="w-[1095px]">
          <OperationTable onChange={setChecklistData} />
        </div>

        {/* Footer */}
        <div className="flex w-full max-w-[1095px] justify-between">
          <button
            onClick={() => navigate("/cleaning/new/step3_01")}
            className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
          >
            ก่อนหน้า
          </button>

          <button
            onClick={handleSubmitChecklist}
            disabled={loading}
            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl disabled:opacity-50"
          >
            {loading ? "กำลังบันทึก..." : "ถัดไป"}
          </button>
        </div>
      </div>
    </div>
  );
}
