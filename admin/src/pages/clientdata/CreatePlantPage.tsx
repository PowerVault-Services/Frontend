import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { createClientPlant } from "../../services/client-data.api";

export default function CreatePlantPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        projectNo: "",
        projectName: "",
        company: "",
        epcPpa: "",
        type: "Solar Photovoltaic",
        address: "",
        province: "",
        latitude: "",
        longitude: "",
        freeOmYears: "",
        freeOmFreq: "",
        warrantyOutput: "",
        codDate: "",
        solarPanel: "",
        panelBrand: "",
        panelSizeW: "",
        salePerson: "",
        siteEngineer: "",
        installationContractor: "",
        workConditions: "",
        customerEmail: "",
        telephone: "",
        status: "ACTIVE",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {

            // 🔥 map form → backend payload
            const payload = {
                projectNo: formData.projectNo,
                projectName: formData.projectName,
                companyName: formData.company,
                ecpPpa: formData.epcPpa,
                type: formData.type,
                address: formData.address,
                locationProvince: formData.province,

                freeOmText: formData.freeOmYears && formData.freeOmFreq
                    ? `${formData.freeOmYears} Years / ${formData.freeOmFreq} Times`
                    : undefined,

                warrantyOutputPct: formData.warrantyOutput
                    ? Number(formData.warrantyOutput)
                    : undefined,

                codDate: formData.codDate || undefined,

                solarPanel: formData.solarPanel,
                panelBrand: formData.panelBrand,
                panelSizeW: formData.panelSizeW
                    ? Number(formData.panelSizeW)
                    : undefined,

                salePerson: formData.salePerson,
                siteEngineer: formData.siteEngineer,
                installationContractor: formData.installationContractor,
                workEntryConditions: formData.workConditions,

                contactEmail: formData.customerEmail,
                contactPhone: formData.telephone,
            };

            // 🔥 CALL API
            await createClientPlant(payload);

            alert("สร้างโปรเจคสำเร็จ!");
            navigate("/client-data");

        } catch (error: any) {

            console.error(error);

            if (error.message?.includes("already exists")) {
                alert("Project No ซ้ำ");
            } else {
                alert("เกิดข้อผิดพลาด");
            }

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-800">
                    <ArrowLeft size={20} />
                    <span>Back to Client Data</span>
                </button>
                <h1 className="text-green-800 font-bold mt-6">Create New Project Plant</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: General Information */}
                <section className="bg-white rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(13,30,37,0.04)] border border-slate-100">
                    <div className="bg-green-700 px-8 py-4 border-b border-green-100 flex items-center justify-between">
                        <h5 className="text-lg text-white flex items-center gap-2">
                            General Information
                        </h5>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput label="Project No." name="projectNo" value={formData.projectNo} onChange={handleChange} placeholder="e.g. PRJ-2024-001" required />
                        <div className="lg:col-span-2">
                            <FormInput label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Enter formal project title" required />
                        </div>
                        <FormInput label="Company" name="company" value={formData.company} onChange={handleChange} placeholder="Enter company name" />
                        <FormInput label="EPC / PPA" name="epcPpa" value={formData.epcPpa} onChange={handleChange} placeholder="Contract Reference" />
                        <FormSelect label="Type" name="type" value={formData.type} onChange={handleChange}>
                            <option value="Solar Photovoltaic">Solar Photovoltaic</option>
                            <option value="Wind Turbine Array">Wind Turbine Array</option>
                            <option value="BESS (Battery Storage)">BESS (Battery Storage)</option>
                        </FormSelect>
                        <div className="lg:col-span-2">
                            <FormInput label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Street name and plot number" />
                        </div>
                        <FormInput label="Location (Province)" name="province" value={formData.province} onChange={handleChange} placeholder="e.g. Bavaria, GE" />
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">Free O&M (Years / Times per year)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input name="freeOmYears" value={formData.freeOmYears} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Yrs" type="number" />
                                <input name="freeOmFreq" value={formData.freeOmFreq} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Freq" type="number" />
                            </div>
                        </div>
                        <FormInput label="Warranty Output (%)" name="warrantyOutput" value={formData.warrantyOutput} onChange={handleChange} placeholder="e.g. 98" type="number" />
                        <FormInput label="COD Date" name="codDate" value={formData.codDate} onChange={handleChange} type="date" />

                        {/* --- เพิ่มพิกัด GPS ตรงนี้ --- */}
                        <div className="space-y-2 lg:col-span-1">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">GPS Coordinates (Lat, Long)</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-700 outline-none transition-all"
                                    placeholder="Latitude"
                                    type="text"
                                />
                                <input
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-700 outline-none transition-all"
                                    placeholder="Longitude"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Technical Details & Team */}
                <section className="bg-white rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(13,30,37,0.04)] border border-slate-100">
                    <div className="bg-green-700 px-8 py-4 border-b border-green-100 flex items-center justify-between">
                        <h5 className=" text-white flex items-center gap-2">
                            Technical Details & Team
                        </h5>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormInput label="Solar Panel" name="solarPanel" value={formData.solarPanel} onChange={handleChange} placeholder="Model specification" />
                        <FormInput label="Panel Brand" name="panelBrand" value={formData.panelBrand} onChange={handleChange} placeholder="Manufacturer name" />
                        <FormInput label="Panel Size (W)" name="panelSizeW" value={formData.panelSizeW} onChange={handleChange} placeholder="Wattage" type="number" />
                        <FormInput label="Sale Person" name="salePerson" value={formData.salePerson} onChange={handleChange} placeholder="Full Name" />
                        <FormInput label="Site Engineer" name="siteEngineer" value={formData.siteEngineer} onChange={handleChange} placeholder="Lead technical contact" />
                        <FormInput label="Installation Contractor" name="installationContractor" value={formData.installationContractor} onChange={handleChange} placeholder="Registered Firm Name" />
                        <div className="md:col-span-2 lg:col-span-3 space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">Work Entry Conditions</label>
                            <textarea name="workConditions" value={formData.workConditions} onChange={handleChange} rows={3} className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Describe safety protocols..." />
                        </div>
                    </div>
                </section>

                {/* Section 3: Customer Contact */}
                <section className="bg-white rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(13,30,37,0.04)] border border-slate-100">
                    <div className="bg-green-700 px-8 py-4 border-b border-green-100 flex items-center justify-between">
                        <h5 className=" text-white flex items-center gap-2">
                            Customer Contact
                        </h5>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormInput label="Customer Contact Email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="client@example.com" type="email" />
                        <FormInput label="Telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                    </div>
                </section>

                {/* Actions */}
                <div className="flex justify-end items-center gap-6 pt-4 pb-6">
                    <button type="button" onClick={() => navigate(-1)} className="bg-white text-slate-500 font-bold text-sm hover:text-slate-700 border border-2 border-slate-500 px-10 py-3.5 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isLoading} className="bg-green-700 hover:bg-green-500 text-white px-10 py-3.5 rounded-lg font-bold transition-all active:scale-95 disabled:bg-slate-400">
                        {isLoading ? "Processing..." : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
    );
}

// --- Sub-components (ย้ายมาไว้ล่างสุดและเปลี่ยนชื่อให้ตรง) ---

function FormInput({ label, name, value, onChange, placeholder, type = "text", required = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">{label}</label>
            <input
                required={required}
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
            />
        </div>
    );
}

function FormSelect({ label, name, value, onChange, children }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
                {children}
            </select>
        </div>
    );
}