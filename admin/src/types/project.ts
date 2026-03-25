export interface Project {
  siteId: number;
  projectNo: string;
  projectName: string;
  systemSizeKWp: number;
  status?: string;

  // optional fields (detail API)
  startWarranty?: string;
  endWarranty?: string;
  company?: string;
  address?: string;
  panelBrand?: string;
  panelPowerW?: number;
  latitude?: number;
  longitude?: number;

  layouts?: {
    id: number;
    type: "PV_LAYOUT" | "PV_STRING_LAYOUT";
    fileUrl: string;
  }[];

  forecastMonthlyRows?: any[];
  forecastRows?: any[];
  forecast?: any[];
  rows?: any[];
}