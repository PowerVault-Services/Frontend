import { useEffect, useState } from "react";
import type { Alarm } from "../../services/alarm.api";
import SearchBox from "../SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import AlarmTable from "../table/AlarmTable";
import api from "../../services/api";


export default function ActiveAlarmsTab() {

  // ===== FILTER INPUT STATES =====
  const [deviceType, setDeviceType] = useState("all");
  const [snInput, setSnInput] = useState("");
  const [alarmNameInput, setAlarmNameInput] = useState("");
  const [alarmIdInput, setAlarmIdInput] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // ===== QUERY STATE (ยิงจริงตอน search) =====
  const [filters, setFilters] = useState<any>({});

  // ===== DATA STATES =====
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAlarms = async () => {
    try {
      const res = await api.get("/alarms", {
        params: {
          tab: "active",
          page,
          pageSize,
          ...filters,
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

  const handleSearch = () => {
    setPage(1);

    setFilters({
      sn: snInput || undefined,
      q: alarmNameInput || undefined,
      alarmId: alarmIdInput || undefined,
      from: startTime ? new Date(startTime).toISOString() : undefined,
      to: endTime ? new Date(endTime).toISOString() : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-[18px]">
      <SearchBox onSearch={handleSearch}>
        <div className="grid grid-cols-3 gap-4">

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
          />

          <TextInputFilter
            label="Alarm Name"
            value={alarmNameInput}
            onChange={setAlarmNameInput}
          />

          <TextInputFilter
            label="Alarm ID"
            value={alarmIdInput}
            onChange={setAlarmIdInput}
          />

          {/* 🔥 Occurrence Time → Start / End */}
          <div className="flex flex-col gap-2">
            {/* <label className="text-[16px] font-normal text-green-800">
              Occurrence Time
            </label> */}

            <div className="flex gap-4">

              {/* Start Time */}
              <div className="flex flex-col w-full">
                <span className="text-[16px] font-normal text-green-800">Occurrence Time Start</span>
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

              {/* End Time */}
              <div className="flex flex-col w-full">
                <span className="text-[16px] font-normal text-green-800">Occurrence Time End</span>
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
      />
    </div>
  );
}




