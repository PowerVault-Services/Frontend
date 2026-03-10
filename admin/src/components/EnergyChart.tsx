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
  startTime: string;
  endTime: string;
}

const rangeMap: Record<string, string> = {
  day: "day",
  month: "month",
  year: "year",
  lifetime: "lifetime",
};

export default function EnergyChart({
  period,
  startTime,
  endTime,
}: EnergyChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const inverterId = 1;

        const res = await api.get(
          `/monitoring/inverters/${inverterId}/history`,
          {
            params: {
              metric: "activePower",
              range: rangeMap[period],
              ...(period === "day"
                ? { from: startTime, to: endTime }
                : {}),
            },
          }
        );

        const series = res.data?.data?.series ?? [];

        let formatted: any[] = [];

        if (period === "day") {
          const start = new Date(startTime);
          const end = new Date(endTime);

          const slots: Date[] = [];

          for (
            let t = new Date(start);
            t <= end;
            t.setMinutes(t.getMinutes() + 30)
          ) {
            slots.push(new Date(t));
          }

          const now = new Date();

          formatted = slots.map((slot) => {
            const found = series.find(
              (s: any) =>
                Math.abs(new Date(s.t).getTime() - slot.getTime()) < 60000
            );

            return {
              time: slot.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              pv: slot <= now ? found?.v ?? 0 : null,
            };
          });
        } else {
          formatted = series.map((item: any) => ({
            time: new Date(item.t).toLocaleDateString(),
            pv: item.v,
          }));
        }

        setData(formatted);
      } catch (err) {
        console.error("Energy history error:", err);
        setData([]);
      }
    };

    fetchHistory();   // ⭐ ต้องเรียกตรงนี้

  }, [period, startTime, endTime]);

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
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}