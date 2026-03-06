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


// ==========================
// NEW: format phone
// ==========================
function formatPhones(phone?: string | null) {
    if (!phone) return "";

    return phone
        .split(";")
        .map((p) => p.trim())
        .filter(Boolean)
        .join(", ");
}

// ==========================
// NEW: parse email
// ==========================
function parseEmails(email?: string | null) {
    if (!email) return [];

    return email
        .split(";")
        .map((e) => e.trim())
        .filter(Boolean);
}

export default function NewInspectionStep1() {

    const navigate = useNavigate();
    const FIELD_WIDTH = "w-[532px]";

    const [shutdownHours, setShutdownHours] = useState("");

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "ส่งรายงาน" },
    ];

    const [currentStep] = useState(1);

    const [projects, setProjects] = useState<InspectionProject[]>([]);
    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<InspectionProject | null>(null);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [remark, setRemark] = useState("");
    const [contractor, setContractor] = useState("");
    const [projectType, setProjectType] = useState("");


    // ==========================
    // Load Projects
    // ==========================
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


    // ==========================
    // หา project ที่เลือก
    // ==========================
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


    // ==========================
    // Save Draft
    // ==========================
    function saveStep1Data() {

        const payload = {
            projectId,
            projectName: project?.projectName ?? "",
            date,
            time,
            remark,
            contractor,
            projectType,
            shutdownHours,
        };

        localStorage.setItem("inspection_step1", JSON.stringify(payload));
    }


    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Inspection Job</h1>

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
                    <div className="col-span-2 w-full">
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
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-green-800">Contact Email</label>

                        <div
                            className="min-h-10 p-4 rounded-sm border bg-[#EDEDED] text-[14px]
              text-green-500 border-green-200 cursor-not-allowed space-y-1"
                        >
                            {parseEmails(project?.contactEmail).map((email, index) => (
                                <div key={index} className="break-all">
                                    {email}
                                </div>
                            ))}
                        </div>
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
                        <TextInputFilter
                            label="Time*"
                            type="time"
                            placeholder="Select Time"
                            value={time}
                            onChange={setTime}
                        />
                    </div>

                    {/* จำนวนชั่วโมง */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="ระยะเวลาปิด(ชั่วโมง)"
                            type="number"
                            placeholder="เช่น 3"
                            value={shutdownHours}
                            onChange={setShutdownHours}
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
                        onClick={() => navigate("/inspection")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ยกเลิก
                    </button>


                    <button
                        onClick={async () => {

                            if (!date || !time) {
                                alert("กรุณาเลือกวันที่และเวลา");
                                return;
                            }

                            try {

                                const result = await createInspectionStep1({
                                    siteId: Number(projectId),
                                    projectType,
                                    contactPhone: project?.contactPhone ?? "",
                                    contactEmail: project?.contactEmail ?? "",
                                    workDate: date,
                                    workTimeText: time,
                                    customerName: project?.projectName ?? "",
                                    note: remark,
                                });

                                localStorage.setItem("jobId", String(result.data.jobId));

                                const payload = {
                                    jobId: result.data.jobId,
                                    projectId,
                                    projectName: project?.projectName,
                                    contactEmail: project?.contactEmail,
                                    date,
                                    time,
                                    shutdownHours,
                                    remark,
                                };

                                localStorage.setItem("inspection_step1", JSON.stringify(payload));

                                navigate("/inspection/new/step2");

                            } catch (err) {
                                console.error(err);
                                alert("สร้าง Inspection Job ไม่สำเร็จ");
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