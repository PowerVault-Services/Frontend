import Battery from "../../assets/card/battery.svg";

/* ================= Types ================= */
interface MainBatteryType {
  id?: string;
  soc?: number;
  temp?: number;
  powerstatus?: "Normal" | "Warning";
  status?: "Connect" | "Disconnect";
}

interface MainBatteryCardProps {
  data?: MainBatteryType; // ✅ ให้ตรงกับ Overview
}

/* ================= Status Colors ================= */
const statusDotColor: Record<string, string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

const powerStatusColor: Record<string, string> = {
  Normal: "bg-green-500",
  Warning: "bg-[#F68B34]",
};

/* ================= Component ================= */
export default function MainBattery({ data }: MainBatteryCardProps) {
  // ✅ กัน undefined
  if (!data) {
    return (
      <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5 flex items-center justify-center text-gray-400 text-sm">
        No Data
      </div>
    );
  }

  const {
    soc = 0,
    temp = 0,
    powerstatus = "Normal",
    status = "Disconnect",
  } = data;

  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Battery</h5>

      <div className="flex justify-center items-center">
        <img src={Battery} alt="Main Battery" />
      </div>

      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* SOC */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">SOC</span>
          <span>{soc}%</span>
        </div>

        {/* Temp */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">Temp</span>
          <span>{temp}</span>
        </div>

        {/* Power Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Power Status
          </span>

          <span className="flex items-center gap-[5px]">
            <span
              className={`w-2 h-2 rounded-full ${
                powerStatusColor[powerstatus] || "bg-gray-400"
              }`}
            />
            {powerstatus}
          </span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Connection
          </span>

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