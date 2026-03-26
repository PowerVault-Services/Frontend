export function mapProject(data: any, extra?: any) {
  return {
    id: data.id,

    name:
      data.name ??
      data.projectName ??
      extra?.projectName ??
      "-",

    systemSize:
      data.systemSize ??
      data.systemSizeKWp ??
      data.capacityKWp ??
      extra?.systemSizeKWp ??
      0,

    startWarranty:
      data.startWarranty ??
      data.start_warranty ??
      data.warrantyStart ??
      extra?.startWarranty ??
      "-",

    endWarranty:
      data.endWarranty ??
      data.end_warranty ??
      data.warrantyEnd ??
      extra?.endWarranty ??
      "-",

    // 🔥 เพิ่มตรงนี้ทั้งหมด
    company: data.company ?? "-",
    address: data.address ?? "-",
    latitude: data.latitude,
    longitude: data.longitude,

    epcPPA: data.epcPPA ?? "-",
    type: data.type ?? "-",
    freeOM: data.freeOM ?? "-",
    warrantyOutput: data.warrantyOutput ?? "-",
    gridConnectionDate: data.gridConnectionDate ?? null,

    panelBrand: data.panelBrand ?? "-",
    panelPowerW: data.panelPowerW ?? "-",
    inverterCount: data.inverterCount ?? "-",
    inverterBrand: data.inverterBrand ?? "-",

    condition: data.condition ?? "-",
    remark: data.remark ?? "-",

    contactEmail: data.contactEmail ?? "-",
    contactPhone: data.contactPhone ?? "-",

    imageUrl: data.imageUrl ?? null,
    projectName: data.name || data.projectName,
    status: data.status || "ACTIVE",
  };
}