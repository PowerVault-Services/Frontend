import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveDraftIcon from "../../assets/icons/Diskette.svg";
import ProgressBar from "../../components/progress/ProgressBar";
import SelectFilter from "../../components/SelectFilter";
import InputField from "../../components/InputField";
import TextInputFilter from "../../components/TextInputFilter";
import { PROJECTS, type Project } from "../../mock/project";



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

    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<Project | null>(null);

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [remark, setRemark] = useState("");
    const [remarklocation, setRemarkLocation] = useState("");
    const [problem, setProblem] = useState("");
    const [projectType, setProjectType] = useState("");

    useEffect(() => {
        const selected = PROJECTS.find(p => p.id === projectId);
        setProject(selected ?? null);
    }, [projectId]);

    function saveStep1Data() {
        const payload = {
            projectName: project?.name ?? "",
            date,
            time,
            problem,
            remarklocation,
            remark,
        };
        localStorage.setItem("service_step1", JSON.stringify(payload));
    }


    return (
        <div className="w-full">

            {/* Header */}
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">New Service Job</h1>

                <button
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

                    <div className={FIELD_WIDTH}>
                        <SelectFilter
                            label="Project Name"
                            placeholder="Select Project"
                            value={projectId}
                            onChange={setProjectId}
                            options={PROJECTS.map(p => ({
                                label: p.name,
                                value: p.id,
                            }))}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Location"
                            value={project?.location ?? ""}
                            disabled
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="System Size (kWp)"
                            value={project?.systemSize ?? ""}
                            disabled
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Contact Phone Number"
                            value={project?.phone ?? ""}
                            disabled
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <InputField
                            label="Contact Email"
                            value={project?.email ?? ""}
                            disabled
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="ปัญหา / Alarmที่พบ"
                            placeholder="Text"
                            value={problem}
                            onChange={setProblem}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="Date"
                            type="date"
                            placeholder="Select Date"
                            value={date}
                            onChange={setDate}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="Time"
                            type="time"
                            placeholder="Select Time"
                            value={time}
                            onChange={setTime}
                        />
                    </div>

                    <div className={FIELD_WIDTH}>
                        <TextInputFilter
                            label="บริเวณที่เข้าทำงาน"
                            placeholder="Text"
                            value={remarklocation}
                            onChange={setRemarkLocation}
                        />
                    </div>

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
                        className="w-[195px] border border-green-600 text-green-600 px-6 py-2.5 rounded-2xl">
                        ยกเลิก
                    </button>

                    <button
                        onClick={() => {
                            saveStep1Data();
                            navigate("/service/new/step2");
                        }}
                        className="w-[195px] bg-green-700 text-white px-6 py-2.5 rounded-2xl">
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
    );
}
