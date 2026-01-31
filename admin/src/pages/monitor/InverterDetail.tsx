import { useNavigate } from "react-router-dom";

import { ArrowLeft, Calendar, ChevronDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";


// --- Mock Data (คงเดิม) ---
const stringData = Array.from({ length: 20 }, (_, i) => ({
    id: `PV${i + 1}`,
    status: i === 10 ? "lost" : i > 12 && i < 15 ? "disconnected" : "normal",
    voltage: 705.5,
    current: 1.4,
}));

const chartData = [
    { time: "00:00", value: 4 },
    { time: "02:00", value: 5 },
    { time: "04:00", value: 4 },
    { time: "06:00", value: 7.5 },
    { time: "07:00", value: 5 },
    { time: "08:00", value: 4.5 },
    { time: "09:00", value: 7.2 },
    { time: "10:00", value: 4.5 },
    { time: "11:00", value: 6.2 },
    { time: "12:00", value: 4.2 },
    { time: "14:00", value: 5.5 },
    { time: "16:00", value: 6.2 },
    { time: "17:00", value: 1.2 },
    { time: "18:00", value: 3.2 },
    { time: "19:00", value: 0.8 },
    { time: "22:00", value: 3 },
    { time: "24:00", value: 4 },
];

const alarms = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    name: "Name Alarm",
    date: "20/10/2025",
    time: "15:30",
}));

interface InverterDetailProps {
    inverterName?: string;
}


