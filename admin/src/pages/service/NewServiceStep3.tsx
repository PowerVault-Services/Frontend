import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadFileField from "../../components/UploadFileField";
import SelectFilter from "../../components/SelectFilter";

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
    const [teamFile, setTeamFile] = useState<File | null>(null);
    const [projectType, setProjectType] = useState("");


    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Service Job</h1>

                <button
                    className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
          text-green-700 bg-white border-2 border-green-700 rounded-md"
                >
                    <img src={SaveDraftIcon} alt="save draft" />
                    Save Draft
                </button>
            </div>

            {/* Form */}
            <div className="flex flex-col h-[822px] px-28 py-5 bg-white rounded-2xl items-center justify-between content-start">
                <ProgressBar steps={steps} currentStep={currentStep} />

                {/* Form Fields */}
                <div className=" grid
                    w-[1091px]
                    h-[443px]
                    shrink-0
                    grid-cols-2
                    grid-rows-5
                    gap-x-[27px]
                    gap-y-[27px]">
                    <UploadFileField
                        label="Service Report"
                        onChange={(file) => setTeamFile(file)}
                    />
                    <UploadFileField
                        label="รูปภาพ Service"
                        onChange={(file) => setTeamFile(file)}
                    />
                    <div className="mt-[27px]">
                        <p className="text-[16px] text-[#E54848] font-semibold">*** หมายเหตุ : จํานวนรูปภาพขั้นตํ่า 6 รูป</p>
                    </div>

                    <div className="col-span-2">
                        <div className="grid grid-cols-2 gap-x-[27px] gap-y-[27px] w-[1091px]">
                            <SelectFilter
                                label="หมวดหมู่อุปกรณ์"
                                placeholder="Select"
                                value={projectType}
                                onChange={setProjectType}
                                options={[
                                    { label: "Type A", value: "type_a" },
                                    { label: "Type B", value: "type_b" },
                                    { label: "Type C", value: "type_c" },
                                ]}
                            />
                            <SelectFilter
                                label="อุปกรณ์"
                                placeholder="Select"
                                value={projectType}
                                onChange={setProjectType}
                                options={[
                                    { label: "Type A", value: "type_a" },
                                    { label: "Type B", value: "type_b" },
                                    { label: "Type C", value: "type_c" },
                                ]}
                            />
                            <SelectFilter
                                label="จำนวน"
                                placeholder="Select"
                                value={projectType}
                                onChange={setProjectType}
                                options={[
                                    { label: "Type A", value: "type_a" },
                                    { label: "Type B", value: "type_b" },
                                    { label: "Type C", value: "type_c" },
                                ]}
                            />
                        </div>
                    </div>


                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">
                    <button
                        onClick={() => navigate("/service/new/step2")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl">
                        ก่อนหน้า
                    </button>

                    <button
                        onClick={() => navigate("/service/new/step4")}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl">
                        ถัดไป
                    </button>
                </div>

                {/* debug / preview */}
                {teamFile && (
                    <p className="text-sm text-green-700">
                        ไฟล์ที่แนบ: {teamFile.name}
                    </p>
                )}
            </div>
        </div>
    );
}
