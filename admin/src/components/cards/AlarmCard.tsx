import { DonutChart } from "../charts/DonutChart";

import criticalIcon from "../../assets/icons/critical.svg";
import majorIcon from "../../assets/icons/Major.svg";
import minorIcon from "../../assets/icons/Minor.svg";
import warningIcon from "../../assets/icons/Warning.svg";

export default function AlarmCard() {
  const data = [
    { name: "Critical", value: 231 },
    { name: "Major", value: 231 },
    { name: "Minor", value: 231 },
    { name: "Warning", value: 231 },
  ];

  return (
    <div className="rounded-2xl">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Alarms</h3>
      </div>

      <div className="flex items-center gap-10">
        <DonutChart
          data={data}
          colors={["#ef4444", "#f97316", "#eab308", "#3b82f6"]}
          totalLabel="924"
        />

        {/* Details */}
        <div className="pb-[7px]">
          {/* Critical */}
          <div className="flex items-start gap-3">
            <img src={criticalIcon} alt="Critical" className="w-6 h-6" />
            <div>
              <div className="text-[22px] font-bold">231</div>
              <div className="text-[12px] text-[#C4C2C2]">Critical</div>
            </div>
          </div>

          {/* Major */}
          <div className="flex items-start gap-3">
            <img src={majorIcon} alt="Major" className="w-5 h-5 mt-1" />
            <div>
              <div className="text-[22px] font-bold">231</div>
              <div className="text-[12px] text-[#C4C2C2]">Major</div>
            </div>
          </div>

          {/* Minor */}
          <div className="flex items-start gap-3">
            <img src={minorIcon} alt="Minor" className="w-5 h-5 mt-1" />
            <div>
              <div className="text-[22px] font-bold">231</div>
              <div className="text-[12px] text-[#C4C2C2]">Minor</div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3">
            <img src={warningIcon} alt="Warning" className="w-5 h-5 mt-1" />
            <div>
              <div className="text-[22px] font-bold">231</div>
              <div className="text-[12px] text-[#C4C2C2]">Warning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
