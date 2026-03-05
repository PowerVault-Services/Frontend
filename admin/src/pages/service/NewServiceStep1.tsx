import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import SelectFilter from "../../components/SelectFilter";
import InputField from "../../components/InputField";
import TextInputFilter from "../../components/TextInputFilter";

interface ServiceProject {
    siteId: number;
    plantCode: string;
    projectName: string;
    address: string | null;
    systemSizeKWp: number;
    pvModuleEA: number | null;
    contactPhone: string | null;
    contactEmail: string | null;
}

// ==========================
// NEW: format phone
// ==========================
function formatPhones(phone?: string | null) {
    if (!phone) return "";

    return phone
        .split(";")
        .map(p => p.trim())
        .filter(Boolean)
        .join(", ");
}

// ==========================
// NEW: format email (2 ต่อบรรทัด)
// ==========================
function formatEmails(email?: string | null) {
    if (!email) return "";

    const emails = email
        .split(";")
        .map(e => e.trim())
        .filter(Boolean);

    const rows: string[] = [];

    for (let i = 0; i < emails.length; i += 2) {
        rows.push(emails.slice(i, i + 2).join(", "));
    }

    return rows.join("\n");
}

function parseEmails(email?: string | null) {
    if (!email) return [];

    return email
        .split(";")
        .map(e => e.trim())
        .filter(Boolean);
}

export default function NewServiceStep1() {

    const navigate = useNavigate();
    const FIELD_WIDTH = "w-[532px]";

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "แนบรูปภาพ" },
        { id: 4, label: "รายงาน" },
        { id: 5, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(1);

    const [projects, setProjects] = useState<ServiceProject[]>([]);
    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<ServiceProject | null>(null);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [remark, setRemark] = useState("");
    const [remarklocation, setRemarkLocation] = useState("");
    const [problem, setProblem] = useState("");
    const [projectType, setProjectType] = useState("");

    // =========================
    // Load projects
    // =========================
    useEffect(() => {

        async function loadProjects() {

            try {

                const res = await fetch("/api/service/projects");

                const json = await res.json();

                if (!json.success) {
                    throw new Error("โหลด projects ไม่สำเร็จ");
                }

                setProjects(json.data);

            } catch (err) {

                console.error(err);
            }
        }

        loadProjects();

    }, []);

    // =========================
    // select project
    // =========================
    useEffect(() => {

        const selected = projects.find(
            (p) => p.siteId === Number(projectId)
        );

        setProject(selected ?? null);

    }, [projectId, projects]);

    // =========================
    // Save draft local
    // =========================
    function saveStep1Data() {

        const payload = {
            projectId,
            projectName: project?.projectName ?? "",
            date,
            time,
            problem,
            remarklocation,
            remark,
            projectType
        };

        localStorage.setItem("service_step1", JSON.stringify(payload));
    }

    // =========================
    // Create Service Job
    // =========================
    async function handleNext() {

        if (!projectId) {
            alert("กรุณาเลือก Project");
            return;
        }

        if (!date || !time) {
            alert("กรุณาเลือกวันที่และเวลา");
            return;
        }

        try {

            const res = await fetch("/api/service/step1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    siteId: Number(projectId),
                    workDate: date,
                    workTimeText: time,
                    note: remark
                })
            });

            const json = await res.json();

            if (!json.success) {
                throw new Error("create job failed");
            }

            const jobId = json.data.jobId;

            localStorage.setItem("service_jobId", String(jobId));

            const payload = {
                jobId,
                projectId,
                projectName: project?.projectName,
                contactEmail: project?.contactEmail,
                date,
                time,
                problem,
                remarklocation,
                remark
            };

            localStorage.setItem("service_step1", JSON.stringify(payload));

            navigate("/service/new/step2");

        } catch (err) {

            console.error(err);
            alert("สร้าง Service Job ไม่สำเร็จ");
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
                    onClick={saveStep1Data}
                    className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
                    text-green-700 bg-white border-2 border-green-700 rounded-md"
                >
                    <img src={SaveDraftIcon} alt="" />
                    Save Draft
                </button>

            </div>

            {/* Form */}
            <div className="flex flex-col h-[822px] px-28 py-5 gap-y-[58px]
            bg-white rounded-2xl justify-between items-center">

                <ProgressBar
                    steps={steps}
                    currentStep={currentStep}
                />

                {/* Form Fields */}
                <div className="grid grid-cols-2 w-[1095px] justify-center gap-y-[27px]">

                    {/* Project */}
                    <div className={FIELD_WIDTH}>

                        <SelectFilter
                            label="Project Name"
                            placeholder="Select Project"
                            value={projectId}
                            onChange={setProjectId}
                            options={projects.map((p) => ({
                                label: p.projectName,
                                value: String(p.siteId)
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
                            value={formatPhones(project?.contactPhone)} // NEW
                            disabled
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2 max-w-[532px]">
                        <label className="text-sm text-green-800">Contact Email</label>

                        <div
                            className="min-h-10 p-4 rounded-sm border bg-[#EDEDED] text-[14px] text-green-500 border-green-200 cursor-not-allowed space-y-1"
                        >
                            {parseEmails(project?.contactEmail).map((email, index) => (
                                <div key={index} className="flex items-center gap-2 break-all">
                                    <span>{email}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Problem */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="ปัญหา / Alarmที่พบ"
                            placeholder="Text"
                            value={problem}
                            onChange={setProblem}
                        />
                    </div>

                    {/* Date */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="Date"
                            type="date"
                            value={date}
                            onChange={setDate}
                        />
                    </div>

                    {/* Time */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="Time"
                            type="time"
                            value={time}
                            onChange={setTime}
                        />
                    </div>

                    {/* Location Remark */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="บริเวณที่เข้าทำงาน"
                            placeholder="Text"
                            value={remarklocation}
                            onChange={setRemarkLocation}
                        />
                    </div>

                    {/* Project Type */}
                    <div className={FIELD_WIDTH}>
                        <SelectFilter
                            label="Project Type"
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

                    {/* Remark */}
                    <div className="col-span-2 w-full">
                        <TextInputFilter
                            label="หมายเหตุ"
                            placeholder="Text"
                            value={remark}
                            onChange={setRemark}
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">

                    <button
                        onClick={() => navigate("/service")}
                        className="w-[195px] border border-green-600
                        text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ยกเลิก
                    </button>

                    <button
                        onClick={handleNext}
                        className="w-[195px] bg-green-700 text-white
                        px-6 py-2.5 rounded-2xl"
                    >
                        ถัดไป
                    </button>

                </div>

            </div>

        </div>
    );
}