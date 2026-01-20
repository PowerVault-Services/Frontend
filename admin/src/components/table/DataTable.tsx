export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
} 

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  label?: string;
  width?: string;
  loading?: boolean;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function DataTable<T>({
  columns,
  data,
  loading = false,
}: DataTableProps<T>) {
  return (
    <div className="rounded-2xl overflow-x-auto border border-[#DEE2E6]">
      <table className="w-full border-collapse">
        {/* ---------- Header ---------- */}
        <thead className="bg-green-700 text-white">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`
                  px-4 py-3
                  text-xs font-light
                  ${alignClass[col.align ?? "left"]}
                  border-r border-[#DEE2E6]
                  last:border-r-0
                  whitespace-normal wrap-break-word
                  align-middle
                `}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ---------- Body ---------- */}
        <tbody className="bg-white">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 border-t border-[#DEE2E6]"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 border-t border-[#DEE2E6]"
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-t border-[#DEE2E6] text-sm text-gray-700">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    style={{ width: col.width }}
                    className={`
                      px-4 py-3
                      ${alignClass[col.align ?? "left"]}
                      border-r border-[#DEE2E6]
                      last:border-r-0
                    `}
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "-")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
