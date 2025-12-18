import { DonutChart } from "../charts/DonutChart";

export default function PlantStatusCard() {
  const data = [
    { name: "Normal", value: 231 },
    { name: "Faulty", value: 6 },
    { name: "Disconnected", value: 20 },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="">
      <h3 className="text-xl font-bold">Plant Status</h3>
      <div className="flex items-center gap-10">
        {/* Donut */}
        <DonutChart
          data={data}
          colors={["#5DB37C", "#D9534F", "#E0E3E6"]}
          totalLabel={total}
        />

        {/* Legend */}
        <div className="gap-2.5">
          {/* Normal */}
          <div className="flex items-start gap-3">
            <span className="w-4 h-4 rounded-full bg-green-500 mt-2" />
            <div>
              <div className="text-2xl font-bold text-black">231</div>
              <div className="text-sm text-gray-400">Normal</div>
            </div>
          </div>

          {/* Faulty */}
          <div className="flex items-start gap-3">
            <span className="w-4 h-4 rounded-full bg-red-500 mt-2" />
            <div>
              <div className="text-2xl font-bold text-black">6</div>
              <div className="text-sm text-gray-400">Faulty</div>
            </div>
          </div>

          {/* Disconnected */}
          <div className="flex items-start gap-3">
            <span className="w-4 h-4 rounded-full bg-gray-300 mt-2" />
            <div>
              <div className="text-2xl font-bold text-black">20</div>
              <div className="text-sm text-gray-400">Disconnected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
