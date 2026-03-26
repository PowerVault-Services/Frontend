import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Pagination from "../../components/table/Pagination";

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
  month?: string;
}

interface PRTableProps {
  data?: PRRowFromAPI[];
  loading?: boolean;
  startMonth?: string;
  endMonth?: string;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;

  mode?: "plant" | "month";
}

export default function PRTable({
  data = [],
  loading = false,
  startMonth,
  endMonth,
  page,
  pageSize,
  total,
  onPageChange,
  mode = "plant",
}: PRTableProps) {
  // ===== STATE =====
  const [selectedPlants, setSelectedPlants] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const totalPages = Math.ceil(total / pageSize);

  // ===== LOGIC: SELECT ALL (ในหน้านั้นๆ) =====
  const isAllSelected = data.length > 0 && selectedPlants.length === data.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedPlants([]);
    } else {
      setSelectedPlants(data.map((row) => row.id));
    }
  };

  const togglePlant = (id: number) => {
    setSelectedPlants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Reset checkbox เมื่อเปลี่ยนหน้า
  useEffect(() => {
    setSelectedPlants([]);
  }, [page]);

  // ===== HELPER: FORMAT VALUE =====
  const formatValue = (val: number | null, isPercent = false) => {
    if (val === null || val === undefined) return "-";
    return isPercent
      ? `${val.toFixed(2)}%`
      : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // ===== EXPORT CSV LOGIC =====
  const handleExport = async () => {
    if (selectedPlants.length === 0) {
      alert("กรุณาเลือก Plant อย่างน้อย 1 รายการก่อนทำการ Export");
      return;
    }

    setIsExporting(true);
    try {
      const res = await api.get("/monitoring/pr/export", {
        params: {
          siteIds: selectedPlants.join(","),
          startMonth,
          endMonth,
        },
        responseType: "blob",
      });

      const fileName = `PR_Report_${startMonth || "start"}_to_${endMonth || "end"}.csv`;

      const blob = new Blob([res.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Export error:", error);
      alert("ไม่สามารถ Export ข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      {/* Export Button Section */}
      <div className="flex justify-end mb-3">
        {mode === "plant" && (
          <button
            onClick={handleExport}
            disabled={isExporting || selectedPlants.length === 0}
            className={`flex items-center px-7 py-3 gap-1.5 bg-white shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-2 rounded-md text-xs font-normal transition-all
              ${isExporting || selectedPlants.length === 0
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-green-700 text-green-700 hover:bg-green-50 active:scale-95"
              }`}
          >
            {isExporting ? (
              <>
                <div className="w-3 h-3 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              "Export CSV"
            )}
          </button>
        )}
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
                <th rowSpan={2} className="py-3 px-4 text-center font-normal border-r border-white/20">
                  <div className="flex flex-col items-center gap-1">
                    {mode === "plant" && (
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    )}
                  </div>
                </th>
                <th rowSpan={2} className="py-3 px-4 text-center font-normal border-r border-white/20">
                  {mode === "plant" ? "Plant" : "Month"}
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
                  <th key={`irr-${i}`} className="py-2 px-4 text-center font-normal border-r border-white/20">
                    {label}
                  </th>
                ))}
                {["Actual", "Forecast", "Var%"].map((label, i) => (
                  <th key={`prod-${i}`} className="py-2 px-4 text-center font-normal border-r border-white/20">
                    {label}
                  </th>
                ))}
                {["Actual", "Forecast", "Var%"].map((label, i) => (
                  <th key={`pr-${i}`} className="py-2 px-4 text-center font-normal border-r border-white/20">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ===== Body ===== */}
            <tbody className="text-gray-700">
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <tr key={row.id || idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-center border-r border-gray-200">
                      {mode === "plant" && (
                        <input
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer accent-green-600"
                          checked={selectedPlants.includes(row.id)}
                          onChange={() => togglePlant(row.id)}
                        />
                      )}
                    </td>
                    <td className="py-3 px-4 border-r border-gray-200 font-medium">
                      {mode === "plant" ? row.plantName : row.month}
                    </td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.irradiation.actual)}</td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.irradiation.forecast)}</td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.irradiation.varPct, true)}</td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.production.actual)}</td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.production.forecast)}</td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.production.varPct, true)}</td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.pr.actual)}</td>
                    <td className="py-3 px-4 text-center border-r border-gray-200">{formatValue(row.pr.forecast)}</td>
                    <td className="py-3 px-4 text-center">{formatValue(row.pr.varPct, true)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-10 text-center text-gray-400 italic">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== Footer / Pagination ===== */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
          <span>
            Showing <b>{(page - 1) * pageSize + 1}</b> to <b>{Math.min(page * pageSize, total)}</b> of <b>{total}</b> items
          </span>
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-[1px] z-10">
          <div className="w-10 h-10 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}