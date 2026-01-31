import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// --- Types ---
export interface PRDataRow {
  id: string;
  // Irradiation
  irrActual: number | string;
  irrForecast: number | string;
  irrVar: number | string;
  // Production
  prodActual: number | string;
  prodForecast: number | string;
  prodVar: number | string;
  // Performance Ratio
  prActual: number | string;
  prForecast: number | string;
  prVar: number | string;
}

interface PRTableProps {
  data?: PRDataRow[];
}

export default function PRTable({ data = [] }: PRTableProps) {
  // Mock Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  const emptyRows = Math.max(0, 4 - data.length); 

  return (
    <div className="bg-white">
      
      {/* ===== Table Container ===== */}
      <div className="border border-gray-200 rounded-t-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            
            {/* ===== Table Header ===== */}
            <thead className="bg-green-700 text-white">
              {/* Row 1: Main Categories */}
              <tr>
                <th colSpan={3} className="py-3 px-2 text-center font-normal border-r border-[#B9B9B9] border-b border-white/20">
                  Irradiation (kWh / m2)
                </th>
                <th colSpan={3} className="py-3 px-2 text-center font-normal border-r border-[#B9B9B9] border-b border-white/20">
                  Production (kWh)
                </th>
                <th colSpan={3} className="py-3 px-2 text-center font-normal border-b border-white/20">
                  Performance Ratio (%)
                </th>
              </tr>
              
              {/* Row 2: Sub Categories (Actual, Forecast, Var%) */}
              <tr className="">
                {/* Irradiation Sub-cols */}
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Actual</th>
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Forecast</th>
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Var%</th>
                
                {/* Production Sub-cols */}
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Actual</th>
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Forecast</th>
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Var%</th>
                
                {/* PR Sub-cols */}
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Actual</th>
                <th className="py-2 px-4 text-center font-normal  border-r border-white/20 w-[11%]">Forecast</th>
                <th className="py-2 px-4 text-center font-normal  w-[11%]">Var%</th>
              </tr>
            </thead>

            {/* ===== Table Body ===== */}
            <tbody className="text-gray-700">
              {/* Render Data Rows */}
              {data.map((row, idx) => (
                <tr key={row.id || idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.irrActual}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.irrForecast}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.irrVar}</td>
                  
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.prodActual}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.prodForecast}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.prodVar}</td>
                  
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.prActual}</td>
                  <td className="py-3 px-4 text-center border-r border-gray-200">{row.prForecast}</td>
                  <td className="py-3 px-4 text-center">{row.prVar}</td>
                </tr>
              ))}

              {/* Render Empty Rows */}
              {Array.from({ length: emptyRows }).map((_, idx) => (
                <tr key={`empty-${idx}`} className="border-b border-gray-200 h-[45px]">
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Pagination Footer ===== */}
      <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
        {/* ข้อความฝั่งซ้าย (Mock ตามรูป) */}
        <div>1 to 9 of 7 items</div>
        
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          
          <button 
             className={`w-8 h-8 flex items-center justify-center border rounded ${currentPage === 1 ? 'border-[#2F4F39] text-[#2F4F39] font-bold' : 'border-gray-200'}`}
             onClick={() => setCurrentPage(1)}
          >
            1
          </button>
          
          <button 
             className={`w-8 h-8 flex items-center justify-center border rounded ${currentPage === 2 ? 'border-[#2F4F39] text-[#2F4F39] font-bold' : 'border-gray-200'}`}
             onClick={() => setCurrentPage(2)}
          >
            2
          </button>

          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}