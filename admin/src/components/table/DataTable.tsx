import React from "react";

export interface Column<T> {
  id: string;
  key?: keyof T;
  label: React.ReactNode;
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

export default function DataTable<T extends { id: number | string }>({
  columns,
  data,
  loading = false,
}: DataTableProps<T>) {

  if (loading) {
    return (
      <div className="rounded-2xl overflow-x-auto border border-[#DEE2E6]">
        <table className="w-full border-collapse">
          <thead className="bg-[#356A2E] text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={`head-${col.id}`}
                  className="px-4 py-4 text-center text-[15px] font-medium border-r border-green-200 last:border-none"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400"
              >
                Loading...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-x-auto border border-[#DEE2E6]">
      <table className="w-full border-collapse">

        {/* ---------- Header ---------- */}
        <thead className="bg-[#356A2E] text-white">
          <tr>
            {columns.map((col, colIndex) => (
              <th
                key={`head-${col.id}-${colIndex}`}
                className="px-4 py-4 text-center text-[15px] font-medium border-r border-green-200 last:border-none"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ---------- Body ---------- */}
        <tbody className="bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400"
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={`row-${row.id}-${rowIndex}`}
                className="border-t border-gray-300"
              >
                {columns.map((col, colIndex) => {

                  const value = col.key ? row[col.key] : undefined;

                  return (
                    <td
                      key={`cell-${row.id}-${col.id}-${colIndex}`}
                      className={`px-4 py-4 text-[15px] border-r border-gray-300 last:border-none ${
                        alignClass[col.align ?? "center"]
                      }`}
                    >
                      {col.render
                        ? col.render(value, row)
                        : (value ?? "-") as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
}