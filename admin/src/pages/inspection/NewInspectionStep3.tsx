import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import UploadIcon from "../../assets/icons/Cloud Upload.svg";


export default function NewInspectionStep3() {
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);


    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
    ];

    const [currentStep] = useState(3);

    const [jobData, setJobData] = useState<{
        projectName?: string;
        date?: string;
        time?: string;
        remark?: string;
    }>({});

    useEffect(() => {
        const raw = localStorage.getItem("inspection_step1");
        if (raw) setJobData(JSON.parse(raw));
    }, []);

    function formatThaiDate(dateStr?: string) {
        if (!dateStr) return "";

        const date = new Date(dateStr);
        const months = [
            "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
            "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
        ];

        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Inspection Job</h1>

                <button className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
          text-green-700 bg-white border-2 border-green-700 rounded-md">
                    <img src={SaveDraftIcon} alt="save draft" />
                    Save Draft
                </button>
            </div>

            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl justify-between items-center">
                <ProgressBar steps={steps} currentStep={currentStep} />

                <div className="grid w-[1095px]">
                    <label className="text-[16px] font-normal text-black">
                        รายละเอียดแจ้งแผน
                    </label>

                    <div className="h-[406px] rounded-lg border border-green-800 flex items-center justify-center">
                        <div className="w-[953px] text-[18px] text-gray-800 leading-relaxed">

                            <p><span>From :</span> ทีมดูแลระบบ PowerVault Service</p>

                            <p>
                                <span>To :</span>{" "}
                                <span className="text-[#2196F3] font-semibold">
                                    {jobData.projectName || "-"}
                                </span>
                            </p>

                            <div className="pt-4 indent-10">
                                <p>เรียน ท่านผู้เกี่ยวข้อง</p>

                                <p>เรื่อง ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System ประจําปี 2568</p>

                                <p className="pt-4 indent-10">
                                    บริษัท พาวเวอร์วอลท์ จํากัด ขออนุญาตนําส่งรายงาน Inspection ระบบ Solar System ประจําปี 2568
                                </p>

                                <p className="indent-10">
                                    โครงการ{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {jobData.projectName || "-"}
                                    </span>{" "}
                                    เข้าปฏิบัติงาน ในวันที่{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {formatThaiDate(jobData.date)}
                                    </span>{" "}
                                    รายละเอียดตามไฟล์แนบค่ะ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[27px]">
                        {/* Upload Inspection Report */}
                        <label className="text-[16px] font-normal">
                            อัปโหลดเอกสารไฟล์ (Inspection Report)
                        </label>
                        <label
                            htmlFor="teamFile"
                            className="flex items-center rounded-lg h-[39px] border border-dashed border-green-800 px-4 py-3 text-sm text-gray-600 cursor-pointer hover:bg-green-50 transition"
                        >
                            {/* icon (import svg) */}
                            <img
                                src={UploadIcon}
                                alt="upload"
                                className="h-4.5 w-4.5"
                            />

                            <span className="text-[#2979FF] font-normal">
                                คลิกเลือกไฟล์เพื่ออัปโหลด
                            </span>

                            <input
                                id="teamFile"
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.xls,.xlsx"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setUploadedFile(file);
                                }}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex w-full max-w-[1095px] justify-between">
                    <button onClick={() => navigate("/inspection/new/step2")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl">
                        ก่อนหน้า
                    </button>

                    <button onClick={() => navigate("/inspection/new/step3")}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl">
                        ยืนยันส่งอีเมล
                    </button>
                </div>
            </div>
        </div>
    );
}
