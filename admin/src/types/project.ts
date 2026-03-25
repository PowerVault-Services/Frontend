export interface ApiProject {
  id: number;
  siteId: number;
  projectNo: string;
  projectName: string;
  systemSizeKWp: number;

  warrantyStart?: string;
  warrantyEnd?: string;

  layouts?: {
    id: number;
    type: "PV_LAYOUT" | "PV_STRING_LAYOUT";
    fileUrl: string;
  }[];
}

export interface ProjectUI {
  id: number;

  name: string;
  systemSize: number;

  startWarranty: string;
  endWarranty: string;

  layouts?: {
    id: number;
    type: "PV_LAYOUT" | "PV_STRING_LAYOUT";
    fileUrl: string;
  }[];
}