import { useEffect, useState, type ReactNode } from "react";
import api from "../../services/api";
import type { Alarm } from "../../services/alarm.api";

type Alarm = {
  alarmId: ReactNode;
  id: number;
  severity: number;
  severityText: string;
  plantName: string;
  deviceType: string;
  deviceName: string;
  sn: string;
  alarmName: string;
  occurrenceTime: string;
  status: string;
};

interface Props {
  plantId?: number;
}

export default function AlarmTab({ plantId }: Props) {
  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("ACTIVE");

  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= Fetch API ================= */
  useEffect(() => {
    if (!plantId) return;

    const fetchAlarms = async () => {
      try {
        setLoading(true);

        const res = await api.get("/alarms", {
          params: {
            siteId: plantId,
            tab: status === "ACTIVE" ? "active" : "historical",
            severity: severity === "ALL" ? undefined : severity
          }
        });

        setAlarms(res.data?.data?.list ?? []);

      } catch (err) {
        console.error("โหลด alarm ไม่สำเร็จ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, [plantId, severity, status]);

  const handleCreateInspection = (alarm: Alarm) => {
    console.log("Create inspection for:", alarm);
  };

  if (loading) {
    return <div className="p-6">Loading alarms...</div>;
  }

  return (
    <div className="p-6">

      {/* FILTER */}
      <div className="rounded-lg border border-[#DEE2E6] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">

          {/* Severity */}
          <div className="flex flex-col min-w-[180px] round-lg">
            <label className="text-xs font-bold text-gray-500 round-lg">
              Alarm Severity
            </label>
            <select
              className="round-lg border border-[#DEE2E6] px-3 py-2"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="4">Critical</option>
              <option value="3">Major</option>
              <option value="2">Minor</option>
              <option value="1">Warning</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col min-w-[180px] round-lg">
            <label className="text-xs font-bold text-gray-500">
              Status
            </label>
            <select
              className="round-lg border border-[#DEE2E6] px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ACTIVE">Active</option>
              <option value="CLEARED">Cleared</option>
            </select>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm text-left">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Alarm Severity</th>
              <th className="px-4 py-3">Plant Name</th>
              <th className="px-4 py-3">Device Type</th>
              <th className="px-4 py-3">Device Name</th>
              <th className="px-4 py-3 text-center">SN</th>
              <th className="px-4 py-3">Alarm ID</th>
              <th className="px-4 py-3">Alarm Name</th>
              <th className="px-4 py-3">Occurrence Time</th>
              <th className="px-4 py-3 text-center">Operation</th>
            </tr>
          </thead>

          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm.id} className="border-b hover:bg-gray-50">

                <td className="px-4 py-3">{alarm.severityText}</td>
                <td className="px-4 py-3">{alarm.plantName}</td>
                <td className="px-4 py-3">{alarm.deviceType}</td>
                <td className="px-4 py-3">{alarm.deviceName}</td>
                <td className="px-4 py-3">{alarm.sn}</td>
                <td className="px-4 py-3">{alarm.alarmId}</td>
                <td className="px-4 py-3">{alarm.alarmName}</td>
                <td className="px-4 py-3">
                  {new Date(alarm.occurrenceTime).toLocaleString()}
                </td>

                <td className="px-4 py-3 items-center text-center">
                  <button
                    onClick={() => handleCreateInspection(alarm)}
                    className="bg-[#2979FF] text-white px-3 py-1 rounded"
                  >
                    Create Service
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}