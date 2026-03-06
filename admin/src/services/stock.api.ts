import api from "./api";

/* =========================
   Types
========================= */

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

/* =========================
   Stock Summary
========================= */

export const getStockSummary = async () => {
  const res = await api.get("/stock/summary");
  return res.data;
};

/* =========================
   Stock Meta
========================= */

export const getStockMeta = async (includeInactive = false) => {

  const res = await api.get<StockMetaResponse>(
    `/stock/meta?includeInactive=${includeInactive}`
  );

  return res.data.data;
};

/* =========================
   Stock IN
========================= */

export const getStockInList = async (query?: string) => {

  const res = await api.get(`/stock/in${query ?? ""}`);

  return res.data;
};

export const createStockIn = async (data: any) => {

  const res = await api.post("/stock/in", data);

  return res.data;
};

/* =========================
   Stock OUT
========================= */

export const getStockOutList = async (query?: string) => {

  const res = await api.get(`/stock/out${query ?? ""}`);

  return res.data;
};

export const createStockOut = async (data: any) => {

  const res = await api.post("/stock/out", data);

  return res.data;
};

/* =========================
   Products
========================= */

export const createStockProduct = async (data: {
  sku: string;
  name: string;
  categoryId: number;
  unitId: number;
}) => {

  const res = await api.post("/stock/products", data);

  return res.data;
};

export interface CreateStockProductPayload {
  sku: string;
  name: string;
  categoryId: number;
  unitId: number;
}
