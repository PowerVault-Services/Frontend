import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Calendar,
    ChevronDown,
    MoreHorizontal,
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

    const [chartData, setChartData] = useState<any[]>([]);
    const [metric, setMetric] = useState("current");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [data, setData] = useState<any>(null);
    const [stringSnapshot, setStringSnapshot] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [alarms, setAlarms] = useState<any[]>([]);

    const formatDateTime = (date: string) => {
        const d = new Date(date);

        return {
            date: d.toLocaleDateString(),
            time: d.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };


    /* ================= Fetch APIs ================= */

    useEffect(() => {
        if (!inverterId) return;

        const fetchDetailAndStrings = async () => {
            try {
                const [detailRes, stringRes] = await Promise.all([
                    api.get(`/monitoring/inverters/${inverterId}`),
                    api.get(`/monitoring/inverters/${inverterId}/strings/latest`)
                ]);

                setData(detailRes.data.data);
                setStringSnapshot(stringRes.data.data);

            } catch (error) {
                console.error("Error fetching inverter detail:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAlarms = async () => {
            try {
                const res = await api.get("/alarms", {
                    params: {
                        tab: "history",
                        inverterId: Number(inverterId),
                        page: 1,
                        pageSize: 10
                    }
                });

                setAlarms(res.data?.data?.list ?? []);

            } catch (error) {
                console.error("Error fetching alarms:", error);
            }
        };

        fetchDetailAndStrings();
        fetchAlarms();

    }, [inverterId]);



    {
        alarms.map((alarm, idx) => {
            const { date, time } = formatDateTime(alarm.occurredAt);

            return (
                <div
                    key={alarm.id ?? idx}
                    className="border-b border-gray-100 pb-2 last:border-0"
                >
                    <div className="flex justify-between items-start">
                        <span className="font-bold text-[#2F4F39] text-sm">
                            {alarm.alarmName}
                        </span>
                        <MoreHorizontal
                            size={16}
                            className="text-blue-500 cursor-pointer"
                        />
                    </div>

                    <div className="text-xs text-black mt-1">
                        Date: {date} &nbsp; Time: {time}
                    </div>
                </div>
            );
        })
    }

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
                            stringNo: 1
                        }
                    }
                );

                const raw = res.data?.data?.seriesByString ?? [];

                let formatted: any[] = [];

                if (raw.length > 0) {
                    const points = raw[0].points ?? [];

                    formatted = points.map((item: any) => ({
                        time: new Date(item.t).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        }),
                        value: item[metric] ?? 0
                    }));
                }

                setChartData(formatted);

            } catch (err) {
                console.error("History error:", err);
            }
        };
        fetchHistory();

    }, [inverterId, selectedDate, metric]);



    if (loading) return <div className="p-6">Loading...</div>;
    if (!data) return <div className="p-6">Inverter not found</div>;

    /* ================= Build String Table Data ================= */

    const stringData = Array.from({ length: 20 }, (_, i) => {
        const apiString = stringSnapshot?.strings?.find(
            (s: any) => s.stringNo === i + 1
        );

        return {
            id: `PV${i + 1}`,
            status: apiString
                ? apiString.status.toLowerCase()
                : "disconnected",
            voltage: apiString?.voltage ?? "-",
            current: apiString?.current ?? "-",
        };
    });

    const renderStatusDot = (status: string) => {
        switch (status) {
            case "normal":
                return (
                    <div className="w-4 h-4 rounded-full border-2 border-[#4CAF50] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                    </div>
                );
            case "lost":
                return (
                    <div className="w-4 h-4 rounded-full border-2 border-[#F44336] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#F44336]" />
                    </div>
                );
            case "disconnected":
            default:
                return <div className="w-4 h-4 rounded-full bg-gray-300" />;
        }
    };

    // const metricLabelMap: Record<string, string> = {
    //     activePower: "Active Power",
    //     dayEnergy: "Day Energy",
    //     temperature: "Temperature",
    //     powerFactor: "Power Factor",
    // };

    const metricLabelMap: Record<string, string> = {
        current: "Current (A)",
        voltage: "Voltage (V)",
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

                <h1 className="text-green-800 font-bold mt-6">
                    {data.name}
                </h1>
            </div>

            <div className="bg-white p-6">

                {/* ===== Real-Time Device Data Table ===== */}
                <div className="flex justify-between items-center">
                    <h5 className="text-green-700">
                        Real-Time Device Data
                    </h5>
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


                <div className="overflow-x-auto border border-[#DEE2E6] rounded-t-sm mb-2">
                    <table className="w-full min-w-[1200px] text-center text-sm border-collapse">
                        <thead>
                            <tr className="bg-green-800 text-white font-normal">
                                <th className="p-2 border-r border-white/20 text-left pl-4 w-32 font-normal">
                                    String
                                </th>
                                {stringData.map((pv) => (
                                    <th key={pv.id} className="p-2 border-r border-white/20 min-w-[50px] font-normal">
                                        {pv.id}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="border-b border-gray-200 font-normal">
                                <td className="p-2 text-left pl-4 border-r border-gray-200">
                                    Status
                                </td>
                                {stringData.map((pv, idx) => (
                                    <td key={idx} className="p-2 border-r border-gray-200">
                                        <div className="flex justify-center">
                                            {renderStatusDot(pv.status)}
                                        </div>
                                    </td>
                                ))}
                            </tr>

                            <tr className="border-b border-gray-200 font-normal">
                                <td className="p-2 text-left pl-4 border-r border-gray-200">
                                    Input Voltage (V)
                                </td>
                                {stringData.map((pv, idx) => (
                                    <td key={idx} className="p-2 text-xs border-r border-gray-200">
                                        {pv.voltage}
                                    </td>
                                ))}
                            </tr>

                            <tr className="border-b border-gray-200">
                                <td className="p-2 text-left pl-4 border-r border-gray-200">
                                    Input Current (A)
                                </td>
                                {stringData.map((pv, idx) => (
                                    <td key={idx} className="p-2 text-xs border-r border-gray-200">
                                        {pv.current}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* ===== Real-Time Summary ===== */}
                <div className="grid grid-cols-2 lg:grid-cols-6 border border-[#DEE2E6] mb-6 text-sm">
                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Inverter Status
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        {data.realtime.status}
                    </div>

                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Daily Energy
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        {data.realtime.dayEnergy} kWh
                    </div>

                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Total yield
                    </div>
                    <div className="p-3 bg-white flex items-center">
                        {data.realtime.totalYield} kW
                    </div>
                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Active Power
                    </div>
                    <div className="p-3 bg-white flex items-center">
                        {data.realtime.activePower} kW
                    </div>

                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Output reactive power
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        {data.realtime.outputReactivePower} kvar
                    </div>

                    <div className="bg-green-800 text-white p-3 flex items-center font-normal">
                        Inverter rated power
                    </div>
                    <div className="p-3 bg-white flex items-center">
                        {data.realtime.inverterRatedPower} kW
                    </div>
                </div>

                {/* ===== Section 3: Basic Information ===== */}
                <h5 className="text-green-700 mb-1">Basic Information</h5>
                <div className="grid grid-cols-2 lg:grid-cols-6 border border-[#DEE2E6] mb-1 text-sm font-normal">

                    {/* 1. Device name */}
                    <div className="bg-green-800 text-white p-3 flex items-center">
                        Device name
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        {data?.name ?? "--"}
                    </div>

                    {/* 2. Device type */}
                    <div className="bg-green-800 text-white p-3 flex items-center">
                        Device type
                    </div>
                    <div className="p-3 bg-white border-r border-gray-200 flex items-center">
                        Inverter
                    </div>

                    {/* 3. SN */}
                    <div className="bg-green-800 text-white p-3 flex items-center">
                        SN
                    </div>
                    <div className="p-3 bg-white flex items-center">
                        {data?.serialNumber ?? "--"}
                    </div>

                    {/* 4. Device replacement record */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center">
                        Device replacement record
                    </div>
                    <div className="p-3 bg-white border-r border-t border-gray-200 flex items-center">
                        --
                    </div>

                    {/* 5. Model */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center">
                        Model
                    </div>
                    <div className="p-3 bg-white border-r border-t border-gray-200 flex items-center">
                        {data?.model ?? "--"}
                    </div>

                    {/* 6. Software version */}
                    <div className="bg-green-800 text-white p-3 border-t border-white/20 flex items-center">
                        Software version
                    </div>
                    <div className="p-3 bg-white border-t border-gray-200 flex items-center">
                        --
                    </div>

                </div>

                {/* ===== Section 4: Bottom Split (Alarm & Chart) ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">

                    {/* ================= Left: Alarm List ================= */}
                    <div className="border border-green-800 rounded-sm p-4 h-full">
                        <h5 className="font-bold text-green-700 mb-2.5">Alarm</h5>

                        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2">
                            {alarms.length === 0 && (
                                <div className="text-sm text-gray-500">
                                    No active alarms
                                </div>
                            )}

                            {alarms.map((alarm, idx) => (
                                <div
                                    key={alarm.id ?? idx}
                                    className="border-b border-gray-100 pb-2 last:border-0"
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-blue-700 text-sm">
                                            {alarm.alarmName}
                                        </span>
                                        {/* <MoreHorizontal
                                            size={16}
                                            className="text-blue-500 cursor-pointer"
                                        /> */}
                                    </div>

                                    <div className="text-xs text-black mt-1">
                                        Date:{" "}
                                        {new Date(alarm.occurredAt).toLocaleDateString()}
                                        &nbsp; Time:{" "}
                                        {new Date(alarm.occurredAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= Right: Chart ================= */}
                    <div className="border border-green-800 rounded-sm p-4">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                            <h5 className="text-green-700 mb-2.5">
                                Historical Information
                            </h5>

                            <div className="flex gap-2">
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1.5 text-sm pr-8"
                                    />
                                </div>

                                <select
                                    value={metric}
                                    onChange={(e) => setMetric(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-1.5 text-sm min-w-[140px]"
                                >
                                    {Object.entries(metricLabelMap).map(([key, label]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </select>

                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2 text-xs text-[#2F4F39]">
                            <span className="text-lg font-bold">A</span>
                            <div className="w-8 h-0.5 bg-[#00C49F]"></div>
                            <span>Single String</span>
                        </div>

                        <div className="h-[300px] w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke="#E5E7EB"
                                    />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#333" }}
                                        interval={1}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 12, fill: "#333" }}
                                        domain={["auto", "auto"]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "8px",
                                            border: "none",
                                            boxShadow:
                                                "0 2px 10px rgba(0,0,0,0.1)",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#00C49F"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}