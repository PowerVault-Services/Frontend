import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import SelectFilter from "../../components/SelectFilter";
import InputField from "../../components/InputField";
import TextInputFilter from "../../components/TextInputFilter";

import { saveDraftStep } from "../../services/draft.api";
import { createServiceStep1, updateServiceStep1 } from "../../services/service.api";
import { getServiceProjects } from "../../services/service.api";

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
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [remark, setRemark] = useState("");
    const [remarklocation, setRemarkLocation] = useState("");
    const [problem, setProblem] = useState("");
    const [projectType, setProjectType] = useState("");

    const [contractor, setContractor] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    const location = useLocation();
    const navData = location.state as any;

    const savedData = JSON.parse(localStorage.getItem("service_step1") || "{}");
    const isReadOnly = savedData.status === "COMPLETED";


    useEffect(() => {
        // ✅ ถ้ามาจาก Alarm page (มี navData) ให้ล้างค่าเก่าก่อนเสมอ
        if (navData?.projectName) {
            localStorage.removeItem("service_step1");
            localStorage.removeItem("jobId");

            setProjectId("");
            setProject(null);
            setDate("");
            setStartTime("");
            setEndTime("");
            setProblem(navData.problem || "");
            setRemark("");
            setRemarkLocation("");
            setContractor("");
            setProjectType("");
            setIsEditMode(false);
            return; // หยุด ไม่ต้อง load localStorage
        }

        // โหลดจาก localStorage เฉพาะกรณีที่ไม่มี navData
        const savedData = localStorage.getItem("service_step1");
        if (!savedData) return;

        const parsed = JSON.parse(savedData);

        const idFromStorage = parsed.projectId || parsed.siteId;

        // ✅ set projectId
        if (idFromStorage && !isNaN(Number(idFromStorage))) {
            setProjectId(String(idFromStorage));
        }

        // ✅ set form
        setDate(parsed.date || "");
        setStartTime(parsed.startTime?.slice(0, 5) || "");
        setEndTime(parsed.endTime?.slice(0, 5) || "");

        setProblem(parsed.problem || "");
        setRemark(parsed.remark || "");

        setRemarkLocation(parsed.remarklocation || "");
        setContractor(parsed.contractor || "");
        setProjectType(parsed.projectType || "");

        // ✅ edit mode
        if (parsed.jobId) {
            localStorage.setItem("jobId", String(parsed.jobId));
            setIsEditMode(true);
        }

        // ✅ set project object (สำคัญมาก)
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

        if (idFromStorage) {
            setProjectId(String(idFromStorage));
        }

    }, []);

    useEffect(() => {
        if (!projectId && project?.projectName && projects.length > 0) {

            const found = projects.find(
                (p) => p.projectName === project.projectName
            );

            if (found) {
                setProjectId(String(found.siteId));
                setProject(found);
            }
        }
    }, [projects, project, projectId]);

    // =========================
    // select project
    // =========================
    useEffect(() => {

        if (!projectId || projects.length === 0) return;

        const selected = projects.find(
            (p) => p.siteId === Number(projectId)
        );

        if (selected) {
            setProject(selected);
        }

    }, [projectId, projects]);

    useEffect(() => {
        const fetchProjects = async () => {
            const res = await getServiceProjects();
            if (!res.success) return;

            setProjects(res.data || []);
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        // ✅ ถ้ามาจาก navData ให้ match project จาก projects list เท่านั้น ไม่ต้อง load localStorage
        if (navData?.projectName && projects.length > 0) {
            const found = projects.find(
                (p) => p.projectName === navData.projectName
            );

            if (found) {
                setProjectId(String(found.siteId));
                setProject(found);
            }
            return; // หยุด ไม่ต้อง load localStorage
        }

        const savedData = localStorage.getItem("service_step1");
        if (!savedData) return;

        const parsed = JSON.parse(savedData);

        if (parsed.projectId) {
            setProjectId(String(parsed.projectId));
        }

    }, [navData, projects]);

    // =========================
    // Create Service Job
    // =========================
    async function handleSaveStep1() {

        const finalProjectId =
            projectId || (project?.siteId ? String(project.siteId) : "");

        if (!finalProjectId) throw new Error("กรุณาเลือก Project");

        if (!date || !startTime || !endTime) {
            throw new Error("กรุณากรอก Date/Time");
        }

        if (startTime >= endTime) {
            throw new Error("เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด");
        }

        if (!contractor) {
            throw new Error("กรุณากรอกผู้รับเหมา");
        }

        const currentJobId = localStorage.getItem("jobId");

        const payload = {
            siteId: Number(finalProjectId),
            workDate: date,
            startTime: startTime.length === 5 ? startTime + ":00" : startTime,
            endTime: endTime.length === 5 ? endTime + ":00" : endTime,
            contractor,
            problem: problem || "-",
            note: remark || "-",
        };

        console.log("🔥 SERVICE STEP1:", payload);

        let res;

        if (currentJobId) {
            // ✅ EDIT MODE
            res = await updateServiceStep1(Number(currentJobId), payload);
        } else {
            // ✅ CREATE
            res = await createServiceStep1(payload);
        }

        const jobId = res.data?.jobId || res.jobId;

        if (!jobId) throw new Error("ไม่พบ jobId");

        // ✅ save local (เหมือน cleaning)
        localStorage.setItem("service_step1", JSON.stringify({
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
            time: startTime,
            problem,
            remarklocation,
            remark,
            contractor,
            projectType,
            status: "COMPLETED",
        }));

        localStorage.setItem("jobId", String(jobId));

        await saveDraftStep(jobId, 1);

        return jobId;
    }

    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">

                <h1 className="text-green-800">
                    New Service Job
                </h1>

                <button
                    onClick={async () => {
                        try {
                            await handleSaveStep1();
                            alert("บันทึกเรียบร้อยแล้ว");
                            navigate("/service");
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
            <div className="flex flex-col h-auto px-28 py-5 gap-y-[58px]
            bg-white rounded-2xl justify-between items-center">

                <ProgressBar
                    steps={steps}
                    currentStep={currentStep}
                />

                {/* Form Fields */}
                <div className="grid grid-cols-2 w-[1095px] justify-center gap-y-[27px]">

                    {/* Project */}
                    <div className={FIELD_WIDTH}>
                        {isEditMode ? (
                            <InputField label="Project Name" value={project?.projectName ?? ""} disabled />
                        ) : (
                            <SelectFilter
                                label="Project Name"
                                value={projectId}
                                onChange={setProjectId}
                                options={projects.map(p => ({
                                    label: p.projectName,
                                    value: String(p.siteId),
                                }))}
                            />
                        )}
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

                    {/* Project Type */}
                    <div className={FIELD_WIDTH}>
                        <SelectFilter key={projectType} label="Project Type" value={projectType} onChange={setProjectType} options={[
                            { label: "EPC", value: "EPC" },
                            { label: "PPA", value: "PPA" },
                        ]} />
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
                        <TextInputFilter label="Start Time*" type="time" key={startTime} value={startTime} onChange={setStartTime} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter label="End Time*" type="time" key={endTime} value={endTime} onChange={setEndTime} />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <SelectFilter label="รับเหมา" value={contractor} onChange={setContractor} options={[
                            { label: "TK Clean", value: "TK Clean" },
                            { label: "A Plus", value: "A Plus" },
                        ]} />
                    </div>

                    {/* Location Remark */}
                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="บริเวณที่เข้าทำงาน"
                            placeholder="Text"
                            key={remarklocation}
                            value={remarklocation}
                            onChange={setRemarkLocation}
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

                    {isReadOnly ? (
                        <button
                            onClick={() => navigate("/service/new/step2")}
                            className="min-w-[195px] w-auto bg-green-700 text-white px-6 py-2.5 rounded-2xl"
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
                                    navigate("/service/new/step2");

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