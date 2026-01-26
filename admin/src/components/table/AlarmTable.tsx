import React, { useState } from "react";
import { 
  Download, 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Zap, 
  AlertTriangle, 
  Info,
  Inbox
} from "lucide-react";

// --- Types ---
interface AlarmItem {
  id: string;
  severity: "High" | "Medium" | "Low";
  plantName: string;
  deviceType: string;
  deviceName: string;
  alarmId: string;
  alarmName: string;
  occurrenceTime: string;
}

interface AlarmTableProps {
  data?: AlarmItem[]; // ถ้าไม่มี data หรือ array ว่าง จะแสดง No Data
}

export default function AlarmTable({ data = [] }: AlarmTableProps) {
  // State สำหรับ Toggle Auto Refresh
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // State สำหรับ Pagination (Mock)
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  return (
    <div className="rounded-lg text-sm">
      
      {/* ===== 1. Top Control Bar ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        
        {/* Left: Toggles & Counters */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAutoRefresh(!autoRefresh)}>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${autoRefresh ? 'bg-green-800' : 'bg-gray-400'}`}>
              <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${autoRefresh ? 'left-6' : 'left-1'}`}></div>
            </div>
            <span className="text-black font-medium text-xs">Auto Refresh</span>
          </div>

          {/* Counters (Divided by vertical lines) */}
          <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden md:block"></div>
          
          <div className="flex gap-3">
             {/* Counter 1: Home/Base (Orange) */}
             <div className="flex items-center gap-1.5 bg-[#F4B084] px-3 py-1 rounded-full text-[#5B3016] font-bold min-w-[60px] justify-center">
                <Home size={14} /> <span>0</span>
             </div>
             {/* Counter 2: Fault (Yellow) */}
             <div className="flex items-center gap-1.5 bg-[#FCD34D] px-3 py-1 rounded-full text-[#713F12] font-bold min-w-[60px] justify-center">
                <Zap size={14} fill="currentColor" /> <span>0</span>
             </div>
             {/* Counter 3: Warning (Light Yellow) */}
             <div className="flex items-center gap-1.5 bg-[#FDE68A] px-3 py-1 rounded-full text-[#854D0E] font-bold min-w-[60px] justify-center">
                <AlertTriangle size={14} /> <span>0</span>
             </div>
             {/* Counter 4: Info (Blue) */}
             <div className="flex items-center gap-1.5 bg-[#7DD3FC] px-3 py-1 rounded-full text-[#0C4A6E] font-bold min-w-[60px] justify-center">
                <Info size={14} /> <span>0</span>
             </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2">
          {/* Clear Button */}
          <button className="flex items-center gap-2 px-4 py-1.5 bg-[#2F4F39] text-white rounded border border-[#2F4F39] hover:bg-[#254230] transition-colors">
            <X size={16} />
            <span>Clear</span>
          </button>
          {/* Export File Button */}
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white text-[#2F4F39] rounded border border-[#2F4F39] hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span>Export file</span>
          </button>
        </div>
      </div>

      {/* ===== 2. The Table ===== */}
      <div className="border border-[#2F4F39] rounded-t-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse">
            {/* Table Header */}
            <thead className="bg-green-800 text-white font-light text-sm">
              <tr>
                <th className="py-3 px-4 text-left text-sm border-r border-white/20 w-[140px]">
                  <div className="flex items-center justify-between cursor-pointer font-normal text-sm">
                    <span>Alarm Severity</span>
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Plant Name</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Device Type</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Device Name</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Plant Name</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Alarm ID</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Alarm Name</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Alarm Name</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Alarm Name</th>
                <th className="py-3 px-4 text-left border-r border-white/20 font-normal text-sm text-nowrap">Occurence Time</th>
                <th className="py-3 px-4 text-center w-[100px]">
                   <div className="flex items-center justify-center gap-1 cursor-pointer font-normal">
                    <span>Operation</span>
                    <ChevronDown size={14} />
                   </div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {data.length > 0 ? (
                // กรณีมีข้อมูล (Render Row ปกติ)
                data.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-gray-700">
                    <td className="py-3 px-4 border-r border-gray-200">{item.severity}</td>
                    <td className="py-3 px-4 border-r border-gray-200">{item.plantName}</td>
                    <td className="py-3 px-4 border-r border-gray-200">{item.deviceType}</td>
                    <td className="py-3 px-4 border-r border-gray-200">{item.deviceName}</td>
                    <td className="py-3 px-4 border-r border-gray-200">{item.plantName}</td>
                    <td className="py-3 px-4 border-r border-gray-200">{item.alarmId}</td>
                    <td className="py-3 px-4 border-r border-gray-200">{item.alarmName}</td>
                    <td className="py-3 px-4 border-r border-gray-200">-</td>
                    <td className="py-3 px-4 border-r border-gray-200">-</td>
                    <td className="py-3 px-4 border-r border-gray-200">{item.occurrenceTime}</td>
                    <td className="py-3 px-4 text-center">...</td>
                  </tr>
                ))
              ) : (
                // กรณีไม่มีข้อมูล (Empty State - เหมือนในรูป)
                <tr>
                  <td colSpan={11} className="h-[400px]">
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                       <div className="mb-2">
                         {/* ใช้ Inbox Icon หรือรูปภาพแทน No Data */}
                         <Inbox size={64} strokeWidth={1} className="text-gray-300" />
                       </div>
                       <span className="text-lg font-medium text-gray-400">No Data</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 3. Footer / Pagination ===== */}
      <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
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