import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";

import { createThailandProject } from "../../services/api";
import type { CreateThailandProjectPayload } from "../../services/api";

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
            key: "projectNo",
            label: "Project No.",
            align: "center",
            render: (value, row) => {
                const raw = String(value || "");
                const displayValue = raw.startsWith("NE=")
                    ? raw.replace("NE=", "")
                    : raw;

                return (
                    <button
                        onClick={() => navigate(`/project/${row.id}`)}
                        className="text-green-800 underline hover:text-green-900"
                    >
                        {displayValue}
                    </button>
                );
            },
            id: ""
        },
        { key: "projectName", label: "Project Name", align: "center" },
        {
            key: "capacityKwp",
            label: "System Size (kWp)",
            align: "center",
            render: (value) =>
                value !== undefined && value !== null
                    ? Number(value).toLocaleString()
                    : "-",
        },
        {
            key: "endWarranty",
            label: "End Warranty",
            align: "center",
            render: (value) => formatDate(value as string | null),
        },
        {
            key: "status",
            label: "Status",
            align: "center",
            render: (value) => {
                const statusStr = String(value || "");
                return (
                    <span
                        className={
                            statusStr.toUpperCase() === "ACTIVE"
                                ? ""
                                : "text-gray-500"
                        }
                    >
                        {statusStr.charAt(0).toUpperCase() +
                            statusStr.slice(1).toLowerCase()}
                    </span>
                );
            },
        },
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
