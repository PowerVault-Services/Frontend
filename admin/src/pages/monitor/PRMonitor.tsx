import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import PRTable from "../../components/table/PRTable";
import api from "../../services/api";

export default function PRMonitor() {
    const navigate = useNavigate();

    // ===== Filter States =====
    const [projectName, setProjectName] = useState("");
    
    // เก็บ State เป็น YYYY-MM (ค่าเริ่มต้นเป็นค่าว่าง เพื่อดึงข้อมูลทั้งหมด)
    const [startMonth, setStartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);
    const [total, setTotal] = useState(0);

    // ===== Data States =====
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ===== Fetch API =====
    const fetchPR = useCallback(async (searchParams: { start: string; end: string; q: string }) => {
        try {
            setLoading(true);

            // API ต้องการ YYYY-MM ซึ่ง input type="month" จะคืนค่า YYYY-MM มาให้อยู่แล้ว
            const res = await api.get("/monitoring/pr/sites", {
                params: {
                    startMonth: searchParams.start || undefined,
                    endMonth: searchParams.end || undefined,
                    q: searchParams.q || undefined,
                },
            });

            const list = res.data?.data?.list ?? [];

            const mapped = list.map((item: any) => ({
                id: item.siteId,
                plantName: item.plantName,
                irradiation: item.totals?.irradiation ?? { actual: null, forecast: null, varPct: null },
                production: item.totals?.production ?? { actual: null, forecast: null, varPct: null },
                pr: item.totals?.pr ?? { actual: null, forecast: null, varPct: null },
            }));

            setRows(mapped);
            setTotal(mapped.length);

        } catch (error: any) {
            console.error("Fetch PR error:", error.response?.data || error);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, []); 

    // ===== 1. ดึงข้อมูลครั้งแรกตอนโหลดหน้าเว็บ =====
    useEffect(() => {
        // ดึงด้วยค่าว่างทั้งหมด
        fetchPR({ start: "", end: "", q: "" });
    }, [fetchPR]);

    // ===== 2. ฟังก์ชันปุ่ม Search =====
    const handleSearch = () => {
        setPage(1);
        fetchPR({ start: startMonth, end: endMonth, q: projectName });
    };

    // ===== 3. ฟังก์ชันปุ่ม Reset =====
    const handleReset = () => {
        setProjectName("");
        setStartMonth("");
        setEndMonth("");
        setPage(1);
        
        // ส่งคำสั่งดึงข้อมูลด้วยค่าว่าง
        fetchPR({ start: "", end: "", q: "" });
    };

    return (
        <div className="w-full">
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800 text-2xl font-bold">%PR</h1>

                <button
                    className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5 hover:bg-green-600 transition"
                    onClick={() => navigate("/monitor/forecast/new")}
                >
                    <img src={AddIcon} alt="" />
                    Add Forecast Data
                </button>
            </div>

            <div className="pb-[62px]">
                <SearchBox onSearch={handleSearch} onReset={handleReset}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        
                        <TextInputFilter
                            label="Project Name"
                            value={projectName}
                            onChange={setProjectName}
                        />

                        {/* ===== Start Month Picker (เดือน + ปี) ===== */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-[13px] text-green-800 font-semibold pl-1">
                                Start Month
                            </label>
                            <input
                                type="month"
                                value={startMonth}
                                onChange={(e) => setStartMonth(e.target.value)}
                                className="w-full h-10 px-3 border border-[#DEE2E6] rounded-[8px] text-sm text-gray-600 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
                            />
                        </div>

                        {/* ===== End Month Picker (เดือน + ปี) ===== */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <label className="text-[13px] text-green-800 font-semibold pl-1">
                                End Month
                            </label>
                            <input
                                type="month"
                                value={endMonth}
                                min={startMonth} // บล็อกไม่ให้เลือกอดีตย้อนหลังก่อน Start Month
                                onChange={(e) => setEndMonth(e.target.value)}
                                className="w-full h-10 px-3 border border-[#DEE2E6] rounded-[8px] text-sm text-gray-600 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
                            />
                        </div>

                    </div>
                </SearchBox>
            </div>

            <PRTable
                data={rows}
                loading={loading}
                startMonth={startMonth || undefined}
                endMonth={endMonth || undefined}
                page={page}
                pageSize={pageSize}
                total={total}
                onPageChange={setPage}
            />
            
        </div>
    );
}