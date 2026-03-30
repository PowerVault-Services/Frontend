import api from "./api";

/* =========================
   Types
========================= */

export interface ClientPlant {
  siteId: number;
  projectNo: string;
  projectName: string;
  company?: string;
  type?: string;
  systemSizeKWp?: number;
  locationProvince?: string;
  codDate?: string;
  status?: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  createdAt?: string;
}

export interface ClientPlantDetail extends ClientPlant {
  ecpPpa?: string;
  address?: string;
  freeOmText?: string;
  warrantyOutputPct?: number;
  solarPanel?: string;
  panelBrand?: string;
  panelSizeW?: number;
  salePerson?: string;
  siteEngineer?: string;
  installationContractor?: string;
  workEntryConditions?: string;
  contactEmail?: string;
  contactPhone?: string;
}

/* =========================
   Query Params
========================= */

export interface GetClientPlantsParams {
  projectNo?: string;
  projectName?: string;
  company?: string;
  status?: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  page?: number;
  pageSize?: number;
}

/* =========================
   GET: list
========================= */

export const getClientPlants = async (
  params?: GetClientPlantsParams
) => {
  const res = await api.get("/client-data/plants", { params });
  return res.data;
};

/* =========================
   GET: detail
========================= */

export const getClientPlantById = async (siteId: number) => {
  const res = await api.get(`/client-data/plants/${siteId}`);
  return res.data;
};

/* =========================
   POST: create
========================= */

export interface CreateClientPlantPayload {
  projectNo: string;
  projectName: string;
  companyName?: string;
  ecpPpa?: string;
  type?: string;
  address?: string;
  locationProvince?: string;
  freeOmText?: string;
  warrantyOutputPct?: number;
  codDate?: string;

  systemSizeKWp?: number;
  capacityKWp?: number;   // alias
  capacityKwp?: number;   // alias

  solarPanel?: string;
  panelBrand?: string;
  panelSizeW?: number;

  salePerson?: string;
  siteEngineer?: string;
  installationContractor?: string;
  workEntryConditions?: string;

  contactEmail?: string;
  contactPhone?: string;
}

export const createClientPlant = async (
  payload: CreateClientPlantPayload
) => {
  // 🔥 normalize alias
  const systemSizeKWp =
    payload.systemSizeKWp ??
    payload.capacityKWp ??
    payload.capacityKwp ??
    0;

  const body = {
    ...payload,
    systemSizeKWp,
  };

  const res = await api.post("/client-data/plants", body);
  return res.data;
};

/* =========================
   PUT: update
========================= */

export const updateClientPlant = async (
  siteId: number,
  payload: Partial<CreateClientPlantPayload & { status: string }>
) => {
  const res = await api.put(
    `/client-data/plants/${siteId}`,
    payload
  );
  return res.data;
};

/* =========================
   DELETE
========================= */

export const deleteClientPlant = async (siteId: number) => {
  const res = await api.delete(
    `/client-data/plants/${siteId}`
  );
  return res.data;
};


/* =========================
   Service Entries (เพิ่มส่วนนี้เข้าไป)
========================= */

export const createServiceEntry = async (payload: {
  siteId: number;
  job: "SERVICE" | "CLEANING" | "INSPECTION" | "OM";
  description: string;
}) => {
  const res = await api.post(
    "/client-data/service/entries",
    payload
  );
  return res.data.data;
};

/* =========================
   Thailand Projects (เพิ่มส่วนนี้เข้าไป)
========================= */

export interface CreateThailandProjectPayload {
  projectNo: string;
  projectName: string;
  capacityKwp: number;
  status: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export const createThailandProject = async (
  payload: CreateThailandProjectPayload
) => {
  // ใช้ endpoint ให้ถูกตาม backend (ในที่นี้เดาว่า /client-data/thailand/projects)
  const res = await api.post(
    "/client-data/thailand/projects",
    payload
  );
  return res.data.data;
};

export const uploadPlantImage = async (siteId: number, file: File) => {
  console.log("UPLOAD FILE:", file);
  console.log("SITE ID:", siteId);

  const formData = new FormData();

  // 🔥 ลอง "file" ก่อน
  formData.append("file", file);

  const res = await api.post(
    `/client-data/projects/${siteId}/image`,
    formData
  );

  return res.data;
};

export const deletePlantImage = async (siteId: number) => {
  const res = await api.delete(
    `/client-data/projects/${siteId}/image`
  );
  return res.data;
};