import { Outlet, useParams, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import JobHeader from "../components/JobHeader";
import type { JobType } from "../mock/project";

const JOB_MAP: Record<string, JobType> = {
    service: "Service",
    cleaning: "Cleaning",
    inspection: "Inspection",
    om: "OM",
};

export default function JobLayout() {
    const { job } = useParams<{ job: string }>();

    const jobKey = job ? JOB_MAP[job.toLowerCase()] : undefined;

    if (!jobKey) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="relative min-h-screen bg-[#EAF6E8] px-[60px]">
            <Sidebar />

            {/* แถบสีด้านบน */}
            <div className="">
                <JobHeader job={jobKey} />
            </div>

            <div className="pt-[18px]">
                <Outlet />
            </div>
        </div>
    );
}
