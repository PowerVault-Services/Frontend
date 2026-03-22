import {
  ResponsiveContainer,
  ComposedChart, // เปลี่ยนจาก BarChart เป็น ComposedChart เพื่อผสม Bar กับ Line
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

// ลบ interface Props ที่ไม่ได้ใช้ออกเพื่อให้โค้ดคลีนขึ้น
interface EnergyProductionProps {
    data?: any[];
    year?: number;
    month?: number;
}

// ✅ กำหนดค่า Default ป้องกัน undefined
export default function EnergyProductionChart({ 
  data = [], 
  year = new Date().getFullYear(), 
  month = new Date().getMonth() + 1 
}: EnergyProductionProps) {

  // ตอนนี้ year และ month จะเป็น number แน่นอนแล้ว (ไม่เป็น undefined)
  const daysInMonth = new Date(year, month, 0).getDate();

  // generate day list
  const fullData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;

    // ค้นหาข้อมูล (data เป็น [] แน่นอนถ้าไม่ได้ส่งมา ไม่พังแน่นอน)
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
        {/* เปลี่ยนมาใช้ ComposedChart */}
        <ComposedChart data={fullData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="day"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            yAxisId="left"
            label={{ value: "kWh", angle: -90, position: "insideLeft", dx: -15 }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Wh/m²", angle: 90, position: "insideRight", dx: 15 }}
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