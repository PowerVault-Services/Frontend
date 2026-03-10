import api from "./api";

/* ================= Types ================= */

export interface Alarm {
  id: number;
  severity: number;
  severityText: string;
  plantName: string;
  deviceType: string | null;
  deviceName: string;
  alarmName: string;
  alarmId: string;
  sn: string;
  occurredAt: string;
  clearedAt?: string | null;
  status: "ACTIVE" | "CLEARED";
}

export interface AlarmListResponse {
  list: Alarm[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/* ================= GET /api/alarms ================= */

export const getAlarms = async (params?: {
  tab?: "active" | "historical";
  page?: number;
  pageSize?: number;
  siteId?: number;
  inverterId?: number;
  severity?: number;
  q?: string;
  alarmId?: string;
  sn?: string;
  from?: string;
  to?: string;
}): Promise<AlarmListResponse> => {
  const res = await api.get("/alarms", { params });
  return res.data?.data;
};

/* ================= GET Latest Alarm ================= */

export const getLatestAlarm = async (
  siteId: number
): Promise<Alarm[]> => {
  const res = await api.get("/alarms", {
    params: {
      tab: "active",
      siteId,
      page: 1,
      pageSize: 1,
    },
  });

  return res.data?.data?.list ?? [];
};

/* ================= GET /api/alarms/:id ================= */

export const getAlarmById = async (id: number): Promise<Alarm> => {
  const res = await api.get(`/alarms/${id}`);
  return res.data?.data;
};

/* ================= POST /api/alarms/:id/acknowledge ================= */

export const acknowledgeAlarm = async (id: number) => {
  const res = await api.post(`/alarms/${id}/acknowledge`);
  return res.data?.data;
};

/* ================= DELETE /api/alarms/:id ================= */

export const deleteAlarm = async (id: number) => {
  const res = await api.delete(`/alarms/${id}`);
  return res.data?.data;
};

/* ================= GET /api/alarms/export ================= */

export const exportAlarms = async (params?: {
  tab?: "active" | "historical";
  siteId?: number;
  inverterId?: number;
  severity?: number;
  q?: string;
  alarmId?: string;
  sn?: string;
  from?: string;
  to?: string;
}) => {
  const res = await api.get("/alarms/export", {
    params,
    responseType: "blob",
  });

  return res.data;
};