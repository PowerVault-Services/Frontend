import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ReportViewe from "./ReportView";

import { getReports } from "../../services/report.api";
import type { ReportItem } from "../../services/report.api";

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

const JOB_TYPES = [
    { label: "All", value: "" },
    { label: "Cleaning", value: "cleaning" },
    { label: "Service", value: "service" },
    { label: "Inspection", value: "inspection" },
];

export default function ReportMonitor() {

    const [projectName, setProjectName] = useState("");
    const [startMonth, setStartMonth] = useState("");
    const [endMonth, setEndMonth] = useState("");
    const [jobType, setJobType] = useState("");

    const [reports, setReports] = useState<ReportItem[]>([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    /* ===== Month Logic ===== */

    const startMonthOptions = useMemo(() => {
        if (!endMonth) return ALL_MONTHS;
        return ALL_MONTHS.filter((m) => Number(m.value) <= Number(endMonth));
    }, [endMonth]);

    const endMonthOptions = useMemo(() => {
        if (!startMonth) return ALL_MONTHS;
        return ALL_MONTHS.filter((m) => Number(m.value) >= Number(startMonth));
    }, [startMonth]);

    /* ===== Load Reports ===== */

    async function loadReports(filters?: any) {
        try {

            setLoading(true);

            const data = await getReports(filters);

            setReports(data);

        } catch (err) {

            console.error("โหลด report ไม่สำเร็จ", err);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadReports();
    }, []);

    /* ===== Search ===== */

    const handleSearch = async () => {

        const filterData: any = {};

        if (startMonth) {
            filterData.startMonth = `2026-${startMonth.padStart(2, "0")}`;
        }

        if (endMonth) {
            filterData.endMonth = `2026-${endMonth.padStart(2, "0")}`;
        }

        try {

            setLoading(true);

            let data = await getReports(filterData);

            /* ===== Filter Project Name ===== */
            if (projectName) {
                data = data.filter((r) =>
                    r.title.toLowerCase().includes(projectName.toLowerCase())
                );
            }

            /* ===== Filter Job Type ===== */
            if (jobType) {
                data = data.filter(
                    (r) => r.type.toLowerCase() === jobType.toLowerCase()
                );
            }

            setReports(data);

        } catch (err) {

            console.error("โหลด report ไม่สำเร็จ", err);

        } finally {

            setLoading(false);

        }

    };

    /* ===== Reset ===== */

    const handleReset = () => {

        setProjectName("");
        setStartMonth("");
        setEndMonth("");
        setJobType("");

        loadReports();
    };

    return (
        <div className="w-full">

            <div className="flex justify-between pb-9">

                <h1 className="text-green-800">Report</h1>
                <button
                    onClick={() => navigate("/monitor/energy-yield")}
                    className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5 cursor-pointer"
                >
                    Energy Yield Report
                </button>
            </div>

            <div className="pb-[62px]">

                <SearchBox
                    onReset={handleReset}
                    onSearch={handleSearch}
                >

                    <div className="grid grid-cols-3 justify-between gap-2.5">

                        <TextInputFilter
                            label="Project Name"
                            value={projectName}
                            onChange={(e: any) => setProjectName(e.target.value)}
                        />

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

                        <SelectFilter
                            label="Job Type"
                            placeholder="เลือกประเภทงาน"
                            value={jobType}
                            onChange={(val: any) => setJobType(val)}
                            options={JOB_TYPES}
                        />

                    </div>

                </SearchBox>

            </div>

            <ReportViewe
                reports={reports}
                loading={loading}
            />

        </div>
    );
}