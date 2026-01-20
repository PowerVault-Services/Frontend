// mock/project.ts

export type JobType = "Cleaning" | "Inspection" | "Service" | "OM";

export interface ProjectJob {
  job: JobType;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  systemSize: number;
  pvModule: number;
  phone: string;
  email: string;
  startWarranty: string;
  endWarranty: string;
  jobs: ProjectJob[];
}

export const PROJECTS: Project[] = [
  {
    id: "robinson_ccs",
    name: "Robinson Chachoengsao",
    location: "...",
    systemSize: 1200,
    pvModule: 2400,
    phone: "038-123-456",
    email: "contact@robinson.co.th",
    startWarranty: "2022-05-01",
    endWarranty: "2025-05-25",
    jobs: [
      { job: "Service", description: "Preventive maintenance" },
      { job: "Cleaning", description: "Panel cleaning" },
      { job: "Inspection", description: "System inspection" },
      { job: "OM", description: "Operation & Maintenance" },
    ],
  },
];
