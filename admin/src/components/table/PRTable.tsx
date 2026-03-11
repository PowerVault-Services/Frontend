import React, { useState } from "react";

interface Metric {
  actual: number | null;
  forecast: number | null;
  varPct: number | null;
}

interface PRRowFromAPI {
  id: number;
  plantName: string;
  irradiation: Metric;
  production: Metric;
  pr: Metric;
}

interface PRTableProps {
  data?: PRRowFromAPI[];
  loading?: boolean;
}

export default function PRTable({
  data = [],
  loading = false
}: PRTableProps) {

  const [selectedPlants, setSelectedPlants] = useState<number[]>([]);

  const formatValue = (val: number | null, isPercent = false) => {
    if (val === null || val === undefined) return "-";
    return isPercent
      ? `${val.toFixed(2)}%`
      : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const togglePlant = (id: number) => {
    setSelectedPlants(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  /* ===== Export CSV ===== */

  const handleExport = () => {

    const rows = data.filter(r =>
      selectedPlants.includes(r.id)
    );

    const csv = [
      [
        "Plant",
        "Irradiation Actual",
        "Irradiation Forecast",
        "Irradiation Var%",
        "Production Actual",
        "Production Forecast",
        "Production Var%",
        "PR Actual",
        "PR Forecast",
        "PR Var%"
      ],
      ...rows.map(r => [
        r.plantName,
        r.irradiation.actual,
        r.irradiation.forecast,
        r.irradiation.varPct,
        r.production.actual,
        r.production.forecast,
        r.production.varPct,
        r.pr.actual,
        r.pr.forecast,
        r.pr.varPct
      ])
    ].map(r => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "plant-summary.csv";
    link.click();
  };

  return (
    <div className="relative">

      {/* Export Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={handleExport}
          className="flex items-center px-7 py-3 gap-1.5 bg-white shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-2 border-green-700 rounded-md text-xs text-green-700 font-normal"
        >
          Export Excel
        </button>
      </div>

      <div
        className={`border border-gray-200 rounded-t-lg overflow-hidden transition-opacity duration-300 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"
          }`}
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] bg-white border-collapse text-sm">

            {/* ===== Header ===== */}

            <thead className="bg-green-700 text-white">

              <tr>

                <th
                  rowSpan={2}
                  className="py-3 px-4 text-center font-normal border-r border-white/20"
                >
                  Select
                </th>

                <th
                  rowSpan={2}
                  className="py-3 px-4 text-center font-normal border-r border-white/20"
                >
                  Plant
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

                {["Actual", "Forecast", "Var%"].map((label, i) => (
                  <th
                    key={`irr-${i}`}
                    className="py-2 px-4 text-center font-normal border-r border-white/20"
                  >
                    {label}
                  </th>
                ))}

                {["Actual", "Forecast", "Var%"].map((label, i) => (
                  <th
                    key={`prod-${i}`}
                    className="py-2 px-4 text-center font-normal border-r border-white/20"
                  >
                    {label}
                  </th>
                ))}

                {["Actual", "Forecast", "Var%"].map((label, i) => (
                  <th
                    key={`pr-${i}`}
                    className="py-2 px-4 text-center font-normal border-r border-white/20"
                  >
                    {label}
                  </th>
                ))}

              </tr>

            </thead>

            {/* ===== Body ===== */}

            <tbody className="text-gray-700">

              {data.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >

                  <td className="py-3 px-4 text-center border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedPlants.includes(row.id)}
                      onChange={() => togglePlant(row.id)}
                    />
                  </td>

                  <td className="py-3 px-4 border-r border-gray-200">
                    {row.plantName}
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

      {/* Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  );
}