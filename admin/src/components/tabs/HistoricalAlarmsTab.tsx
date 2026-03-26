import { useEffect, useState } from "react";
import type { Alarm } from "../../services/alarm.api";
import SearchBox from "../SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import AlarmTable from "../table/AlarmTable";
import api from "../../services/api";

export default function HistoricalAlarmsTab() {
    // ===== 1. FILTER INPUT STATES =====
    const [plantNameInput, setPlantNameInput] = useState("");
    const [deviceType, setDeviceType] = useState("all");
    const [snInput, setSnInput] = useState("");
    const [alarmNameInput, setAlarmNameInput] = useState("");
    const [alarmIdInput, setAlarmIdInput] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // ===== 2. QUERY STATE =====
    const [filters, setFilters] = useState<any>({});

    // ===== 3. DATA STATES =====
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 20;

    // ===== 4. FETCH API & SMART FILTER =====
    const fetchAlarms = async () => {
        try {
            // เตรียม Params ตาม Spec API
            const apiParams = {
                tab: "historical",
                page,
                pageSize,
                q: filters.alarmName, // API ใช้ q สำหรับค้นหาชื่อ
                sn: filters.sn,
                from: filters.from,
                to: filters.to,
                // หมายเหตุ: ไม่ส่ง alarmId ไปที่ API เพราะจากที่เช็ค API คืนค่าว่าง (Backend มีปัญหา)
            };

            const cleanParams = Object.fromEntries(
                Object.entries(apiParams).filter(([_, v]) => v !== undefined && v !== "")
            );

            const res = await api.get("/alarms", { params: cleanParams });
            const data = res.data?.data;
            let list = data?.list ?? [];

            // ⭐ [FRONTEND FILTER FALLBACK] 
            // กรองซ้ำด้วยมือเพื่อให้ Search ทำงานได้ครบทุกช่องแม้ Backend จะไม่รองรับ

            // 1. กรอง Plant Name (เนื่องจาก API Spec ไม่มีฟิลด์นี้)
            if (filters.plantName) {
                list = list.filter((a: any) =>
                    a.plantName?.toLowerCase().includes(filters.plantName.toLowerCase())
                );
            }

            // 2. กรอง Alarm ID (แก้ปัญหา API คืนค่าว่างเมื่อส่ง alarmId)
            if (filters.alarmId) {
                list = list.filter((a: any) =>
                    String(a.alarmId).includes(filters.alarmId) ||
                    String(a.raw?.alarmId).includes(filters.alarmId)
                );
            }

            // 3. กรอง Device Type
            if (filters.deviceType && filters.deviceType !== "all") {
                list = list.filter((a: any) =>
                    a.deviceType?.toUpperCase() === filters.deviceType.toUpperCase()
                );
            }

            setAlarms(list);
            setTotalPages(data?.pagination?.totalPages ?? 1);
        } catch (err) {
            console.error("Fetch alarm error:", err);
        }
    };

    useEffect(() => {
        fetchAlarms();
    }, [page, filters]);

    // ===== 5. HANDLE SEARCH =====
    const handleSearch = () => {
        setPage(1);
        setFilters({
            plantName: plantNameInput.trim() || undefined,
            deviceType: deviceType !== "all" ? deviceType : undefined,
            sn: snInput.trim() || undefined,
            alarmName: alarmNameInput.trim() || undefined,
            alarmId: alarmIdInput.trim() || undefined, // เก็บค่าไว้กรองที่ Frontend
            from: startTime ? new Date(startTime).toISOString() : undefined,
            to: endTime ? new Date(endTime).toISOString() : undefined,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleReset = () => {
        setPlantNameInput("");
        setDeviceType("all");
        setSnInput("");
        setAlarmNameInput("");
        setAlarmIdInput("");
        setStartTime("");
        setEndTime("");
        setFilters({});
        setPage(1);
    };

    return (
        <div className="flex flex-col gap-[18px]">
            <SearchBox onSearch={handleSearch} onReset={handleReset}>
                <div className="grid grid-cols-3 gap-4">
                    <TextInputFilter
                        label="Plant Name"
                        value={plantNameInput}
                        onChange={setPlantNameInput}
                        onKeyDown={handleKeyDown}
                    />

                    <div className="flex flex-col gap-2">
                        <span className="text-[16px] font-normal text-green-800">Device Type</span>
                        <div className="h-[39px] flex items-center rounded-sm border border-green-200 bg-gray-50 px-4 text-gray-400 text-[14px]">
                            All (Automatic)
                        </div>
                    </div>

                    <TextInputFilter
                        label="SN"
                        value={snInput}
                        onChange={setSnInput}
                        onKeyDown={handleKeyDown}
                    />

                    <TextInputFilter
                        label="Alarm Name"
                        value={alarmNameInput}
                        onChange={setAlarmNameInput}
                        onKeyDown={handleKeyDown}
                    />

                    <TextInputFilter
                        label="Alarm ID"
                        value={alarmIdInput}
                        onChange={setAlarmIdInput}
                        onKeyDown={handleKeyDown}
                    />

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-4">
                            <div className="flex flex-col w-full">
                                <span className="text-[16px] font-normal text-green-800">Occurrence Time Start</span>
                                <input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="h-[39px] rounded-sm border border-green-200 bg-white px-4 text-[14px] text-green-500 font-normal outline-none focus:border-green-500"
                                />
                            </div>

                            <div className="flex flex-col w-full">
                                <span className="text-[16px] font-normal text-green-800">Occurrence Time End</span>
                                <input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="h-[39px] rounded-sm border border-green-200 bg-white px-4 text-[14px] text-green-500 font-normal outline-none focus:border-green-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SearchBox>

            <AlarmTable
                data={alarms}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onRefresh={fetchAlarms}
                showClearedAt
            />
        </div>
    );
}