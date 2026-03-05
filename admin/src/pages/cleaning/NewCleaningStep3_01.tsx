import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadFileField from "../../components/UploadFileField";
import UploadImagePreviewField from "../../components/UploadImagePreviewField";

import { uploadCleaningEvidence } from "../../services/api";

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

  // แยกเก็บไฟล์ตามประเภท
  const [filesByType, setFilesByType] = useState<Record<string, File[]>>({
    BEFORE: [],
    AFTER: [],
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

    const totalImages =
      filesByType.BEFORE.length + filesByType.AFTER.length;

    if (totalImages < 6) {
      alert("ต้องแนบรูปขั้นต่ำ 6 รูป (ก่อน + หลัง)");
      return;
    }

    try {
      setLoading(true);

      for (const labelType of Object.keys(filesByType)) {
        const files = filesByType[labelType];

        if (!files.length) continue;

        await uploadCleaningEvidence({
          jobId,
          labelType,
          files,
        });
      }

      alert("อัปโหลดสำเร็จ");

      navigate("/cleaning/new/step3_02");

    } catch (error) {
      console.error(error);
      alert("อัปโหลดไฟล์ไม่สำเร็จ");
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
          {/* BEFORE */}
          <UploadImagePreviewField
            label="ก่อน - ล้างแผง"
            onChange={(file) => handleFileChange("BEFORE", file)}
          />
          <UploadImagePreviewField
            label="ก่อน - ทําความสะอาดห้องอินเวอร์เตอร์"
            onChange={(file) => handleFileChange("BEFORE", file)}
          />

          {/* DURING → จัดอยู่ใน BEFORE หรือ AFTER แล้วแต่ backend design */}
          <UploadImagePreviewField
            label="ขณะ - ล้างแผง"
            onChange={(file) => handleFileChange("BEFORE", file)}
          />
          <UploadImagePreviewField
            label="ขณะ - ทําความสะอาดห้องอินเวอร์เตอร์"
            onChange={(file) => handleFileChange("BEFORE", file)}
          />

          {/* AFTER */}
          <UploadImagePreviewField
            label="หลัง - ล้างแผง"
            onChange={(file) => handleFileChange("AFTER", file)}
          />
          <UploadImagePreviewField
            label="หลัง - ทําความสะอาดห้องอินเวอร์เตอร์"
            onChange={(file) => handleFileChange("AFTER", file)}
          />

          {/* DOCUMENTS */}
          <UploadFileField
            label="อัปโหลดเอกสารไฟล์ ส่งมอบงาน"
            onChange={(file) => handleFileChange("CERTIFICATE", file)}
          />
          <UploadFileField
            label="อัปโหลดเอกสารไฟล์ Check List"
            onChange={(file) => handleFileChange("LAYOUT", file)}
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

          <button
            onClick={uploadEvidence}
            disabled={loading}
            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl disabled:opacity-50"
          >
            {loading ? "กำลังอัปโหลด..." : "ถัดไป"}
          </button>
        </div>

        {/* Debug Preview */}
        <div className="text-sm text-green-700">
          BEFORE: {filesByType.BEFORE.length} | AFTER:{" "}
          {filesByType.AFTER.length}
        </div>
      </div>
    </div>
  );
}
