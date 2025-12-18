import React from "react";
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

/* ================= Node ================= */
function EnergyNode({
  value,
  icon,
}: {
  value: number;
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center w-[76px] h-[76px] rounded-full border-[2px] border-[#2AC1E6] text-black">
      {icon && <img src={icon} alt="icon" className="w-[22px] h-[22px]" />}
      <div className="text-xs font-light">{value.toFixed(2)}</div>
      <div className="text-[10px]">kW</div>
    </div>
  );
}

/* ================= Card ================= */
export default function EnergyFlowCard({
  pv,
  grid,
  battery,
  load,
}: EnergyFlowProps) {
  const hasFlow = pv > 0 || battery > 0 || grid > 0;

  return (
    <div className="rounded-lg p-2 border border-[#DEE2E6] w-[314px] h-[314px] bg-white">
      <div className="relative w-full h-full">

        {/* ================= NODES ================= */}

        {/* PV */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-xs font-light">PV</div>
          <EnergyNode value={pv} icon={pvIcon} />
        </div>

        {/* Battery */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <EnergyNode value={battery} icon={batteryIcon} />
          <div className="text-xs font-light">Battery</div>
        </div>

        {/* Grid */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
          <EnergyNode value={grid} icon={gridIcon} />
          <div className="text-xs font-light">Grid</div>
        </div>

        {/* Load */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <EnergyNode value={load} icon={loadIcon} />
          <div className="text-xs font-light">Load</div>
        </div>

        {/* ================= FLOW LINES ================= */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="314"
          height="314"
          viewBox="0 0 314 314"
          fill="none"
        >
          <FlowLine
            active={pv > 0}
            d="M189 117 L189 260"
          />

          {/* ===== Battery → Load (ซ้าย) =====*/}
          <FlowLine
            active={battery > 0}
            d="M76 157 L127 157 Q151 157 151 181 L151 222"
          />

          {/* ===== Grid → Load (ขวา) =====*/}
          <FlowLine
            active={grid > 0}
            d="M238 157 L181 157 Q171 157 171 167 L171 222"
          />
        </svg>
      </div>
    </div>
  );
}
