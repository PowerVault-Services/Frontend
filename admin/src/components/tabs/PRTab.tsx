import { useState, useEffect } from "react";

import PRTable from "../../components/table/PRTable";
import SelectFilter from "../../components/SelectFilter";
import api from "../../services/api";

interface Props {
    plantId?: number;
}

export default function PRTab({ plantId }: Props) {
    const siteId = plantId;

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string>(String(currentYear));
    const [yearOptions, setYearOptions] = useState<{ label: string; value: string }[]>([]);

    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchYears = async () => {
            if (!siteId) return;

            try {
                const res = await api.get("/monitoring/pr", {
                    params: {
                        siteId,
                        granularity: "year", // 🔥 เปลี่ยนเป็น year
                    },
                });

                const rows = res.data?.data?.rows ?? [];

                // 👉 สมมุติ API มี field year
                const years: number[] = rows.map((r: any) => Number(r.year));

                const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);

                const options = uniqueYears.map((y) => ({
                    label: String(y),
                    value: String(y),
                }));

                setYearOptions(options);

                // auto select ปีล่าสุด
                if (options.length > 0) {
                    setYear(options[0].value);
                }

            } catch (err) {
                console.error("fetchYears error:", err);
            }
        };

        fetchYears();
    }, [siteId]);


    function transformToMonthly(rows: any[]) {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        return months.map((month, index) => {
            const m = index + 1;

            const found = rows.find((r: any) => r.month === m);

            return {
                month,
                irradiation: found?.irradiation ?? "-",
                production: found?.production ?? "-",
                pr: found?.pr ?? "-"
            };
        });
    }

    useEffect(() => {
        // ✅ ย้าย fetchPR เข้ามาไว้ในนี้
        const fetchPR = async () => {
            if (!siteId) return;

            try {
                setLoading(true);

                const res = await api.get("/monitoring/pr", {
                    params: {
                        siteId,
                        granularity: "month",
                        year: Number(year),
                    },
                });

                const raw = res.data?.data?.rows ?? [];

                const transformed = transformToMonthly(raw);

                setRows(transformed);
            } catch (error) {
                console.error("Fetch PR error:", error);
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPR();
    }, [siteId, year]); // ✅ Dependencies ครบถ้วนและปลอดภัย

    return (
        <div className="w-full">
            <div className="max-w-[400px]">
                <SelectFilter
                    label="Statistical Period"
                    value={year}
                    onChange={(val: any) => setYear(val)}
                    options={yearOptions}
                />
            </div>

            <PRTable
                data={rows}
                loading={loading}
                page={1}
                pageSize={12}
                total={rows.length}
                onPageChange={() => { }}
                mode="month"
            />
        </div>
    );
}