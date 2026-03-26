import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import api from "../../services/api";

interface Plant {
    id: number;
    name: string;
    capacityKWp: number;
    address: string;
}

type RowData = {
    irradiation: string;
    production: string;
    pr: string;
};

export default function PRAddForecast() {
    const navigate = useNavigate();

    /* ---------------- STATES ---------------- */
    const [plants, setPlants] = useState<Plant[]>([]);
    const [loadingPlants, setLoadingPlants] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedPlants, setSelectedPlants] = useState<number[]>([]);
    const [startMonth, setStartMonth] = useState("2026-03");
    
    const [formData, setFormData] = useState<Record<string, RowData>>({});
    
    // ✅ เพิ่ม State สำหรับปุ่ม Submit
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ---------------- FETCH PLANTS ---------------- */
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                setLoadingPlants(true);
                const res = await api.get("/monitoring/sites");
                setPlants(res.data?.data || res.data || []);
            } catch (error) {
                console.error("Fetch plants error:", error);
            } finally {
                setLoadingPlants(false);
            }
        };

        fetchPlants();
    }, []);

    /* ---------------- FILTER PLANTS ---------------- */
    const filteredPlants = useMemo(() => {
        if (!searchQuery.trim()) return plants;
        return plants.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [plants, searchQuery]);

    /* ---------------- GENERATE MONTHS ---------------- */
    const months = useMemo(() => {
        const result: string[] = [];
        const start = new Date(startMonth);

        for (let i = 0; i < 12; i++) {
            const d = new Date(start);
            d.setMonth(start.getMonth() + i);
            result.push(
                d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
            );
        }
        return result;
    }, [startMonth]);

    /* ---------------- SELECT PLANT ---------------- */
    const togglePlant = (id: number) => {
        setSelectedPlants((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
        );
    };

    const toggleAllPlants = () => {
        if (selectedPlants.length === filteredPlants.length) {
            setSelectedPlants([]);
        } else {
            setSelectedPlants(filteredPlants.map(p => p.id));
        }
    };

    /* ---------------- GENERATE TABLE ROWS ---------------- */
    const tableRows = useMemo(() => {
        const rowsToRender: any[] = [];
        const sortedSelected = [...selectedPlants].sort((a, b) => a - b);

        sortedSelected.forEach((plantId) => {
            const plant = plants.find((p) => p.id === plantId);

            months.forEach((month) => {
                const key = `${plantId}-${month}`;
                const data = formData[key] || { irradiation: "", production: "", pr: "" };

                rowsToRender.push({
                    key,
                    plantId,
                    plantName: plant?.name,
                    month,
                    ...data,
                });
            });
        });

        return rowsToRender;
    }, [selectedPlants, plants, months, formData]);

    /* ---------------- UPDATE INPUT ---------------- */
    const updateValue = (key: string, field: "irradiation" | "production", value: string) => {
        setFormData((prev) => {
            const currentRow = prev[key] || { irradiation: "", production: "", pr: "" };
            const updatedRow = { ...currentRow, [field]: value };

            const irr = Number(updatedRow.irradiation);
            const prod = Number(updatedRow.production);

            if (irr && prod) {
                updatedRow.pr = (prod / irr).toFixed(2);
            } else {
                updatedRow.pr = "";
            }

            return { ...prev, [key]: updatedRow };
        });
    };

    /* ---------------- SUBMIT LOGIC ---------------- */
    // ✅ ฟังก์ชันจัดการตอนกดปุ่ม Submit
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // 1. กรองเฉพาะข้อมูลที่มีการกรอกตัวเลขจริงๆ
            const payloadToSubmit = tableRows.filter(
                (row) => row.irradiation !== "" || row.production !== ""
            );

            if (payloadToSubmit.length === 0) {
                alert("กรุณากรอกข้อมูล Forecast อย่างน้อย 1 ช่องก่อนบันทึก");
                setIsSubmitting(false);
                return;
            }

            // แสดงข้อมูลที่จะส่งไป Backend (ให้ลองเปิด Console ดูครับ)
            console.log("🚀 ข้อมูลที่จะส่งไป Backend:", payloadToSubmit);

            // 2. จำลองการยิง API (นำ API ยิงบันทึกของจริงมาใส่ตรงนี้ได้เลย)
            // await api.post("/monitoring/pr/forecast", { data: payloadToSubmit });
            
            // สมมติว่ายิง API ใช้เวลา 1 วินาที
            await new Promise((resolve) => setTimeout(resolve, 1000));

            alert("บันทึกข้อมูล Forecast สำเร็จ!");
            navigate(-1); // กลับไปหน้า %PR

        } catch (error) {
            console.error("Submit error:", error);
            alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full pb-20">
            {/* ===== Header ===== */}
            <div className="mb-9">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-green-800 hover:text-green-600 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to %PR page</span>
                </button>

                <h1 className="text-green-800 font-bold mt-6 text-2xl">
                    Create %PR Forecast
                </h1>
            </div>

            {/* Configuration Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plant Selection Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            Plant Selection
                        </h3>

                        <div className="relative w-64">
                            <input
                                className="w-full pl-3 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Search plants..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[240px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10 shadow-sm">
                                <tr className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <th className="px-4 py-3 w-12 text-center border-b border-slate-200 dark:border-slate-700">
                                        <input 
                                            type="checkbox" 
                                            checked={filteredPlants.length > 0 && selectedPlants.length === filteredPlants.length}
                                            onChange={toggleAllPlants}
                                            disabled={loadingPlants || filteredPlants.length === 0}
                                        />
                                    </th>
                                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                        Plant Name
                                    </th>
                                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                        Capacity (kWp)
                                    </th>
                                    <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                        Location
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {loadingPlants ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-6 text-slate-500 text-sm">
                                            Loading plants...
                                        </td>
                                    </tr>
                                ) : filteredPlants.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-6 text-slate-500 text-sm">
                                            No plants found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPlants.map((plant) => (
                                        <tr key={plant.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlants.includes(plant.id)}
                                                    onChange={() => togglePlant(plant.id)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                                {plant.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono">
                                                {plant.capacityKWp ?? "-"}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                                {plant.address || "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Forecast Period Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">
                            Forecast Period
                        </h3>

                        <div className="space-y-4">
                            <label className="block">
                                <span className="text-xs font-semibold text-slate-500 uppercase">
                                    Start Month
                                </span>
                                <input
                                    type="month"
                                    value={startMonth}
                                    onChange={(e) => setStartMonth(e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 italic">
                            Forecast will be generated for 12 months starting from {startMonth}
                        </p>
                    </div>
                </div>
            </div>

            {/* Forecast Table & Submit Button */}
            {tableRows.length > 0 && (
                <>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-8">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse table-fixed min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">
                                        <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700 w-48">
                                            Plant Name
                                        </th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700 w-32">
                                            Month
                                        </th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">
                                            Irradiation (kWh/m²)
                                        </th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">
                                            Production (kWh)
                                        </th>
                                        <th className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                            Performance Ratio (%)
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm font-mono divide-y divide-slate-200 dark:divide-slate-800">
                                    {tableRows.map((row, i) => {
                                        const showPlant = i === 0 || tableRows[i - 1].plantId !== row.plantId;

                                        return (
                                            <tr key={row.key} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                                <td className="px-4 py-3 font-semibold bg-slate-50/50 dark:bg-slate-800/30 border-r border-slate-200 dark:border-slate-700">
                                                    {showPlant ? row.plantName : ""}
                                                </td>
                                                <td className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                                    {row.month}
                                                </td>
                                                <td className="p-0 border-r border-slate-200 dark:border-slate-700">
                                                    <input
                                                        type="number"
                                                        value={row.irradiation}
                                                        onChange={(e) => updateValue(row.key, "irradiation", e.target.value)}
                                                        className="w-full h-full min-h-[44px] border-none bg-transparent py-3 px-4 outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="p-0 border-r border-slate-200 dark:border-slate-700">
                                                    <input
                                                        type="number"
                                                        value={row.production}
                                                        onChange={(e) => updateValue(row.key, "production", e.target.value)}
                                                        className="w-full h-full min-h-[44px] border-none bg-transparent py-3 px-4 outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                                                        placeholder="0.00"
                                                    />
                                                </td>
                                                <td className="px-4 py-3 font-bold text-green-600 dark:text-green-500">
                                                    {row.pr ? `${row.pr}%` : "-"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ✅ ส่วนของปุ่ม Submit ที่เพิ่มเข้ามาใหม่ */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`px-8 py-3 rounded-lg font-bold text-white transition-all shadow-sm flex items-center gap-2
                                ${isSubmitting 
                                    ? "bg-gray-400 cursor-not-allowed" 
                                    : "bg-green-600 hover:bg-green-700 hover:shadow-md active:scale-95"
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Saving...
                                </>
                            ) : (
                                "Save Forecast Data"
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}