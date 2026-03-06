import api from "./api";

export interface ReportItem {
  id: number;
  jobNo: string;
  title: string;
  type: string;
  status: string;
  site: {
    id: number;
    name: string;
  };
  createdAt: string;
  reportCreatedAt: string;
  previewUrl: string;
  downloadUrl: string;
}

export const getReports = async (params?: {
  siteId?: number;
  startMonth?: string;
  endMonth?: string;
}) => {

  const res = await api.get("/reports", { params });

  return res.data.data.list as ReportItem[];

};