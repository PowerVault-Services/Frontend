import { useState, useEffect } from "react";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import PRTable from "../../components/table/PRTable";
import api from "../../services/api";


export default function PRMonitor() {

    // ===== Filter States =====
    const [siteId] = useState<number>(1);
    const [granularity, setGranularity] =
        useState<"day" | "month" | "year">("month");

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState<string>(String(currentYear));
    const [projectName, setProjectName] = useState("");

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
                    <div className="grid grid-cols-2 justify-between gap-2.5">

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