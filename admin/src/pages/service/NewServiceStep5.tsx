import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";

export default function NewServiceStep5() {

    const navigate = useNavigate();

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
        { id: 4, label: "รายงาน" },
        { id: 5, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(5);

    const [loading, setLoading] = useState(false);

    const [jobId, setJobId] = useState<number | null>(null);

    const [reportFileUrl, setReportFileUrl] = useState<string | null>(null);

    const [jobData, setJobData] = useState<{
        projectName?: string;
        date?: string;
        time?: string;
        problem?: string;
        remark?: string;
    }>({});

    // =========================
    // load step1 data
    // =========================
    useEffect(() => {

        const raw = localStorage.getItem("service_step1");

        if (!raw) {
            navigate("/service/new/step1");
            return;
        }

        const data = JSON.parse(raw);

        setJobId(data.jobId);

        setJobData(data);

    }, []);

    // =========================
    // load report data
    // =========================
    useEffect(() => {

        const raw = localStorage.getItem("service_report");

        if (!raw) return;

        const data = JSON.parse(raw);

        setReportFileUrl(`http://localhost:3000${data.reportUrl}`);

    }, []);

    // =========================
    // format date
    // =========================
    function formatThaiDate(dateStr?: string) {

        if (!dateStr) return "";

        const date = new Date(dateStr);

        const months = [
            "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน",
            "พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม",
            "กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
        ];

        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
    }

    // =========================
    // SEND REPORT EMAIL
    // =========================
    async function handleSendEmail() {

        if (!jobId) {
            alert("ไม่พบ jobId");
            return;
        }

        try {

            setLoading(true);

            const subject =
                `Service Report โครงการ ${jobData.projectName}`;

            const body = `
<p>เรียน ท่านผู้เกี่ยวข้อง</p>

<p>
บริษัท PowerVault ขออนุญาตนำส่งรายงานการเข้า
<strong>${jobData.problem}</strong>
โครงการ <strong>${jobData.projectName}</strong>
</p>

<p>
วันที่ ${formatThaiDate(jobData.date)}
</p>

<p>รายละเอียดตามเอกสารที่แนบมาพร้อมอีเมลนี้</p>
`;

            const res = await fetch(
                "http://localhost:3000/api/service/step5/send",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        jobId,
                        to: "nita290646@gmail.com",
                        subject,
                        body
                    })
                }
            );

            const json = await res.json();

            if (!json.success) {
                throw new Error("send email failed");
            }

            alert("ส่งรายงานสำเร็จ");

            navigate("/service");

        } catch (err) {

            console.error(err);

            alert("ส่งอีเมลไม่สำเร็จ");

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

                <button className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
                text-green-700 bg-white border-2 border-green-700 rounded-md">

                    <img src={SaveDraftIcon} alt="save draft" />
                    Save Draft

                </button>

            </div>

            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl justify-between items-center">

                <ProgressBar
                    steps={steps}
                    currentStep={currentStep}
                />

                <div className="grid w-[1095px]">

                    <label className="text-[16px] font-normal text-black mb-1">
                        รายละเอียดแจ้งแผน
                    </label>

                    <div className="h-[406px] rounded-lg border border-green-800 flex items-center justify-center">

                        <div className="w-[953px] text-[18px] text-gray-800 leading-relaxed">

                            <p>
                                <span>From :</span> ทีมดูแลระบบ PowerVault Service
                            </p>

                            <p>
                                <span>To :</span>{" "}
                                <span className="text-[#2196F3] font-semibold">
                                    {jobData.projectName || "-"}
                                </span>
                            </p>

                            <div className="pt-4 indent-10">

                                <p>เรียน ท่านผู้เกี่ยวข้อง</p>

                                <p>
                                    เรื่อง ขออนุญาตนําส่งรายงานการเข้า{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {jobData.problem || "-"}
                                    </span>{" "}
                                    โครงการ{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {jobData.projectName || "-"}
                                    </span>
                                </p>

                                <p className="pt-4 indent-28">
                                    บริษัท พาวเวอร์วอลท์ จํากัด
                                    ขออนุญาตนําส่งรายงานการเข้า{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {jobData.problem || "-"}
                                    </span>{" "}
                                    โครงการ{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {jobData.projectName || "-"}
                                    </span>{" "}
                                    ในวันที่{" "}
                                    <span className="text-[#2196F3] font-semibold">
                                        {formatThaiDate(jobData.date)}
                                    </span>
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="mt-[27px]">

                        <label className="text-[16px] font-normal">
                            เอกสารรายงานที่แนบไปด้วย
                        </label>

                        {reportFileUrl ? (

                            <div className="flex items-center gap-3 mt-2 border border-green-800 rounded-lg h-[39px] px-4">

                                <span className="text-sm text-gray-700">
                                    Service_Report.pdf
                                </span>

                                <a
                                    href={reportFileUrl}
                                    target="_blank"
                                    className="text-[#2979FF] underline text-sm"
                                >
                                    เปิดดู
                                </a>

                            </div>

                        ) : (

                            <div className="text-sm text-gray-400 mt-2">
                                ยังไม่มีรายงานจากขั้นตอนก่อนหน้า
                            </div>

                        )}

                    </div>

                </div>

                <div className="flex w-full max-w-[1095px] justify-between">

                    <button
                        onClick={() => navigate("/service/new/step4")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ก่อนหน้า
                    </button>

                    <button
                        onClick={handleSendEmail}
                        disabled={loading}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                    >
                        {loading ? "กำลังส่ง..." : "ยืนยันส่งอีเมล"}
                    </button>

                </div>

            </div>

        </div>
    );
}