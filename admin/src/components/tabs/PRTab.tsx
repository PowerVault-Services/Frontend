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

    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

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
    }, [siteId, year]);

    return (
        <div className="w-full">

            <SelectFilter
                label="Statistical Period"
                placeholder="Select Year"
                value={year}
                onChange={(val: any) => setYear(val)}
                options={yearOptions}
            />

            <PRTable
                data={rows}
                year={Number(year)}
                loading={loading}
            />
        </div>
    );
}