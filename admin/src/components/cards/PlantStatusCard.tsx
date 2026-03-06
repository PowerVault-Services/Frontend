import { DonutChart } from "../charts/DonutChart";

interface Props {
  data?: {
    normal: number;
    faulty: number;
    disconnected: number;
  };
}

export default function PlantStatusCard({ data }: Props) {

  const normal = data?.normal ?? 0;
  const faulty = data?.faulty ?? 0;
  const disconnected = data?.disconnected ?? 0;

  const chartData = [
    { name: "Normal", value: normal },
    { name: "Faulty", value: faulty },
    { name: "Disconnected", value: disconnected },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="">
      <h3 className="text-xl font-bold">Plant Status</h3>

      <div className="flex items-center gap-10">

        {/* Donut */}
        <DonutChart
          data={chartData}
          colors={["#5DB37C", "#D9534F", "#E0E3E6"]}
          totalLabel={total}
        />

        {/* Legend */}
        <div className="gap-2.5">

          {/* Normal */}
          <div className="flex items-start gap-3">
            <span className="w-4 h-4 rounded-full bg-green-500 mt-2" />
            <div>
              <div className="text-2xl font-bold text-black">
                {normal}
              </div>
              <div className="text-sm text-gray-400">
                Normal
              </div>
            </div>
          </div>

          {/* Faulty */}
          <div className="flex items-start gap-3">
            <span className="w-4 h-4 rounded-full bg-red-500 mt-2" />
            <div>
              <div className="text-2xl font-bold text-black">
                {faulty}
              </div>
              <div className="text-sm text-gray-400">
                Faulty
              </div>
            </div>
          </div>

          {/* Disconnected */}
          <div className="flex items-start gap-3">
            <span className="w-4 h-4 rounded-full bg-gray-300 mt-2" />
            <div>
              <div className="text-2xl font-bold text-black">
                {disconnected}
              </div>
              <div className="text-sm text-gray-400">
                Disconnected
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}