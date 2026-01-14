import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import OperationTable from "../../components/table/OperationTable";

export default function NewCleaningStep3_02() {
    const navigate = useNavigate();

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
        { id: 4, label: "รายงาน" },
        { id: 5, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(3);

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
            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl items-center justify-between">
                <ProgressBar steps={steps} currentStep={currentStep} />

                {/* Form Fields */}
                <div className="w-[1095px]">
                    <OperationTable />
                </div>
                    

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">
                    <button
                        onClick={() => navigate("/cleaning/new/step3_01")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl">
                        ก่อนหน้า
                    </button>

                    <button
                        onClick={() => navigate("/cleaning/new/step4")}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl">
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
    );
}
