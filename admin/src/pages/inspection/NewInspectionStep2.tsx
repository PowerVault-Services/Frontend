import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadIcon from "../../assets/icons/Cloud Upload.svg";

import { saveDraftStep } from "../../services/draft.api";
import { saveInspectionStep2Draft, sendInspectionStep2 } from "../../services/inspection.api";

export default function NewInspectionStep2() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const [emailStatus, setEmailStatus] =
        useState<"idle" | "sending" | "sent">("idle");

    const [showConfirm, setShowConfirm] = useState(false);

    const savedData = JSON.parse(localStorage.getItem("inspection_step1") || "{}");
    const isReadOnly = savedData.status === "COMPLETED";

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(2);

    const [formData, setFormData] = useState({
        jobId: "",
        projectName: "",
        contactEmail: "",
        date: "",
        startTime: "",     // ✅ ใช้ตัวนี้
        endTime: "",       // ✅ ใช้ตัวนี้
        shutdownHours: "",
        remark: "",
    });

    // =========================
    // load step1 data
    // =========================
    useEffect(() => {

        const raw = localStorage.getItem("inspection_step1");

        if (!raw) return;

        const data = JSON.parse(raw);

        setFormData(data);

        const sent = localStorage.getItem(
            `inspection_step2_sent_${data.jobId}`
        );

        if (sent === "true") {
            setEmailStatus("sent");
        }

    }, []);

    // =========================
    // Thai Date Format
    // =========================
    function formatThaiDate(dateStr: string) {

        if (!dateStr) return "";

        const date = new Date(dateStr);

        const months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
            "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
            "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear() + 543;

        return `${day} ${month} ${year}`;
    }

    function calculateHours(start: string, end: string) {
        if (!start || !end) return "";

        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        const startMin = sh * 60 + sm;
        const endMin = eh * 60 + em;

        const diff = (endMin - startMin) / 60;

        return diff > 0 ? diff : "";
    }

    function formatDuration(start: string, end: string) {
        if (!start || !end) return "";

        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        let totalMin = (eh * 60 + em) - (sh * 60 + sm);

        if (totalMin <= 0) return "";

        const hours = Math.floor(totalMin / 60);
        const minutes = totalMin % 60;

        if (hours > 0 && minutes > 0) {
            return `${hours} ชั่วโมง ${minutes} นาที`;
        }

        if (hours > 0) {
            return `${hours} ชั่วโมง`;
        }

        return `${minutes} นาที`;
    }

    // =========================
    // Save Draft
    // =========================
    async function handleSaveDraft() {
        if (loading) return;

        try {
            setLoading(true);

            const subject =
                `[ทดสอบระบบ]ขออนุญาตเข้าบํารุงรักษาระบบ Solar System โครงการ ${formData.projectName}`;

            const body = `
                    <div style="margin-top: 40px; max-width: 800px;">
                        <p>เรียน ท่านผู้เกี่ยวข้อง</p>
                        <p><b>เรื่อง ขออนุญาตแจ้งแผน Inspection ระบบ Solar System ประจําปี 2568</b></p>

                        <p style="text-indent: 50px; margin-top: 20px;">
                            บริษัท พาวเวอร์วอลท์ จํากัด ขออนุญาตแจ้งแผน Inspection ระบบ Solar System ประจําปี 2568 โครงการ
                            ${formData.projectName} เข้าปฎิบัติงาน ในวันที่ ${formatThaiDate(formData.date)} 
                            เวลา (Time) ${formData.startTime} - ${formData.endTime}
                        </p>

                        <p style="text-indent: 50px; margin-top: 20px;">
                            ${formData.remark ? `หมายเหตุ: ${formData.remark}` : ""}
                        </p>
                        <p style="text-indent: 50px; margin-top: 20px;">
                            โดยจะขออนุญาตทําการปิดระบบ Solar System ประมาณ ${formData.shutdownHours ||
                formatDuration(formData.startTime, formData.endTime)} เพื่อดําเนินการ SMDB Inspection และ Inverter Inspection
                        </p>
                        <p style="text-indent: 50px;">
                            จึงเรียนมาเพิ่อพิจารณาอนุมัติ และขออํานวยความสะดวกในการขึ้นหลังคา ระบบนํ้าและการเข้าปฏิบัติงานในพื้นที่
                        </p>
            `;

            await saveInspectionStep2Draft({
                jobId: Number(formData.jobId),
                to: "nita290646@gmail.com",
                subject,
                body,
                attachments: uploadedFile ? [uploadedFile] : [],
            });

            // save step draft
            await saveDraftStep(Number(formData.jobId), 2);

            alert("บันทึก Draft สำเร็จ");

        } catch (err: any) {
            console.error("🔥 SAVE DRAFT ERROR:", err);
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
            navigate("/inspection/new/step3");
            return;
        }

        try {
            setEmailStatus("sending");

            const subject =
                `[ทดสอบระบบ]ขออนุญาตเข้าบํารุงรักษาระบบ Solar System โครงการ ${formData.projectName}`;

            const body = `
                    <div style="margin-top: 40px; max-width: 800px;">
                        <p>เรียน ท่านผู้เกี่ยวข้อง</p>
                        <p><b>เรื่อง ขออนุญาตแจ้งแผน Inspection ระบบ Solar System ประจําปี 2568</b></p>

                        <p style="text-indent: 50px; margin-top: 20px;">
                            บริษัท พาวเวอร์วอลท์ จํากัด ขออนุญาตแจ้งแผน Inspection ระบบ Solar System ประจําปี 2568 โครงการ
                            ${formData.projectName} เข้าปฎิบัติงาน ในวันที่ ${formatThaiDate(formData.date)} 
                            เวลา (Time) ${formData.startTime} - ${formData.endTime}
                        </p>

                        <p style="text-indent: 50px; margin-top: 20px;">
                            ${formData.remark ? `หมายเหตุ: ${formData.remark}` : ""}
                        </p>
                        <p style="text-indent: 50px; margin-top: 20px;">
                            โดยจะขออนุญาตทําการปิดระบบ Solar System ประมาณ ${formData.shutdownHours ||
                formatDuration(formData.startTime, formData.endTime)} เพื่อดําเนินการ SMDB Inspection และ Inverter Inspection
                        </p>
                        <p style="text-indent: 50px;">
                            จึงเรียนมาเพิ่อพิจารณาอนุมัติ และขออํานวยความสะดวกในการขึ้นหลังคา ระบบนํ้าและการเข้าปฏิบัติงานในพื้นที่
                        </p>
            `;

            // ✅ 1. save draft ก่อน
            await saveInspectionStep2Draft({
                jobId: Number(formData.jobId),
                to: "nita290646@gmail.com",
                subject,
                body,
                attachments: uploadedFile ? [uploadedFile] : [],
            });

            // ✅ 2. send email
            await sendInspectionStep2(Number(formData.jobId));

            // ✅ mark step complete
            await saveDraftStep(Number(formData.jobId), 2);

            // ✅ update localStorage
            localStorage.setItem("inspection_step1", JSON.stringify({
                jobId: formData.jobId,
                projectName: formData.projectName,
                contactEmail: formData.contactEmail,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                shutdownHours: formData.shutdownHours,
                status: "COMPLETED",
            }));

            setEmailStatus("sent");

            navigate("/inspection/new/step3");

        } catch (err: any) {

            console.error("🔥 SEND EMAIL ERROR:", err);
            alert(err.message || "ส่งอีเมลไม่สำเร็จ");

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
                    <img src={SaveDraftIcon} alt="" />
                    {loading ? "Saving..." : "Save Draft"}
                </button>

            </div>

            {/* Form */}
            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px]
            bg-white rounded-2xl justify-between items-center">

                <ProgressBar
                    steps={steps}
                    currentStep={currentStep}
                />

                {/* Email Preview */}
                <div className="grid grid-cols-2 w-[1095px] justify-center gap-y-[27px]">

                    <div className="w-[1095px]">

                        <label className="text-[16px] font-normal text-black mb-1">
                            รายละเอียดแจ้งแผน
                        </label>

                        <div className="h-[406px] rounded-lg border border-green-800
                        flex items-center justify-center">

                            <div className="w-[953px] text-[18px]
                            font-normal text-gray-800 leading-relaxed">

                                <p>
                                    <span>From :</span> ทีมดูแลระบบ PowerVault Service
                                </p>

                                <p>
                                    <span>To :</span>{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {formData.projectName}
                                    </span>
                                </p>

                                <p>
                                    <span>Subject :</span>{" "}
                                    ขออนุญาตเข้าตรวจสอบระบบ Solar System โครงการ{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {formData.projectName}
                                    </span>
                                </p>

                                <div className="pt-4 indent-10">

                                    <p>เรียน ท่านผู้เกี่ยวข้อง</p>
                                    <p>เรื่อง ขออนุญาตแจ้งแผน Inspection ระบบ Solar System ประจําปี 2568</p>

                                    <p className="pt-4 indent-28">
                                        บริษัท พาวเวอร์วอลท์ จำกัด
                                        ขอแจ้งแผน Inspection ระบบ Solar System
                                        โครงการ{" "}
                                        <span className="text-[#2196F3] font-semibold">
                                            {formData.projectName}
                                        </span>{" "}
                                        วันที่{" "}
                                        <span className="text-[#2196F3] font-semibold">
                                            {formatThaiDate(formData.date)}
                                        </span>
                                    </p>

                                    {formData.remark && (
                                        <p className="pt-4 indent-28">
                                            หมายเหตุ:{" "}
                                            <span className="text-[#2196F3] font-semibold">
                                                {formData.remark}
                                            </span>
                                        </p>
                                    )}

                                    <p className="pt-4 indent-28">
                                        โดยจะขออนุญาตทําการปิดระบบ Solar System ประมาณ{" "}
                                        <span className="text-[#2196F3] font-semibold">
                                            {formData.shutdownHours ||
                                                formatDuration(formData.startTime, formData.endTime)}
                                        </span> {" "}
                                        ชม. เวลา{" "}
                                        <span className="text-[#2196F3] font-semibold">
                                            {formData.startTime} - {formData.endTime}
                                        </span>{" "}
                                        น.
                                    </p>

                                    <p className="pt-4 indent-10">
                                        เพื่อดําเนินการ SMDB Inspection และ Inverter Inspection
                                        จึงเรียนมาเพิ่อพิจารณาอนุมัติ และขออํานวยความสะดวกในการขึ้นหลังคา
                                        ระบบนํ้าและการเข้าปฏิบัติงานในพื้นที่
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* Upload */}
                        <div className="mt-[27px]">

                            <label className="text-[16px] font-normal">
                                อัปโหลดเอกสารไฟล์ รายชื่อทีมงาน Inspection
                            </label>

                            <label
                                htmlFor="teamFile"
                                className="flex items-center rounded-lg h-[39px]
                                border border-dashed border-green-800 px-4 py-3
                                text-sm text-gray-600 cursor-pointer
                                hover:bg-green-50 transition"
                            >

                                <img src={UploadIcon} alt="upload" className="h-4.5 w-4.5" />

                                <span className="text-[#2979FF] font-normal ml-2">
                                    {uploadedFile
                                        ? uploadedFile.name
                                        : "คลิกเลือกไฟล์เพื่ออัปโหลด"}
                                </span>

                                <input
                                    id="teamFile"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.xls,.xlsx"
                                    disabled={isReadOnly}
                                    onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                            setUploadedFile(e.target.files[0]);
                                        }
                                    }}
                                />

                            </label>

                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">

                    <button
                        onClick={() => navigate("/inspection/new/step1")}
                        className="w-[195px] border border-green-600
                        text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ก่อนหน้า
                    </button>

                    {isReadOnly ? (
                        <button
                            onClick={() => navigate("/inspection/new/step3")}
                            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                        >
                            ถัดไป
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
                                    ? "ส่งอีเมลแล้ว"
                                    : "ยืนยันส่งอีเมล"}
                        </button>
                    )}

                </div>

            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-[720px] p-6 shadow-lg">

                        <h2 className="text-lg font-semibold">
                            ยืนยันการส่งอีเมล
                        </h2>

                        <p className="text-gray-600 mt-3 text-xl">

                            คุณต้องการส่งอีเมลแจ้งแผน Inspection ไปยังโครงการ

                            <span className="text-green-700 font-semibold">
                                {" "} {formData.projectName} {" "}
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