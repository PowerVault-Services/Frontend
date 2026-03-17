import { useState, useEffect } from "react";
import PeriodSelector from "../../components/charts/PeriodSelector";
import CalendarSelector from "../../components/charts/CalendarSelector";
import EnergySummary from "../../components/charts/EnergySummary";
import TrendChart from "../../components/charts/TrendChart";

export type PeriodType = "day" | "month" | "year" | "lifetime";

export default function EnergyTrendChart() {
  const [period, setPeriod] = useState<PeriodType>("month");

  const [date, setDate] = useState(new Date());

  const [data, setData] = useState<any[]>([]);

  const summary = {
    yield: 127.92,
    consumption: 706.89,
    fromPV: 127.91,
    fromGrid: 578.98,
    feedToGrid: 11.94
  };

  useEffect(() => {
    // mock data fetch
    if (period === "day") {
      const hours = Array.from({ length: 24 }, (_, i) => ({
        time: `${String(i).padStart(2, "0")}:00`,
        pv: Math.random() * 3,
        grid: Math.random() * 4
      }));
      setData(hours);
    }

    if (period === "month") {
      const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

      const arr = Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        pv: Math.random() * 30,
        grid: Math.random() * 20
      }));

      setData(arr);
    }

    if (period === "year") {
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];

      const arr = months.map(m => ({
        month: m,
        pv: Math.random() * 300,
        grid: Math.random() * 200
      }));

      setData(arr);
    }

    if (period === "lifetime") {
      const startYear = 2019;
      const currentYear = date.getFullYear();

      const arr = Array.from(
        { length: currentYear - startYear + 1 },
        (_, i) => ({
          year: startYear + i,
          pv: Math.random() * 1200
        })
      );

      setData(arr);
    }

  }, [period, date]);

  return (
    <div className="bg-white p-6 rounded-lg border border-[#DEE2E6] space-y-5 mt-5">

      <div className="flex justify-between items-center">

        <h2 className="text-lg font-semibold">Energy Trend</h2>

        <div className="flex items-center gap-3">

          <PeriodSelector period={period} setPeriod={setPeriod} />

          <CalendarSelector
            period={period}
            date={date}
            setDate={setDate}
          />

        </div>

      </div>

      <EnergySummary summary={summary} />

      <TrendChart data={data} period={period} />

    </div>
  );
}