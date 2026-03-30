import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadFileField from "../../components/UploadFileField";
import UploadImagePreviewField from "../../components/UploadImagePreviewField";
import { uploadCleaningEvidence } from "../../services/cleaning.api";
import { saveDraftStep } from "../../services/draft.api";

export default function NewCleaningStep3_01() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  const steps = [
    { id: 1, label: "กรอกข้อมูล" },
    { id: 2, label: "ส่งอีเมลแจ้งแผน" },
    { id: 3, label: "แนบรูปภาพ" },
    { id: 4, label: "รายงาน" },
    { id: 5, label: "ส่งรายงาน" },
  ];

  const [currentStep] = useState(3);
  const savedData = JSON.parse(localStorage.getItem("cleaning_step1") || "{}");
  const isReadOnly = savedData.status === "COMPLETED";

  const [filesByType, setFilesByType] = useState<Record<string, File[]>>({
    BEFORE_PANEL: [],
    DURING_PANEL: [],
    AFTER_PANEL: [],
    BEFORE_INVERTER: [],
    DURING_INVERTER: [],
    AFTER_INVERTER: [],
    ZONE_WORK: [],
    ZONE_CHECKLIST: [],
    CERTIFICATE: [],
    LAYOUT: [],
  });

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false, message: "", type: "success",
  });

  // ✅ เพิ่มฟังก์ชันสำหรับแสดง Label พร้อมจำนวนรูป (ที่ Error เพราะก่อนหน้านี้ไม่มีฟังก์ชันนี้)
  const getLabelWithCount = (label: string, type: string) => {
    const count = filesByType[type]?.length || 0;
    const isComplete = count >= 6;
    return (
      <div className="flex justify-between items-center w-full">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={`text-xs font-bold ${isComplete ? 'text-green-600' : 'text-red-500'}`}>
          (อัปโหลดแล้ว {count}/6 รูป)
        </span>
      </div>
    );
  };

  const handleFileChange = (type: string, file: File | null) => {
    if (!file) return;
    setFilesByType((prev) => ({
      ...prev,
      [type]: [...prev[type], file], // ✅ แก้เป็น Spread เพื่อให้เก็บได้หลายรูป
    }));
  };

  const uploadEvidence = async () => {
    if (loading) return;
    const jobId = localStorage.getItem("jobId");
    if (!jobId) return showToast("ไม่พบ jobId", "error"); // ✅

    const requiredTypes = ["BEFORE_PANEL", "BEFORE_INVERTER", "DURING_PANEL", "DURING_INVERTER", "AFTER_PANEL", "AFTER_INVERTER"];
    const isIncomplete = requiredTypes.some(type => filesByType[type].length < 6);

    if (isIncomplete) {
      showToast("กรุณาอัปโหลดรูปภาพให้ครบอย่างน้อยประเภทละ 6 รูป", "error"); // ✅
      return;
    }

    try {
      setLoading(true);
      await uploadCleaningEvidence({ jobId: Number(jobId), filesByType });
      showToast("อัปโหลดสำเร็จ ✓"); // ✅
      setTimeout(() => navigate("/cleaning/new/step3_02"), 1500);
    } catch (error: any) {
      showToast(error.response?.data?.message || "อัปโหลดไฟล์ไม่สำเร็จ", "error"); // ✅
    } finally {
      setLoading(false);
    }
  };

  async function handleSaveDraft() {
    try {
      const jobId = localStorage.getItem("jobId");
      if (!jobId) return showToast("ไม่พบ jobId", "error"); // ✅
      await saveDraftStep(Number(jobId), 3);
      showToast("บันทึกเรียบร้อยแล้ว ✓"); // ✅
      setTimeout(() => navigate("/cleaning"), 1500);
    } catch (err) {
      showToast("Save Draft ไม่สำเร็จ", "error"); // ✅
    }
  }

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between pb-9">
        <h1 className="text-green-800 text-2xl font-bold">New Cleaning Job</h1>
        <button
          onClick={handleSaveDraft}
          className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
          text-green-700 bg-white border-2 border-green-700 rounded-md hover:bg-green-50 transition-colors"
        >
          <img src={SaveDraftIcon} alt="save draft" />
          Save Draft
        </button>
      </div>

      {/* Form Container */}
      <div className="flex flex-col min-h-[822px] px-28 py-10 gap-y-[58px] bg-white rounded-2xl items-center shadow-sm">
        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="w-full">
          <h4 className="text-xl font-semibold mb-6 text-green-700 border-l-4 border-green-600 pl-4">
            อัปโหลดหลักฐานการทำงาน (ขั้นต่ำประเภทละ 6 รูป)
          </h4>

          <div className="grid w-full grid-cols-2 gap-8">
            {[
              { key: "BEFORE_PANEL", label: "ก่อน - ล้างแผง" },
              { key: "BEFORE_INVERTER", label: "ก่อน - ทำความสะอาดห้องอินเวอร์เตอร์" },
              { key: "DURING_PANEL", label: "ขณะ - ล้างแผง" },
              { key: "DURING_INVERTER", label: "ขณะ - ทำความสะอาดห้องอินเวอร์เตอร์" },
              { key: "AFTER_PANEL", label: "หลัง - ล้างแผง" },
              { key: "AFTER_INVERTER", label: "หลัง - ทำความสะอาดห้องอินเวอร์เตอร์" },
            ].map((item) => (
              <div key={item.key} className="flex flex-col gap-2">
                {getLabelWithCount(item.label, item.key)}
                <UploadImagePreviewField
                  label=""
                  onChange={(file) => handleFileChange(item.key, file)}
                  disabled={isReadOnly}
                />
                <div className="text-[11px] text-gray-400 mt-1 italic">
                  {filesByType[item.key].length > 0 && `เลือกแล้ว: ${filesByType[item.key].length} รูป (ล่าสุด: ${filesByType[item.key].slice(-1)[0].name})`}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-end">
          <p className="text-[#E54848] font-bold bg-red-50 px-4 py-2 rounded-lg">
            ⚠️ คำเตือน: ระบบจะตรวจสอบจำนวนรูปภาพแยกตามประเภท (ประเภทละ 6 รูปขึ้นไป)
          </p>
        </div>

        {/* ✅ ย้าย Navigation Buttons เข้ามาอยู่ใน Container เดียวกัน */}
        <div className="flex w-full justify-between mt-auto pt-10">
          <button
            onClick={() => navigate("/cleaning/new/step2")}
            className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl hover:bg-green-50 transition-all"
          >
            ก่อนหน้า
          </button>

          {isReadOnly ? (
            <button
              onClick={() => navigate("/cleaning/new/step3_02")}
              className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl hover:bg-green-800 transition-all"
            >
              ถัดไป (View Only)
            </button>
          ) : (
            <button
              onClick={uploadEvidence}
              disabled={loading}
              className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl disabled:opacity-50 hover:bg-green-800 transition-all shadow-md"
            >
              {loading ? "กำลังอัปโหลด..." : "ถัดไป"}
            </button>
          )}
        </div>
      </div>
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-white text-sm
    transition-all duration-300 ease-in-out
    ${toast.type === "success" ? "bg-green-700" : "bg-red-500"}`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
      ${toast.type === "success" ? "bg-green-600" : "bg-red-400"}`}
          >
            {toast.type === "success"
              ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            }
          </div>
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(t => ({ ...t, show: false }))} className="ml-2 opacity-70 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}