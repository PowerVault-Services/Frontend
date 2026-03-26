import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadIcon from "../../assets/icons/Cloud Upload.svg";
import { saveCleaningStep2Draft, sendCleaningStep2 } from "../../services/cleaning.api";
import api from "../../services/api";
import { handleQueueOrSync } from "../../utils/taskQueue";

export default function NewCleaningStep2() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // email status (production pattern)
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent">("idle");

    const savedData = JSON.parse(localStorage.getItem("cleaning_step1") || "{}");
    const isReadOnly = savedData.status === "COMPLETED";

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
        { id: 4, label: "รายงาน" },
        { id: 5, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(2);

    const [formData, setFormData] = useState({
        projectName: "",
        date: "",
        startTime: "",
        endTime: "",
        remark: "",
    });

    //pop-up confirm send e-mail
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem("cleaning_step1");

        if (!raw) return;

        const data = JSON.parse(raw);

        setFormData({
            projectName: data.projectName || "",
            date: data.date || "",
            startTime: data.startTime || "",
            endTime: data.endTime || "",
            remark: data.remark || "",
        });
    }, []);

    useEffect(() => {
        const jobId = localStorage.getItem("jobId");

        if (!jobId) return;

        async function loadJob() {
            try {
                const res = await api.get(`/cleaning/job/${jobId}`);
                const data = res.data?.data;

                console.log("🔥 STEP2 API:", data);

                setFormData((prev) => ({
                    ...prev,
                    projectName: data?.cleaning?.projectName || prev.projectName,
                    date: prev.date,

                    startTime: data?.timeRange?.startTime || "",
                    endTime: data?.timeRange?.endTime || "",

                    remark: prev.remark,
                }));

            } catch (err) {
                console.error("❌ โหลด Step2 ไม่ได้", err);
            }
        }

        loadJob();
    }, []);

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

    function formatTimeRange(start?: string, end?: string) {
        if (!start && !end) return "";

        const clean = (t?: string) => t?.slice(0, 5); // ตัดวินาทีออก

        if (start && end) {
            return `${clean(start)} – ${clean(end)} น.`;
        }

        return `${clean(start || end)} น.`;
    }

    async function handleSaveDraft() {
        if (loading) return;

        try {
            setLoading(true);

            const raw = localStorage.getItem("cleaning_step1");
            if (!raw) {
                alert("ไม่พบข้อมูล Step1");
                return;
            }

            const step1 = JSON.parse(raw);

            if (!step1.jobId) {
                alert("ไม่พบ jobId");
                return;
            }

            const subject = `[ทดสอบระบบ]ขออนุญาตเข้าบำรุงรักษาระบบ Solar System โครงการ ${formData.projectName}`;

            const body = `
                    <div style="margin-top: 40px; max-width: 800px;">
                        <p>เรียน ท่านผู้เกี่ยวข้อง</p>
                        
                        <p><b>เรื่อง: ขออนุญาตแจ้งแผนเข้าบำรุงรักษาระบบ PM Solar System</b></p>
                        
                        <p style="text-indent: 50px; margin-top: 20px;">
                            บริษัท พาวเวอร์วอลท์ จำกัด ขออนุญาตแจ้งแผนงานเข้า PM Solar System โครงการ ${formData.projectName} </b> 
                            วันที่ ${formatThaiDate(formData.date)} เวลา ${formatTimeRange(formData.startTime, formData.endTime)} ระบบ Solar System โครงการ <b>${formData.projectName}</b> โดยมีรายละเอียดกำหนดการเข้าปฏิบัติงานดังนี้:
                        </p>

                        <p> ${formData.remark} </p>

                        <p style="text-indent: 50px;">
                            จึงเรียนมาเพิ่อพิจารณาอนุมัติ และขออํานวยความสะดวกในการขึ้นหลังคา ระบบนํ้าและการเข้าปฏิบัติงานในพื้นที่ โดยได้แนบเอกสารรายชื่อผู้เข้าปฏิบัติงานพร้อมวุฒิบัตรการอบรมการทํางานบนที่สูงตามเอกสารแนบด้านล่าง
                        </p>
                    </div>
            `;

            await saveCleaningStep2Draft({
                jobId: step1.jobId,
                // ✅ FIX ให้เป็น email จริง
                to: "nita290646@gmail.com",
                subject,
                body,
                files: uploadedFile ? [uploadedFile] : [],
            });

            alert("บันทึก Draft สำเร็จ");

        } catch (err) {
            console.error(err);
            alert("บันทึก Draft ไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }

    async function handleSendEmail() {

        // กัน double click
        if (emailStatus === "sending") return;

        // ถ้าเคยส่งแล้วให้ไป step3 เลย
        if (emailStatus === "sent") {
            navigate("/cleaning/new/step3_01");
            return;
        }

        const raw = localStorage.getItem("cleaning_step1");

        if (!raw) return;

        const step1 = JSON.parse(raw);

        try {

            setEmailStatus("sending");

            const subject = `[ทดสอบระบบ]ขออนุญาตเข้าบำรุงรักษาระบบ Solar System โครงการ ${formData.projectName}`;

            const body = `
                    <div style="margin-top: 40px; max-width: 800px;">
                        <p>เรียน ท่านผู้เกี่ยวข้อง</p>
                        
                        <p><b>เรื่อง: ขออนุญาตแจ้งแผนเข้าบำรุงรักษาระบบ PM Solar System</b></p>
                        
                        <p style="text-indent: 50px; margin-top: 20px;">
                            บริษัท พาวเวอร์วอลท์ จำกัด ขออนุญาตแจ้งแผนงานเข้า PM Solar System โครงการ ${formData.projectName} </b> 
                            วันที่ ${formatThaiDate(formData.date)} เวลา ${formatTimeRange(formData.startTime, formData.endTime)} ระบบ Solar System โครงการ <b>${formData.projectName}</b> โดยมีรายละเอียดกำหนดการเข้าปฏิบัติงานดังนี้:
                        </p>

                        <p> ${formData.remark} </p>

                        <p style="text-indent: 50px;">
                            จึงเรียนมาเพิ่อพิจารณาอนุมัติ และขออํานวยความสะดวกในการขึ้นหลังคา ระบบนํ้าและการเข้าปฏิบัติงานในพื้นที่ โดยได้แนบเอกสารรายชื่อผู้เข้าปฏิบัติงานพร้อมวุฒิบัตรการอบรมการทํางานบนที่สูงตามเอกสารแนบด้านล่าง
                        </p>
                    </div>
            `;

            await saveCleaningStep2Draft({
                jobId: step1.jobId,
                to: "nita290646@gmail.com",
                subject,
                body,
                files: uploadedFile ? [uploadedFile] : [],
            });

            await handleQueueOrSync(
                sendCleaningStep2(step1.jobId),
                "email-sending",
                () => { },
            );

            // mark ว่าส่งแล้ว
            localStorage.setItem("cleaning_step2_sent", "true");

            setEmailStatus("sent");

            navigate("/cleaning/new/step3_01");

        } catch (err) {

            console.error(err);
            alert("ส่งอีเมลไม่สำเร็จ");

            setEmailStatus("idle");

        }
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Cleaning Job</h1>

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

            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl justify-between items-center">

                <ProgressBar steps={steps} currentStep={currentStep} />

                <div className="grid grid-cols-2 w-[1095px] justify-center gap-y-[27px]">
                    <div className="w-[1095px] justify-center gap-y-[27px]">

                        <label className="text-[16px] font-normal text-black mb-1">
                            รายละเอียดแจ้งแผน
                        </label>

                        {/* Email Preview */}
                        <div className="h-[406px] rounded-lg border border-green-800 flex items-center justify-center">
                            <div className="w-[953px] text-[18px] font-normal text-gray-800 leading-relaxed">

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
                                    ขออนุญาตเข้าบำรุงรักษาระบบ Solar System โครงการ{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {formData.projectName}
                                    </span>
                                </p>

                                <div className="pt-4 indent-10">
                                    <p>เรียน ท่านผู้เกี่ยวข้อง</p>

                                    <p>
                                        เรื่อง ขออนุญาตแจ้งแผนเข้าบำรุงรักษาระบบ PM Solar System
                                    </p>

                                    <p className="pt-4 indent-28">
                                        บริษัท พาวเวอร์วอลท์ จำกัด ขออนุญาตแจ้งแผนงานเข้า PM Solar
                                        System โครงการ{" "}
                                        <span className="text-[#2196F3] font-semibold">
                                            {formData.projectName}
                                        </span>{" "}
                                        เข้าปฏิบัติงาน ในวันที่{" "}
                                        <span className="text-[#2196F3] font-semibold">
                                            {formatThaiDate(formData.date)}
                                        </span>{" "}
                                        เวลา{" "}
                                        <span className="text-[#2196F3] font-semibold">
                                            {formatTimeRange(formData.startTime, formData.endTime)}
                                        </span>
                                    </p>

                                    <p className="pt-4 indent-28 text-[#2196F3]">
                                        หมายเหตุ: {formData.remark}
                                    </p>

                                    <p className="pt-4 indent-28">
                                        จึงเรียนมาเพิ่อพิจารณาอนุมัติ และขออํานวยความสะดวกในการขึ้นหลังคา ระบบนํ้าและการเข้าปฏิบัติงานในพื้นที่ โดยได้แนบเอกสารรายชื่อผู้เข้าปฏิบัติงานพร้อมวุฒิบัตรการอบรมการทํางานบนที่สูงตามเอกสารแนบด้านล่าง
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Upload */}
                        <div className="mt-[27px]">
                            <label className="text-[16px] font-normal">
                                อัปโหลดเอกสารไฟล์ รายชื่อทีมล้างแผง
                            </label>

                            <label
                                htmlFor="teamFile"
                                className="flex items-center rounded-lg h-[39px] border border-dashed border-green-800 px-4 py-3 text-sm text-gray-600 cursor-pointer hover:bg-green-50 transition"
                            >
                                <img src={UploadIcon} alt="upload" className="h-4.5 w-4.5" />

                                <span className="text-[#2979FF] font-normal ml-2">
                                    {uploadedFile ? uploadedFile.name : "คลิกเลือกไฟล์เพื่ออัปโหลด"}
                                </span>

                                <input
                                    id="teamFile"
                                    name="files"
                                    type="file"
                                    className="hidden"
                                    disabled={isReadOnly}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
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
                        onClick={() => navigate("/cleaning/new/step1")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ก่อนหน้า
                    </button>

                    {isReadOnly ? (
                        <button
                            onClick={() => navigate("/cleaning/new/step3_01")}
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
            {/* Confirm Modal*/}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl w-[720px] p-6 shadow-lg">

                        <h2 className="text-lg font-semibold text-black-800">
                            ยืนยันการส่งอีเมล
                        </h2>

                        <p className="text-gray-600 mt-3 text-xl leading-relaxed">
                            คุณต้องการส่งอีเมลแจ้งแผนงานไปยังโครงการ
                            <span className="font-semibold text-green-700">
                                {" "}{formData.projectName}{" "}
                            </span>
                            ใช่หรือไม่
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
        </div>
    );
}
