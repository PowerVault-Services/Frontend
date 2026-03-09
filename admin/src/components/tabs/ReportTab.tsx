import { useState } from "react";
import CreateReportModal from "../CreateReportModal";
import ReportTable from "../table/ReportTable";

interface Props {
    plantId?: number;
}



export default function ReportTab({ plantId }: Props) {

    const [openCreate, setOpenCreate] = useState(false);

    return (
        <div className="w-full">

            <div className="flex justify-between items-center mb-6">

                <button
                    onClick={() => setOpenCreate(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    + Create Report
                </button>
            </div>

            <ReportTable plantId={plantId} />

            {openCreate && (
                <CreateReportModal
                    plantId={plantId}
                    onClose={() => setOpenCreate(false)}
                />
            )}

        </div>

    );
}