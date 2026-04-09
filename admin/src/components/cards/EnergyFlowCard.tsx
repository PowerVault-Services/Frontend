import FlowLine from "../FlowLine";

import pvIcon from "../../assets/icons/pv.svg";
import batteryIcon from "../../assets/icons/battery.svg";
import gridIcon from "../../assets/icons/grid.svg";
import loadIcon from "../../assets/icons/load.svg";

/* ================= Props ================= */
interface EnergyFlowProps {
  pv: number;
  grid: number;
  battery: number;
  load: number;
}

/* ================= Node Component ================= */
function EnergyNode({
  value,
  icon,
  label,
  colorClass,
  labelPosition = "top",
}: {
  value: number;
  icon?: string;
  label: string;
  colorClass: string;
  labelPosition?: "top" | "bottom";
}) {
  return (
    <div className="flex flex-col items-center justify-center z-10">
      {labelPosition === "top" && (
        <span className="text-[11px] text-gray-500 mb-1 uppercase font-medium">{label}</span>
      )}
      <div
        className={`flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full border-2 bg-white transition-colors duration-300 ${colorClass}`}
        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        {icon && <img src={icon} alt="icon" className="w-[24px] h-[24px] mb-0.5" />}
        <div className="text-[13px] font-bold leading-none">{value.toFixed(2)}</div>
        <div className="text-[9px] font-light opacity-70">kW</div>
      </div>
      {labelPosition === "bottom" && (
        <span className="text-[11px] text-gray-500 mt-1 uppercase font-medium">{label}</span>
      )}
    </div>
  );
}

/* ================= Main Card ================= */
export default function EnergyFlowCard({ pv, grid, battery, load }: EnergyFlowProps) {
  
  // ✅ ย้าย constant ออกมาไว้นอก JSX
  const THRESHOLD = 0.05;

  const colors = {
    pv:      "border-[#ff9800] text-[#ff9800]",
    grid:    "border-[#488fc2] text-[#488fc2]",
    battery: "border-[#a280db] text-[#a280db]",
    load:    "border-[#4db6ac] text-[#4db6ac]",
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative rounded-lg p-2 w-[314px] min-h-[314px] border border-[#DEE2E6]">

        {/* Top: PV (Solar) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <EnergyNode label="Solar" value={pv} icon={pvIcon} colorClass={colors.pv} labelPosition="top" />
        </div>

        {/* Left: Battery */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <EnergyNode label="Battery" value={Math.abs(battery)} icon={batteryIcon} colorClass={colors.battery} labelPosition="bottom" />
        </div>

        {/* Right: Grid */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <EnergyNode label="Grid" value={Math.abs(grid)} icon={gridIcon} colorClass={colors.grid} labelPosition="bottom" />
        </div>

        {/* Bottom: Load (Home) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <EnergyNode label="Home" value={load} icon={loadIcon} colorClass={colors.load} labelPosition="bottom" />
        </div>

        {/* ================= FLOW LINES (SVG) ================= */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 314 314"
          fill="none"
        >
          {/* Solar → Home */}
          <FlowLine
            active={pv >= THRESHOLD}
            d="M157 90 L157 224"
            stroke="#ff9800"
          />

          {/* Grid ↔ Home
              grid > 0 = import (Grid→Home) = default direction
              grid < 0 = export (Home→Grid) = reverse */}
          <FlowLine
            active={Math.abs(grid) >= THRESHOLD}
            d="M224 157 H197 Q177 157 177 177 V224"
            stroke="#488fc2"
            reverse={grid < 0}
          />

          {/* Battery ↔ Home
              battery < 0 = discharge (Battery→Home) = default direction
              battery > 0 = charge (Home→Battery) = reverse */}
          <FlowLine
            active={Math.abs(battery) >= THRESHOLD}
            d="M90 157 H117 Q137 157 137 177 V224"
            stroke="#a280db"
            reverse={battery > 0}
          />

          {/* Solar → Grid (เฉพาะตอน export เกิน) */}
          {grid < -THRESHOLD && (
            <FlowLine
              active={true}
              d="M157 120 V140 Q157 157 177 157 H224"
              stroke="#ff9800"
            />
          )}
        </svg>
      </div>
    </div>
  );
}