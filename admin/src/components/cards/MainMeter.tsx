import Meter from "../../assets/card/meter.svg";

/* ================= Types ================= */
interface MainMeterType {
  id?: string;
  voltage?: number;
  current?: number;
  power?: number;
  status?: "Connect" | "Disconnect";
}

interface MainMeterCardProps {
  data?: MainMeterType;
}

/* ================= Status Color ================= */
const statusDotColor: Record<string, string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

const powerStatusColor: Record<string, string> = {
  Normal: "bg-green-500",
  Warning: "bg-[#F68B34]",
};

/* ================= Component ================= */
export default function MainMeter({ data }: MainMeterCardProps) {
  // ✅ กัน undefined

  const {
    voltage = 0,
    current = 0,
    power = 0,
    status = "Disconnect",
  } = data || {};

  const isNoData = !data;

  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Meter (Main)</h5>

      <div className="flex justify-center items-center">
        <img src={Meter} alt="Main Meter" />
      </div>

      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* Voltage */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Voltage</span>
          <span>{isNoData ? "0 V" : `${voltage} V`}</span>
        </div>

        {/* Current */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Current</span>
          <span>{isNoData ? "0 A" : `${current} A`}</span>
        </div>

        {/* Power */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Power</span>
          <span>{isNoData ? "0 W" : `${power} W`}</span>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Status</span>

          <span className="flex items-center gap-[5px]">
            <span
              className={`w-2 h-2 rounded-full ${isNoData ? "bg-gray-300" : statusDotColor[status] || "bg-gray-400"
                }`}
            />
            {isNoData ? "No Data" : status}
          </span>
        </div>
      </div>
    </div>
  );
}