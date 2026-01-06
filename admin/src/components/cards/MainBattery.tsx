import Battery from "../../assets/card/battery.svg";

interface MainBattery {
  id: string;
  soc: number;
  temp: number;
  powerstatus: "Normal" | "Warning";
  status: "Connect" | "Disconnect";
}

interface MainBatteryCardProps {
  mainBattery: MainBattery;
}

const statusDotColor: Record<MainBattery["status"], string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

const powerStatusColor: Record<MainBattery["powerstatus"], string> = {
  Normal: "bg-green-500",
  Warning: "bg-[#F68B34]",
};

export default function MainBattery({ mainBattery }: MainBatteryCardProps) {
  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Battery</h5>
      <div className="flex justify-center items-center">
        <img src={Battery} alt="Main Battery" />
      </div>
      {/* ===== Info (Label | Value | Left aligned) ===== */}
      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* SOC */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            SOC
          </span>
          <span className="text-black text-xs">
            {mainBattery.soc}%
          </span>
        </div>
        {/* Temp */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Temp
          </span>
          <span className="text-black text-xs">
            {mainBattery.temp}
          </span>
        </div>
        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Status
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
                className={`w-2 h-2 text-xs rounded-full ${powerStatusColor[mainBattery.powerstatus]}`}
            />
            {mainBattery.powerstatus}
          </span>
        </div>
        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Status
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
              className={`w-2 h-2 text-xs rounded-full ${statusDotColor[mainBattery.status]}`}
            />
            {mainBattery.status}
          </span>
        </div>
      </div>
    </div>
  );
}