import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function PRAddForcast() {

    const navigate = useNavigate();

    /* ---------------- MOCK PLANTS ---------------- */

    const plants = [
        { id: 1, name: "Desert Sky Solar", capacity: 150, location: "Arizona, USA" },
        { id: 2, name: "Ocean Breeze PV", capacity: 85.5, location: "California, USA" },
        { id: 3, name: "Mountain Peak Energy", capacity: 210, location: "Colorado, USA" },
        { id: 4, name: "JJJJJ", capacity: 150, location: "Arizona, USA" },
        { id: 5, name: "HHGSSGFSF", capacity: 85.5, location: "California, USA" },
        { id: 6, name: "IIOOIPPP", capacity: 210, location: "Colorado, USA" },
        
    ];

    /* ---------------- STATES ---------------- */

    const [selectedPlants, setSelectedPlants] = useState<number[]>([]);
    const [startMonth, setStartMonth] = useState("2026-03");
    const [rows, setRows] = useState<any[]>([]);

    /* ---------------- GENERATE MONTHS ---------------- */

    const generateMonths = (startMonth: string) => {

        const months: string[] = [];
        const start = new Date(startMonth);

        for (let i = 0; i < 12; i++) {

            const d = new Date(start);
            d.setMonth(start.getMonth() + i);

            months.push(
                d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
            );
        }

        return months;
    };

    /* ---------------- SELECT PLANT ---------------- */

    const togglePlant = (id: number) => {

        setSelectedPlants((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );

    };

    /* ---------------- GENERATE TABLE ROWS ---------------- */

    useEffect(() => {

        const months = generateMonths(startMonth);

        const newRows: any[] = [];

        selectedPlants.forEach((plantId) => {

            const plant = plants.find((p) => p.id === plantId);

            months.forEach((month) => {

                newRows.push({
                    plantId,
                    plantName: plant?.name,
                    month,
                    irradiation: "",
                    production: "",
                    pr: ""
                });

            });

        });

        setRows(newRows);

    }, [selectedPlants, startMonth]);

    /* ---------------- UPDATE INPUT ---------------- */

    const updateValue = (index: number, field: string, value: string) => {

        const newRows = [...rows];

        newRows[index][field] = value;

        const irr = Number(newRows[index].irradiation);
        const prod = Number(newRows[index].production);

        if (irr && prod) {
            newRows[index].pr = ((prod / irr)).toFixed(2);
        }

        setRows(newRows);

    };

    return (
        <>
            <div className="w-full">

                {/* ===== Header ===== */}
                <div className="mb-9">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-green-800"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to %PR page</span>
                    </button>

                    <h1 className="text-green-800 font-bold mt-6">
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
                                    className="w-full pl-3 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg"
                                    placeholder="Search plants..."
                                    type="text"
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto max-h-[240px]">

                            <table className="w-full text-left border-collapse">

                                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                                    <tr className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">

                                        <th className="px-4 py-3 w-12 text-center border-b">
                                            <input type="checkbox" />
                                        </th>

                                        <th className="px-4 py-3 border-b">
                                            Plant Name
                                        </th>

                                        <th className="px-4 py-3 border-b">
                                            Capacity (MW)
                                        </th>

                                        <th className="px-4 py-3 border-b">
                                            Location
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                                    {plants.map((plant) => (

                                        <tr key={plant.id} className="hover:bg-primary/5 transition-colors">

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
                                                {plant.capacity}
                                            </td>

                                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                                {plant.location}
                                            </td>

                                        </tr>

                                    ))}

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
                                        className="mt-1 block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
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

                {/* Forecast Table */}

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-8">

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse table-fixed min-w-[1000px]">

                            <thead>

                                <tr className="bg-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-left">

                                    <th className="px-4 py-3 border-r w-48">
                                        Plant Name
                                    </th>

                                    <th className="px-4 py-3 border-r w-32">
                                        Month
                                    </th>

                                    <th className="px-4 py-3 border-r">
                                        Irradiation (kWh/m²)
                                    </th>

                                    <th className="px-4 py-3 border-r">
                                        Production (kWh)
                                    </th>

                                    <th className="px-4 py-3">
                                        Performance Ratio (%)
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="text-sm font-mono">

                                {rows.map((row, i) => {

                                    const showPlant =
                                        i === 0 || rows[i - 1].plantId !== row.plantId;

                                    return (

                                        <tr key={i} className="group border-b border-slate-200">

                                            <td className="px-4 py-3 font-semibold bg-slate-50 border-r">
                                                {showPlant ? row.plantName : ""}
                                            </td>

                                            <td className="px-4 py-3 border-r">
                                                {row.month}
                                            </td>

                                            <td className="p-0 border-r">
                                                <input
                                                    value={row.irradiation}
                                                    onChange={(e) => updateValue(i, "irradiation", e.target.value)}
                                                    className="w-full h-full border-none bg-transparent py-3 px-4"
                                                />
                                            </td>

                                            <td className="p-0 border-r">
                                                <input
                                                    value={row.production}
                                                    onChange={(e) => updateValue(i, "production", e.target.value)}
                                                    className="w-full h-full border-none bg-transparent py-3 px-4"
                                                />
                                            </td>

                                            <td className="px-4 py-3 font-bold text-green-600">
                                                {row.pr ? `${row.pr}%` : "-"}
                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </>
    );
}