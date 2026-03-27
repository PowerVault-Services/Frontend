import { useEffect, useState, useCallback } from "react";
import type { Alarm } from "../../services/alarm.api";
import SearchBox from "../SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import AlarmTable from "../table/AlarmTable";
import api from "../../services/api";

export default function ActiveAlarmsTab() {
  const [plantNameInput, setPlantNameInput] = useState("");
  const [snInput, setSnInput] = useState("");
  const [alarmNameInput, setAlarmNameInput] = useState("");
  const [alarmIdInput, setAlarmIdInput] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [filters, setFilters] = useState<any>(null); // ✅ null = ยังไม่เคย search

  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  const fetchAlarms = useCallback(async (currentPage: number, currentFilters: any) => {
    try {
      const apiParams = {
        tab: "active",
        page: currentPage,
        pageSize,
        q: currentFilters?.alarmName,
        alarmId: currentFilters?.alarmId,
        sn: currentFilters?.sn,
        from: currentFilters?.from,
        to: currentFilters?.to,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(apiParams).filter(([_, v]) => v !== undefined && v !== "")
      );

      const res = await api.get("/alarms", { params: cleanParams });
      const data = res.data?.data;
      let list = data?.list ?? [];

      // Frontend fallback: กรอง plantName
      if (currentFilters?.plantName) {
        list = list.filter((item: any) =>
          item.plantName?.toLowerCase().includes(currentFilters.plantName.toLowerCase())
        );
      }

      setAlarms(list);
      setTotalPages(data?.pagination?.totalPages ?? 1);
    } catch (err) {
      console.error("Fetch alarm error:", err);
    }
  }, []);

  // ✅ Fetch ทันทีตอน mount (ไม่รอ filters)
  useEffect(() => {
    fetchAlarms(1, null);
  }, []);

  // ✅ Fetch เมื่อ page หรือ filters เปลี่ยน (หลังจาก search แล้วเท่านั้น)
  useEffect(() => {
    if (filters === null) return; // ข้ามรอบแรก
    fetchAlarms(page, filters);
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
    setFilters(null); // ✅ reset กลับเป็น null
    setPage(1);
    fetchAlarms(1, null); // ✅ fetch ใหม่โดยไม่มี filter
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
        onPageChange={(p) => {
          setPage(p);
          fetchAlarms(p, filters);
        }}
        onRefresh={() => fetchAlarms(page, filters)}
      />
    </div>
  );
}