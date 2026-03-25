import { useNavigate } from "react-router-dom";

import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";

import EditIcon from "../../assets/icons/Pen New Square.svg";
import DeleteIcon from "../../assets/icons/Paper Bin.svg";

import { deleteThailandProject } from "../../services/client.api";
import Pagination from "../table/Pagination";

/* ================= Interface ================= */
export interface PowerVaultThailand {
    siteId: number;
    systemSizeKWp: number;
    projectNo: string;
    projectName: string;
    status: string;
    endWarranty?: string | null;
}

interface PowerVaultThailandTabProps {
    data: PowerVaultThailand[];
    isLoading: boolean;
    pagination: any;
    onPageChange: (page: number) => void;

    filters: {
        projectNo: string;
        projectName: string;
        systemSizeKWp: string;
        endWarranty: string;
        status: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export default function PowerVaultThailandTab({
    data,
    isLoading,
    pagination,
    onPageChange,
    filters,
    setFilters
}: PowerVaultThailandTabProps) {

    const navigate = useNavigate();
    const { page, pageSize, total, totalPages } = pagination;

    /* ================= Safe Date Format ================= */
    const formatDate = (isoString?: string | null) => {
        if (!isoString) return "-";

        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("en-CA");
    };

    /* ================= Delete ================= */
    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("ต้องการลบรายการนี้หรือไม่?");
        if (!confirmDelete) return;

        try {
            await deleteThailandProject(id);
            alert("ลบสำเร็จ");
            window.location.reload();
        } catch {
            alert("ลบไม่สำเร็จ");
        }
    };

    const handleEdit = (row: PowerVaultThailand) => {
        navigate(`/project/edit/${row.siteId}`);
    };

    /* ================= Table Columns ================= */
    const columns: Column<PowerVaultThailand>[] = [
        {
            id: "projectNo",
            key: "projectNo",
            label: "Project No.",
            align: "center",
            render: (value, row) => {
                const raw = String(value ?? "");
                const displayValue = raw.replace(/^NE=/, "");

                return (
                    <button
                        onClick={() => navigate(`/project/${row.siteId}`)}
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
            id: "systemSizeKWp",
            key: "systemSizeKWp",
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
            id: "actions",
            key: "siteId",
            label: "Actions",
            align: "center",
            render: (_, row) => (
                <div className="flex items-center gap-3 justify-center">
                    <button onClick={() => handleEdit(row)}>
                        <img src={EditIcon} className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(row.siteId)}>
                        <img src={DeleteIcon} className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    /* ================= JSX ================= */
    return (
        <div className="flex flex-col gap-[18px]">
            <SearchBox>
                <div className="grid grid-cols-3 gap-2.5">

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
                        value={filters.systemSizeKWp}
                        onChange={(value) =>
                            setFilters({ ...filters, systemSizeKWp: value })
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
                <DataTable
                    columns={columns}
                    data={data.map(item => ({
                        ...item,
                        id: item.siteId
                    }))}
                    loading={isLoading}
                />
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-6 text-sm text-gray-500">
                <span>
                    {(page - 1) * pageSize + 1} to{" "}
                    {Math.min(page * pageSize, total)} of {total} items
                </span>

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={onPageChange}
                />
            </div>
        </div>
    );
}