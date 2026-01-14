import Meter from "../../assets/card/meter.svg";

interface MainMeter {
  id: string;
  voltage: number;
  current: number;
  power: number;
  status: "Connect" | "Disconnect";
}

interface MainMeterCardProps {
  mainMeter: MainMeter;
}

const statusDotColor: Record<MainMeter["status"], string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-[#E54848]",
};

export default function MainMeter({ mainMeter }: MainMeterCardProps) {
  return (
    <div className="w-full h-48 border border-[#DEE2E6] rounded-lg p-2.5">
      <h5 className="text-green-700">Meter (Main)</h5>
      <div className="flex justify-center items-center">
        <img src={Meter} alt="Main Meter" />
      </div>
      {/* ===== Info (Label | Value | Left aligned) ===== */}
      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* Voltage */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Voltage
          </span>
          <span className="text-black text-xs">
            {mainMeter.voltage}
          </span>
        </div>
        {/* Current */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Current
          </span>
          <span className="text-black text-xs">
            {mainMeter.current}
          </span>
        </div>
        {/* Power */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Power
          </span>
          <span className="text-black text-xs">
            {mainMeter.power}
          </span>
        </div>
        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Status
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
              className={`w-2 h-2 text-xs rounded-full ${statusDotColor[mainMeter.status]}`}
            />
            {mainMeter.status}
          </span>
        </div>
      </div>
    </div>
  );
}