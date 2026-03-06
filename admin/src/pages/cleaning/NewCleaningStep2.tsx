import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadIcon from "../../assets/icons/Cloud Upload.svg";
import { saveCleaningStep2Draft, sendCleaningStep2 } from "../../services/cleaning.api";

export default function NewCleaningStep2() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    // email status (production pattern)
    const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent">("idle");

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
        time: "",
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
            time: data.time || "",
            remark: data.remark || "",
        });

        // ✅ check status ตาม job
        const sent = localStorage.getItem(`cleaning_step2_sent_${data.jobId}`);

        if (sent === "true") {
            setEmailStatus("sent");
        }

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

            const subject = `ขออนุญาตเข้าบำรุงรักษาระบบ Solar System โครงการ ${formData.projectName}`;

            const body = `
เรียน ท่านผู้เกี่ยวข้อง

บริษัท พาวเวอร์วอลท์ จำกัด ขออนุญาตแจ้งแผนงานเข้า PM Solar System
โครงการ ${formData.projectName}
วันที่ ${formatThaiDate(formData.date)}
เวลา ${formData.time}

${formData.remark}
            `;

            await saveCleaningStep2Draft({
                jobId: step1.jobId,
                to: formData.projectName,
                subject,
                body,
                file: uploadedFile
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

            const subject = `ขออนุญาตเข้าบำรุงรักษาระบบ Solar System โครงการ ${formData.projectName}`;

            const body = `
เรียน ท่านผู้เกี่ยวข้อง

บริษัท พาวเวอร์วอลท์ จำกัด ขออนุญาตแจ้งแผนงานเข้า PM Solar System
โครงการ ${formData.projectName}
วันที่ ${formatThaiDate(formData.date)}
เวลา ${formData.time}

${formData.remark}
            `;

            await saveCleaningStep2Draft({
                jobId: step1.jobId,
                to: "nita290646@gmail.com",
                subject,
                body,
                file: uploadedFile
            });

            await sendCleaningStep2(step1.jobId);

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
                                            {formData.time}
                                        </span>
                                    </p>

                                    <p className="pt-4 indent-28">
                                        จึงเรียนมาเพื่อพิจารณาอนุมัติ และขออำนวยความสะดวกในการขึ้นหลังคา
                                        ระบบน้ำและการเข้าปฏิบัติงานในพื้นที่
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
