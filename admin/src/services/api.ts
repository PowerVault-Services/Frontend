import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ==========================
// Common Types
// ==========================
export interface Category {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  categoryId: number;
  category: string;
  unitId: number;
  unit: string;
  inQty: number;
  outQty: number;
  onHand: number;
  isActive: boolean;
}

export interface StockMetaResponse {
  success: boolean;
  data: {
    categories: Category[];
    units: Unit[];
    products: Product[];
  };
}

// ==========================
// Monitoring
// ==========================
export const getMonitoringPlants = async () => {
  const response = await api.get("/monitoring/sites");
  return response.data;
};

// ==========================
// Stock
// ==========================
export const getStockSummary = async () => {
  const response = await api.get("/stock/summary");
  return response.data;
};

export const getStockMeta = async (includeInactive = false) => {
  const res = await api.get<StockMetaResponse>(
    `/stock/meta?includeInactive=${includeInactive}`
  );
  return res.data.data;
};

export const getStockInList = async () => {
  const res = await api.get("/stock/in");
  return res.data;
};

export const createStockIn = async (data: any) => {
  const res = await api.post("/stock/in", data);
  return res.data;
};

export const createStockProduct = async (data: {
  sku: string;
  name: string;
  categoryId: number;
  unitId: number;
}) => {
  const res = await api.post("/stock/products", data);
  return res.data;
};

export const getStockOutList = async () => {
  const res = await api.get("/stock/out");
  return res.data;
};

export const createStockOut = async (data: {
  productId: number;
  quantity: number;
  txDate?: string;
  project?: string;
  receiver?: string;
  vendor?: string;
  insuranceCompany?: string;
  insuranceNo?: string;
  note?: string;
  jobId?: string;
}) => {
  try {
    const res = await api.post("/stock/out", data);
    return res.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Stock out failed");
  }
};

// ==========================
// Cleaning
// ==========================
export const getCleaningProjects = async () => {
  const res = await api.get("/cleaning/projects", {
    params: { pageSize: 5000 },
  });

  return res.data.data;
};

export const getCleaningJobs = async () => {
  const res = await api.get("/cleaning/jobs");
  return res.data.data;
};

export const createCleaningStep1 = async (payload: {
  siteId: number;
  projectType: string;
  contactPhone: string;
  contactEmail: string;
  workDate: string;
  workTimeText: string;
  customerName: string;
  note: string;
}) => {
  const res = await api.post("/cleaning/step1", payload);
  return res.data;
};

export const sendCleaningStep2 = async (jobId: number) => {
  const res = await api.post("/cleaning/step2/send", {
    jobId
  });

  return res.data;
};

export async function saveCleaningStep2Draft(data: {
  jobId: number
  to: string
  subject: string
  body: string
  file?: File | null
}) {
  const formData = new FormData()

  formData.append("jobId", String(data.jobId))
  formData.append("to", data.to)
  formData.append("subject", data.subject)
  formData.append("body", data.body)

  if (data.file) {
    formData.append("files", data.file)
  }

  const res = await api.post("/cleaning/step2/draft", formData)

  return res.data
}

export async function uploadCleaningEvidence({
  jobId,
  labelType,
  files,
}: {
  jobId: string;
  labelType: string;
  files: File[];
}) {
  const formData = new FormData();

  formData.append("jobId", jobId);
  formData.append("labelType", labelType);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await api.post("/cleaning/step3/evidence", formData);

  return res.data;
}

export const generateCleaningReport = async (jobId: number) => {
  const res = await api.post("/cleaning/step4/generate", {
    jobId,
  });

  return res.data;
};

// ==========================
// Inspection
// ==========================
export const getInspectionProjects = async () => {
  const res = await api.get("/inspection/projects");
  return res.data.data;
};

export const createInspectionStep1 = async (payload: {
  siteId: number;
  projectType: string;
  contactPhone: string;
  contactEmail: string;
  workDate: string;
  workTimeText: string;
  customerName: string;
  note: string;
}) => {
  const res = await api.post("/inspection/step1", payload);
  return res.data;
};

export const sendInspectionStep2 = async (jobId: number) => {
  const res = await api.post("/inspection/step2/send", { jobId });
  return res.data;
};

// ==========================
// Service
// ==========================

export const createServiceStep3Draft = async ({
  jobId,
  reportFile,
  images,
  metaJson,
}: {
  jobId: number;
  reportFile?: File | null;
  images?: File[];
  metaJson?: any;
}) => {
  const formData = new FormData();

  formData.append("jobId", String(jobId));

  if (metaJson) {
    formData.append("metaJson", JSON.stringify(metaJson));
  }

  if (reportFile) {
    formData.append("serviceReport", reportFile);
  }

  if (images && images.length > 0) {
    images.forEach((file) => {
      formData.append("evidence", file);
    });
  }

  const res = await api.post(
    "/service/step3/draft",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// ==========================================
// Client Data - Thailand Projects
// ==========================================

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

export const getThailandProjects = async (params?: {
  page?: number;
  pageSize?: number;
  projectNo?: string;
  projectName?: string;
  capacityKwp?: number;
  status?: string;
}) => {
  const response = await api.get("/client-data/thailand/projects", { params });
  return response.data;
};

export const createThailandProject = async (
  payload: CreateThailandProjectPayload
) => {
  try {
    const response = await api.post(
      "/client-data/thailand/projects",
      payload
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to create project");
  }
};

export const getProjectDetail = async (siteId: number) => {
  const res = await api.get(`/client-data/projects/${siteId}`);
  return res.data;
};

// GET
export const getServiceEntries = async (job?: string) => {
  const query = job && job !== "all" ? `?job=${job}` : "";
  return api.get(`/client-data/service/entries${query}`);
};

// POST
export const createServiceEntry = async (payload: {
  siteId: number;
  job: "SERVICE" | "CLEANING" | "INSPECTION" | "OM";
  description: string;
}) => {
  return api.post("/client-data/service/entries", payload);
};

export default api;
