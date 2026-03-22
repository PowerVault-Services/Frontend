import EnergyChart from "./EnergyChart";

type Period = "day" | "month" | "year" | "lifetime";

type Props = {
  data: any;
  view: Period;
  date: string;
  onChangeView: (v: Period) => void;
  onChangeDate: (d: string) => void;
};

export default function EnergyManagementCard({
  data,
  view,
  date,
  onChangeView,
  onChangeDate,
}: Props) {

  const points = data?.points || [];

  return (
    <div className="h-[314px] w-full rounded-lg border border-[#DEE2E6] bg-white px-6 py-5 flex flex-col">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-3">
        <h5 className="text-green-700 font-semibold">Energy Management</h5>

        <div className="flex gap-2 items-center">
          {/* ✅ Date Picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => onChangeDate(e.target.value)}
            className="border border-green-300 rounded px-[11px] py-1 text-xs"
          />

          {/* ✅ Period Selector */}
          <div className="w-72 h-7 flex items-center border border-green-300 rounded text-[14px] px-1">
            {(["day", "month", "year", "lifetime"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => onChangeView(p)}
                className={`
                  flex-1 h-5 flex items-center justify-center
                  rounded-[13px] transition-all duration-200
                  ${view === p
                    ? "bg-green-600 text-white"
                    : "text-[#9291A5]"
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
      <div className="flex-1 w-full min-h-0">
        <EnergyChart
          data={points} 
          view={view}
        />
      </div>
    </div>
  );
}