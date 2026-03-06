import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import SelectFilter from "../../components/SelectFilter";
import InputField from "../../components/InputField";
import TextInputFilter from "../../components/TextInputFilter";

import { getCleaningProjects, createCleaningStep1 } from "../../services/cleaning.api";
import type { CleaningProject } from "../../services/types";
import { saveCleaningDraft } from "../../utils/saveJobDraft";

function formatPhones(phone?: string) {
    if (!phone) return "";

    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
}

function parseEmails(emails?: string) {
    if (!emails) return [];

    return emails
        .split(/[;,]/) // รองรับ ; หรือ ,
        .map((e) => e.trim())
        .filter(Boolean);
}

export default function NewCleaningStep1() {
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

    const [projects, setProjects] = useState<CleaningProject[]>([]);
    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<CleaningProject | null>(null);

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
                const res = await getCleaningProjects();
                setProjects(res.data);
            } catch (error) {
                console.error("โหลด cleaning projects ไม่สำเร็จ:", error);
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
    // async function saveStep1Data() {

    //     try {

    //         if (!projectId) {
    //             alert("กรุณาเลือก Project");
    //             return;
    //         }

    //         if (!date || !time) {
    //             alert("กรุณาเลือกวันที่และเวลา");
    //             return;
    //         }

    //         let jobId = localStorage.getItem("jobId");

    //         // ถ้ายังไม่มี jobId ให้สร้าง job ก่อน
    //         if (!jobId) {

    //             const result = await createCleaningStep1({
    //                 siteId: Number(projectId),
    //                 projectType,
    //                 contactPhone: project?.contactPhone ?? "",
    //                 contactEmail: project?.contactEmail ?? "",
    //                 workDate: date,
    //                 workTimeText: time,
    //                 customerName: project?.projectName ?? "",
    //                 note: remark,
    //             });

    //             jobId = result.data.jobId;

    //             localStorage.setItem("jobId", String(jobId));
    //         }

    //         // เรียก Draft API
    //         await saveDraft(Number(jobId), 1);

    //         // backup form data
    //         const payload = {
    //             jobId,
    //             projectId,
    //             projectName: project?.projectName,
    //             date,
    //             time,
    //             remark,
    //             contractor,
    //             projectType,
    //         };

    //         localStorage.setItem("cleaning_step1", JSON.stringify(payload));

    //         alert("Draft saved");
    //         navigate("/cleaning");

    //     } catch (err) {

    //         console.error(err);
    //         alert("Save Draft ไม่สำเร็จ");

    //     }
    // }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Cleaning Job</h1>
                <button
                    onClick={() =>
                        saveCleaningDraft({
                            projectId,
                            project,
                            date,
                            time,
                            remark,
                            contractor,
                            projectType,
                            step: 1,
                            navigate,
                        })
                    }
                    className="flex items-center w-[140px] h-10 justify-between px-5 py-3 text-[12px]
  text-green-700 bg-white border-2 border-green-700 rounded-md"
                >
                    <img src={SaveDraftIcon} alt="" />
                    Save Draft
                </button>
            </div>

            {/* Form */}
            <div className="flex flex-col min-h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl justify-between items-center">

                <ProgressBar steps={steps} currentStep={currentStep} />

                {/* Form Fields */}
                <div className="grid grid-cols-2 w-[1095px] justify-center gap-y-[27px]">

                    {/* Project Name */}
                    <div className={FIELD_WIDTH}>
                        <SelectFilter
                            label="Project Name"
                            placeholder="Select Project"
                            value={projectId}
                            onChange={setProjectId}
                            options={projects.map((p) => ({
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

                    {/* PV Module */}
                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="PV Module (ea.)"
                            value={project?.pvModuleEA?.toString() ?? ""}
                            disabled
                        />
                    </div>

                    {/* Phone */}
                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Contact Phone Number"
                            value={formatPhones(project?.contactPhone ?? "")}
                            disabled
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm text-green-800">Contact Email</label>

                        <div
                            className="min-h-10 p-4 rounded-sm border bg-[#EDEDED] text-[14px] text-green-500 border-green-200 cursor-not-allowed space-y-1"
                        >
                            {parseEmails(project?.contactEmail ?? "").map((email, index) => (
                                <div key={index} className="flex items-center gap-2 break-all">
                                    <span>{email}</span>
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

                    {/* Remark */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="หมายเหตุ"
                            placeholder="Text"
                            value={remark}
                            onChange={setRemark}
                        />
                    </div>

                    {/* Contractor */}
                    <div className={FIELD_WIDTH}>
                        <SelectFilter
                            label="รับเหมา"
                            placeholder="Select"
                            value={contractor}
                            onChange={setContractor}
                            options={[
                                { label: "Contractor A", value: "contractor_a" },
                                { label: "Contractor B", value: "contractor_b" },
                                { label: "Contractor C", value: "contractor_c" },
                            ]}
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

                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">

                    <button
                        onClick={() => navigate("/cleaning")}
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ยกเลิก
                    </button>

                    <button
                        onClick={async () => {
                            if (!projectId) {
                                alert("กรุณาเลือก Project");
                                return;
                            }

                            if (!date || !time) {
                                alert("กรุณาเลือกวันที่และเวลา");
                                return;
                            }

                            try {

                                const result = await createCleaningStep1({
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
                                    remark,
                                };

                                localStorage.setItem("cleaning_step1", JSON.stringify(payload));

                                navigate("/cleaning/new/step2");

                            } catch (err) {
                                console.error(err);
                                alert("สร้าง Cleaning Job ไม่สำเร็จ");
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