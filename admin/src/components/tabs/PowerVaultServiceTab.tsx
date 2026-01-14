import { useEffect, useState } from "react";
import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";

interface PowerVaultService {
    id: number;
    projectnumber: number;
    projectType: string;
    projectName: string;
    systemSize: number;
    date: string;
    time: string;
    status: string;
    job: string;
    description: string;
}

export default function PowerVaultServiceTab() {
    const [data, setData] = useState<PowerVaultService[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

    const [] = useState("all");

    useEffect(() => {
        fetch("/api/service")
            .then((res) => res.json())
            .then((res) => {
                setData(res);
                setLoading(false);
            });
    }, []);

    const handleEdit = (row: PowerVaultService) => {
        console.log("Edit:", row);
    };

    const handleDelete = (id: number) => {
        if (!confirm("Delete this record?")) return;

        setData((prev) => prev.filter((r) => r.id !== id));
        setSelectedRows((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const jobStyleMap: Record<string, string> = {
        Service: "bg-[#DDF4FF] text-[#1976D2]",
        Cleaning: "bg-[#EFE3F7] text-[#6A1B9A]",
        Inspection: "bg-[#FFD6EB] text-[#AD1457]",
        "O&M": "bg-[#FFE3CC] text-[#E65100]",
    };


    const columns: Column<PowerVaultService>[] = [

        { key: "projectnumber", label: "Project No..", align: "center" },
        { key: "projectName", label: "Project Name", align: "center" },
        { key: "systemSize", label: "System Size (kWp)", align: "center" },
        {
            key: "job",
            label: "Job",
            align: "center",
            render: (value) => {
                const style = jobStyleMap[value] || "bg-gray-200 text-gray-700";

                return (
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${style}`}
                    >
                        {value}
                    </span>
                );
            },
        },

        { key: "description", label: "Description", align: "center" },

        {
            key: "id",
            label: "",
            align: "center",
            render: (_, row) => (
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="text-red-600 hover:text-red-800"
                    >
                        🗑
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-[18px]">
            <SearchBox>
                <div className="grid grid-cols-4 justify-between gap-2.5">
                    <TextInputFilter label="Job No." value={""} onChange={() => { }} />

                    <SelectFilter
                        label="Project Type"
                        placeholder="All"
                        value={""}
                        onChange={() => { }}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Project A", value: "project_a" },
                            { label: "Project B", value: "project_b" },
                        ]}
                    />

                    <TextInputFilter label="Project Name" value={""} onChange={() => { }} />
                    <TextInputFilter label="System Size (kWp)" value={""} onChange={() => { }} />
                    <TextInputFilter label="PV Module (ea.)" value={""} onChange={() => { }} />
                    <TextInputFilter label="Date" type="date" value={""} onChange={() => { }} />
                    <TextInputFilter label="Time" type="time" value={""} onChange={() => { }} />

                    <SelectFilter
                        label="รับเหมา"
                        placeholder="All"
                        value={""}
                        onChange={() => { }}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Project A", value: "project_a" },
                            { label: "Project B", value: "project_b" },
                        ]}
                    />

                    <SelectFilter
                        label="Status"
                        placeholder="All"
                        value={""}
                        onChange={() => { }}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Pending", value: "pending" },
                            { label: "Completed", value: "completed" },
                        ]}
                    />
                </div>
            </SearchBox>
            <div className="pt-[25px]">
                <DataTable<PowerVaultService> columns={columns} data={data} loading={loading} />
            </div>
        </div>
    );
}
