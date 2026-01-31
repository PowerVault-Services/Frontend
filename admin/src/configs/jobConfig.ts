import type { JobType } from "../mock/project";

export type { JobType };

export const JOB_CONFIG: Record<
  JobType,
  {
    label: string;
    headerBg: string;
    textColor: string;
  }
> = {
  Cleaning: {
    label: "Cleaning",
    headerBg: "bg-purple-500",
    textColor: "text-white",
  },
  Inspection: {
    label: "Inspection",
    headerBg: "bg-pink-500",
    textColor: "text-white",
  },
  Service: {
    label: "Service",
    headerBg: "bg-blue-600",
    textColor: "text-white",
  },
  OM: {
    label: "O&M",
    headerBg: "bg-orange-500",
    textColor: "text-white",
  },
};

export const JOB_ROUTE_MAP = {
  cleaning: "Cleaning",
  inspection: "Inspection",
  service: "Service",
  om: "OM",
} as const;

export type JobRouteKey = keyof typeof JOB_ROUTE_MAP;
