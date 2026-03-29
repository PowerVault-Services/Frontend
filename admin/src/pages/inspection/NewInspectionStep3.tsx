import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadIcon from "../../assets/icons/Cloud Upload.svg";

import { saveDraftStep } from "../../services/draft.api";

import {
    saveInspectionStep3Draft,
    sendInspectionStep3
} from "../../services/inspection.api";

import { handleQueueOrSync } from "../../utils/taskQueue";

export default function NewInspectionStep3() {

    const navigate = useNavigate();
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [_uploadedFile, setUploadedFile] = useState<File | null>(null);


    const [loading, setLoading] = useState(false);
    const [reportFile, setReportFile] = useState<File | null>(null);

    const [emailStatus, setEmailStatus] =
        useState<"idle" | "sending" | "sent">("idle");

    const [showConfirm, setShowConfirm] = useState(false);

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(3);

    const [jobData, setJobData] = useState({
        jobId: "",
        projectName: "",
        date: "",
        time: "",
        remark: "",
    });

    // =========================
    // Load step1 data
    // =========================
    useEffect(() => {

        const raw = localStorage.getItem("inspection_step1");

        if (!raw) return;

        const data = JSON.parse(raw);

        setJobData(data);

        const sent = localStorage.getItem(
            `inspection_step3_sent_${data.jobId}`
        );

        if (sent === "true") {
            setEmailStatus("sent");
        }

        if (data.status === "COMPLETED") {
            setIsReadOnly(true);
        }


    }, []);

    // =========================
    // Format Thai Date
    // =========================
    function formatThaiDate(dateStr?: string) {

        if (!dateStr) return "";

        const date = new Date(dateStr);

        const months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
    }

    // =========================
    // Save Draft
    // =========================
    async function handleSaveDraft() {

        if (loading) return;

        try {
            setLoading(true);

            const subject =
                `รายงาน Inspection ระบบ Solar System โครงการ ${jobData.projectName}`;

            const body = `
เรียน ท่านผู้เกี่ยวข้อง

บริษัท พาวเวอร์วอลท์ จำกัด ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System
โครงการ ${jobData.projectName}

เข้าปฏิบัติงานวันที่ ${formatThaiDate(jobData.date)}

รายละเอียดตามไฟล์แนบ
`;

            await saveInspectionStep3Draft({
                jobId: Number(jobData.jobId),
                to: "nita290646@gmail.com",
                subject,
                body,
                report: reportFile,
            });

            await saveDraftStep(Number(jobData.jobId), 3);

            alert("บันทึก Draft สำเร็จ");

        } catch (err: any) {
            console.error("🔥 STEP3 DRAFT ERROR:", err);
            alert(err.message || "บันทึก Draft ไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // Send Email
    // =========================
    async function handleSendEmail() {

        if (emailStatus === "sending") return;

        if (emailStatus === "sent") {
            navigate("/inspection");
            return;
        }

        try {
            setEmailStatus("sending");

            const subject =
                `ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System ประจําปี 2568 ${jobData.projectName}`;

            const body = `
                <div style="margin-top: 40px; max-width: 800px;">
                    <p>เรียน ท่านผู้เกี่ยวข้อง</p>
                    <p>เรื่อง ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System ประจําปี 2568</p>

                    <p style="text-indent: 50px; margin-top: 20px;">
                        บริษัท พาวเวอร์วอลท์ จํากัด ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System
                        ประจําปี 2568 โครงการ ${jobData.projectName} เข้าปฏิบัติงานวันที่ ${formatThaiDate(jobData.date)}
                    </p>
                    <p style="text-indent: 50px;"> รายละเอียดตามไฟล์แนบ </p>
                </div>
            `;

            // ✅ 1. save draft ก่อน
            await saveInspectionStep3Draft({
                jobId: Number(jobData.jobId),
                to: "nita290646@gmail.com",
                subject,
                body,
                report: reportFile,
            });

            // ✅ 2. send
            await handleQueueOrSync(
                sendInspectionStep3(Number(jobData.jobId)),
                "email-sending",
                () => { }
            );

            await saveDraftStep(Number(jobData.jobId), 3);

            localStorage.setItem(
                `inspection_step3_sent_${jobData.jobId}`,
                "true"
            );

            setEmailStatus("sent");

            navigate("/inspection");

        } catch (err: any) {

            console.error("🔥 STEP3 SEND ERROR:", err);

            alert(err.message || "ส่งรายงานไม่สำเร็จ");

            setEmailStatus("idle");
        }
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">

                <h1 className="text-green-800">
                    New Inspection Job
                </h1>

                <button
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
                    text-green-700 bg-white border-2 border-green-700 rounded-md"
                >
                    <img src={SaveDraftIcon} alt="save draft" />
                    {loading ? "Saving..." : "Save Draft"}
                </button>

            </div>

            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px]
            bg-white rounded-2xl justify-between items-center">

                <ProgressBar steps={steps} currentStep={currentStep} />

                <div className="grid w-[1095px]">

                    <label className="text-[16px] font-normal text-black">
                        รายละเอียดแจ้งแผน
                    </label>

                    {/* Email Preview */}
                    <div className="h-[406px] rounded-lg border border-green-800
                    flex items-center justify-center">

                        <div className="w-[953px] text-[18px]
                        text-gray-800 leading-relaxed">

                            <p>From : ทีมดูแลระบบ PowerVault Service</p>

                            <p>
                                To :{" "}
                                <span className="text-[#2196F3] font-semibold">
                                    {jobData.projectName || "-"}
                                </span>
                            </p>

                            <div className="pt-4 indent-10">

                                <p>เรียน ท่านผู้เกี่ยวข้อง</p>

                                <p>
                                    เรื่อง ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System
                                </p>

                                <p className="pt-4 indent-10">
                                    บริษัท พาวเวอร์วอลท์ จำกัด
                                    ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System
                                </p>

                                <p className="indent-10">
                                    โครงการ{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {jobData.projectName}
                                    </span>{" "}
                                    เข้าปฏิบัติงานวันที่{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {formatThaiDate(jobData.date)}
                                    </span>{" "}
                                    รายละเอียดตามไฟล์แนบค่ะ
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Upload */}
                    <div className="mt-[27px]">

                        <label className="text-[16px] font-normal">
                            อัปโหลดเอกสารไฟล์ (Inspection Report)
                        </label>

                        <label
                            htmlFor="teamFile"
                            className="flex items-center rounded-lg h-[39px]
                            border border-dashed border-green-800 px-4 py-3
                            text-sm text-gray-600 cursor-pointer
                            hover:bg-green-50 transition"
                        >

                            <img src={UploadIcon} alt="upload" className="h-4.5 w-4.5" />

                            <span className="text-[#2979FF] ml-2">
                                {reportFile
                                    ? reportFile.name
                                    : "คลิกเลือกไฟล์เพื่ออัปโหลด"}
                            </span>

                            <input
                                id="teamFile"
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.xls,.xlsx"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                        setReportFile(e.target.files[0]);
                                    }
                                }}
                            />

                        </label>

                    </div>

                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">

                    <button
                        onClick={() => navigate("/inspection/new/step2")}
                        className="w-[195px] border border-green-600
                        text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ก่อนหน้า
                    </button>

                    {isReadOnly ? (
                        <button
                            onClick={() => navigate("/inspection")}
                            className="w-[195px] bg-green-800 text-white px-6 py-2.5 rounded-2xl"
                        >
                            กลับหน้าหลัก
                        </button>
                    ) : (
                        <button
                            disabled={emailStatus === "sending" || emailStatus === "sent"}
                            onClick={() => setShowConfirm(true)}
                            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                        >
                            {emailStatus === "sending"
                                ? "กำลังส่ง..."
                                : emailStatus === "sent"
                                    ? "ส่งรายงานแล้ว"
                                    : "ยืนยันส่งรายงาน"}
                        </button>
                    )}
                </div>

            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-[720px] p-6 shadow-lg">

                        <h2 className="text-lg font-semibold">
                            ยืนยันการส่งรายงาน
                        </h2>

                        <p className="text-gray-600 mt-3 text-xl">

                            คุณต้องการส่งรายงาน Inspection ไปยังโครงการ

                            <span className="text-green-700 font-semibold">
                                {" "} {jobData.projectName} {" "}
                            </span>

                            ใช่หรือไม่

                        </p>

                        <div className="flex justify-end gap-3 mt-6">

                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg"
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

        </div>
    );
}