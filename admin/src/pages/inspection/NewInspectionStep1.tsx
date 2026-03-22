import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import SelectFilter from "../../components/SelectFilter";
import InputField from "../../components/InputField";
import TextInputFilter from "../../components/TextInputFilter";

import {
    getInspectionProjects,
    createInspectionStep1,
} from "../../services/inspection.api";

import type { InspectionProject } from "../../services/types";
import { saveDraftStep } from "../../services/draft.api";

function formatPhones(phone?: string | null) {
    if (!phone) return "";

    return phone
        .split(";")
        .map((p) => p.trim())
        .filter(Boolean)
        .join(", ");
}

function parseEmails(email?: string | null) {
    if (!email) return [];

    return email
        .split(";")
        .map((e) => e.trim())
        .filter(Boolean);
}

function calculateHours(start: string, end: string) {
    if (!start || !end) return "";

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let totalMin = (eh * 60 + em) - (sh * 60 + sm);

    if (totalMin < 0) totalMin += 24 * 60;

    const hours = totalMin / 60;

    return hours.toString();
}

export default function NewInspectionStep1() {

    const navigate = useNavigate();
    const FIELD_WIDTH = "w-[532px]";

    const [shutdownHours, setShutdownHours] = useState("");
    const [projects, setProjects] = useState<InspectionProject[]>([]);
    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<InspectionProject | null>(null);

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [contractor, setContractor] = useState("");
    const [problem, setProblem] = useState("");
    const [remark, setRemark] = useState("");
    const [projectType, setProjectType] = useState("");

    const [isManualHours, setIsManualHours] = useState(false);

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(1);

    useEffect(() => {
        async function loadProjects() {
            try {
                const res = await getInspectionProjects();
                setProjects(res.data);
            } catch (error) {
                console.error("โหลด inspection projects ไม่สำเร็จ:", error);
            }
        }

        loadProjects();
    }, []);

    useEffect(() => {

        if (!projectId) {
            setProject(null);
            return;
        }

        const selected = projects.find(
            (p) => p.siteId === Number(projectId)
        );

        setProject(selected ?? null);

    }, [projectId, projects]);

    useEffect(() => {
        if (!isManualHours) {
            const calculated = calculateHours(startTime, endTime);
            if (calculated) {
                setShutdownHours(calculated);
            }
        }
    }, [startTime, endTime]);


    // ==========================
    // Save Draft (ใช้ API)
    // ==========================

    async function handleSaveStep1() {
        if (!projectId) throw new Error("กรุณาเลือก Project");
        if (!date || !startTime || !endTime) {
            throw new Error("กรุณากรอกวันที่และเวลา");
        }

        if (startTime >= endTime) {
            throw new Error("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
        }

        const currentJobId = localStorage.getItem("jobId");

        const payload = {
            siteId: Number(projectId),
            workDate: date,
            startTime,
            endTime,
            contractor,
            problem,
        };
        console.log("🔥 STEP1 payload:", payload);

        const res = await createInspectionStep1(payload);

        const jobId = res.data?.jobId;

        if (!jobId) throw new Error("ไม่พบ jobId");

        localStorage.setItem("jobId", String(jobId));

        localStorage.setItem("inspection_step1", JSON.stringify({
            jobId,
            projectId,
            projectName: project?.projectName,
            contactEmail: project?.contactEmail,
            date,
            startTime,
            endTime,
            contractor,
            problem,
            remark,
            projectType,
        }));

        await saveDraftStep(jobId, 1);

        return jobId;
    }


    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Inspection Job</h1>

                <button
                    onClick={async () => {
                        try {
                            await handleSaveStep1();
                            alert("บันทึกเรียบร้อยแล้ว");
                        } catch (err: any) {
                            alert(err.message);
                        }
                    }}
                    className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
          text-green-700 bg-white border-2 border-green-700 rounded-md"
                >
                    <img src={SaveDraftIcon} alt="" />
                    Save Draft
                </button>
            </div>


            {/* Form */}
            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl justify-between items-center">

                <ProgressBar steps={steps} currentStep={currentStep} />

                {/* Form Fields */}
                <div className="grid grid-cols-2 w-[1095px] justify-center gap-y-[27px]">

                    {/* Project */}
                    <div className={FIELD_WIDTH}>
                        <SelectFilter
                            label="Project Name"
                            placeholder="Select Project"
                            value={projectId}
                            onChange={setProjectId}
                            options={(projects ?? []).map((p) => ({
                                label: p.projectName,
                                value: String(p.siteId),
                            }))}
                        />
                    </div>

                    {/* Location */}
                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Location"
                            value={project?.address ?? ""}
                            disabled
                        />
                    </div>

                    {/* System Size */}
                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="System Size (kWp)"
                            value={project?.systemSizeKWp?.toString() ?? ""}
                            disabled
                        />
                    </div>

                    {/* Phone */}
                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Contact Phone Number"
                            value={formatPhones(project?.contactPhone)}
                            disabled
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-sm text-green-800">Contact Email</label>

                        <div
                            className="min-h-10 px-4 py-2 flex items-center rounded-sm border bg-[#EDEDED]
                            text-[14px] text-green-500 border-green-200 cursor-not-allowed"
                        >
                            {parseEmails(project?.contactEmail).join(", ")}
                        </div>
                    </div>

                    {/* Project Type */}
                    <div className={FIELD_WIDTH}>
                        <SelectFilter
                            label="Project Type"
                            placeholder="Select"
                            value={projectType}
                            onChange={setProjectType}
                            options={[
                                { label: "Free", value: "Free" },
                                { label: "Sale", value: "Sale" },
                            ]}
                        />
                    </div>

                    {/* Date */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="Date*"
                            type="date"
                            placeholder="Select Date"
                            value={date}
                            onChange={setDate}
                        />
                    </div>

                    {/* Time */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="Start Time*" type="time" value={startTime} onChange={setStartTime} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="End Time*" type="time" value={endTime} onChange={setEndTime} />
                    </div>

                    {/* จำนวนชั่วโมง */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="ระยะเวลาปิด(ชั่วโมง)"
                            type="number"
                            placeholder="เช่น 3"
                            value={shutdownHours}
                            onChange={(val) => {
                                setShutdownHours(val);
                                setIsManualHours(true); // ✅ สำคัญ
                            }}
                        />
                    </div>

                    {/* Remark */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="หมายเหตุ" value={remark} onChange={setRemark} />
                    </div>

                </div>


                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">

                    <button
                        onClick={() => navigate("/inspection")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ยกเลิก
                    </button>


                    <button
                        onClick={async () => {
                            try {
                                await handleSaveStep1();
                                navigate("/inspection/new/step2");
                            } catch (err: any) {
                                alert(err.message);
                            }
                        }}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                    >
                        ถัดไป
                    </button>

                </div>

            </div>
        </div>
    );
}