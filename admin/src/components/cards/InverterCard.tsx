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
}

/* ✅ FIX: status color map */
const statusDotColor: Record<Inverter["status"], string> = {
  Connect: "bg-green-500",
  Disconnect: "bg-red-500",
};

export default function InverterCard({ inverter }: InverterCardProps) {
  return (
    <div className="border border-[#DEE2E6] rounded-lg p-2.5 w-full bg-white">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-semibold text-green-700">
          {inverter.name}
        </h5>
        <span className="text-[#BFBFBF] cursor-pointer">•••</span>
      </div>

      {/* ===== Gauge ===== */}
      <div className="flex justify-center mb-4">
        <div className="relative w-40 h-[90px]">
          {/* arc placeholder */}
          <div
            className="absolute inset-0 rounded-t-full
                       border-t-10 border-l-10 border-r-10
                       border-green-500"
          />

          {/* dot */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2
                       w-4 h-4 rounded-full bg-green-400
                       border-2 border-white"
          />

          {/* value */}
          <div className="absolute inset-0 flex items-center justify-center text-green-900">
            <h4 className="flex items-end gap-1">
              <span>{inverter.power}</span>
              <span className="text-[16px] font-bold">kW</span>
            </h4>
          </div>
        </div>
      </div>

      {/* ===== Info (Label | Value | Left aligned) ===== */}
      <div className="mt-3 flex flex-col text-xs w-[230px]">
        {/* Status */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Status
          </span>

          <span className="flex items-center text-black gap-[5px]">
            <span
              className={`w-2 h-2 text-xs rounded-full ${statusDotColor[inverter.status]}`}
            />
            {inverter.status}
          </span>
        </div>

        {/* Alarm */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Alarm
          </span>
          <span className="text-black text-xs">
            {inverter.alarm}
          </span>
        </div>

        {/* Model */}
        <div className="flex items-center">
          <span className="w-[103px] text-green-900 font-bold whitespace-nowrap">
            Inverter Model
          </span>
          <span className="text-black text-xs wrap-break-word">
            {inverter.model}
          </span>
        </div>
      </div>
    </div>
  );
}
