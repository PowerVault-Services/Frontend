import { useParams } from "react-router-dom";
import { PROJECTS, type JobType } from "../../mock/project";
import {
    JOB_CONFIG,
    JOB_ROUTE_MAP,
    type JobRouteKey,
} from "../../configs/jobConfig";

import CleaningJob from "../../pages/detailjobs/CleaningJob";
import InspectionJob from "../../pages/detailjobs/InspectionJob";
import ServiceJob from "../../pages/detailjobs/ServiceJob";
import OMJob from "../../pages/detailjobs/OMJob";

export default function ProjectJobPage() {
    const { projectId, job } = useParams<{
        projectId: string;
        job: string;
    }>();

    const project = PROJECTS.find((p) => p.id === projectId);

    const jobKey: JobType | undefined =
        job && job.toLowerCase() in JOB_ROUTE_MAP
            ? JOB_ROUTE_MAP[job.toLowerCase() as JobRouteKey]
            : undefined;

    if (!project || !jobKey) {
        return <div>Not found</div>;
    }

    // ถ้าต้องใช้ config ต่อ
    const jobConfig = JOB_CONFIG[jobKey];

    return (
        <div>
            {jobKey === "Service" && <ServiceJob project={project} />}
            {jobKey === "Cleaning" && <CleaningJob project={project} />}
            {jobKey === "Inspection" && <InspectionJob project={project} />}
            {jobKey === "OM" && <OMJob project={project} />} 
        </div>
    );
}
