import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

interface DataItem {
  day: number;
  energy?: number;
  radiation?: number;
}

interface Props {
  data: DataItem[];
  year: number;
  month: number; // 1 - 12
}

export default function EnergyProductionChart({ data, year, month }: Props) {

  // จำนวนวันในเดือน
  const daysInMonth = new Date(year, month, 0).getDate();

  // generate day list
  const fullData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;

    const found = data.find((d) => d.day === day);

    return {
      day: String(day).padStart(2, "0"),
      energy: found?.energy ?? 0,
      radiation: found?.radiation ?? 0
    };
  });

  return (
    <div className="bg-white p-5 rounded-lg border border-[#DEE2E6]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Daily Energy Production vs Radiation
        </h3>

        <span className="text-sm text-gray-500">
          {year}-{String(month).padStart(2, "0")}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={fullData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            yAxisId="left"
            label={{ value: "kWh", angle: -90, position: "insideLeft" }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Wh/m²", angle: 90, position: "insideRight" }}
          />

          <Tooltip />
          <Legend />

          <Bar
            yAxisId="left"
            dataKey="energy"
            fill="#2F6FED"
            name="Energy Produced"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="radiation"
            stroke="#FF7A00"
            strokeWidth={3}
            dot
            name="Radiation"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}