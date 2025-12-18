import { useState } from "react";
import EnergyChart from "./EnergyChart";

type Period = "day" | "month" | "year" | "lifetime";

export default function EnergyManagementCard() {
  const [period, setPeriod] = useState<Period>("day");

  return (
    <div className="h-[314px] w-[731px] rounded-[8px] px-[10px] py-[20px] border border-[#DEE2E6]">
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-green-700 font-semibold">
          Energy Management
        </h5>

        <div className="flex gap-2">
          <input
            type="date"
            className="border border-green-300 rounded px-[11px] py-[4px] text-xs"
          />

          <div className="w-72 h-7 flex items-center border border-green-300 rounded text-[14px] px-1">
            {(["day", "month", "year", "lifetime"] as Period[]).map(p => (
                <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`
                    h-4.5
                    flex items-center justify-center
                    px-4
                    rounded-[13px]
                    leading-none
                    transition
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
      <EnergyChart period={period} />
    </div>
  );
}
