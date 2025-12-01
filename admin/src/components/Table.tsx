interface Column {
  key: string;
  label: string;
  width?: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
}

export default function Table({ columns, data }: TableProps) {
  return (
    <div
      className="
        w-full max-w-[1320px]
        bg-white 
        border border-[#DEE2E6]
        rounded-t-2xl
        rounded-b-sm
        overflow-hidden
        shadow-sm
      "
    >
      <table className="w-full border-collapse">
        {/* HEAD */}
        <thead>
          <tr className="bg-green-700 h-14 text-white text-sm">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                style={{ width: col.width || "auto" }}
                className={`
                  px-4 text-left font-medium
                  ${idx === 0 ? "rounded-tl-2xl" : ""}
                  ${idx === columns.length - 1 ? "rounded-tr-2xl" : ""}
                  ${col.className ?? ""}
                `}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                No data
              </td>
            </tr>
          )}

          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="h-[52px] border-b border-[#DEE2E6] text-sm"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 text-green-900">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
