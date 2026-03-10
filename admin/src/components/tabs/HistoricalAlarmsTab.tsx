import { useEffect, useState } from "react";
import type { Alarm } from "../../services/alarm.api";
import SearchBox from "../SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import AlarmTable from "../table/AlarmTable";
import api from "../../services/api";

export default function HistoricalAlarmsTab() {

  // ===== FILTER INPUT =====
  const [plantNameInput, setPlantNameInput] = useState("");
  const [deviceType, setDeviceType] = useState("all");
  const [snInput, setSnInput] = useState("");
  const [alarmNameInput, setAlarmNameInput] = useState("");
  const [alarmIdInput, setAlarmIdInput] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // ===== QUERY =====
  const [filters, setFilters] = useState<any>({});

  // ===== DATA =====
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 20;

  // ===== FETCH API =====
  const fetchAlarms = async () => {
    try {

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== undefined && v !== "")
      );

      const res = await api.get("/alarms", {
        params: {
          tab: "historical",
          page,
          pageSize,
          ...cleanFilters,
        },
      });

      const data = res.data?.data;

      setAlarms(data?.list ?? []);
      setTotalPages(data?.pagination?.totalPages ?? 1);

    } catch (err) {
      console.error("Fetch alarm error:", err);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, [page, filters]);

  // ===== SEARCH =====
  const handleSearch = () => {

    setPage(1);

    const newFilters = {
      sn: snInput || undefined,
      q: alarmNameInput || undefined,
      alarmId: alarmIdInput || undefined,
      from: startTime ? new Date(startTime).toISOString() : undefined,
      to: endTime ? new Date(endTime).toISOString() : undefined,
    };

    console.log("Search Filters:", newFilters);

    setFilters(newFilters);
  };

  // ===== ENTER SEARCH =====
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

          <SelectFilter
            label="Device Type"
            placeholder="All"
            value={deviceType}
            onChange={setDeviceType}
            options={[
              { label: "All", value: "all" },
              { label: "Inverter", value: "INVERTER" },
              { label: "Logger", value: "LOGGER" },
            ]}
          />

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
                <span className="text-[16px] font-normal text-green-800">
                  Occurrence Time Start
                </span>

                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-[39px]
                  rounded-sm
                  border border-green-200
                  bg-white
                  px-4
                  text-[14px]
                  text-green-500
                  font-normal"
                />
              </div>

              <div className="flex flex-col w-full">
                <span className="text-[16px] font-normal text-green-800">
                  Occurrence Time End
                </span>

                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-[39px]
                  rounded-sm
                  border border-green-200
                  bg-white
                  px-4
                  text-[14px]
                  text-green-500
                  font-normal"
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