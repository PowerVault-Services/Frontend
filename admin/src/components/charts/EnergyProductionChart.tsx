import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

interface EnergyProductionProps {
  data?: any[];
  year?: number;
  month?: number;
}

export default function EnergyProductionChart({
  data = [],
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1
}: EnergyProductionProps) {

  const daysInMonth = new Date(year, month, 0).getDate();

  const fullData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;

    const found = data.find((d) => {
      if (!d?.date) return false;
      const dDate = new Date(d.date);
      return dDate.getDate() === day;
    });

    return {
      day: String(day).padStart(2, "0"),
      energy: found?.production ?? 0,
      radiation: found?.irradiation ?? 0
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
        <ComposedChart data={fullData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" tick={{ fontSize: 12 }} />

          <YAxis
            yAxisId="left"
            label={{
              value: "kWh",
              angle: -90,
              position: "insideLeft",
              dx: -15
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Wh/m²",
              angle: 90,
              position: "insideRight",
              dx: 15
            }}
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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}