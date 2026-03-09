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

export const getServiceEntries = async (params?: {
    job?: string;
    projectNo?: string;
    projectName?: string;
    systemSizeKWp?: number;
    page?: number;
    pageSize?: number;
}) => {

    const res = await api.get(
        "/client-data/service/entries",
        { params }
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

export const updateServiceEntry = async (
    entryId: number,
    data: { description: string }
) => {

    const res = await api.put(
        `/client-data/service/entries/${entryId}`,
        data
    );

    return res.data;
};

export const deleteServiceEntry = async (
    entryId: number
) => {

    const res = await api.delete(
        `/client-data/service/entries/${entryId}`
    );

    return res.data;
};


/* =========================
   Warranty Supplier
========================= */

export const createWarrantySupplier = async (
    siteId: number,
    payload: {
        category: string;
        itemName: string;
        supplierName: string;
        productName: string;
        quantity: number;
        startWarranty: string;
        endWarranty: string;
        warrantyYears: number;
    }
) => {

    const res = await api.post(
        `/client-data/projects/${siteId}/warranty/supplier`,
        payload
    );

    return res.data;

};

export const updateWarrantySupplier = async (
    itemId: number,
    payload: {
        supplierName?: string;
        warrantyYears?: number;
    }
) => {

    const res = await api.put(
        `/client-data/warranty/supplier/${itemId}`,
        payload
    );

    return res.data;

};

export const deleteWarrantySupplier = async (
    itemId: number
) => {

    const res = await api.delete(
        `/client-data/warranty/supplier/${itemId}`
    );

    return res.data;

};


/* =========================
   Warranty Customer
========================= */

export const createWarrantyCustomer = async (
    siteId: number,
    payload: {
        category: string;
        itemName: string;
        warrantyYears: number;
    }
) => {

    const res = await api.post(
        `/client-data/projects/${siteId}/warranty/customer`,
        payload
    );

    return res.data;

};

export const updateWarrantyCustomer = async (
    itemId: number,
    payload: {
        warrantyYears?: number;
    }
) => {

    const res = await api.put(
        `/client-data/warranty/customer/${itemId}`,
        payload
    );

    return res.data;

};

export const deleteWarrantyCustomer = async (
    itemId: number
) => {

    const res = await api.delete(
        `/client-data/warranty/customer/${itemId}`
    );

    return res.data;

};


/* =========================
   Layout Upload
========================= */

export const uploadLayout = async (
    siteId: number,
    type: "PV_LAYOUT" | "PV_STRING_LAYOUT",
    file: File
) => {

    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(
        `/client-data/projects/${siteId}/layouts/${type}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;

};


/* =========================
   Forecast (PVsyst)
========================= */

export const updateForecastPvsyst = async (
    siteId: number,
    rows: {
        month: number;
        globalKwhM2: number;
        eGridKwh: number;
        prRatio: number;
    }[]
) => {

    const res = await api.put(
        `/client-data/projects/${siteId}/forecast/pvsyst`,
        { rows }
    );

    return res.data;

};


/* =========================
   Forecast Warranty Energy
========================= */

export const updateForecastWarrantyEnergy = async (
    siteId: number,
    rows: {
        year: number;
        warrantyEnergyKwh: number;
    }[]
) => {

    const res = await api.put(
        `/client-data/projects/${siteId}/forecast/warranty-energy`,
        { rows }
    );

    return res.data;

};


/* =========================
   Other Tab
========================= */

export const createOtherRow = async (
    siteId: number,
    payload: {
        title: string;
        value: string;
        remark?: string;
    }
) => {

    const res = await api.post(
        `/client-data/projects/${siteId}/other`,
        payload
    );

    return res.data;

};

export const updateOtherRow = async (
    rowId: number,
    payload: {
        value?: string;
        remark?: string;
    }
) => {

    const res = await api.put(
        `/client-data/other/${rowId}`,
        payload
    );

    return res.data;

};

export const deleteOtherRow = async (
    rowId: number
) => {

    const res = await api.delete(
        `/client-data/other/${rowId}`
    );

    return res.data;

};