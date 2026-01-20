import { useEffect, useState } from "react";

/* =======================
   Types
======================= */
export interface OperationItem {
  id: number;
  item: string;
  children?: OperationItem[];
}

export interface OperationResult {
  id: number;
  item: string;
  level: number;
  done: boolean;
  remark: string;
}

interface OperationTableProps {
  items?: OperationItem[];
  onChange?: (data: OperationResult[]) => void;
}

/* =======================
   Default Items
======================= */
const DEFAULT_ITEMS: OperationItem[] = [
  {
    id: 1,
    item: "แผงโซลาร์เซลล์",
    children: [
      { id: 11, item: "ตรวจสอบความสะอาดแผงและล้างแผงโซลาร์เซลล์" },
      { id: 12, item: "ตรวจสอบสภาพแผง สึกกร่อน และการเกิดออกไซด์ บน Frame" },
    ],
  },
  {
    id: 2,
    item: "Inverter Unit",
    children: [
      { id: 21, item: "ตรวจสอบสภาพและทำความสะอาด Filter" },
      { id: 22, item: "ตรวจสอบการทำงานของพัดลมระบายอากาศ และดูดฝุ่น" },
    ],
  },
  {
    id: 3,
    item: "Monitoring System",
    children: [
      { id: 31, item: "ตรวจสอบสภาพและทำความสะอาดภายในตู้ควบคุม คอมพิวเตอร์" },
    ],
  },
  {
    id: 4,
    item: "ระบบน้ำทำความสะอาดแผงโซลาร์เซลล์",
    children: [
      { id: 41, item: "ตรวจสอบสภาพและความพร้อมของปั๊มน้ำและอุปกรณ์ Starter" },
      { id: 42, item: "ตรวจสอบสภาพของหัวจ่ายน้ำ" },
    ],
  },
];

/* =======================
   Utils
======================= */
const flattenItems = (items: OperationItem[], level = 0): OperationResult[] =>
  items.flatMap(item => [
    { id: item.id, item: item.item, level, done: false, remark: "" },
    ...(item.children ? flattenItems(item.children, level + 1) : []),
  ]);

/* =======================
   Component
======================= */
export default function OperationTable({
  items = DEFAULT_ITEMS,
  onChange,
}: OperationTableProps) {
  const [rows, setRows] = useState<OperationResult[]>(flattenItems(items));

  useEffect(() => {
    onChange?.(rows);
  }, [rows, onChange]);

  const toggleDone = (id: number) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, done: !r.done } : r)));

  const updateRemark = (id: number, value: string) =>
    setRows(prev => prev.map(r => (r.id === id ? { ...r, remark: value } : r)));

  let mainIndex = 0;

  return (
    <div className="rounded-sm border border-[#CFCFCF] overflow-hidden">
      <table className="w-full border-separate border-spacing-0 text-[12px]">
        <thead className="font-semibold">
          <tr>
            <th className="h-9 w-[62px] border-r border-[#CFCFCF] bg-[#F0F0F0]">ลำดับ</th>
            <th className="h-9 w-[594px] border-r border-[#CFCFCF] bg-[#F0F0F0]">อุปกรณ์ / รายการ</th>
            <th className="h-9 w-[161px] border-r border-[#CFCFCF] bg-[#F0F0F0]">การดำเนินการ</th>
            <th className="h-9 w-[278px] bg-[#F0F0F0]">หมายเหตุ</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(row => {
            const displayIndex = row.level === 0 ? ++mainIndex : "";
            return (
              <tr key={row.id}>
                {/* Index */}
                <td className="h-9 text-center border-t border-r border-[#D6D6D6]">
                  {displayIndex}
                </td>

                {/* Item */}
                <td className="h-9 px-3 py-2.5 border-t border-r border-[#D6D6D6]">
                  <div
                    className={`flex items-center ${
                      row.level ? " text-black" : "font-normal"
                    }`}
                  >
                    {row.level ? "–" : ""}
                    {row.item}
                  </div>
                </td>

                {/* Done */}
                <td className="h-9 text-center border-t border-r border-[#D6D6D6]">
                  {row.level !== 0 && (
                    <input
                      type="checkbox"
                      checked={row.done}
                      onChange={() => toggleDone(row.id)}
                      className="w-4 h-4 accent-green-700"
                    />
                  )}
                </td>

                {/* Remark */}
                <td className="h-9 px-2 border-t border-[#D6D6D6]">
                  {row.level !== 0 && (
                    <input
                      value={row.remark}
                      onChange={e => updateRemark(row.id, e.target.value)}
                      className="w-full h-[26px] px-2 border border-[#B9B9B9] rounded text-[12px] text-blue-700"
                      placeholder="กรอกหมายเหตุ"
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
