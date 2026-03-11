
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import nonconnecticon from "../../assets/icons/nonconnect.svg";
import createicon from "../../assets/icons/add_bold.svg";
import api from "../../services/api";

/* ===== Backend Alarm Type ===== */
interface Alarm {
  id: number;
  severity: number;
  severityText: string;
  plantName: string;
  deviceType: string | null;
  deviceName: string;
  alarmName: string;
  alarmId: string;
  sn: string;
  occurredAt: string;
  clearedAt?: string | null;
  status: string;
  raw?: any;
}

/* ===== Props ===== */
interface AlarmTableProps {
  data: Alarm[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  showClearedAt?: boolean;
}

export default function AlarmTable({
  data,
  page,
  totalPages,
  onPageChange,
  onRefresh,
  showClearedAt = false,
}: AlarmTableProps) {

  const navigate = useNavigate();


  /* ===== Export CSV ===== */
  const handleExport = async () => {
    try {
      const res = await api.get("/alarms/export", {
        params: { tab: "active" },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "alarms.csv";
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  useEffect(() => {
    onRefresh(); // โหลดครั้งแรก

    const interval = setInterval(() => {
      onRefresh?.();
    }, 30000);

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="rounded-lg text-sm">

      {/* ===== 1. Top Control Bar ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">

        {/* <div className="flex flex-wrap items-center gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <div className={`w-10 h-5 rounded-full relative transition-colors ${autoRefresh ? 'bg-green-800' : 'bg-gray-400'}`}>
              <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${autoRefresh ? 'left-6' : 'left-1'}`}></div>
            </div>
            <span className="text-black font-medium text-xs">Auto Refresh</span>
          </div>

          <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden md:block"></div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 bg-[#F4B084] px-3 py-1 rounded-full text-[#5B3016] font-bold min-w-[60px] justify-center">
              <Home size={14} /> <span>0</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FCD34D] px-3 py-1 rounded-full text-[#713F12] font-bold min-w-[60px] justify-center">
              <Zap size={14} fill="currentColor" /> <span>0</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FDE68A] px-3 py-1 rounded-full text-[#854D0E] font-bold min-w-[60px] justify-center">
              <AlertTriangle size={14} /> <span>0</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#7DD3FC] px-3 py-1 rounded-full text-[#0C4A6E] font-bold min-w-[60px] justify-center">
              <Info size={14} /> <span>0</span>
            </div>
          </div>
        </div> */}

        <div className="flex gap-2 ml-auto">

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-1.5 bg-white text-[#2F4F39] rounded border border-[#2F4F39] hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            <span>Export file</span>
          </button>
        </div>
      </div>

      {/* ===== 2. Table ===== */}
      <div className="border border-[#2F4F39] rounded-t-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse">
            <thead className="bg-green-800 text-white font-light text-sm">
              <tr>
                <th className="py-3 px-4 text-left border-r border-white/20 w-[140px]">
                  <div className="flex items-center justify-between">
                    <span>Alarm Severity</span>
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="py-3 px-4 border-r border-white/20">Plant Name</th>
                <th className="py-3 px-4 border-r border-white/20">Device Type</th>
                <th className="py-3 px-4 border-r border-white/20">Device Name</th>
                <th className="py-3 px-4 border-r border-white/20">SN</th>
                <th className="py-3 px-4 border-r border-white/20">Alarm ID</th>
                <th className="py-3 px-4 border-r border-white/20">Alarm Name</th>
                <th className="py-3 px-4 border-r border-white/20">Occurence Time</th>
                {!showClearedAt && (
                  <th className="py-3 px-4 border-r border-white/20">Create Service</th>
                )}
                {showClearedAt && (
                  <th className="py-3 px-4 border-r border-white/20">Clear Alarm</th>
                )}
                {showClearedAt && (
                  <th className="py-3 px-4 border-r border-white/20">Status</th>
                )}
                
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50 text-gray-700"
                  >
                    <td className="py-3 px-4 border-r">
                      {item.severityText}
                    </td>

                    <td className="py-3 px-4 border-r">
                      {item.plantName}
                    </td>

                    <td className="py-3 px-4 border-r">
                      {item.deviceType ?? "-"}
                    </td>

                    <td className="py-3 px-4 border-r">
                      {item.deviceName}
                    </td>

                    <td className="py-3 px-4 border-r">
                      {item.sn}
                    </td>

                    <td className="py-3 px-4 border-r">
                      {item.alarmId}
                    </td>

                    <td className="py-3 px-4 border-r">
                      {item.alarmName}
                    </td>

                    <td className="py-3 px-4 border-r">
                      {new Date(item.occurredAt).toLocaleString()}
                    </td>

                    {!showClearedAt && (
                      <td className="py-3 px-4 items-center justify-center flex"
                        onClick={() => navigate('/service/new/step1')}
                      >
                        <img src={createicon} alt="" />
                      </td>
                    )}

                    {showClearedAt && (
                      <td className="py-3 px-4 border-r">
                        {item.clearedAt ?? "-"}
                      </td>
                    )}

                    {showClearedAt && (
                      <td className="py-3 px-4 items-center justify-center flex">
                        <img src={nonconnecticon} alt="" />
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="h-[400px]">
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Inbox size={64} strokeWidth={1} className="text-gray-300" />
                      <span className="text-lg font-medium text-gray-400">
                        No Data
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 3. Pagination ===== */}
      <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
        <div>Page {page} of {totalPages}</div>

        <div className="flex gap-1">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          <button className="w-8 h-8 border rounded border-[#2F4F39] text-[#2F4F39] font-bold">
            {page}
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}