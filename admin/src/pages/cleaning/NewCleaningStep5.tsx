import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";

import {
  saveCleaningStep5Draft,
  sendCleaningStep5
} from "../../services/cleaning.api";
import { handleQueueOrSync } from "../../utils/taskQueue";

export default function NewCleaningStep5() {
  const navigate = useNavigate();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const steps = [
    { id: 1, label: "กรอกข้อมูล" },
    { id: 2, label: "ส่งอีเมลแจ้งแผน" },
    { id: 3, label: "แนบรูปภาพ" },
    { id: 4, label: "รายงาน" },
    { id: 5, label: "ส่งรายงาน" },
  ];

  const [currentStep] = useState(5);
  const [loading, setLoading] = useState(false);
  const jobId = Number(localStorage.getItem("jobId"));

  const [jobData, setJobData] = useState<{
    projectName?: string;
    date?: string;
    time?: string;
    remark?: string;
    contactEmail?: string;
  }>({});

  useEffect(() => {
    const raw = localStorage.getItem("cleaning_step1");
    if (raw) {
      const parsed = JSON.parse(raw);
      setJobData(parsed);
      if (parsed.status === "COMPLETED") setIsReadOnly(true);
    }
  }, []);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }

  function formatThaiDate(dateStr?: string) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const months = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
  }

  function buildEmailPayload(jobId: number) {
    return {
      jobId,
      to: "nita290646@gmail.com",
      subject: "ขออนุญาตนําส่งรายงานการเข้าบํารุงรักษาระบบ Solar System",
      body: `
        <div style="margin-top: 40px; max-width: 800px;">
          <p>เรียน ท่านผู้เกี่ยวข้อง</p>
          <p style="text-indent: 50px; margin-top: 20px;">บริษัท พาวเวอร์วอลท์ จํากัด ขออนุญาตนําส่งรายงานการเข้าบํารุงรักษาระบบ Solar System โครงการ ${jobData.projectName || "-"}</p>
          <p>ในวันที่ ${formatThaiDate(jobData.date)}</p>
          <p style="text-indent: 50px;">รายละเอียดตามไฟล์แนบ</p>
        </div>
      `
    };
  }

  async function handleSendEmail() {
    if (!jobId || isNaN(jobId)) {
      showToast("ไม่พบ jobId", "error");
      return;
    }

    const payload = buildEmailPayload(jobId);

    try {
      setLoading(true);

      await handleQueueOrSync(
        sendCleaningStep5(payload),
        "email-sending",
        () => { }
      );

      showToast("ส่งรายงานเรียบร้อยแล้ว ✓");
      setTimeout(() => navigate("/cleaning/home"), 2000);

    } catch (error: any) {
      console.error(error);
      showToast(error.message || "ไม่สามารถส่งอีเมลได้", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveDraft() {
    if (!jobId || isNaN(jobId)) {
      showToast("ไม่พบ jobId", "error");
      return;
    }

    try {
      const res = await saveCleaningStep5Draft(buildEmailPayload(jobId));
      if (!res.success) throw new Error("บันทึกไม่สำเร็จ");
      showToast("บันทึกเรียบร้อยแล้ว ✓");
      setTimeout(() => navigate("/cleaning"), 2000);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Save Draft ไม่สำเร็จ", "error");
    }
  }

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-[15px] transition-all duration-300 ${toast.type === "success" ? "bg-green-700" : "bg-red-600"
            }`}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[480px] p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">ยืนยันการส่งอีเมล</h2>
            <p className="text-gray-600 mt-3 text-base leading-relaxed">
              คุณต้องการส่งรายงานไปยังโครงการ{" "}
              <span className="font-semibold text-green-700">{jobData.projectName}</span>{" "}
              ใช่หรือไม่?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleSendEmail();
                }}
                className="px-4 py-2 bg-green-700 text-white rounded-lg"
              >
                ยืนยันส่ง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between pb-9">
        <h1 className="text-green-800">New Cleaning Job</h1>
        {!isReadOnly && (
          <button
            onClick={handleSaveDraft}
            className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px] text-green-700 bg-white border-2 border-green-700 rounded-md"
          >
            <img src={SaveDraftIcon} alt="save draft" />
            Save Draft
          </button>
        )}
      </div>

      <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl justify-between items-center">
        <ProgressBar steps={steps} currentStep={currentStep} />

        <div className="grid w-[1095px]">
          <label className="text-[16px] font-normal text-black mb-1">
            รายละเอียดแจ้งแผน {isReadOnly && "(สถานะงานเสร็จสมบูรณ์ - ไม่สามารถแก้ไขได้)"}
          </label>

          <div className="h-[406px] rounded-lg border border-green-800 flex items-center justify-center">
            <div className="w-[953px] text-[18px] text-gray-800 leading-relaxed">
              <p><span>From :</span> ทีมดูแลระบบ PowerVault Service</p>
              <p>
                <span>To :</span>{" "}
                <span className="text-[#2196F3] font-semibold">{jobData.projectName || "-"}</span>
              </p>
              <p>
                <span>Subject :</span> ขออนุญาตนําส่งรายงานการเข้าบํารุงรักษาระบบ Solar System
              </p>
              <div className="pt-4 indent-10">
                <p>เรียน ท่านผู้เกี่ยวข้อง</p>
                <p>เรื่อง ขออนุญาตแจ้งแผนเข้าบำรุงรักษาระบบ PM Solar System</p>
                <p className="pt-4 indent-10">
                  บริษัท พาวเวอร์วอลท์ จำกัด ขออนุญาตนําส่งรายงานการเข้าบํารุงรักษาระบบ Solar System
                </p>
                <p className="indent-10">
                  โครงการ{" "}
                  <span className="text-[#2196F3] font-semibold">{jobData.projectName || "-"}</span>{" "}
                  เข้าปฏิบัติงาน ในวันที่{" "}
                  <span className="text-[#2196F3] font-semibold">{formatThaiDate(jobData.date)}</span>{" "}
                  รายละเอียดตามไฟล์แนบค่ะ
                </p>
              </div>
            </div>
          </div>

          <div className="mt-[27px]">
            <label className="text-[16px] font-normal">เอกสารรายงานที่แนบไปด้วย</label>
            {jobId ? (
              <div className="flex items-center gap-3 mt-2 border border-green-800 rounded-lg h-[39px] px-4">
                <span className="text-sm text-gray-700">Cleaning_Report.pdf</span>
                <a
                  href={`${import.meta.env.VITE_API_URL}/api/cleaning/step4/download/${jobId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2979FF] underline text-sm"
                >
                  เปิดดู
                </a>
              </div>
            ) : (
              <div className="text-sm text-gray-400 mt-2">ยังไม่มีรายงานจากขั้นตอนก่อนหน้า</div>
            )}
          </div>
        </div>

        <div className="flex w-full max-w-[1095px] justify-between">
          <button
            onClick={() => navigate("/cleaning/new/step4")}
            className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
          >
            ก่อนหน้า
          </button>

          {isReadOnly ? (
            <button
              onClick={() => navigate("/cleaning")}
              className="w-[195px] bg-green-800 text-white px-6 py-2.5 rounded-2xl hover:bg-green-900"
            >
              กลับสู่หน้าหลัก
            </button>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl disabled:opacity-50"
            >
              {loading ? "กำลังส่ง..." : "ยืนยันส่งอีเมล"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}