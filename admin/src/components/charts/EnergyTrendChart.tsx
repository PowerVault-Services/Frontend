import { useState } from "react";
import PeriodSelector from "../../components/charts/PeriodSelector";
import CalendarSelector from "../../components/charts/CalendarSelector";
import EnergySummary from "../../components/charts/EnergySummary";
import TrendChart from "../../components/charts/TrendChart";

export type PeriodType = "day" | "month" | "year" | "lifetime";

interface EnergyTrendProps {
    charts?: {
      trend?: any[];
      trendDay?: any[];
      trendYear?: any[];
      trendLifetime?: any[];
    };
    summary?: {
      yield: number;
      consumption: number;
      fromPV: number;
      fromGrid: number;
      feedToGrid: number;
    };
}

export default function EnergyTrendChart({ charts, summary }: EnergyTrendProps) {
  const [period, setPeriod] = useState<PeriodType>("month");
  const [date, setDate] = useState(new Date());

  const defaultSummary = {
    yield: 0,
    consumption: 0,
    fromPV: 0,
    fromGrid: 0,
    feedToGrid: 0,
  };

  const trendData =
    period === "day"      ? (charts?.trendDay || [])
    : period === "month"  ? (charts?.trend || [])
    : period === "year"   ? (charts?.trendYear || [])
    : (charts?.trendLifetime || []);

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

      <EnergySummary summary={summary || defaultSummary} />

      <TrendChart data={trendData} period={period} />

    </div>
  );
}