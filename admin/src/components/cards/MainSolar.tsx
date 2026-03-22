import Solar from "../../assets/card/solar.svg";

/* ================= Types ================= */
interface MainSolarType {
  id?: string;
  irradiance?: number;
  current?: number;
  powerstatus?: "Online" | "Offline";
  status?: "Connect" | "Disconnect";
}

interface MainSolarCardProps {
  data?: MainSolarType; // ✅ ให้ตรง Overview
}

/* ================= Status Colors ================= */
const statusDotColor: Record<string, string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

const powerStatusColor: Record<string, string> = {
  Online: "bg-green-500",
  Offline: "bg-[#F68B34]",
};

/* ================= Component ================= */
export default function MainSolar({ data }: MainSolarCardProps) {
  // ✅ กัน crash
  if (!data) {
    return (
      <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5 flex items-center justify-center text-gray-400 text-sm">
        No Data
      </div>
    );
  }

  const {
    irradiance = 0,
    current = 0,
    powerstatus = "Offline",
    status = "Disconnect",
  } = data;

  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Solar Irradiance</h5>

      <div className="flex justify-center items-center">
        <img src={Solar} alt="Main Solar" />
      </div>

      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* Irradiance */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Irradiance
          </span>
          <span>{irradiance} W/m²</span>
        </div>

        {/* Current */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Current
          </span>
          <span>{current} A</span>
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