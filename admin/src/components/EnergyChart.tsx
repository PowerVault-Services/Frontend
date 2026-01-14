import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EnergyChartProps {
  period: "day" | "month" | "year" | "lifetime";
}

const data = [
  { time: "00:00", pv: 1.8 },
  { time: "04:00", pv: 1.5 },
  { time: "08:00", pv: 2.6 },
  { time: "12:00", pv: 3.0 },
  { time: "16:00", pv: 2.4 },
  { time: "20:00", pv: 1.7 },
  { time: "24:00", pv: 2.8 },
];

export default function EnergyChart({}: EnergyChartProps) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis unit=" kW" tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
