import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type React from "react";
import html2pdf from "html2pdf.js";

import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ExportIcon from "../../assets/icons/File Download.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import ReportPreview from "../../components/ReportPreview";

export default function NewCleaningStep4() {
    const navigate = useNavigate();

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
        { id: 4, label: "รายงาน" },
        { id: 5, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(4);

    function handleExport(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const element = document.getElementById("report-preview");
        if (!element) {
            alert("ไม่พบตัวอย่างรายงาน");
            return;
        }

        const opt = {
            margin: 0,
            filename: "Cleaning_Report.pdf",
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 3, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(element).save();
    }


    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Cleaning Job</h1>

                <button className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
          text-green-700 bg-white border-2 border-green-700 rounded-md">
                    <img src={SaveDraftIcon} alt="save draft" />
                    Save Draft
                </button>
            </div>

            {/* Form */}
            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl items-center justify-between">
                <ProgressBar steps={steps} currentStep={currentStep} />

                {/* Content */}
                <div className="w-[1095px]">
                    <div className="flex justify-between mb-1">
                        <h2 className="text-green-800">ตัวอย่างรายงาน</h2>

                        <button
                            onClick={handleExport}
                            className="flex items-center justify-center w-[171px] h-10 px-5 py-3 text-[12px] gap-x-1
              text-green-700 bg-white border-2 border-green-600 rounded-md"
                        >
                            <img src={ExportIcon} alt="export" />
                            Export file
                        </button>
                    </div>

                    <ReportPreview data={[]} />
                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">
                    <button
                        onClick={() => navigate("/cleaning/new/step3_02")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl">
                        ก่อนหน้า
                    </button>

                    <button
                        onClick={() => navigate("/cleaning/new/step5")}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl">
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
    );
}
