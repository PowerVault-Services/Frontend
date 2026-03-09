import { useEffect, useState } from "react";
import api from "../../services/api";

interface Props {
    plantId?: number;
}

export default function ReportTable({ plantId }: Props) {

    const [reports, setReports] = useState<any[]>([]);

    const fetchReports = async () => {
        try {

            const res = await api.get("/reports", {
                params: {
                    siteId: plantId
                }
            });

            console.log("REPORT API", res.data);

            const list = res.data?.data?.list;

            setReports(Array.isArray(list) ? list : []);

        } catch (error) {

            console.error("fetch report error", error);
            setReports([]);

        }
    };

    useEffect(() => {
        if (plantId) fetchReports();
    }, [plantId]);

    return (

        <div className="bg-white border rounded-xl overflow-x-auto">

            <table className="w-full text-sm">

                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3">Job No</th>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Created</th>
                        <th className="px-4 py-3">Action</th>
                    </tr>
                </thead>

                <tbody>

                    {reports.length === 0 ? (

                        <tr>
                            <td colSpan={6} className="text-center py-6 text-gray-400">
                                No reports
                            </td>
                        </tr>

                    ) : (

                        reports.map((r) => (

                            <tr key={r.id} className="border-t">

                                <td className="px-4 py-3">
                                    {r.jobNo}
                                </td>

                                <td className="px-4 py-3">
                                    {r.title}
                                </td>

                                <td className="px-4 py-3">
                                    {r.type}
                                </td>

                                <td className="px-4 py-3">
                                    {r.status}
                                </td>

                                <td className="px-4 py-3">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-3 flex gap-2">

                                    <a
                                        href={r.previewUrl}
                                        target="_blank"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Preview
                                    </a>

                                    <a
                                        href={r.downloadUrl}
                                        className="text-green-600 hover:underline"
                                    >
                                        Download
                                    </a>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    );
}