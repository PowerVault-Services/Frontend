import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { mapProject } from "../../utils/mapProject";

import {
  JOB_CONFIG,
  JOB_ROUTE_MAP,
  type JobRouteKey,
} from "../../configs/jobConfig";

import { getProjectDetail } from "../../services/client.api";
import JobPage from "../../pages/clientdata/JobPage";

import type { ProjectUI } from "../../types/project";

export default function ProjectJobPage() {
  const location = useLocation();
  const extra = (location.state as any) || {};

  const { projectId, job } = useParams<{
    projectId: string;
    job: string;
  }>();

  const [project, setProject] = useState<ProjectUI | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ map route → jobKey
  const jobKey =
    job && job.toLowerCase() in JOB_ROUTE_MAP
      ? JOB_ROUTE_MAP[job.toLowerCase() as JobRouteKey]
      : undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!projectId) return;

        const data = await getProjectDetail(Number(projectId));

        // ✅ ใช้ mapper กลาง
        const mapped = mapProject(data, extra);

        setProject(mapped);
      } catch (err) {
        console.error("โหลด project ไม่สำเร็จ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // 🔄 loading
  if (loading) return <div>Loading...</div>;

  // ❌ invalid
  if (!project || !jobKey) {
    return <div>Not found</div>;
  }

  // ✅ config
  const config = JOB_CONFIG[jobKey];

  return (
    <JobPage
      project={project}
      config={config}
      jobKey={jobKey}
    />
  );
}