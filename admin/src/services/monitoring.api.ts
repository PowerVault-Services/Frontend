import api from "./api";

/* =========================
   Types
========================= */

export interface MonitoringSite {
  id: number;
  plantCode: string;
  name: string;
  capacityKWp: number;
  address: string;
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export interface MonitoringSiteOverview {
  site: {
    id: number;
    plantCode: string;
    name: string;
    capacityKWp: number;
  };
  inverters: {
    id: number;
    name: string;
    model: string;
    serialNumber: string;
    activePower: number;
    lastDailyEnergy: number;
    status: string;
    lastSyncAt: string;
  }[];
  energySeries: {
    date: string;
    energyKWh: number;
  }[];
  lastUpdatedAt: string;
}

export interface InverterDetail {
  id: number;
  name: string;
  model: string;
  serialNumber: string;
  softwareVersion: string | null;
  deviceReplacementRecord: string | null;
  stationCode: string;
  site: {
    id: number;
    name: string;
    plantCode: string;
  };
  realtime: {
    activePower: number;
    dayEnergy: number;
    status: string;
    lastSyncAt: string;
  };
}

export interface InverterStringSnapshot {
  ts: string | null;
  strings: {
    stringNo: number;
    voltage: number;
    current: number;
    status: string;
  }[];
}

export interface InverterSeriesPoint {
  t: string;
  v: number;
}

export interface InverterHistory {
  metric: string;
  range: string;
  series: InverterSeriesPoint[];
}

/* =========================
   Sites
========================= */

export const getMonitoringSites = async () => {
  const res = await api.get("/monitoring/sites");
  return res.data.data;
};

/* =========================
   Site Overview
========================= */

export const getSiteOverview = async (siteId: number) => {
  const res = await api.get(`/monitoring/sites/${siteId}/overview`);
  return res.data.data as MonitoringSiteOverview;
};

/* =========================
   Inverter Detail
========================= */

export const getInverterDetail = async (inverterId: number) => {
  const res = await api.get(`/monitoring/inverters/${inverterId}`);
  return res.data.data as InverterDetail;
};

/* =========================
   Latest String Snapshot
========================= */

export const getLatestStrings = async (inverterId: number) => {
  const res = await api.get(
    `/monitoring/inverters/${inverterId}/strings/latest`
  );

  return res.data.data as InverterStringSnapshot;
};

/* =========================
   Inverter History
========================= */

export const getInverterHistory = async (
  inverterId: number,
  params?: {
    metric?: "activePower" | "dayEnergy" | "temperature" | "powerFactor";
    range?: "day" | "week" | "month";
  }
) => {
  const res = await api.get(
    `/monitoring/inverters/${inverterId}/history`,
    { params }
  );

  return res.data.data as InverterHistory;
};

/* =========================
   String History
========================= */

export const getStringHistory = async (
  inverterId: number,
  params?: {
    date?: string;
    tzOffsetMinutes?: number;
    range?: "day" | "week" | "month";
    stringNo?: number;
    includeDisconnected?: boolean;
  }
) => {

  const res = await api.get(
    `/monitoring/inverters/${inverterId}/strings/history`,
    { params }
  );

  return res.data.data;
};

/* =========================
   PR (Performance Ratio)
========================= */

export const getPRData = async (params: {
  siteId: number;
  granularity?: "day" | "month" | "year";
  collectTime?: number;
  endDate?: string;
  year?: number;
}) => {

  const res = await api.get("/monitoring/pr", {
    params
  });

  return res.data.data;
};