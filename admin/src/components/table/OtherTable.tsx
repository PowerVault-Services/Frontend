import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import OtherForm from "../OtherForm";


interface OtherRow {
    id: number;
    status: string;
    description: string;
    remark: string;
}

const PAGE_SIZE = 5;

export default function OtherTable() {
    const [rows, setRows] = useState<OtherRow[]>([]);
    const [editingRow, setEditingRow] = useState<OtherRow | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    /* ---------------- Add ---------------- */
    const handleAdd = () => {
        setEditingRow({
            id: Date.now(),
            status: "",
            description: "",
            remark: "",
        });
    };

    /* ---------------- Save (Add / Edit) ---------------- */
    const handleSave = () => {
        if (!editingRow) return;

        setRows((prev) => {
            const exists = prev.find((r) => r.id === editingRow.id);
            return exists
                ? prev.map((r) => (r.id === editingRow.id ? editingRow : r))
                : [...prev, editingRow];
        });

        setEditingRow(null);
    };

    /* ---------------- Delete ---------------- */
    const handleDelete = (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this item?"
        );
        if (!confirmed) return;

        setRows((prev) => prev.filter((row) => row.id !== id));
    };

    /* ---------------- Pagination ---------------- */
    const totalPages = Math.ceil(rows.length / PAGE_SIZE);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedRows = rows.slice(
        startIndex,
        startIndex + PAGE_SIZE
    );

    /* ---------------- Render ---------------- */
    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex justify-end mb-3">
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 border border-green-700 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50"
                >
                    <Plus size={16} />
                    Add Description
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse">
                    <thead className="bg-green-800 text-white">
                        <tr>
                            <th className="px-3 py-3 w-[60px] text-center">No.</th>
                            <th className="px-3 py-3 w-[120px]">Status</th>
                            <th className="px-3 py-3">Description</th>
                            <th className="px-3 py-3">Remark</th>
                            <th className="px-3 py-3 w-[90px] text-center"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedRows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-400">
                                    No data
                                </td>
                            </tr>
                        )}

                        {paginatedRows.map((row, index) => (
                            <tr key={row.id} className="border-t">
                                <td className="px-3 py-2 text-center">
                                    {startIndex + index + 1}
                                </td>
                                <td className="px-3 py-2">{row.status}</td>
                                <td className="px-3 py-2">{row.description}</td>
                                <td className="px-3 py-2">{row.remark}</td>
                                <td className="px-3 py-2 text-center">
                                    <button
                                        onClick={() => setEditingRow(row)}
                                        className="mr-2 text-blue-700 hover:text-blue-900"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(row.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
                <div>
                    {rows.length === 0
                        ? "0 items"
                        : `${startIndex + 1} to ${Math.min(
                            startIndex + PAGE_SIZE,
                            rows.length
                        )} of ${rows.length} items`}
                </div>

                <div className="flex gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                        ‹
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 border rounded ${currentPage === page
                                    ? "bg-green-700 text-white"
                                    : ""
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* Modal */}
            {editingRow && (
                <OtherForm
                    value={editingRow}
                    isEdit={rows.some((r) => r.id === editingRow.id)}
                    onChange={setEditingRow}
                    onClose={() => setEditingRow(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
