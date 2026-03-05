import { useEffect, useState } from "react";
import api from "../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface EnergyChartProps {
  period: "day" | "month" | "year" | "lifetime";
}

export default function EnergyChart({ period }: EnergyChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const inverterId = 1; // 👈 เปลี่ยนเป็น prop ถ้ามี

        const rangeMap: Record<string, string> = {
          day: "day",
          month: "month",
          year: "month",
          lifetime: "month",
        };

        const res = await api.get(
          `/monitoring/inverters/${inverterId}/history`,
          {
            params: {
              metric: "activePower",
              range: rangeMap[period] || "day",
            },
          }
        );

        const series = res.data?.data?.series ?? [];

        const formatted = series.map((item: any) => ({
          time:
            period === "day"
              ? new Date(item.t).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : new Date(item.t).toLocaleDateString(),
          pv: item.v,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Energy history error:", err);
        setData([]);
      }
    };

    fetchHistory();
  }, [period]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            unit=" kW"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="pv"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}