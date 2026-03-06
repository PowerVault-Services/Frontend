import { useState, useEffect } from "react";
import type { ReportItem } from "../../services/report.api";

interface Props {
  reports: ReportItem[];
  loading?: boolean;
}

export default function ReportViewe({ reports, loading }: Props) {

  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [searchTerm] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    if (reports.length && !selectedReport) {
      setSelectedReport(reports[0]);
    }
  }, [reports]);

  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading reports...
      </div>
    );
  }

  const previewUrl = selectedReport?.previewUrl
    ? `${API_BASE}${selectedReport.previewUrl}`
    : "";

  const downloadUrl = selectedReport?.downloadUrl
    ? `${API_BASE}${selectedReport.downloadUrl}`
    : "";

  return (
    <div className="w-full h-[calc(100vh-100px)] min-h-[600px] bg-white border border-gray-200 rounded-xl shadow-sm flex overflow-hidden">

      {/* LEFT SIDE */}
      <div className="w-1/3 min-w-[300px] border-r border-gray-200 flex flex-col bg-white">

        <div className="p-6 border-b border-gray-100">
          <h4 className="text-green-800">รายการเอกสาร</h4>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {filteredReports.map((report) => (

            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`
                cursor-pointer p-4 border-b border-gray-50 transition-all duration-200
                hover:bg-gray-50
                ${selectedReport?.id === report.id
                  ? "bg-green-50 border-l-4 border-l-green-500"
                  : "border-l-4 border-l-transparent"}
              `}
            >

              <div className="flex justify-between items-start mb-1">
                <p className={`text-lg font-medium ${selectedReport?.id === report.id ? "text-green-900" : "text-gray-700"}`}>
                  {report.title}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                <span>
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium 
                  ${report.status === 'COMPLETED'
                    ? 'bg-green-100 text-green-700'
                    : report.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'}
                `}>
                  {report.status}
                </span>

              </div>

            </div>

          ))}

          {filteredReports.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              ไม่พบเอกสาร
            </div>
          )}

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-gray-50 flex flex-col h-full">

        {selectedReport && (

          <>
            <div className="h-16 border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-10">

              <div>
                <h5 className="text-gray-800 truncate">
                  {selectedReport.title}
                </h5>

                <p className="text-xs text-gray-500">
                  ประเภทไฟล์: PDF • อัปเดตเมื่อ:
                  {new Date(selectedReport.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 border transition"
                >
                  Print
                </button>

                <a
                  href={downloadUrl}
                  download
                  className="px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 shadow-sm transition"
                >
                  Download
                </a>

              </div>

            </div>

            {/* Preview */}
            <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">

              {previewUrl ? (
                <iframe
                  src={previewUrl}
                  className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg rounded-sm"
                />
              ) : (
                <div className="text-gray-400">No preview available</div>
              )}

            </div>

          </>
        )}

      </div>

    </div>
  );
}