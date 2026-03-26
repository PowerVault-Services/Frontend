import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import type { PeriodType } from "./EnergyTrendChart";

interface Props {
  data: any[];
  period: PeriodType;
}

export default function TrendChart({ data, period }: Props) {

  const xKey =
    period === "day"
      ? "time"
      : period === "month"
      ? "day"
      : period === "year"
      ? "month"
      : "year";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey={xKey} />

        <YAxis />

        <Tooltip />

        {period !== "lifetime" && (
          <>
            <Bar dataKey="pv" stackId="a" fill="#1BAA6E" />
            <Bar dataKey="grid" stackId="a" fill="#F4A261" />
          </>
        )}

        {period === "lifetime" && (
          <Bar dataKey="pv" fill="#1BAA6E" />
        )}

      </BarChart>
    </ResponsiveContainer>
  );
}