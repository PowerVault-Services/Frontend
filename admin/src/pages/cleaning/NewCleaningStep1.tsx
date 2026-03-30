import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import SelectFilter from "../../components/SelectFilter";
import InputField from "../../components/InputField";
import TextInputFilter from "../../components/TextInputFilter";

import {
    getCleaningProjects,
    saveCleaningStep1
} from "../../services/cleaning.api";

import { saveDraftStep } from "../../services/draft.api";
import type { CleaningProject } from "../../services/types";

function formatPhones(phone?: string) {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
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
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [remark, setRemark] = useState("");
    const [contractor, setContractor] = useState("");
    const [projectType, setProjectType] = useState("");

    const [isEditMode, setIsEditMode] = useState(false);

    const savedData = JSON.parse(localStorage.getItem("cleaning_step1") || "{}");
    const isReadOnly = savedData.status === "COMPLETED";

    // ==========================
    // Load draft (edit mode)
    // ==========================
    useEffect(() => {
        const savedData = localStorage.getItem("cleaning_step1");
        if (!savedData) return;

        const parsed = JSON.parse(savedData);

        const idFromStorage = parsed.projectId || parsed.siteId;

        if (idFromStorage && !isNaN(Number(idFromStorage))) {
            setProjectId(String(idFromStorage));
        }

        setDate(parsed.date || "");
        setStartTime(parsed.startTime || "");
        setEndTime(parsed.endTime || "");
        setRemark(parsed.remark || "");
        setContractor(parsed.contractor || "");
        setProjectType(parsed.projectType || "");

        if (parsed.startTime) {
            setStartTime(parsed.startTime.slice(0, 5));
        } else if (parsed.time) {
            const parts = parsed.time.split("-").map((t: string) => t.trim());
            setStartTime(parts[0]?.slice(0, 5) || "");
            setEndTime(parts[1]?.slice(0, 5) || "");
        }

        if (parsed.endTime) {
            setEndTime(parsed.endTime.slice(0, 5));
        }

        if (parsed.jobId) {
            localStorage.setItem("jobId", String(parsed.jobId));
            setIsEditMode(true);
        }

        if (parsed.projectName) {
            setProject({
                siteId: idFromStorage ? Number(idFromStorage) : 0,
                projectName: parsed.projectName,
                address: parsed.address,
                systemSizeKWp: parsed.systemSizeKWp,
                pvModuleEA: parsed.pvModuleEA,
                contactPhone: parsed.contactPhone,
                contactEmail: parsed.contactEmail
            } as any);
        }
    }, []);

    // ==========================
    // Load projects
    // ==========================
    useEffect(() => {
        async function loadProjects() {
            try {
                const res = await getCleaningProjects();
                setProjects(res.data);
            } catch (err) {
                console.error(err);
            }
        }
        loadProjects();
    }, []);

    // ==========================
    // Match project
    // ==========================
    useEffect(() => {
        if (!projectId && project?.projectName && projects.length > 0) {
            const found = projects.find(
                (p) => p.projectName === project.projectName
            );

            if (found) {
                console.log("🔥 FIX PROJECT:", found);

                setProjectId(String(found.siteId)); // ✅ ตัวแก้จริง
                setProject(found);
            }
        }
    }, [projects, project, projectId]);

    console.log("projectId:", projectId);
    console.log("project:", project);



    // ==========================
    // CORE SAVE FUNCTION (สำคัญที่สุด)
    // ==========================
    async function handleSaveStep1() {
        const finalProjectId =
            projectId || (project?.siteId ? String(project.siteId) : "");

        if (!finalProjectId) {
            throw new Error("กรุณาเลือก Project");
        }

        if (!date || !startTime || !endTime) {
            throw new Error("กรุณากรอก Date/Time");
        }

        if (!projectType) {
            throw new Error("กรุณาเลือก Project Type");
        }

        if (!contractor) {
            throw new Error("กรุณาเลือกผู้รับเหมา");
        }

        const currentJobId = localStorage.getItem("jobId");

        const payload = {
            siteId: Number(finalProjectId),
            projectType,
            contactPhone: project?.contactPhone || "-",
            contactEmail: project?.contactEmail || "-",
            workDate: date,
            startTime: startTime.length === 5 ? startTime + ":00" : startTime,
            endTime: endTime.length === 5 ? endTime + ":00" : endTime,
            contractor,
            problem: remark || "-",
            customerName: project?.projectName || "-",
            note: remark || "-",
            ...(currentJobId && { jobId: Number(currentJobId) }),
        };

        console.log("🔥 payload:", payload);

        const res = await saveCleaningStep1(payload);

        const jobId = res.data?.jobId || res.jobId;

        if (!jobId) throw new Error("ไม่พบ jobId");

        // ✅ เพิ่มตรงนี้
        localStorage.setItem("cleaning_step1", JSON.stringify({
            jobId,
            projectId: finalProjectId,
            siteId: Number(finalProjectId),

            projectName: project?.projectName,
            address: project?.address,
            systemSizeKWp: project?.systemSizeKWp,
            pvModuleEA: project?.pvModuleEA,
            contactPhone: project?.contactPhone,
            contactEmail: project?.contactEmail,

            date,
            startTime,
            endTime,
            time: startTime, // สำหรับ step2 ใช้
            remark,
            contractor,
            projectType,
        }));

        localStorage.setItem("jobId", String(jobId));

        await saveDraftStep(jobId, 1);

        return jobId;
        
    }

    function formatEmails(emails?: string) {
        if (!emails) return "";
        return emails.split(/[;,]/).map((e) => e.trim()).filter(Boolean).join("; ");
    }
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Cleaning Job</h1>
                {!isReadOnly && (
                    <button
                        onClick={async () => {
                            try {
                                await handleSaveStep1();
                                alert("บันทึกเรียบร้อยแล้ว");
                                navigate("/cleaning");
                            } catch (err: any) {
                                alert(err.message);
                            }
                        }}
                        className="flex items-center w-35 h-10 justify-between px-5 py-3 text-[12px]
    text-green-700 bg-white border-2 border-green-700 rounded-md hover:bg-green-50"
                    >
                        <img src={SaveDraftIcon} alt="" />
                        Save Draft
                    </button>
                )}
            </div>

            {/* Form */}
            <div className="flex flex-col min-h-[822px] px-28 py-5 gap-y-[58px] bg-white rounded-2xl items-center justify-between">

                <ProgressBar steps={steps} currentStep={currentStep} />

                <div className="grid grid-cols-2 w-273.75 gap-y-[27px]">

                    <div className={FIELD_WIDTH}>
                        {isEditMode ? (
                            <InputField label="Project Name" value={project?.projectName ?? ""} disabled />
                        ) : (
                            <SelectFilter
                                label="Project Name"
                                value={projectId}
                                disabled={isReadOnly}
                                onChange={(val: string) => {
                                    setProjectId(val);

                                    const found = projects.find(
                                        (p) => String(p.siteId) === val
                                    );

                                    setProject(found || null);
                                }}
                                options={projects.map(p => ({
                                    label: p.projectName,
                                    value: String(p.siteId),
                                }))}
                            />
                        )}
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField label="Location" value={project?.address ?? ""} disabled />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField label="System Size (kWp)" value={project?.systemSizeKWp?.toString() ?? ""} disabled />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField label="PV Module (ea.)" value={project?.pvModuleEA?.toString() ?? ""} disabled />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField label="Contact Phone Number" value={formatPhones(project?.contactPhone ?? "")} disabled />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField label="Contact Email" value={formatEmails(project?.contactEmail ?? "")} disabled />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="Date*" type="date" value={date} onChange={setDate} disabled={isReadOnly} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="Start Time*" type="time" value={startTime} onChange={setStartTime} disabled={isReadOnly} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="End Time*" type="time" value={endTime} onChange={setEndTime} disabled={isReadOnly} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <SelectFilter label="รับเหมา" value={contractor} onChange={setContractor} disabled={isReadOnly} options={[
                            { label: "TK Clean", value: "TK Clean" },
                            { label: "A Plus", value: "A Plus" },
                        ]} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <SelectFilter label="Project Type" value={projectType} onChange={setProjectType} disabled={isReadOnly} options={[
                            { label: "EPC", value: "EPC" },
                            { label: "PPA", value: "PPA" },
                        ]} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="หมายเหตุ" value={remark} onChange={setRemark} disabled={isReadOnly} />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex w-full max-w-273.75 justify-between mt-6">

                    <button
                        onClick={() => {
                            localStorage.removeItem("jobId");
                            localStorage.removeItem("cleaning_step1");
                            navigate("/cleaning");
                        }}
                        className="w-[195px] border-2 border-green-600 text-green-600 px-6 py-2.5 rounded-2xl"
                    >
                        ยกเลิก
                    </button>

                    {isReadOnly ? (
                        <button
                            onClick={() => navigate("/cleaning/new/step2")}
                            className="w-auto bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                        >
                            ดูรายละเอียดอีเมลแจ้งแผน
                        </button>
                    ) : (
                        <button
                            onClick={async () => {
                                try {
                                    if (!date || !startTime || !endTime) {
                                        alert("กรุณากรอก Date และ Time");
                                        return;
                                    }

                                    if (startTime >= endTime) {
                                        alert("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
                                        return;
                                    }

                                    await handleSaveStep1();
                                    navigate("/cleaning/new/step2");

                                } catch (err: any) {
                                    alert(err.message);
                                }
                            }}
                            className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl"
                        >
                            ถัดไป
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}