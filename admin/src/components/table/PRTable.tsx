import React from "react";


interface Metric {
  actual: number | null;
  forecast: number | null;
  varPct: number | null;
}

interface PRRowFromAPI {
  month?: number;
  year?: number;
  date?: string;
  irradiation: Metric;
  production: Metric;
  pr: Metric;
}

interface PRTableProps {
  data?: PRRowFromAPI[];
  year?: number;
  loading?: boolean; // 👈 รองรับ loading
}

const monthLabels = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

export default function PRTable({
  data = [],
  year,
  loading = false
}: PRTableProps) {

  const formatValue = (val: number | null, isPercent = false) => {
    if (val === null || val === undefined) return "-";
    return isPercent
      ? `${val.toFixed(2)}%`
      : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const displayYear =
    year ??
    data?.[0]?.year ??
    new Date().getFullYear();

  const yearShort = String(displayYear).slice(-2);

  const rows = monthLabels.map((_, index) => {
    const found = data.find(d => d.month === index + 1);
    return (
      found || {
        month: index + 1,
        irradiation: { actual: null, forecast: null, varPct: null },
        production: { actual: null, forecast: null, varPct: null },
        pr: { actual: null, forecast: null, varPct: null }
      }
    );
  });

  return (
    <div className="relative bg-white">

      {/* ===== Table Wrapper ===== */}
      <div
        className={`border border-gray-200 rounded-t-lg overflow-hidden transition-opacity duration-300 ${
          loading ? "opacity-40 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">

            <thead className="bg-green-700 text-white">
              <tr>
                <th
                  rowSpan={2}
                  className="py-3 px-4 text-left font-normal border-r border-white/20"
                >
                  Month
                </th>

                <th colSpan={3} className="py-3 px-2 text-center font-normal border-r border-white/20">
                  Irradiation (kWh / m2)
                </th>

                <th colSpan={3} className="py-3 px-2 text-center font-normal border-r border-white/20">
                  Production (kWh)
                </th>

                <th colSpan={3} className="py-3 px-2 text-center font-normal">
                  Performance Ratio (%)
                </th>
              </tr>

              <tr>
                {["Actual","Forecast","Var%"].map((label, i) => (
                  <th
                    key={`irr-${i}`}
                    className="py-2 px-4 text-center font-normal border-r border-white/20"
                  >
                    {label}
                  </th>
                ))}
                {["Actual","Forecast","Var%"].map((label, i) => (
                  <th
                    key={`prod-${i}`}
                    className="py-2 px-4 text-center font-normal border-r border-white/20"
                  >
                    {label}
                  </th>
                ))}
                {["Actual","Forecast","Var%"].map((label, i) => (
                  <th
                    key={`pr-${i}`}
                    className="py-2 px-4 text-center font-normal border-r border-white/20"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-left border-r border-gray-200">
                    {monthLabels[(row.month ?? 1) - 1]}-{yearShort}
                  </td>

                  {/* Irradiation */}
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.irradiation.actual)}
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.irradiation.forecast)}
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.irradiation.varPct, true)}
                  </td>

                  {/* Production */}
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.production.actual)}
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.production.forecast)}
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.production.varPct, true)}
                  </td>

                  {/* PR */}
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.pr.actual)}
                  </td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    {formatValue(row.pr.forecast)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {formatValue(row.pr.varPct, true)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* ===== Spinner Overlay ===== */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
}