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

/* =========================
   Utils
========================= */

function formatPhones(phone?: string | null) {
    if (!phone) return "";
    return phone.split(";").map((p) => p.trim()).filter(Boolean).join(", ");
}

function parseEmails(email?: string | null) {
    if (!email) return [];
    return email.split(";").map((e) => e.trim()).filter(Boolean);
}

function calculateHours(start: string, end: string) {
    if (!start || !end) return "";

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let totalMin = eh * 60 + em - (sh * 60 + sm);
    if (totalMin < 0) totalMin += 24 * 60;

    return (totalMin / 60).toString();
}

/* =========================
   Component
========================= */

export default function NewInspectionStep1() {
    const navigate = useNavigate();
    const FIELD_WIDTH = "w-[532px]";

    const [isReadOnly, setIsReadOnly] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [shutdownHours, setShutdownHours] = useState("");
    const [isManualHours, setIsManualHours] = useState(false);

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

    const steps = [
        { id: 1, label: "กรอกข้อมูล" },
        { id: 2, label: "ส่งอีเมลแจ้งแผน" },
        { id: 3, label: "ส่งรายงาน" },
    ];

    /* =========================
       Load draft
    ========================= */
    useEffect(() => {
        const raw = localStorage.getItem("inspection_step1");
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (parsed.status === "COMPLETED") {
            setIsReadOnly(true);
        }

        if (parsed.projectName) {
            setProject({
                siteId: parsed.projectId ? Number(parsed.projectId) : 0,
                projectName: parsed.projectName,
                address: parsed.address,
                systemSizeKWp: parsed.systemSizeKWp,
                contactPhone: parsed.contactPhone,
                contactEmail: parsed.contactEmail,
            } as any);
        }

        if (parsed.jobId) {
            setIsEditMode(true);
            localStorage.setItem("jobId", String(parsed.jobId));
        }

        setProjectId(String(parsed.projectId || parsed.siteId || ""));
        setDate(parsed.date || "");
        setStartTime(parsed.startTime || "");
        setEndTime(parsed.endTime || "");
        setContractor(parsed.contractor || "");
        setProblem(parsed.problem || "");
        setRemark(parsed.remark || "");
        setProjectType(parsed.projectType || "");
    }, []);

    /* =========================
       Load projects
    ========================= */
    useEffect(() => {
        async function loadProjects() {
            try {
                const res = await getInspectionProjects();
                setProjects(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        loadProjects();
    }, []);

    /* =========================
       Map selected project
    ========================= */
    useEffect(() => {
        if (!projects.length) return;

        // ✅ เคส 1: มี projectId → match ปกติ
        if (projectId) {
            const found = projects.find(
                (p) => String(p.siteId) === String(projectId)
            );

            if (found) {
                setProject(found);
                return;
            }
        }

        // ✅ เคส 2: fallback แบบ cleaning (สำคัญมาก)
        const raw = localStorage.getItem("inspection_step1");
        if (!raw) return;

        const parsed = JSON.parse(raw);

        if (parsed.projectName) {
            const found = projects.find(
                (p) => p.projectName === parsed.projectName
            );

            if (found) {
                console.log("🔥 FIX PROJECT:", found);

                setProject(found);
                setProjectId(String(found.siteId)); // ⭐ สำคัญสุด
            }
        }

    }, [projects, projectId]);

    /* =========================
       Auto calculate hours
    ========================= */
    useEffect(() => {
        if (!isManualHours) {
            const calculated = calculateHours(startTime, endTime);
            if (calculated) setShutdownHours(calculated);
        }
    }, [startTime, endTime]);

    /* =========================
       Save
    ========================= */
    async function handleSaveStep1() {
        if (isReadOnly) {
            throw new Error("ไม่สามารถแก้ไข job ที่เสร็จแล้ว");
        }

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
            startTime: startTime.length === 5 ? startTime + ":00" : startTime,
            endTime: endTime.length === 5 ? endTime + ":00" : endTime,
            contractor,
            problem,
            ...(currentJobId ? { jobId: Number(currentJobId) } : {}),
        };

        const res = await createInspectionStep1(payload);
        const jobId = res.data?.jobId;

        if (!jobId) throw new Error("ไม่พบ jobId");

        localStorage.setItem("jobId", String(jobId));

        localStorage.setItem(
            "inspection_step1",
            JSON.stringify({
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
                status: isReadOnly ? "COMPLETED" : "DRAFT",
            })
        );

        await saveDraftStep(jobId, 1);

        return jobId;
    }

    /* =========================
       UI
    ========================= */

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Inspection Job</h1>

                {!isReadOnly && (
                    <button
                        onClick={async () => {
                            try {
                                await handleSaveStep1();
                                alert("บันทึกเรียบร้อยแล้ว");
                                navigate("/inspection");
                            } catch (err: any) {
                                alert(err.message);
                            }
                        }}
                    >
                        <img src={SaveDraftIcon} alt="" />
                        Save Draft
                    </button>
                )}
            </div>

            {/* Form */}
            <div className="flex flex-col px-28 py-5 gap-y-[58px] bg-white rounded-2xl items-center">
                <ProgressBar steps={steps} currentStep={1} />

                <div className="grid grid-cols-2 w-[1095px] gap-y-[27px]">
                    <div className={FIELD_WIDTH}>
                        {isEditMode ? (
                            <InputField
                                label="Project Name"
                                value={project?.projectName ?? ""}
                                disabled
                            />
                        ) : (
                            <SelectFilter
                                label="Project Name"
                                value={projectId}
                                onChange={setProjectId}
                                disabled={isReadOnly}
                                options={projects.map((p) => ({
                                    label: p.projectName,
                                    value: String(p.siteId),
                                }))}
                            />
                        )}
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Location"
                            value={project?.address ?? ""}
                            disabled
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="System Size (kWp)"
                            value={project?.systemSizeKWp?.toString() ?? ""}
                            disabled
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Contact Phone Number"
                            value={formatPhones(project?.contactPhone)}
                            disabled
                        />
                    </div>

                    <div className="col-span-2">
                        <InputField
                            label="Contact Email"
                            value={parseEmails(project?.contactEmail).join(", ")}
                            disabled
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <SelectFilter
                            label="Project Type"
                            value={projectType}
                            onChange={setProjectType}
                            disabled={isReadOnly}
                            options={[
                                { label: "Free", value: "Free" },
                                { label: "Sale", value: "Sale" },
                            ]}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="Date*"
                            type="date"
                            value={date}
                            onChange={setDate}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="Start Time*"
                            type="time"
                            value={startTime}
                            onChange={setStartTime}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="End Time*"
                            type="time"
                            value={endTime}
                            onChange={setEndTime}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="ระยะเวลาปิด(ชั่วโมง)"
                            value={shutdownHours}
                            disabled={isReadOnly}
                            onChange={(val) => {
                                setShutdownHours(val);
                                setIsManualHours(true);
                            }}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="หมายเหตุ"
                            value={remark}
                            onChange={setRemark}
                            disabled={isReadOnly}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex w-full max-w-[1095px] justify-between">
                    <button onClick={() => navigate("/inspection")} className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl">
                        กลับหน้าหลัก
                    </button>

                    {!isReadOnly ? (
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
                    ) : (
                        <button
                            onClick={() => {
                                const jobId = localStorage.getItem("jobId");
                                navigate(`/inspection/new/step2`);
                            }}
                            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl hover:bg-green-800 transition"
                        >
                            ดู Preview
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}