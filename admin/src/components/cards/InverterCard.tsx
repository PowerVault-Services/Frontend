interface InverterCardProps {
  inverter: Inverter;
}

interface Inverter {
  id: string;
  name: string;
  power: number;
  status: "Connect" | "Disconnect";
  alarm: string;
  model: string;
}

// interface Plant {
//   id: number;
//   name: string;
//   inverters: Inverter[];
// }


export function InverterCard({ inverter }: InverterCardProps) {
  return (
    <div className="border rounded-lg p-3 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h6 className="font-semibold text-green-800">
          {inverter.name}
        </h6>
        <span className="text-gray-400">•••</span>
      </div>

      {/* Gauge (placeholder) */}
      <div className="flex justify-center mb-3">
        <div className="text-[20px] font-bold text-green-800">
          {inverter.power} <span className="text-sm">kW</span>
        </div>
      </div>

      {/* Info */}
      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>Status</span>
          <span className="flex items-center gap-1 text-green-600">
            ● {inverter.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Alarm</span>
          <span>{inverter.alarm}</span>
        </div>
        <div className="flex justify-between">
          <span>Inverter Model</span>
          <span className="text-right">{inverter.model}</span>
        </div>
      </div>
    </div>
  );
}
