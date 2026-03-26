import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface EnergyChartProps {
  data: any[];
  view: "day" | "month" | "year" | "lifetime";
}

export default function EnergyChart({ data, view }: EnergyChartProps) {

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="left"
            unit=" kW"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            unit="%"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip />

          {/* ✅ 2. ใส่ Legend ตรงนี้ กำหนดให้อยู่ด้านล่างและใช้ไอคอนแบบขีด (plainline) */}
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="plainline"
            wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
          />

          {/* ✅ 3. ใส่ name="..." เพื่อให้ Legend แสดงชื่อตามนี้ และปรับสีให้ตรงกับรูป */}
          <Area yAxisId="left" type="monotone" dataKey="pv" name="PV output" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />

          <Area yAxisId="left" type="monotone" dataKey="grid" name="Power from grid" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} />

          <Area yAxisId="left" type="monotone" dataKey="battery" name="Battery Charge/discharge power" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />

          <Area yAxisId="left" type="monotone" dataKey="load" name="Consumption power" stroke="#f97316" fill="#f97316" fillOpacity={0.1} />

          <Area yAxisId="left" type="monotone" dataKey="irradiance" name="Irradiance" stroke="#eab308" fill="#eab308" fillOpacity={0.0} />

          <Area yAxisId="right" type="monotone" dataKey="pr" name="%PR" stroke="#a855f7" fill="#a855f7" fillOpacity={0.0} />


        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}