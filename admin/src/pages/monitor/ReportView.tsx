import { useState } from "react";

const MOCK_REPORTS = [
  { id: 1, title: "รายงานสรุปยอดขายประจำเดือน ม.ค.", date: "21 ม.ค. 2026", type: "PDF", status: "Completed" },
  { id: 2, title: "เอกสารแจ้งหนี้ (Invoice) #INV-2024001", date: "20 ม.ค. 2026", type: "PDF", status: "Pending" },
  { id: 3, title: "รายงานประสิทธิภาพ Solar Cell", date: "18 ม.ค. 2026", type: "CSV", status: "Completed" },
  { id: 4, title: "บันทึกการซ่อมบำรุงประจำปี", date: "15 ม.ค. 2026", type: "PDF", status: "Completed" },
  { id: 5, title: "รายการเบิกจ่ายวัสดุสิ้นเปลือง", date: "10 ม.ค. 2026", type: "PDF", status: "Rejected" },
];

export default function ReportViewe() {
  
  const [selectedReport, setSelectedReport] = useState(MOCK_REPORTS[0]);
  const [searchTerm] = useState("");

  
  const filteredReports = MOCK_REPORTS.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-[calc(100vh-100px)] min-h-[600px] bg-white border border-gray-200 rounded-xl shadow-sm flex overflow-hidden">
      
      {/* --- LEFT SIDE: List --- */}
      <div className="w-1/3 min-w-[300px] border-r border-gray-200 flex flex-col bg-white">
        
        {/* Header ของ List */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-green-800">รายการเอกสาร</h4>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`
                cursor-pointer p-4 border-b border-gray-50 transition-all duration-200
                hover:bg-gray-50
                ${selectedReport.id === report.id ? "bg-green-50 border-l-4 border-l-green-500" : "border-l-4 border-l-transparent"}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <p className={`text-lg font-medium ${selectedReport.id === report.id ? "text-green-900" : "text-gray-700"}`}>
                  {report.title}
                </p>
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                <span>{report.date}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium 
                  ${report.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                    report.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                `}>
                  {report.status}
                </span>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
             <div className="p-8 text-center text-gray-400 text-sm">ไม่พบเอกสาร</div>
          )}
        </div>
      </div>

      {/* --- RIGHT SIDE: Preview --- */}
      <div className="flex-1 bg-gray-50 flex flex-col h-full">
        
        {/* Preview Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm z-10">
           <div>
              <h5 className="text-gray-800 truncate">{selectedReport.title}</h5>
              <p className="text-xs text-gray-500">ประเภทไฟล์: {selectedReport.type} • อัปเดตเมื่อ: {selectedReport.date}</p>
           </div>
           
           {/* Action Buttons */}
           <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 border border-gray-200 transition">
                Print
              </button>
              <button className="px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 shadow-sm transition">
                Download
              </button>
           </div>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
            {/* จำลองกระดาษ A4 */}
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg rounded-sm p-10 flex flex-col items-center justify-center text-gray-300 animate-in fade-in duration-300">
                {/* เนื้อหาจำลอง (ในงานจริงคือ <iframe src={pdfUrl} /> หรือ Image) */}
                <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">{selectedReport.type}</span>
                </div>
                <p>ตัวอย่างการแสดงผลเอกสาร</p>
                <h3 className="text-xl font-semibold text-gray-800 mt-4 text-center">{selectedReport.title}</h3>
                <div className="w-full h-px bg-gray-200 my-8"></div>
                <div className="space-y-4 w-full">
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-100 rounded w-4/6"></div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}