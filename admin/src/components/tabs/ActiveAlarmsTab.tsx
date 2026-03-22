import { useEffect, useState } from "react";
import type { Alarm } from "../../services/alarm.api";
import SearchBox from "../SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import AlarmTable from "../table/AlarmTable";
import api from "../../services/api";

export default function ActiveAlarmsTab() {
  // 1. เก็บค่าจาก Input ต่างๆ
  const [plantNameInput, setPlantNameInput] = useState("");
  const [snInput, setSnInput] = useState("");
  const [alarmNameInput, setAlarmNameInput] = useState("");
  const [alarmIdInput, setAlarmIdInput] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 2. เก็บค่าที่จะใช้ Filter (จะเปลี่ยนเมื่อกด Search)
  const [filters, setFilters] = useState<any>({});

  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  const fetchAlarms = async () => {
    try {
      // ✅ ส่งเฉพาะค่าที่ API Spec ระบุว่ารองรับ
      const apiParams = {
        tab: "active",
        page,
        pageSize,
        q: filters.alarmName, // API ใช้ q สำหรับค้นหาชื่อ
        alarmId: filters.alarmId, // ส่ง 2032 ไปที่นี่
        sn: filters.sn,
        from: filters.from,
        to: filters.to,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(([_, v]) => v !== undefined && v !== "")
      );

      const res = await api.get("/alarms", { params: cleanParams });
      const data = res.data?.data;
      let list = data?.list ?? [];

      // ⭐ [Frontend Fallback] ถ้าพิมพ์ Plant Name แต่ API ไม่รองรับ 
      // ให้เรากรองจาก List ที่ได้มาอีกทีหนึ่ง
      if (filters.plantName) {
        list = list.filter((item: any) =>
          item.plantName?.toLowerCase().includes(filters.plantName.toLowerCase())
        );
      }

      // ⭐ [Frontend Fallback] สำหรับ Alarm ID ในกรณีที่ API กรองไม่ติด
      if (filters.alarmId && list.length === 0 && !cleanParams.alarmId) {
          // ถ้า API ไม่ยอมกรองให้ เราลองกรองเองจากข้อมูลหน้าปัจจุบัน
          // (แต่กรณีนี้มักจะใช้ไม่ได้กับ pagination ดังนั้นต้องเช็ค Backend เป็นหลัก)
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

  const handleSearch = () => {
    setPage(1);
    setFilters({
      plantName: plantNameInput.trim(),
      alarmName: alarmNameInput.trim(),
      alarmId: alarmIdInput.trim(),
      sn: snInput.trim(),
      from: startTime ? new Date(startTime).toISOString() : undefined,
      to: endTime ? new Date(endTime).toISOString() : undefined,
    });
  };

  const handleReset = () => {
    setPlantNameInput("");
    setSnInput("");
    setAlarmNameInput("");
    setAlarmIdInput("");
    setStartTime("");
    setEndTime("");
    setFilters({});
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
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
                <span className="text-[16px] font-normal text-green-800">Start Time</span>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-[39px] rounded-sm border border-green-200 px-4 text-[14px]"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-[16px] font-normal text-green-800">End Time</span>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-[39px] rounded-sm border border-green-200 px-4 text-[14px]"
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
      />
    </div>
  );
}