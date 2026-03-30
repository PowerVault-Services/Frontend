import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import DeleteIcon from "../../assets/icons/deleteicon.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadFileField from "../../components/UploadFileField";
import ImageGalleryUpload from "../../components/ImageGalleryUpload";
import { createServiceStep3Draft } from "../../services/service.api";
import api from "../../services/api";

import MaterialRequisition from "../../components/MaterialRequisition";

export default function NewServiceStep3() {

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
    const [isReadOnly, setIsReadOnly] = useState(false);

    const [reportFile, setReportFile] = useState<File | null>(null);
    const [images, setImages] = useState<any[]>([]);

    const [equipment, setEquipment] = useState("");
    const [amount, setAmount] = useState("");

    // ✅ jobId (standard เหมือน cleaning)
    const jobIdStr =
        localStorage.getItem("jobId") ||
        JSON.parse(localStorage.getItem("service_step1") || "{}")?.jobId;

    const jobId =
        jobIdStr && !isNaN(Number(jobIdStr))
            ? Number(jobIdStr)
            : null;

    // =========================
    // LOAD DATA + READ ONLY
    // =========================
    useEffect(() => {
        if (!jobId) return;
        const local = localStorage.getItem(`service_step3_${jobId}`);

        if (local) {
            const parsed = JSON.parse(local);

            setImages(parsed.images || []);
            setEquipment(parsed.equipment || "");
            setAmount(parsed.amount || "");
        }

        async function loadData() {
            try {
                const res = await api.get(`/service/job/${jobId}`);
                const data = res.data?.data;

                console.log("🔥 STEP3 API:", data);

                if (data?.job?.status === "COMPLETED") {
                    setIsReadOnly(true);
                }

                // ✅ images
                const attachments = data?.job?.attachments || [];

                // ✅ รูป evidence
                const evidenceImages = attachments
                    .filter((f: any) => f.fileType === "SERVICE_EVIDENCE")
                    .map((f: any) => f.fileUrl);

                // ✅ service report (optional)
                const reportImages = attachments
                    .filter((f: any) => f.fileType === "SERVICE_REPORT_FORM")
                    .map((f: any) => f.fileUrl);

                // รวมเป็น images
                setImages(evidenceImages);

                // ถ้าจะใช้ reportFile
                if (reportImages.length > 0) {
                    setReportFile(reportImages[0]); // หรือเก็บ array ก็ได้
                }

                // ✅ report file
                if (data?.reportFile) {
                    setReportFile(data.reportFile);
                }

                // ✅ material
                if (data?.items?.length > 0) {
                    setEquipment(String(data.items[0].productId));
                    setAmount(String(data.items[0].quantity));
                }

            } catch (err) {
                console.error("โหลด Step3 ไม่ได้", err);
            }
        }

        loadData();
    }, [jobId]);

    // =========================
    // NEXT
    // =========================
    async function handleNext() {

        if (loading) return;

        try {

            if (!jobId) {
                alert("ไม่พบ jobId");
                navigate("/service/new/step1");
                return;
            }

            if (images.length < 6) {
                alert("ต้องอัปโหลดรูปภาพอย่างน้อย 6 รูป");
                return;
            }

            if (images.length > 30) {
                alert("อัปโหลดรูปได้ไม่เกิน 30 รูป");
                return;
            }

            if (!reportFile) {
                alert("กรุณาอัปโหลด Service Report");
                return;
            }

            setLoading(true);

            let metaJson: any = {};

            if (equipment && amount) {
                metaJson.items = [
                    {
                        productId: Number(equipment),
                        quantity: Number(amount),
                    },
                ];
            }

            await createServiceStep3Draft({
                jobId,
                reportFile,
                images,
                metaJson,
            });

            localStorage.setItem(
                `service_step3_${jobId}`,
                JSON.stringify({
                    images,
                    equipment,
                    amount
                })
            );

            navigate("/service/new/step4");

        } catch (error) {
            console.error("Step3 upload error:", error);
            alert("บันทึกข้อมูลไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // SAVE DRAFT
    // =========================
    async function handleSaveDraft() {

        try {

            if (!jobId) {
                alert("ไม่พบ jobId");
                return;
            }

            setLoading(true);

            let metaJson: any = {};

            if (equipment && amount) {
                metaJson.items = [
                    {
                        productId: Number(equipment),
                        quantity: Number(amount),
                    },
                ];
            }

            await createServiceStep3Draft({
                jobId,
                reportFile,
                images,
                metaJson,
            });

            alert("บันทึก Draft สำเร็จ");

        } catch (error) {
            console.error("Save draft error:", error);
            alert("บันทึก Draft ไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">

                <h1 className="text-green-800">
                    New Service Job
                </h1>

                <button
                    onClick={handleSaveDraft}
                    disabled={loading || isReadOnly}
                    className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
                    text-green-700 bg-white border-2 border-green-700 rounded-md"
                >
                    <img src={SaveDraftIcon} alt="save draft" />
                    Save Draft
                </button>

            </div>

            {/* Form */}
            <div className="flex flex-col min-h-[822px] px-28 py-5 bg-white rounded-2xl items-center justify-between">

                <ProgressBar steps={steps} currentStep={currentStep} />

                {/* Form Fields */}
                <div className="w-[1091px]">

                    {isReadOnly ? (
                        // ✅ MODE: COMPLETED → แสดง grid อย่างเดียว
                        <div className="mt-2 pb-1.5">
                            <p className="text-green-800 font-medium">รูปภาพ Service</p>

                            <div className="grid grid-cols-6 gap-2 mt-2">
                                {images.map((img: any, index) => (
                                    <img
                                        key={index}
                                        src={
                                            typeof img === "string"
                                                ? `${import.meta.env.VITE_API_URL}${img}`
                                                : URL.createObjectURL(img)
                                        }
                                        className="w-full h-24 object-cover rounded"
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        // ✅ MODE: DRAFT → ใช้ upload component
                        <ImageGalleryUpload
                            images={images}
                            setImages={setImages}
                        />
                    )}

                    {/* Upload Report */}
                    {isReadOnly ? (
                        <div className="mt-4">
                            <p className="text-green-800 font-medium">Service Report</p>

                            <div className="
            w-full
            border border-dashed border-gray-300
            rounded-md
            px-4 py-3
            text-sm
            text-gray-600
            bg-gray-50
            flex items-center
        ">
                                {reportFile ? (
                                    <a
                                        href={
                                            typeof reportFile === "string"
                                                ? `${import.meta.env.VITE_API_URL}${reportFile}`
                                                : "#"
                                        }
                                        target="_blank"
                                        className="text-blue-600 underline"
                                    >
                                        ดูไฟล์รายงาน
                                    </a>
                                ) : (
                                    <span className="text-gray-400">
                                        ไม่มีไฟล์
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : (
                        <UploadFileField
                            label="Service Report"
                            onChange={(file) => setReportFile(file)}
                        />
                    )}

                    {/* Material */}
                    <MaterialRequisition disabled={isReadOnly} />

                    {/* Preview Material */}
                    {isReadOnly && equipment && (
                        <div className="mt-4">
                            <p className="text-green-800 font-medium">อุปกรณ์ที่ใช้</p>
                            <div className="text-gray-700">
                                Product ID: {equipment} <br />
                                จำนวน: {amount}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between pt-4">

                    <button
                        onClick={() => navigate("/service/new/step2")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ก่อนหน้า
                    </button>

                    {isReadOnly ? (
                        <button
                            onClick={() => navigate("/service/new/step4")}
                            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                        >
                            ถัดไป
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                        >
                            {loading ? "กำลังบันทึก..." : "ถัดไป"}
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}