import { useState, useEffect, useMemo } from "react";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import PRTable from "../../components/table/PRTable";
import api from "../../services/api";
import SelectFilter from "../../components/SelectFilter";

const ALL_MONTHS = [
    { label: "มกราคม", value: "1" },
    { label: "กุมภาพันธ์", value: "2" },
    { label: "มีนาคม", value: "3" },
    { label: "เมษายน", value: "4" },
    { label: "พฤษภาคม", value: "5" },
    { label: "มิถุนายน", value: "6" },
    { label: "กรกฎาคม", value: "7" },
    { label: "สิงหาคม", value: "8" },
    { label: "กันยายน", value: "9" },
    { label: "ตุลาคม", value: "10" },
    { label: "พฤศจิกายน", value: "11" },
    { label: "ธันวาคม", value: "12" },
];


export default function PRMonitor() {

    // ===== Filter States =====
    const [siteId] = useState<number>(1);
    const [granularity, setGranularity] =
        useState<"day" | "month" | "year">("month");

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string>(String(currentYear));
    const [projectName, setProjectName] = useState("");

    const [startMonth, setStartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");

    /* ===== Month Logic ===== */
    
        const startMonthOptions = useMemo(() => {
            if (!endMonth) return ALL_MONTHS;
            return ALL_MONTHS.filter((m) => Number(m.value) <= Number(endMonth));
        }, [endMonth]);
    
        const endMonthOptions = useMemo(() => {
            if (!startMonth) return ALL_MONTHS;
            return ALL_MONTHS.filter((m) => Number(m.value) >= Number(startMonth));
        }, [startMonth]);

    // ===== Data States =====
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPR = async () => {
        try {
            setLoading(true);

            const res = await api.get("/monitoring/pr", {
                params: {
                    siteId,
                    granularity,
                    year: Number(year),
                    projectName
                },
            });

            setRows(res.data?.data?.rows ?? []);

        } catch (error) {
            console.error("Fetch PR error:", error);
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    const yearOptions = [
        { label: "2025", value: "2025" },
        { label: "2026", value: "2026" },
    ];

    useEffect(() => {
        fetchPR();
    }, []);


    return (
        <div className="w-full">
            <div className="flex justify-between pb-9">

                <h1 className="text-green-800">%PR</h1>

                <button className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5" onClick={() => (window.location.href = "/monitor/forecast/new")}>
                    <img src={AddIcon} alt="" />
                    Add Forcast Data
                </button>
            </div>

            <div className="pb-[62px]">
                <SearchBox onSearch={fetchPR}>
                    <div className="grid grid-cols-3 justify-between gap-2.5">

                        {/* Time Granularity */}
                        {/* <SelectFilter
                            label="Time Granularity"
                            placeholder="Select"
                            value={granularity}
                            onChange={(val: any) => setGranularity(val)}
                            options={[
                                { label: "Month", value: "month" },
                                { label: "Year", value: "year" },
                            ]}
                        /> */}

                        {/* Statistical Period (Year Only) */}
                        {/* <SelectFilter
                            label="Statistical Period"
                            placeholder="Select Year"
                            value={year}
                            onChange={(val: any) => setYear(val)}
                            options={yearOptions}
                        /> */}

                        <TextInputFilter label="Project Name" value={projectName} onChange={setProjectName} />

                        <SelectFilter
                            label="Start Month"
                            placeholder="เลือกเดือนเริ่มต้น"
                            value={startMonth}
                            onChange={(val: any) => setStartMonth(val)}
                            options={startMonthOptions}
                        />

                        <SelectFilter
                            label="End Month"
                            placeholder="เลือกเดือนสิ้นสุด"
                            value={endMonth}
                            onChange={(val: any) => setEndMonth(val)}
                            options={endMonthOptions}
                        />

                    </div>
                </SearchBox>
            </div>

            <PRTable
                data={rows}
                year={Number(year)}
                loading={loading}
            />
        </div>
    );
}