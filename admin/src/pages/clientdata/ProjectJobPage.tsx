import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    JOB_ROUTE_MAP,
    type JobRouteKey,
} from "../../configs/jobConfig";

import { getProjectDetail } from "../../services/client.api";

import CleaningJob from "../../pages/detailjobs/CleaningJob";
import InspectionJob from "../../pages/detailjobs/InspectionJob";
import ServiceJob from "../../pages/detailjobs/ServiceJob";
import OMJob from "../../pages/detailjobs/OMJob";

type Project = any;

export default function ProjectJobPage() {

    const location = useLocation();
    const extra = location.state as any;
    const { projectId, job } = useParams<{
        projectId: string;
        job: string;
    }>();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const jobKey =
        job && job.toLowerCase() in JOB_ROUTE_MAP
            ? JOB_ROUTE_MAP[job.toLowerCase() as JobRouteKey]
            : undefined;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!projectId) return;

                const data = await getProjectDetail(Number(projectId));

                // ✅ map ตรงนี้ (สำคัญ)
                const mapped: Project = {
                    ...data,

                    // ✅ ดึงจาก table ถ้า API ไม่มี
                    projectName: data.projectName ?? extra?.projectName,

                    systemSizeKWp:
                        data.systemSizeKWp ??
                        data.systemSize ??
                        extra?.systemSizeKWp ??
                        0,

                    endWarranty:
                        data.endWarranty ??
                        data.end_warranty ??
                        extra?.endWarranty,
                };

                setProject(mapped);
            } catch (err) {
                console.error("โหลด project ไม่สำเร็จ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    if (loading) return <div>Loading...</div>;

    if (!project || !jobKey) {
        return <div>Not found</div>;
    }

    return (
        <div>
            {jobKey === "Service" && <ServiceJob project={project} />}
            {jobKey === "Cleaning" && <CleaningJob project={project} />}
            {jobKey === "Inspection" && <InspectionJob project={project} />}
            {jobKey === "OM" && <OMJob project={project} />}
        </div>
    );
}