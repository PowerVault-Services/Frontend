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

interface ReportResponse {
  success: boolean;
  data: {
    list: ReportItem[];
  };
}

export const getReports = async (params?: {
  siteId?: number;
  startMonth?: string;
  endMonth?: string;
}): Promise<ReportItem[]> => {

  const res = await api.get<ReportResponse>("/reports", {
    params
  });

  return res.data?.data?.list ?? [];

};