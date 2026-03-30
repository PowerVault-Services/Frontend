import api from "./api";

interface ForecastRow {
    month: number;        // 1-12 (ไม่ใช่ YYYY-MM)
    globalKwhM2: number;  // irradiation
    eGridKwh: number;     // production
    prRatio: number;      // PR %
}

interface CreateForecastPayload {
    data: {
        siteId: number;
        rows: ForecastRow[];
    }[];
}

export const createForecast = async (payload: CreateForecastPayload) => {
    // API ต้องการแยก call ทีละ siteId
    const results = await Promise.all(
        payload.data.map(({ siteId, rows }) =>
            api.put(`/client-data/projects/${siteId}/forecast/pvsyst`, { rows })
        )
    );
    return results;
};