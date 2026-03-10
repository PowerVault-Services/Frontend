import { useState } from "react";
import EnergyChart from "./EnergyChart";

type Period = "day" | "month" | "year" | "lifetime";

export default function EnergyManagementCard() {
  const [period, setPeriod] = useState<Period>("day");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  /* ===== Time Range ===== */
  const startTime = new Date(date);
  startTime.setHours(0, 0, 0, 0);

  const endTime = new Date(startTime);
  endTime.setDate(endTime.getDate() + 1);

  return (
    <div className="h-[314px] w-full rounded-lg border border-[#DEE2E6] bg-white px-6 py-5 flex flex-col">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-green-700 font-semibold">
          Energy Management
        </h5>

        <div className="flex gap-2 items-center">

          {/* Date Picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-green-300 rounded px-[11px] py-1 text-xs"
          />

          {/* Period Selector */}
          <div className="w-72 h-7 flex items-center border border-green-300 rounded text-[14px] px-1">
            {(["day", "month", "year", "lifetime"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`
                  flex-1
                  h-5
                  flex items-center justify-center
                  rounded-[13px]
                  leading-none
                  transition-all duration-200
                  ${
                    period === p
                      ? "bg-green-600 text-white"
                      : "bg-transparent text-[#9291A5]"
                  }
                `}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Chart ===== */}
      <div className="flex-1 min-h-0">
        <EnergyChart
          period={period}
          startTime={startTime.toISOString()}
          endTime={endTime.toISOString()}
        />
      </div>
    </div>
  );
}