import { useState, useEffect } from "react";
import SearchBox from "../../components/SearchBox";
import SelectFilter from "../../components/SelectFilter";
import PRTable from "../../components/table/PRTable";
import api from "../../services/api";

export default function PRMonitor() {

    // ===== Filter States =====
    const [siteId] = useState<number>(1);
    const [granularity, setGranularity] =
        useState<"day" | "month" | "year">("month");

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string>(String(currentYear));

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

    // ===== Year Options (เช่น 2025, 2026) =====
    const yearOptions = [
        { label: "2025", value: "2025" },
        { label: "2026", value: "2026" },
    ];

    useEffect(() => {
        fetchPR();
    }, []);


    return (
        <div className="w-full">
            <h1 className="text-green-800 pb-9">%PR</h1>

            <div className="pb-[62px]">
                <SearchBox onSearch={fetchPR}>
                    <div className="grid grid-cols-2 justify-between gap-2.5">

                        {/* Time Granularity */}
                        <SelectFilter
                            label="Time Granularity"
                            placeholder="Select"
                            value={granularity}
                            onChange={(val: any) => setGranularity(val)}
                            options={[
                                { label: "Month", value: "month" },
                                { label: "Year", value: "year" },
                            ]}
                        />

                        {/* Statistical Period (Year Only) */}
                        <SelectFilter
                            label="Statistical Period"
                            placeholder="Select Year"
                            value={year}
                            onChange={(val: any) => setYear(val)}
                            options={yearOptions}
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