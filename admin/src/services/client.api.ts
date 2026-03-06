import api from "./api";

/* =========================
   Types
========================= */

export interface ThailandProject {
  id: number;
  projectNo: string;
  projectName: string;
  capacityKwp: number;
  status: string;
  startWarranty?: string;
  endWarranty?: string;
}

export interface ThailandProjectListResponse {
  list: ThailandProject[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateThailandProjectPayload {
  projectNo: string;
  projectName: string;
  capacityKwp: number;
  status: string;
  startWarranty?: string;
  endWarranty?: string;
  company?: string;
  address?: string;
  epcPPA?: string;
  panelBrand?: string;
  panelPowerW?: number | string;
  inverterBrand?: string;
}

/* =========================
   Thailand Projects
========================= */

export const getThailandProjects = async (params?: {
  page?: number;
  pageSize?: number;
  projectNo?: string;
  projectName?: string;
  capacityKwp?: number;
  status?: string;
}) => {

  const res = await api.get("/client-data/thailand/projects", {
    params
  });

  return res.data as {
    success?: boolean
    data: ThailandProjectListResponse
  };
};

export const createThailandProject = async (
  payload: CreateThailandProjectPayload
) => {

  try {

    const res = await api.post(
      "/client-data/thailand/projects",
      payload
    );

    return res.data;

  } catch (error: any) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to create project");

  }
};

/* =========================
   Project Detail
========================= */

export const getProjectDetail = async (siteId: number) => {

  const res = await api.get(
    `/client-data/projects/${siteId}`
  );

  return res.data;
};

/* =========================
   Service Entries
========================= */

export const getServiceEntries = async (job?: string) => {

  const query =
    job && job !== "all"
      ? `?job=${job}`
      : "";

  const res = await api.get(
    `/client-data/service/entries${query}`
  );

  return res.data;
};

export const createServiceEntry = async (payload: {
  siteId: number;
  job: "SERVICE" | "CLEANING" | "INSPECTION" | "OM";
  description: string;
}) => {

  const res = await api.post(
    "/client-data/service/entries",
    payload
  );

  return res.data;
};