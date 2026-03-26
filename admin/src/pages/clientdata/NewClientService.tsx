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
            // แปลงเป็นตัวพิมพ์ใหญ่และยืนยัน Type (Casting)
            setJobType(type.toUpperCase() as JobType);
        }
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const formatType = (type: string) => {
        switch (type) {
            case "SERVICE": return "Service";
            case "CLEANING": return "Cleaning";
            case "INSPECTION": return "Inspection";
            case "OM": return "O&M";
            default: return "-";
        }
    };

    const jobBadgeClass = (job: string) => {
        switch (job) {
            case "SERVICE":
                return "bg-sky-100 text-sky-700";
            case "CLEANING":
                return "bg-purple-100 text-purple-700";
            case "INSPECTION":
                return "bg-pink-100 text-pink-700";
            case "OM":
                return "bg-orange-100 text-orange-700";
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

            // 🔥 1. สร้าง Project (เช็คฟิลด์ให้ตรงกับ CreateThailandProjectPayload)
            const plantRes = await createThailandProject({
                projectNo: form.projectNo,
                projectName: form.projectName,
                capacityKwp: Number(form.systemSizeKWp || 0), // ใช้ capacityKwp ตาม interface ในไฟล์
                status: "ACTIVE",
                address: form.address,
                // ฟิลด์อื่นๆ ถ้ามีใน interface...
            });

            // plantRes จะคืนค่า ThailandProject ซึ่งมี siteId
            const siteId = plantRes.siteId;

            // 🔥 2. สร้าง Service Entry
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

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-9 space-y-8">

                {/* JOB TYPE */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500">Plant Name</p>
                        <h2 className="text-xl font-semibold">
                            {form.projectName || "-"}
                        </h2>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Job Type</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${jobBadgeClass(jobType)}`}>
                            {formatType(jobType)}
                        </span>
                    </div>
                </div>

                {/* PROJECT INFO */}
                <div className="grid grid-cols-2 gap-6">

                    <FormInput label="Project No." name="projectNo" value={form.projectNo} onChange={handleChange} required />
                    <FormInput label="Project Name" name="projectName" value={form.projectName} onChange={handleChange} required />

                    <FormInput label="System Size (kWp)" name="systemSizeKWp" value={form.systemSizeKWp} onChange={handleChange} type="number" />
                    <FormInput label="Address" name="address" value={form.address} onChange={handleChange} />

                    <FormInput label="Email" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
                    <FormInput label="Phone" name="contactPhone" value={form.contactPhone} onChange={handleChange} />

                    <div className="col-span-2">
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                            rows={3}
                        />
                    </div>

                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 border border-green-600 text-green-600 rounded-xl"
                    >
                        ยกเลิก
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-green-700 text-white rounded-xl"
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
        <div className="space-y-2">
            <label className="text-sm text-gray-600">{label}</label>
            <input
                required={required}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                className="w-full border rounded-lg px-3 py-2"
            />
        </div>
    );
}