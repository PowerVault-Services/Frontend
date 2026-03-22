import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function InverterDetail() {
    const navigate = useNavigate();
    const { inverterId } = useParams();

    // ----- Data States -----
    const [data, setData] = useState<any>(null);
    const [stringSnapshot, setStringSnapshot] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [alarms, setAlarms] = useState<any[]>([]);

    // ----- Graph States -----
    const [chartData, setChartData] = useState<any[]>([]);
    const [metric, setMetric] = useState("current");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [availableStrings, setAvailableStrings] = useState<number[]>([]);

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28", "#E91E63", "#3F51B5"];

    const metricLabelMap: Record<string, string> = {
        current: "Current (A)",
        voltage: "Voltage (V)",
    };

    // ================= 1. Fetch Initial Data =================
    useEffect(() => {
        if (!inverterId) return;

        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [detailRes, stringRes, alarmRes] = await Promise.all([
                    api.get(`/monitoring/inverters/${inverterId}`),
                    api.get(`/monitoring/inverters/${inverterId}/strings/latest`),
                    api.get("/alarms", {
                        params: { tab: "history", inverterId: Number(inverterId), page: 1, pageSize: 10 }
                    })
                ]);

                setData(detailRes.data.data);
                setStringSnapshot(stringRes.data.data);
                setAlarms(alarmRes.data?.data?.list ?? []);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [inverterId]);

    // ================= 2. Fetch History Graph (Multi-line) =================
    useEffect(() => {
        if (!inverterId) return;

        const fetchHistory = async () => {
            try {
                const res = await api.get(
                    `/monitoring/inverters/${inverterId}/strings/history`,
                    {
                        params: {
                            date: selectedDate,
                            tzOffsetMinutes: new Date().getTimezoneOffset(),
                            includeDisconnected: false
                        }
                    }
                );

                const seriesByString = res.data?.data?.seriesByString ?? [];
                const stringIds = seriesByString.map((s: any) => s.stringNo);
                setAvailableStrings(stringIds);

                const timeMap: Record<string, any> = {};
                seriesByString.forEach((series: any) => {
                    const sKey = `string${series.stringNo}`;
                    series.points.forEach((p: any) => {
                        const timeStr = new Date(p.t).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false
                        });
                        if (!timeMap[timeStr]) timeMap[timeStr] = { time: timeStr };
                        timeMap[timeStr][sKey] = p[metric] ?? 0;
                    });
                });

                const formatted = Object.values(timeMap).sort((a: any, b: any) =>
                    a.time.localeCompare(b.time)
                );
                setChartData(formatted);
            } catch (err) {
                console.error("History error:", err);
                setChartData([]);
            }
        };

        fetchHistory();
    }, [inverterId, selectedDate, metric]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!data) return <div className="p-6">Inverter not found</div>;

    // Helper for Status Dots
    const renderStatusDot = (status: string) => {
        const color = status === "normal" ? "#4CAF50" : status === "lost" ? "#F44336" : "#D1D5DB";
        return (
            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: color }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            </div>
        );
    };

    type StringData = {
        id: string;
        status: string;
        voltage: number | string;
        current: number | string;
    };

    const stringData: StringData[] =
        stringSnapshot?.strings?.map((s: any) => ({
            id: `PV${s.stringNo}`,
            status: s.status.toLowerCase(),
            voltage: s.voltage ?? "-",
            current: s.current ?? "-",
        })) || [];

    return (
        <div className="w-full">
            <div className="mb-6">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-800">
                    <ArrowLeft size={20} />
                    <span>Back to Monitoring page</span>
                </button>
                <h1 className="text-green-800 font-bold mt-6">{data.name}</h1>
            </div>

            <div className="bg-white p-6 w-full overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h5 className="text-green-700 font-bold">Real-Time Device Data</h5>
                </div>

                {/* ✅ FIXED TABLE */}
                <div className="w-full overflow-hidden border border-[#DEE2E6] rounded-t-sm mb-6">
                    <div className="overflow-x-auto max-w-[1550px]">
                        <table className="min-w-max text-center text-sm border-collapse">

                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="sticky left-0 z-20 bg-green-800 w-[150px] p-2 text-left pl-4">
                                        String
                                    </th>
                                    {stringData.map((pv) => (
                                        <th key={pv.id} className="w-[70px] p-2">
                                            {pv.id}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className="sticky left-0 bg-white z-10 w-[150px] p-2 text-left pl-4">
                                        Status
                                    </td>
                                    {stringData.map((pv, idx) => (
                                        <td key={idx} className="w-[70px]">
                                            <div className="flex justify-center">
                                                {renderStatusDot(pv.status)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr>
                                    <td className="sticky left-0 bg-white z-10 w-[150px] p-2 text-left pl-4">
                                        Input Voltage (V)
                                    </td>
                                    {stringData.map((pv, idx) => (
                                        <td key={idx} className="w-[70px]">
                                            {pv.voltage}
                                        </td>
                                    ))}
                                </tr>

                                <tr>
                                    <td className="sticky left-0 bg-white z-10 w-[150px] p-2 text-left pl-4">
                                        Input Current (A)
                                    </td>
                                    {stringData.map((pv, idx) => (
                                        <td key={idx} className="w-[70px]">
                                            {pv.current}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>

                {/* Section 2: Real-Time Summary (3 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#DEE2E6] mb-6 text-sm">
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Inverter Status</div>
                        <div className="w-1/2 p-3">{data.realtime.status || "Grid Connect"}</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Daily Energy</div>
                        <div className="w-1/2 p-3">{data.realtime.dayEnergy} kWh</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Total yield</div>
                        <div className="w-1/2 p-3">{data.realtime.totalYield} kWh</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Active Power</div>
                        <div className="w-1/2 p-3">{data.realtime.activePower} kW</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Output reactive power</div>
                        <div className="w-1/2 p-3">{data.realtime.outputReactivePower} kvar</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Inverter rated power</div>
                        <div className="w-1/2 p-3">{data.realtime.inverterRatedPower} kW</div>
                    </div>
                </div>

                {/* Section 3: Basic Information (3 Columns) */}
                <h5 className="text-green-700 font-bold mb-3">Basic Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#DEE2E6] mb-8 text-sm">
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Device name</div>
                        <div className="w-1/2 p-3">{data?.name || "--"}</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Device type</div>
                        <div className="w-1/2 p-3">Inverter</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">SN</div>
                        <div className="w-1/2 p-3">{data?.serialNumber || "--"}</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Device replacement record</div>
                        <div className="w-1/2 p-3">--</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Model</div>
                        <div className="w-1/2 p-3">{data?.model || "--"}</div>
                    </div>
                    <div className="flex border-r border-b border-[#DEE2E6]">
                        <div className="w-1/2 bg-green-800 text-white p-3">Software version</div>
                        <div className="w-1/2 p-3">{data?.softwareVersion || "--"}</div>
                    </div>
                </div>

                {/* Section 4: Alarms & Historical Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
                    <div className="border border-green-800 rounded-sm p-4 h-[450px] flex flex-col">
                        <h5 className="font-bold text-green-700 mb-4">Alarm</h5>
                        <div className="flex-1 overflow-y-auto pr-2">
                            {alarms.length === 0 ? <div className="text-sm text-gray-400">No active alarms</div> : alarms.map((alarm, idx) => (
                                <div key={alarm.id ?? idx} className="border-b border-gray-100 py-3 last:border-0">
                                    <div className="font-bold text-blue-700 text-sm">{alarm.alarmName}</div>
                                    <div className="text-[10px] text-black mt-1">{new Date(alarm.occurredAt).toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border border-green-800 rounded-sm p-4">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                            <h5 className="text-green-700">Historical Information</h5>
                            <div className="flex gap-2">
                                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm" />
                                <select value={metric} onChange={(e) => setMetric(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 text-sm">
                                    {Object.entries(metricLabelMap).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] text-gray-500">
                            {availableStrings.map((sNo, idx) => (
                                <div key={sNo} className="flex items-center gap-1">
                                    <div className="w-4 h-0.5" style={{ backgroundColor: colors[idx % colors.length] }}></div>
                                    <span>PV{sNo} input {metric}</span>
                                </div>
                            ))}
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} interval="preserveStartEnd" minTickGap={40} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 'auto']} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", fontSize: '11px' }} />
                                    {availableStrings.map((sNo, idx) => (
                                        <Line key={sNo} type="monotone" dataKey={`string${sNo}`} name={`PV${sNo}`} stroke={colors[idx % colors.length]} strokeWidth={1.5} dot={false} />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}