export default function InverterDetail({
    inverterName = "Inverter 1"}: InverterDetailProps) {

    const [selectedDate] = useState("18 Oct 2025");
    const navigate = useNavigate();

    const renderStatusDot = (status: string) => {
        switch (status) {
            case "normal":
                return (
                    <div className="w-4 h-4 rounded-full border-2 border-[#4CAF50] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#4CAF50]"></div>
                    </div>
                );
            case "lost":
                return (
                    <div className="w-4 h-4 rounded-full border-2 border-[#F44336] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#F44336]"></div>
                    </div>
                );
            case "disconnected":
                return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
            default:
                return <div className="w-4 h-4 rounded-full bg-gray-300"></div>;
        }
    };

    return (
        <div className="w-full">
            {/* ===== Header ===== */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-green-800"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Monitoring page</span>
                </button>

                {/* ตรงนี้จะแสดงชื่อตามที่ส่งเข้ามา (inverterName) */}
                <h1 className="text-green-800 font-bold mt-6">{inverterName}</h1>
            </div>

            <div className="bg-white p-6">

                {/* ===== Section 1: String Table ===== */}
                <div className="mb-1">
                    <div className="flex justify-between items-center mb-2">
                        <h5 className="text-green-700">Real-Time Device Data</h5>
                        <div className="flex gap-2 text-sm font-normal">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-[#4CAF50]"></span> Normal
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-[#F44336]"></span> Lost
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-gray-300"></span> Disconnected
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto border border-[#DEE2E6] rounded-t-sm">
                        <table className="w-full min-w-[1200px] text-center text-sm border-collapse ">
                            <thead>
                                <tr className="bg-green-800 text-white font-normal">
                                    <th className="p-2 border-r border-white/20 text-left pl-4 w-32 font-normal">String</th>
                                    {stringData.map((pv) => (
                                        <th key={pv.id} className="p-2 border-r border-white/20 min-w-[50px] font-normal">
                                            {pv.id}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 font-normal">
                                    <td className="p-2 text-left pl-4 border-r border-gray-200">Status</td>
                                    {stringData.map((pv, idx) => (
                                        <td key={idx} className="p-2 border-r border-gray-200 font-normal">
                                            <div className="flex justify-center">{renderStatusDot(pv.status)}</div>
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="p-2 text-left pl-4 border-r border-gray-200">Input Voltage (V)</td>
                                    {stringData.map((pv, idx) => (
                                        <td key={idx} className="p-2 border-r border-gray-200 text-xs">
                                            {pv.voltage}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-2 text-left pl-4 border-r border-gray-200">Input Current (A)</td>
                                    {stringData.map((pv, idx) => (
                                        <td key={idx} className="p-2 border-r border-gray-200 text-xs">
                                            {pv.current}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ===== Section 2: Info Grid 1 (Real-Time) ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-6 border border-[#DEE2E6] mb-1 text-sm font-normal">
                    {/* --- Row 1 --- */}
                    {/* 1. Inverter Status */}
                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Inverter Status
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        Grid Connect
                    </div>

                    {/* 2. Daily Energy */}
                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Daily Energy
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        360.39 kWh
                    </div>

                    {/* 3. Total yield */}
                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Total yield
                    </div>
                    <div className="p-3 bg-white flex items-center">
                        545,785.01 kWh
                    </div>

                    {/* --- Row 2 --- */}
                    {/* 4. Active Power */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center font-normal">
                        Active Power
                    </div>
                    <div className="p-3 bg-white border-r border-t border-gray-200 flex items-center font-normal">
                        68.979 kW
                    </div>

                    {/* 5. Output reactive power */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center font-normal">
                        Output reactive power
                    </div>
                    <div className="p-3 bg-white border-r border-t border-gray-200 flex items-center">
                        0.041 kvar
                    </div>

                    {/* 6. Inverter rated power */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center">
                        Inverter rated power
                    </div>
                    <div className="p-3 bg-white border-t border-gray-200 flex items-center">
                        100.000 kW
                    </div>
                </div>

                {/* ===== Section 3: Basic Information ===== */}
                <h5 className="text-green-700 mb-1">Basic Information</h5>
                <div className="grid grid-cols-2 lg:grid-cols-6 border border-[#DEE2E6] mb-1 text-sm font-normal">
                    {/* --- Row 1 --- */}
                    {/* 1. Device name */}
                    <div className="bg-green-800 text-white p-3 flex items-center">
                        Device name
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        Grid Connect
                    </div>

                    {/* 2. Device type */}
                    <div className="bg-green-800 text-white p-3 flex items-center">
                        Device type
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        360.39 kWh
                    </div>

                    {/* 3. SN */}
                    <div className="bg-green-800 text-white p-3 flex items-center">
                        SN
                    </div>
                    <div className="p-3 bg-white flex items-center">
                        545,785.01 kWh
                    </div>

                    {/* --- Row 2 --- */}
                    {/* 4. Device replacement record */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center">
                        Device replacement record
                    </div>
                    <div className="p-3 bg-white border-r border-t border-gray-200 flex items-center">
                        68.979 kW
                    </div>

                    {/* 5. Model */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center">
                        Model
                    </div>
                    <div className="p-3 bg-white border-r border-t border-gray-200 flex items-center">
                        0.041 kvar
                    </div>

                    {/* 6. Software version */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center">
                        Software version
                    </div>
                    <div className="p-3 bg-white border-t border-gray-200 flex items-center">
                        100.000 kW
                    </div>
                </div>

                {/* ===== Section 4: Bottom Split (Alarm & Chart) ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                    {/* Left: Alarm List */}
                    <div className="border border-green-800 rounded-sm p-4 h-full">
                        <h5 className="font-bold text-green-700 mb-2.5">Alarm</h5>
                        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                            {alarms.map((alarm, idx) => (
                                <div key={idx} className="border-b border-gray-100 pb-2 last:border-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-[#2F4F39] text-sm">{alarm.name}</span>
                                        <MoreHorizontal size={16} className="text-blue-500 cursor-pointer" />
                                    </div>
                                    <div className="text-xs text-black mt-1">
                                        Date: {alarm.date} &nbsp; Time: {alarm.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Chart */}
                    <div className="border border-green-800 rounded-sm p-4">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                            <h5 className="text-green-700 mb-2.5">Historical Information</h5>
                            <div className="flex gap-2">
                                <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-50">
                                    <span>{selectedDate}</span>
                                    <Calendar size={16} className="text-[#2F4F39]" />
                                </div>
                                <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[120px] justify-between cursor-pointer hover:bg-gray-50">
                                    <span>Signal point</span>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-xs text-[#2F4F39]">
                            <span className="text-lg font-bold">A</span>
                            <div className="w-8 h-0.5 bg-[#00C49F]"></div>
                            <span>Single String</span>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#333' }}
                                        interval={1}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: '#333' }}
                                        domain={[0, 8]}
                                        ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
                                    />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }} />
                                    <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}