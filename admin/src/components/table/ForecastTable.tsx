import type { ForecastTableConfig } from "../../types/forecastTable";

interface ForecastTableProps {
  config: ForecastTableConfig;
}

export default function ForecastTable({ config }: ForecastTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-[1109px] rounded-lg border border-[#CFCFCF]">
        <thead className="bg-green-800 text-white text-xs font-semibold h-9">
          <tr>
            <th className="px-4 py-2 text-center border border-[#CFCFCF]">
              {config.fixedColumn.label}
            </th>
            {config.columns.map((col) => (
              <th key={col.key} className="px-4 py-2 text-center border border-[#CFCFCF]">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {config.rows.map((row) => (
            <tr key={row}>
              <td className="px-4 py-2 font-normal text-xs border border-[#CFCFCF] h-9">{row}</td>
              {config.columns.map((col) => (
                <td key={col.key} className="px-4 py-2 text-center border border-[#CFCFCF]" />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

