import type { PeriodType } from "./EnergyTrendChart";

interface Props {
  period: PeriodType;
  setPeriod: (p: PeriodType) => void;
}

export default function PeriodSelector({ period, setPeriod }: Props) {

  const periods: PeriodType[] = ["day","month","year","lifetime"];

  return (
    <div className="flex border rounded-md overflow-hidden text-sm">

      {periods.map(p => (
        <button
          key={p}
          onClick={() => setPeriod(p)}
          className={`px-3 py-1 capitalize ${
            period === p
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {p}
        </button>
      ))}

    </div>
  );
}