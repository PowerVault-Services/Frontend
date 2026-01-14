import Solar from "../../assets/card/solar.svg";

interface MainSolar {
  id: string;
  irradiance: number;
  Current: number;
  powerstatus: "Online" | "Offline";
  status: "Connect" | "Disconnect";
}

interface MainSolarCardProps {
  mainSolar: MainSolar;
}

const statusDotColor: Record<MainSolar["status"], string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

const powerStatusColor: Record<MainSolar["powerstatus"], string> = {
  Online: "bg-green-500",
  Offline: "bg-[#F68B34]",
};

export default function MainSolar({ mainSolar }: MainSolarCardProps) {
  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Solar Irradiance</h5>
      <div className="flex justify-center items-center">
        <img src={Solar} alt="Main Solar" />
      </div>
      {/* ===== Info (Label | Value | Left aligned) ===== */}
      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* Irradiance */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Irradiance
          </span>
          <span className="text-black text-xs">
            {mainSolar.irradiance} W/m²
          </span>
        </div>
        {/* Current */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Current
          </span>
          <span className="text-black text-xs">
            {mainSolar.Current} A
          </span>
        </div>
        {/* Power */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Power
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
                className={`w-2 h-2 text-xs rounded-full ${powerStatusColor[mainSolar.powerstatus]}`}
            />
            {mainSolar.powerstatus}
          </span>
        </div>
        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Status
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
              className={`w-2 h-2 text-xs rounded-full ${statusDotColor[mainSolar.status]}`}
            />
            {mainSolar.status}
          </span>
        </div>
      </div>
    </div>
  );
}