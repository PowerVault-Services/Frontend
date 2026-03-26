import { DonutChart } from "../charts/DonutChart";

import criticalIcon from "../../assets/icons/critical.svg";
import majorIcon from "../../assets/icons/Major.svg";
import minorIcon from "../../assets/icons/Minor.svg";
import warningIcon from "../../assets/icons/Warning.svg";

interface Props {
  data?: {
    critical: number;
    major: number;
    minor: number;
    warning: number;
  };
}

export default function AlarmCard({ data }: Props) {

  const critical = data?.critical ?? 0;
  const major = data?.major ?? 0;
  const minor = data?.minor ?? 0;
  const warning = data?.warning ?? 0;

  const total = critical + major + minor + warning;

  const chartData =
    total === 0
      ? [{ name: "None", value: 1 }]
      : [
          { name: "Critical", value: critical },
          { name: "Major", value: major },
          { name: "Minor", value: minor },
          { name: "Warning", value: warning },
        ];

  const colors =
    total === 0
      ? ["#E5E7EB"]
      : ["#ef4444", "#f97316", "#eab308", "#3b82f6"];

  return (
    <div className="rounded-2xl">

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Active Alarms</h3>
      </div>

      <div className="flex items-center gap-10">

        <DonutChart
          data={chartData}
          colors={colors}
          totalLabel={total}
        />

        {/* Details */}
        <div className="pb-[7px]">

          {/* Critical */}
          <div className="flex items-start gap-3">
            <img src={criticalIcon} alt="Critical" className="w-6 h-6" />
            <div>
              <div className="text-[22px] font-bold">{critical}</div>
              <div className="text-[12px] text-[#C4C2C2]">Critical</div>
            </div>
          </div>

          {/* Major */}
          <div className="flex items-start gap-3">
            <img src={majorIcon} alt="Major" className="w-5 h-5 mt-1" />
            <div>
              <div className="text-[22px] font-bold">{major}</div>
              <div className="text-[12px] text-[#C4C2C2]">Major</div>
            </div>
          </div>

          {/* Minor */}
          <div className="flex items-start gap-3">
            <img src={minorIcon} alt="Minor" className="w-5 h-5 mt-1" />
            <div>
              <div className="text-[22px] font-bold">{minor}</div>
              <div className="text-[12px] text-[#C4C2C2]">Minor</div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-3">
            <img src={warningIcon} alt="Warning" className="w-5 h-5 mt-1" />
            <div>
              <div className="text-[22px] font-bold">{warning}</div>
              <div className="text-[12px] text-[#C4C2C2]">Warning</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}