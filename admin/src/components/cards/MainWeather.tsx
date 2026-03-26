import Weather from "../../assets/card/weather.svg";

/* ================= Types ================= */
interface MainWeatherType {
  id?: string;
  wind?: number;
  temp?: number;
  powerstatus?: "Normal" | "Warning";
  status?: "Connect" | "Disconnect";
}

interface MainWeatherCardProps {
  data?: MainWeatherType; // ✅ ให้ตรง Overview
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
export default function MainWeather({ data }: MainWeatherCardProps) {
  const {
    wind = 0,
    temp = 0,
    powerstatus = "Normal",
    status = "Disconnect",
  } = data || {};

  const hasData = !!data;

  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Weather Station</h5>

      <div className="flex justify-center items-center">
        <img src={Weather} alt="Main Weather" />
      </div>

      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* Wind */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Wind
          </span>
          <span className={hasData ? "text-black" : "text-gray-400"}>
            {hasData ? `${wind} m/s` : "0 m/s"}
          </span>
        </div>

        {/* Temp */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Temp
          </span>
          <span className={hasData ? "text-black" : "text-gray-400"}>
            {hasData ? `${temp} °C` : "0 °C"}
          </span>
        </div>

        {/* Power Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold">
            Condition
          </span>

          <span className="flex items-center gap-[5px]">
            <span
              className={`w-2 h-2 rounded-full ${
                powerStatusColor[powerstatus] || "bg-gray-400"
              }`}
            />
            <span className={hasData ? "text-black" : "text-gray-400"}>
              {hasData ? powerstatus : "No Data"}
            </span>
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
            <span className={hasData ? "text-black" : "text-gray-400"}>
              {hasData ? status : "No Data"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}