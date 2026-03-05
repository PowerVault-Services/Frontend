import { useEffect, useState } from "react";
import SearchBox from "../SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import AlarmTable from "../table/AlarmTable";
import api from "../../services/api";

interface Alarm {
  id: number;
  severity: number;
  severityText: string;
  plantName: string;
  deviceType: string | null;
  deviceName: string;
  alarmName: string;
  alarmId: number;
  sn: string;
  occurredAt: string;
  occurrenceTime: string;
  clearedAt: string | null;
  status: "ACTIVE" | "CLEARED";
  operation: {
    viewDetails: boolean;
    acknowledge: boolean;
    delete: boolean;
  };
  raw: any;
}

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
      deviceType: deviceType !== "all" ? deviceType : undefined,
      sn: snInput || undefined,
      q: alarmNameInput || undefined,
      alarmId: alarmIdInput || undefined,
      startTime: startTime ? new Date(startTime).toISOString() : undefined,
      endTime: endTime ? new Date(endTime).toISOString() : undefined,
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
            <label className="text-[16px] font-normal text-green-800">
              Occurrence Time
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-[39px]
                  rounded-sm
                  border border-green-200
                  bg-white
                  px-4
                  text-[14px]
                  text-green-500
                  font-normal
                  placeholder:text-green-300"
              />
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-[39px]
                  rounded-sm
                  border border-green-200
                  bg-white
                  px-4
                  text-[14px]
                  text-green-500
                  font-normal
                  placeholder:text-green-300"
              />
            </div>
          </div>

        </div>
      </SearchBox>

      <AlarmTable
        data={alarms}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onRefresh={fetchAlarms}   // 🔥 auto refresh ทำงานจริง
      />
    </div>
  );
}




