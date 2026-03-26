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

  const steps = [
    { id: 1, label: "กรอกข้อมูล" },
    { id: 2, label: "ส่งอีเมลแจ้งแผน" },
    { id: 3, label: "แนบรูปภาพ" },
    { id: 4, label: "รายงาน" },
    { id: 5, label: "ส่งรายงาน" },
  ];

  const [currentStep] = useState(3);
  const [loading, setLoading] = useState(false);

  const [existingImages, setExistingImages] = useState<any[]>([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("cleaning_step1") || "{}");
    const isReadOnly = savedData.status === "COMPLETED";

    if (isReadOnly) {
      // ดึงข้อมูลรูปภาพจาก API (สมมติว่าใช้ getCleaningDetail)
      const fetchImages = async () => {
        const jobId = localStorage.getItem("jobId");
        // const res = await getCleaningDetail(jobId);
        // setExistingImages(res.evidences); // เก็บข้อมูลรูปภาพที่มีอยู่
      };
      fetchImages();
    }
  }, []);

  const isReadOnly = JSON.parse(localStorage.getItem("cleaning_step1") || "{}").status === "COMPLETED";

  // แยกเก็บไฟล์ตามประเภท
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

  const handleFileChange = (type: string, file: File | null) => {
    if (!file) return;

    setFilesByType((prev) => ({
      ...prev,
      [type]: [...prev[type], file],
    }));
  };

  const uploadEvidence = async () => {
    if (loading) return;

    const jobId = localStorage.getItem("jobId");

    if (!jobId) {
      alert("ไม่พบ jobId");
      return;
    }

    // ✅ รวมไฟล์ทั้งหมด
    const allFiles = Object.values(filesByType).flat();

    if (allFiles.length < 6) {
      alert("ต้องแนบรูปขั้นต่ำ 6 รูป");
      return;
    }

    if (allFiles.length > 30) {
      alert("ไฟล์รวมต้องไม่เกิน 30");
      return;
    }

    try {
      setLoading(true);

      await uploadCleaningEvidence({
        jobId: Number(jobId),
        files: allFiles, // ✅ ส่งทีเดียว
        // ❌ ไม่ต้องส่ง labelType
      });

      alert("อัปโหลดสำเร็จ");
      navigate("/cleaning/new/step3_02");

    } catch (error: any) {
      console.error("🔥 ERROR:", error.response?.data);
      alert(error.response?.data?.message || "อัปโหลดไฟล์ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  async function handleSaveDraft() {

    try {

      const jobId = localStorage.getItem("jobId");

      if (!jobId) {
        alert("ไม่พบ jobId");
        return;
      }

      await saveDraftStep(Number(jobId), 3);

      alert("บันทึกเรียบร้อยแล้ว");

      navigate("/cleaning");

    } catch (err) {

      console.error(err);
      alert("Save Draft ไม่สำเร็จ");

    }

  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between pb-9">
        <h1 className="text-green-800">New Cleaning Job</h1>

        <button
          onClick={handleSaveDraft}
          className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
          text-green-700 bg-white border-2 border-green-700 rounded-md"
        >
          <img src={SaveDraftIcon} alt="save draft" />
          Save Draft
        </button>
      </div>

      {/* Form */}
      <div className="flex flex-col min-h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl items-center justify-between">
        <ProgressBar steps={steps} currentStep={currentStep} />

        {/* Upload Fields */}
        <div
          className="grid
            w-[1091px]
            grid-cols-2
            gap-x-[27px]
            gap-y-[27px]"
        >
          <UploadImagePreviewField
            label="ก่อน - ล้างแผง"
            onChange={(file) => handleFileChange("BEFORE_PANEL", file)}
            disabled={isReadOnly} // ✅ ส่ง prop ไป disable input
            defaultValue={existingImages.find(img => img.type === "BEFORE_PANEL")?.url}
          />

          <UploadImagePreviewField
            label="ขณะ - ล้างแผง"
            onChange={(file) => handleFileChange("DURING_PANEL", file)}
            disabled={isReadOnly}
            defaultValue={existingImages.find(img => img.type === "DURING_PANEL")?.url}
          />

          <UploadImagePreviewField
            label="หลัง - ล้างแผง"
            onChange={(file) => handleFileChange("AFTER_PANEL", file)}
            disabled={isReadOnly}
            defaultValue={existingImages.find(img => img.type === "AFTER_PANEL")?.url}
          />

          <UploadImagePreviewField
            label="ก่อน - ทําความสะอาดห้องอินเวอร์เตอร์"
            onChange={(file) => handleFileChange("BEFORE_INVERTER", file)}
            disabled={isReadOnly}
            defaultValue={existingImages.find(img => img.type === "BEFORE_INVERTER")?.url}
          />

          <UploadImagePreviewField
            label="ขณะ - ทําความสะอาดห้องอินเวอร์เตอร์"
            onChange={(file) => handleFileChange("DURING_INVERTER", file)}
            disabled={isReadOnly}
            defaultValue={existingImages.find(img => img.type === "DURING_INVERTER")?.url}
          />

          <UploadImagePreviewField
            label="หลัง - ทําความสะอาดห้องอินเวอร์เตอร์"
            onChange={(file) => handleFileChange("AFTER_INVERTER", file)}
            disabled={isReadOnly}
            defaultValue={existingImages.find(img => img.type === "AFTER_INVERTER")?.url}
          />

          {/* DOCUMENTS */}
          <UploadFileField
            label="อัปโหลดเอกสารไฟล์ ส่งมอบงาน"
            onChange={(file) => handleFileChange("CERTIFICATE", file)}
            disabled={isReadOnly}
            defaultValue={existingImages.find(f => f.type === "CERTIFICATE")?.fileName}
          />
          <UploadFileField
            label="อัปโหลดเอกสารไฟล์ Check List"
            onChange={(file) => handleFileChange("LAYOUT", file)}
            disabled={isReadOnly}
            defaultValue={existingImages.find(f => f.type === "LAYOUT")?.fileName}
          />

          <div className="mt-[27px]">
            <p className="text-[16px] text-[#E54848] font-semibold">
              *** หมายเหตุ : จํานวนรูปภาพขั้นต่ำ 6 รูป
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex w-full max-w-[1095px] justify-between">
          <button
            onClick={() => navigate("/cleaning/new/step2")}
            className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
          >
            ก่อนหน้า
          </button>

          {isReadOnly ? (
            <button
              onClick={() => navigate("/cleaning/new/step3_02")}
              className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
            >
              ถัดไป (View Only)
            </button>
          ) : (
            <button
              onClick={uploadEvidence}
              disabled={loading}
              className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl disabled:opacity-50"
            >
              {loading ? "กำลังอัปโหลด..." : "ถัดไป"}
            </button>
          )}
        </div>

        {/* Debug Preview */}
        <div className="text-sm text-green-700">
          PANEL (B/D/A):{" "}
          {filesByType.BEFORE_PANEL.length}/
          {filesByType.DURING_PANEL.length}/
          {filesByType.AFTER_PANEL.length}
          <br />
          INVERTER (B/D/A):{" "}
          {filesByType.BEFORE_INVERTER.length}/
          {filesByType.DURING_INVERTER.length}/
          {filesByType.AFTER_INVERTER.length}
        </div>
      </div>
    </div>
  );
}
