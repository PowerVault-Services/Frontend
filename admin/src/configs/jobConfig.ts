import ServiceInformationTab from "../components/tabs/clientdata/powerservice/ServiceInformationTab";
import InspectionInformationTab from "../components/tabs/clientdata/powerservice/InspectionInformationTab";
import CleaningInformationTab from "../components/tabs/clientdata/powerservice/CleaningInformationTab"; //

export const JOB_ROUTE_MAP = {
  cleaning: "Cleaning",
  inspection: "Inspection",
  service: "Service",
  om: "OM",
} as const;

export type JobRouteKey = keyof typeof JOB_ROUTE_MAP;

export const JOB_CONFIG = {
  Cleaning: {
    label: "Cleaning",
    headerBg: "bg-purple-500",
    textColor: "text-white",
    tabs: [
      { id: "Information", label: "Information", component: CleaningInformationTab },
      { id: "PV Layout", label: "PV Layout", type: "PV_LAYOUT" },
    ],
  },

  Inspection: {
    label: "Inspection",
    headerBg: "bg-pink-500",
    textColor: "text-white",
    tabs: [
      { id: "Information", label: "Information", component: InspectionInformationTab },
      { id: "PV Layout", label: "PV Layout", type: "PV_LAYOUT" },
      { id: "PV String Layout", label: "PV String Layout", type: "PV_STRING_LAYOUT" },
    ],
  },

  Service: {
    label: "Service",
    headerBg: "bg-blue-600",
    textColor: "text-white",
    tabs: [
      { id: "Information", label: "Information", component: ServiceInformationTab },
      { id: "PV Layout", label: "PV Layout", type: "PV_LAYOUT" },
      { id: "PV String Layout", label: "PV String Layout", type: "PV_STRING_LAYOUT" },
    ],
  },

  OM: {
    label: "O&M",
    headerBg: "bg-orange-500",
    textColor: "text-white",
    tabs: [
      { id: "Information", label: "Information", component: ServiceInformationTab },
      { id: "PV Layout", label: "PV Layout", type: "PV_LAYOUT" },
      { id: "PV String Layout", label: "PV String Layout", type: "PV_STRING_LAYOUT" },
    ],
  },
};

export type JobType = keyof typeof JOB_CONFIG;