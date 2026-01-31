import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS } from "../../mock/project";
import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";


interface PowerVaultThailand {
    id: string;
    projectnumber: string;
    projectType: string;
    projectName: string;
    systemSize: number;
    date: string;
    time: string;
    status: string;
    startwarranty?: string;
    endwarranty?: string;
}

export default function PowerVaultThailandTab() {
    const [data, setData] = useState<PowerVaultThailand[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const tableData: PowerVaultThailand[] = PROJECTS.map((p) => ({
            id: String(p.id),                 // ✅ FIX: cast to string
            projectnumber: String(p.id),      // ✅ FIX: consistent type
            projectName: p.name,
            projectType: "Solar",
            systemSize: p.systemSize,
            startwarranty: "2023-01-01",
            endwarranty: "2026-01-01",
            date: "2025-01-10",
            time: "10:00",
            status: "Active",
        }));

        setData(tableData);
        setLoading(false);
    }, []);

    const handleEdit = (row: PowerVaultThailand) => {
        console.log("Edit:", row);
    };

    const handleDelete = (id: string) => {
        if (!confirm("Delete this record?")) return;

        setData((prev) => prev.filter((r) => r.id !== id));
        setSelectedRows((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const columns: Column<PowerVaultThailand>[] = [
        {
            key: "projectnumber",
            label: "Project No.",
            align: "center",
            render: (value, row) => (
                <button
                    onClick={() => navigate(`/project/${row.id}`)}
                    className="text-green-800 underline hover:text-green-900"
                >
                    {value}
                </button>
            ),
        },
        { key: "projectName", label: "Project Name", align: "center" },
        { key: "systemSize", label: "System Size (kWp)", align: "center" },
        { key: "endwarranty", label: "End Warranty", align: "center" },
        { key: "status", label: "Status", align: "center" },
        {
            key: "id",
            label: "Actions",
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
                    <TextInputFilter label="Job No." value={""} onChange={() => {}} />

                    <SelectFilter
                        label="Project Type"
                        placeholder="All"
                        value={""}
                        onChange={() => {}}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Project A", value: "project_a" },
                            { label: "Project B", value: "project_b" },
                        ]}
                    />

                    <TextInputFilter label="Project Name" value={""} onChange={() => {}} />
                    <TextInputFilter label="System Size (kWp)" value={""} onChange={() => {}} />
                    <TextInputFilter label="PV Module (ea.)" value={""} onChange={() => {}} />
                    <TextInputFilter label="Date" type="date" value={""} onChange={() => {}} />
                    <TextInputFilter label="Time" type="time" value={""} onChange={() => {}} />

                    <SelectFilter
                        label="รับเหมา"
                        placeholder="All"
                        value={""}
                        onChange={() => {}}
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
                        onChange={() => {}}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Pending", value: "pending" },
                            { label: "Completed", value: "completed" },
                        ]}
                    />
                </div>
            </SearchBox>

            <div className="pt-[25px]">
                <DataTable<PowerVaultThailand>
                    columns={columns}
                    data={data}
                    loading={loading}
                />
            </div>
        </div>
    );
}

function setSelectedRows(arg0: (prev: any) => Set<unknown>) {
    throw new Error("Function not implemented.");
}
