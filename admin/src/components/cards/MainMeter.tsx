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
  data?: MainMeterType; // ✅ รับ data ตรงกับที่ส่งมา
}

/* ================= Status Color ================= */
const statusDotColor: Record<string, string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

/* ================= Component ================= */
export default function MainMeter({ data }: MainMeterCardProps) {
  // ✅ กัน undefined
  if (!data) {
    return (
      <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5 flex items-center justify-center text-gray-400 text-sm">
        No Data
      </div>
    );
  }

  const {
    voltage = 0,
    current = 0,
    power = 0,
    status = "Disconnect",
  } = data;

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
          <span>{voltage}</span>
        </div>

        {/* Current */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Current</span>
          <span>{current}</span>
        </div>

        {/* Power */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Power</span>
          <span>{power}</span>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Status</span>

          <span className="flex items-center gap-[5px]">
            <span
              className={`w-2 h-2 rounded-full ${
                statusDotColor[status] || "bg-gray-400"
              }`}
            />
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}