import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type DonutData = {
  name: string;
  value: number;
};

interface DonutChartProps {
  data: DonutData[];
  colors: string[];
  totalLabel: string | number;
}

export function DonutChart({
  data,
  colors,
  totalLabel,
}: DonutChartProps) {
  return (
    <div className="w-50 h-50 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-lg font-semibold">
        <span>{totalLabel}</span>
      </div>
    </div>
  );
}
