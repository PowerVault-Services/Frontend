import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createThailandProject,
    createServiceEntry
} from "../../services/client-data.api";

type JobType = "SERVICE" | "CLEANING" | "INSPECTION" | "OM";

export default function NewClientService() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [jobType, setJobType] = useState<JobType | "">("");

    const [form, setForm] = useState({
        projectNo: "",
        projectName: "",
        address: "",
        systemSizeKWp: "",
        contactEmail: "",
        contactPhone: "",
        description: ""
    });

    useEffect(() => {
        const type = localStorage.getItem("jobType");
        if (type) {
            setJobType(type.toUpperCase() as JobType);
        }

        const savedPlantName = localStorage.getItem("newPlantName");
        if (savedPlantName) {
            setForm(prev => ({ ...prev, projectName: savedPlantName }));
        }
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const formatType = (type: string) => {
        switch (type) {
            case "SERVICE":    return "Service";
            case "CLEANING":   return "Cleaning";
            case "INSPECTION": return "Inspection";
            case "OM":         return "O&M";
            default:           return "-";
        }
    };

    // ✅ แบบที่ 1: Pill สี — แยกสีตาม job type
    const jobBadgeClass = (job: string) => {
        switch (job) {
            case "SERVICE":
                return "bg-purple-100 text-purple-800";
            case "CLEANING":
                return "bg-green-100 text-green-800";
            case "INSPECTION":
                return "bg-blue-100 text-blue-800";
            case "OM":
                return "bg-amber-100 text-amber-800";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!form.projectNo || !form.projectName) {
            alert("กรุณากรอก Project No และ Project Name");
            return;
        }

        try {
            setIsLoading(true);

            const plantRes = await createThailandProject({
                projectNo: form.projectNo,
                projectName: form.projectName,
                capacityKwp: Number(form.systemSizeKWp || 0),
                status: "ACTIVE",
                address: form.address,
            });

            const siteId = plantRes.siteId;

            await createServiceEntry({
                siteId: siteId,
                job: (jobType || "SERVICE") as "SERVICE" | "CLEANING" | "INSPECTION" | "OM",
                description: form.description || "-"
            });

            alert("สร้างงานสำเร็จ!");
            navigate("/client-data/service");

        } catch (err: any) {
            if (err.message?.includes("exists")) {
                alert("Project No ซ้ำ (อาจมีโปรเจกต์อยู่แล้ว)");
            } else {
                console.error(err);
                alert(err.message || "เกิดข้อผิดพลาด");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">

            {/* HEADER */}
            <div className="pb-9">
                <h1 className="text-green-800">
                    New Client Service ({formatType(jobType)})
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-9 space-y-6">

                {/* JOB TYPE + PLANT NAME */}
                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                    <div>
                        <p className="text-sm text-gray-400 mb-1">Plant Name</p>
                        <h2 className="text-3xl font-semibold text-gray-800">
                            {form.projectName || "-"}
                        </h2>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-400 mb-2">Job Type</p>
                        {/* ✅ Pill badge แบบที่ 1 */}
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${jobBadgeClass(jobType)}`}>
                            {formatType(jobType)}
                        </span>
                    </div>
                </div>

                {/* PROJECT INFO GRID */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-5">

                    <FormInput
                        label="Project No."
                        name="projectNo"
                        value={form.projectNo}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="Project Name"
                        name="projectName"
                        value={form.projectName}
                        onChange={handleChange}
                        required
                    />
                    <FormInput
                        label="System Size (kWp)"
                        name="systemSizeKWp"
                        value={form.systemSizeKWp}
                        onChange={handleChange}
                        type="number"
                    />
                    <FormInput
                        label="Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Email"
                        name="contactEmail"
                        value={form.contactEmail}
                        onChange={handleChange}
                    />
                    <FormInput
                        label="Phone"
                        name="contactPhone"
                        value={form.contactPhone}
                        onChange={handleChange}
                    />

                    {/* Description — full width */}
                    <div className="col-span-2 space-y-1">
                        <label className="text-xs text-gray-500">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                                       focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            rows={3}
                        />
                    </div>

                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 border border-green-600 text-green-600 rounded-xl text-sm
                                   hover:bg-green-50 transition-colors"
                    >
                        ยกเลิก
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm
                                   hover:bg-green-800 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "กำลังสร้าง..." : "Create"}
                    </button>
                </div>

            </form>
        </div>
    );
}

/* ----------------- COMPONENT ----------------- */

function FormInput({ label, name, value, onChange, type = "text", required = false }: any) {
    return (
        <div className="space-y-1">
            <label className="text-xs text-gray-500">{label}</label>
            <input
                required={required}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700
                           focus:outline-none focus:ring-2 focus:ring-green-500"
            />
        </div>
    );
}