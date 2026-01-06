import Weather from "../../assets/card/weather.svg";

interface MainWeather {
  id: string;
  wind: number;
  temp: number;
  powerstatus: "Normal" | "Warning";
  status: "Connect" | "Disconnect";
}

interface MainWeatherCardProps {
  mainWeather: MainWeather;
}

const statusDotColor: Record<MainWeather["status"], string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

const powerStatusColor: Record<MainWeather["powerstatus"], string> = {
  Normal: "bg-green-500",
  Warning: "bg-[#F68B34]",
};

export default function MainWeather({ mainWeather }: MainWeatherCardProps) {
  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Weather Station</h5>
      <div className="flex justify-center items-center">
        <img src={Weather} alt="Main Weather" />
      </div>
      {/* ===== Info (Label | Value | Left aligned) ===== */}
      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* Wind */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Wind
          </span>
          <span className="text-black text-xs">
            {mainWeather.wind} m/s
          </span>
        </div>
        {/* Temp */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Temp
          </span>
          <span className="text-black text-xs">
            {mainWeather.temp} °C
          </span>
        </div>
        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Status
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
                className={`w-2 h-2 text-xs rounded-full ${powerStatusColor[mainWeather.powerstatus]}`}
            />
            {mainWeather.powerstatus}
          </span>
        </div>
        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Status
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
              className={`w-2 h-2 text-xs rounded-full ${statusDotColor[mainWeather.status]}`}
            />
            {mainWeather.status}
          </span>
        </div>
      </div>
    </div>
  );
}