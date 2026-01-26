import MenuDots from "../../assets/icons/Menu Dots.svg";
import { useNavigate } from "react-router-dom";

interface Inverter {
  id: string;
  name: string;
  power: number;
  status: "Connect" | "Disconnect";
  alarm: string;
  model: string;
}

interface InverterCardProps {
  inverter: Inverter;
  maxPower?: number;
}

const statusDotColor: Record<Inverter["status"], string> = {
  Connect: "bg-[#6BCCA6]",
  Disconnect: "bg-red-400",
};

export default function InverterCard({
  inverter,
  maxPower = 100,
}: InverterCardProps) {
  const navigate = useNavigate();

  // --- Logic คำนวณ Gauge ---
  const percentage = Math.min(Math.max(inverter.power / maxPower, 0), 1);

  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - percentage * circumference;

  const angle = Math.PI * (1 - percentage);
  const knobX = radius + normalizedRadius * Math.cos(angle);
  const knobY = radius - normalizedRadius * Math.sin(angle);

  return (
    <div className="h-full min-h-[190px] border border-[#DEE2E6] rounded-[8px] p-2.5 bg-white relative flex flex-col justify-between">

      {/* ===== Header ===== */}
      <div className="flex justify-between items-start mb-1">
        <h5 className="font-bold text-green-700 tracking-tight text-[16px]">
          {inverter.name}
        </h5>

        {/* ปุ่มไปหน้า Detail */}
        <button
          type="button"
          onClick={() => navigate(`/monitor/inverter/${inverter.id}`)}
          className="
            p-1 rounded-full
            hover:bg-green-100
            transition
          "
          aria-label="View inverter detail"
        >
          <img
            src={MenuDots}
            alt="detail inverter"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* ===== Gauge Chart (SVG) ===== */}
      <div className="flex justify-center items-center relative h-[100px] w-full mt-2">
        <div className="relative w-[160px] h-[83px] flex justify-center">
          <svg
            height="83"
            width="160"
            viewBox="0 0 160 90"
            className="overflow-visible"
          >
            <path
              d={`M 5 80 A ${normalizedRadius} ${normalizedRadius} 0 0 1 155 80`}
              fill="none"
              stroke="#ECF6EF"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <path
              d={`M 5 80 A ${normalizedRadius} ${normalizedRadius} 0 0 1 155 80`}
              fill="none"
              stroke="#7CB376"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
            />
            <g
              className="transition-all duration-500 ease-out"
              transform={`translate(${knobX}, ${knobY})`}
            >
              <circle r="9" fill="black" fillOpacity="0.1" cy="2" />
              <circle r="8" fill="white" />
              <circle r="4" fill="#7CB376" />
            </g>
          </svg>

          <div className="absolute top-8 left-0 right-0 text-center translate-y-2">
            <div className="flex justify-center items-baseline gap-1 text-green-900">
              <span className="text-[24px] font-bold leading-none">
                {inverter.power}
              </span>
              <span className="text-[16px] font-bold">kW</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Info ===== */}
      <div className="mt-3 flex flex-col text-xs w-[230px]">
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Status
          </span>
          <span className="flex items-center gap-[5px]">
            <span
              className={`w-2 h-2 rounded-full ${statusDotColor[inverter.status]}`}
            />
            {inverter.status}
          </span>
        </div>

        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Alarm
          </span>
          <span>{inverter.alarm}</span>
        </div>

        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Inverter Model
          </span>
          <span className="break-words">{inverter.model}</span>
        </div>
      </div>
    </div>
  );
}
