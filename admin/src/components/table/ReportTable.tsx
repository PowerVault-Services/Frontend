import { useEffect, useState } from "react";
import api from "../../services/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

interface Props {
    plantId?: number;
}

const TYPE_COLORS: Record<string, string> = {
    CLEANING: "bg-blue-50 text-blue-700 border border-blue-200",
    SERVICE: "bg-purple-50 text-purple-700 border border-purple-200",
    INSPECTION: "bg-orange-50 text-orange-700 border border-orange-200",
};

const STATUS_COLORS: Record<string, string> = {
    COMPLETED: "bg-green-50 text-green-700 border border-green-200",
    ASSIGNED: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    DRAFT: "bg-gray-50 text-gray-500 border border-gray-200",
};

export default function ReportTable({ plantId }: Props) {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!plantId) return;

        setReports([]);
        setLoading(true);
        let cancelled = false;

        const fetchReports = async () => {
            try {
                const res = await api.get(`/monitoring/sites/${plantId}/reports`);
                const list = res.data?.data?.list;
                if (!cancelled) setReports(Array.isArray(list) ? list : []);
            } catch (error) {
                console.error("fetch report error", error);
                if (!cancelled) setReports([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchReports();
        return () => { cancelled = true; };
    }, [plantId]);

    // ✅ เติม base URL ให้ previewUrl และ downloadUrl
    const toFullUrl = (path?: string) => {
        if (!path) return "#";
        if (path.startsWith("http")) return path;
        return `${API_BASE}${path}`;
    };

    return (
        <div className="rounded-xl border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {reports.length} Report{reports.length !== 1 ? "s" : ""}
                </span>
            </div>

            {loading ? (
                <div className="py-16 text-center text-gray-400 text-sm">Loading...</div>
            ) : reports.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">No reports found</div>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                            <th className="px-5 py-3 text-left font-medium">Job No</th>
                            <th className="px-5 py-3 text-left font-medium">Title</th>
                            <th className="px-5 py-3 text-left font-medium">Type</th>
                            <th className="px-5 py-3 text-left font-medium">Status</th>
                            <th className="px-5 py-3 text-left font-medium">Created</th>
                            <th className="px-5 py-3 text-left font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {reports.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors">

                                <td className="px-5 py-3.5 font-mono text-xs text-gray-600">
                                    {r.jobNo}
                                </td>

                                <td className="px-5 py-3.5 text-gray-800 font-medium max-w-[220px] truncate">
                                    {r.title}
                                </td>

                                <td className="px-5 py-3.5">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLORS[r.type] ?? "bg-gray-100 text-gray-600"}`}>
                                        {r.type}
                                    </span>
                                </td>

                                <td className="px-5 py-3.5">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status] ?? "bg-gray-100 text-gray-600"}`}>
                                        {r.status}
                                    </span>
                                </td>

                                <td className="px-5 py-3.5 text-gray-500 text-xs">
                                    {new Date(r.createdAt).toLocaleDateString("en-GB", {
                                        day: "2-digit", month: "short", year: "numeric"
                                    })}
                                </td>

                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">

                                        {/* ✅ Preview — เปิด PDF ใน tab ใหม่ */}
                                        <a
                                            href={toFullUrl(r.previewUrl)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                                            bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                        >
                                            Preview
                                        </a>

                                        {/* ✅ Download — force download */}
                                        <a
                                            href={toFullUrl(r.downloadUrl)}
                                            download
                                            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg
                                        bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                                        >
                                            Download
                                        </a>

                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
        </div >
    );
}