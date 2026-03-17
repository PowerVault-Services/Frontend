import { type PeriodType } from "./EnergyTrendChart";

interface Props {
  period: PeriodType;
  date: Date;
  setDate: (d: Date) => void;
}

export default function CalendarSelector({ period, date, setDate }: Props) {

  const handleChange = (value: string) => {
    setDate(new Date(value));
  };

  if (period === "day") {
    return (
      <input
        type="date"
        value={date.toISOString().slice(0,10)}
        onChange={(e)=>handleChange(e.target.value)}
        className="border px-2 py-1 rounded text-sm"
      />
    );
  }

  if (period === "month") {
    return (
      <input
        type="month"
        value={date.toISOString().slice(0,7)}
        onChange={(e)=>handleChange(e.target.value)}
        className="border px-2 py-1 rounded text-sm"
      />
    );
  }

  if (period === "year" || period === "lifetime") {
    return (
      <input
        type="number"
        value={date.getFullYear()}
        min="2000"
        max="2100"
        onChange={(e)=>handleChange(`${e.target.value}-01-01`)}
        className="border px-2 py-1 rounded text-sm w-24"
      />
    );
  }

  return null;
}