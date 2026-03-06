import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";

import type { CreateThailandProjectPayload } from "../../services/client.api";

/* ================= Interface ================= */
export interface PowerVaultThailand {
    id: number;
    projectNo: string;
    projectName: string;
    capacityKwp: number;
    status: string;
    startWarranty?: string | null;
    endWarranty?: string | null;
}

interface PowerVaultThailandTabProps {
    data: PowerVaultThailand[];
    isLoading: boolean;
    pagination: any;
    onPageChange: (page: number) => void;
}

export default function PowerVaultThailandTab({
    data,
    isLoading,
    pagination,
    onPageChange
}: PowerVaultThailandTabProps) {

    const navigate = useNavigate();

    /* ================= Filter State ================= */
    const [filters, setFilters] = useState({
        projectNo: "",
        projectName: "",
        capacityKwp: "",
        endWarranty: "",
        status: "all",
    });

    /* ================= Safe Date Format ================= */
    const formatDate = (isoString?: string | null) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "-";
        return date.toISOString().split("T")[0];
    };

    /* ================= Delete ================= */
    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("ต้องการลบรายการนี้หรือไม่?");
        if (!confirmDelete) return;

        console.log("Delete project id:", id);

        // TODO: call delete API here
    };

    /* ================= Filtered Data ================= */
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchProjectNo =
                filters.projectNo === "" ||
                item.projectNo.toLowerCase().includes(filters.projectNo.toLowerCase());

            const matchProjectName =
                filters.projectName === "" ||
                item.projectName.toLowerCase().includes(filters.projectName.toLowerCase());

            const matchCapacity =
                filters.capacityKwp === "" ||
                item.capacityKwp === Number(filters.capacityKwp);

            const matchEndWarranty =
                filters.endWarranty === "" ||
                (item.endWarranty &&
                    formatDate(item.endWarranty) === filters.endWarranty);

            const matchStatus =
                filters.status === "all" ||
                item.status.toUpperCase() === filters.status;

            return (
                matchProjectNo &&
                matchProjectName &&
                matchCapacity &&
                matchEndWarranty &&
                matchStatus
            );
        });
    }, [data, filters]);

    /* ================= Table Columns ================= */
    const columns: Column<PowerVaultThailand>[] = [
        {
            id: "projectNo",
            key: "projectNo",
            label: "Project No.",
            align: "center",
            render: (value, row) => {

                const raw = String(value ?? "");

                // ตัด NE=
                const displayValue = raw.replace(/^NE=/, "");

                return (
                    <button
                        onClick={() => navigate(`/project/${row.id}`)}
                        className="text-green-800 underline hover:text-green-900"
                    >
                        {displayValue}
                    </button>
                );
            }
        },
        {
            id: "projectName",
            key: "projectName",
            label: "Project Name",
            align: "center"
        },
        {
            id: "capacityKwp",
            key: "capacityKwp",
            label: "System Size (kWp)",
            align: "center"
        },
        {
            id: "endWarranty",
            key: "endWarranty",
            label: "End Warranty",
            align: "center",
            render: (value) => formatDate(value as string | null)
        },
        {
            id: "status",
            key: "status",
            label: "Status",
            align: "center"
        },
        {
            id: "action",
            label: "",
            align: "center",
            render: (_, row) => (
                <div className="flex justify-center gap-3">
                    <button
                        onClick={() => navigate(`/project/edit/${row.id}`)}
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
            )
        }
    ];

    /* ================= JSX ================= */
    return (
        <div className="flex flex-col gap-[18px]">
            <SearchBox>
                <div className="grid grid-cols-3 justify-between gap-2.5">
                    <TextInputFilter
                        label="Project No."
                        value={filters.projectNo}
                        onChange={(value) =>
                            setFilters({ ...filters, projectNo: value })
                        }
                    />

                    <TextInputFilter
                        label="Project Name"
                        value={filters.projectName}
                        onChange={(value) =>
                            setFilters({ ...filters, projectName: value })
                        }
                    />

                    <TextInputFilter
                        label="System Size (kWp)"
                        value={filters.capacityKwp}
                        onChange={(value) =>
                            setFilters({ ...filters, capacityKwp: value })
                        }
                    />

                    <TextInputFilter
                        label="End Warranty"
                        type="date"
                        value={filters.endWarranty}
                        onChange={(value) =>
                            setFilters({ ...filters, endWarranty: value })
                        }
                    />

                    <SelectFilter
                        label="Status"
                        placeholder="All"
                        value={filters.status}
                        onChange={(value) =>
                            setFilters({ ...filters, status: value })
                        }
                        options={[
                            { label: "All", value: "all" },
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" },
                        ]}
                    />
                </div>
            </SearchBox>

            <div className="pt-[25px]">
                <DataTable<PowerVaultThailand>
                    columns={columns}
                    data={filteredData}
                    loading={isLoading}
                />
            </div>
        </div>
    );

}
