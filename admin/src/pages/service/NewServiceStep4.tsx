import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type React from "react";

import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ExportIcon from "../../assets/icons/File Download.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import ReportPreview from "../../components/ReportPreview";

export default function NewServiceStep4() {

    const navigate = useNavigate();

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
        { id: 4, label: "รายงาน" },
        { id: 5, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(4);

    const [jobId, setJobId] = useState<number | null>(null);

    const [reportUrl, setReportUrl] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");

    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // load jobId
    // =========================
    useEffect(() => {

        const raw = localStorage.getItem("service_step1");

        if (!raw) {
            navigate("/service/new/step1");
            return;
        }

        const data = JSON.parse(raw);

        setJobId(data.jobId);

    }, []);

    // =========================
    // generate report
    // =========================
    async function generateReport() {

        if (!jobId) return;

        try {

            setGenerating(true);
            setError("");

            const res = await fetch(
                "http://localhost:3000/api/service/step4/generate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ jobId })
                }
            );

            const json = await res.json();

            if (!json.success) {
                throw new Error("generate report failed");
            }

            const reportUrl = json.data.reportUrl;
            const download = `http://localhost:3000${json.data.download}`;

            setReportUrl(reportUrl);
            setDownloadUrl(download);

            localStorage.setItem(
                "service_report",
                JSON.stringify({
                    jobId,
                    reportUrl,
                    download
                })
            );

        } catch (err) {

            console.error(err);
            setError("สร้างรายงานไม่สำเร็จ กรุณาลองใหม่");

        } finally {

            setGenerating(false);
        }
    }

    // =========================
    // export report
    // =========================
    function handleExport(event: React.MouseEvent<HTMLButtonElement>) {

        event.preventDefault();

        if (!downloadUrl) {
            alert("ยังไม่มีรายงาน กรุณาสร้างรายงานก่อน");
            return;
        }

        window.open(downloadUrl, "_blank");
    }

    // =========================
    // auto generate
    // =========================
    useEffect(() => {

        if (jobId) {
            generateReport();
        }

    }, [jobId]);

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">

                <h1 className="text-green-800">
                    New Service Job
                </h1>

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

                <ProgressBar
                    steps={steps}
                    currentStep={currentStep}
                />

                {/* Content */}
                <div className="w-[1095px]">

                    <div className="flex justify-between mb-1">

                        <h2 className="text-green-800">
                            ตัวอย่างรายงาน
                        </h2>

                        <button
                            onClick={handleExport}
                            className="flex items-center justify-center w-[171px] h-10 px-5 py-3 text-[12px] gap-x-1
                            text-green-700 bg-white border-2 border-green-600 rounded-md"
                        >

                            <img src={ExportIcon} alt="export" />
                            Export file

                        </button>

                    </div>

                    {/* Preview area */}
                    <div className="w-full">

                        {generating && (
                            <div className="h-[500px] flex items-center justify-center border rounded-lg text-gray-500">
                                กำลังสร้างรายงาน...
                            </div>
                        )}

                        {!generating && error && (
                            <div className="h-[500px] flex flex-col items-center justify-center border rounded-lg">

                                <p className="text-red-500 mb-3">
                                    {error}
                                </p>

                                <button
                                    onClick={generateReport}
                                    className="px-4 py-2 bg-green-700 text-white rounded-md"
                                >
                                    ลองใหม่
                                </button>

                            </div>
                        )}

                        {!generating && !error && (
                            <ReportPreview
                                data={{
                                    reportUrl
                                }}
                            />
                        )}

                    </div>

                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">

                    <button
                        onClick={() => navigate("/service/new/step3")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ก่อนหน้า
                    </button>

                    <button
                        onClick={() => navigate("/service/new/step5")}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                    >
                        ถัดไป
                    </button>

                </div>

            </div>

        </div>
    );
}

