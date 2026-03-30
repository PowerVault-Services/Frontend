import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientPlantById, updateClientPlant, uploadPlantImage, deletePlantImage } from "../../services/client-data.api";
import { ArrowLeft, Upload, X } from "lucide-react";

const styles = `
  .ep-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 20px 22px; margin-bottom: 14px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1); }
  .ep-section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
  .ep-section-icon { width: 28px; height: 28px; border-radius: 8px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .ep-section-title { font-size: 14px; font-weight: 600; }
  .ep-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; color: #6b7280; text-transform: uppercase; margin-bottom: 5px; display: block; }
  .ep-input, .ep-select, .ep-textarea { 
    padding: 9px 12px; border-radius: 8px; border: 1px solid #d1d5db; background: #f9fafb; 
    font-size: 13px; width: 100%; box-sizing: border-box; transition: all 0.2s;
  }
  .ep-input:focus, .ep-select:focus, .ep-textarea:focus { outline: none; border-color: #166534; background: #fff; ring: 2px solid #166534; }
`;

export default function ProjectEditPage() {
  
  const navigate = useNavigate();
  const { siteId } = useParams();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  // เพิ่มฟิลด์ให้ครบตามความต้องการ
  const [form, setForm] = useState({
    companyName: "",
    projectType: "EPC",
    location: "",
    epcPpa: "",
    address: "",
    freeOM: "",
    warrantyOutput: "",
    codDate: "",
    solarPanel: "",
    panelBrand: "",
    panelSize: "",
    saleName: "",
    siteEngineer: "Sam",
    contractor: "",
    workCondition: "",
    customerEmail: "",
    tel: "",
    status: "ACTIVE",
    remark: "",
  });

  const fetchDetail = async () => {
    if (!siteId) return;
    setLoading(true);
    try {
      const res = await getClientPlantById(Number(siteId));
      const d = res.data; // { success: true, data: {...} }
      setForm({
        companyName: d.company ?? "",
        projectType: d.type ?? "EPC",
        location: d.locationProvince ?? "",
        epcPpa: d.ecpPpa ?? "",
        address: d.address ?? "",
        freeOM: d.freeOmText ?? "",
        warrantyOutput: d.warrantyOutputPct != null ? String(d.warrantyOutputPct) : "",
        codDate: d.codDate?.slice(0, 10) ?? "",
        solarPanel: d.solarPanel ?? "",
        panelBrand: d.panelBrand ?? "",
        panelSize: d.panelSizeW != null ? String(d.panelSizeW) : "",
        saleName: d.salePerson ?? "",
        siteEngineer: d.siteEngineer ?? "",
        contractor: d.installationContractor ?? "",
        workCondition: d.workEntryConditions ?? "",
        customerEmail: d.contactEmail ?? "",
        tel: d.contactPhone ?? "",
        status: d.status ?? "ACTIVE",
        remark: "",
      });
      setCurrentImageUrl(d.siteImageUrl ?? null);
    } catch (err) {
      console.error(err);
      alert("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [siteId]);

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!siteId) return;
    setSaving(true);
    try {
      await updateClientPlant(Number(siteId), {
        projectName: form.companyName,
        type: form.projectType,
        locationProvince: form.location,
        ecpPpa: form.epcPpa,
        address: form.address,
        freeOmText: form.freeOM,
        warrantyOutputPct: form.warrantyOutput ? Number(form.warrantyOutput) : undefined,
        codDate: form.codDate || undefined,
        solarPanel: form.solarPanel,
        panelBrand: form.panelBrand,
        panelSizeW: form.panelSize ? Number(form.panelSize) : undefined,
        salePerson: form.saleName,
        siteEngineer: form.siteEngineer,
        installationContractor: form.contractor,
        workEntryConditions: form.workCondition,
        contactEmail: form.customerEmail,
        contactPhone: form.tel,
        status: form.status,
      });
      if (imageFile) {
        await uploadPlantImage(Number(siteId), imageFile);
      }
      alert("บันทึกสำเร็จ");
      navigate("/client-data", { state: { refresh: true } });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "บันทึกไม่สำเร็จ";
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = async () => {
    if (currentImageUrl && siteId) {
      try {
        await deletePlantImage(Number(siteId));
        setCurrentImageUrl(null);
      } catch {
        alert("ลบรูปไม่สำเร็จ");
      }
    }
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="w-full">
      <style>{styles}</style>

      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-green-800">
          <ArrowLeft size={20} />
          <span>Back to Client Data</span>
        </button>
        <div className="flex justify-between items-center-safe">
          <h1 className="text-green-800 font-bold mt-6">Edit Project Plant</h1>
          <div className="mt-6 flex justify-between items-center px-4 py-3 bg-gray-50 border rounded-xl text-[12px] text-gray-500">
            <span>Last edited by <strong>System Admin</strong> · Just now</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold uppercase text-[10px]">
              ● {form.status} SITE
            </span>
          </div>
        </div>

      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading project data...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">

            {/* General & Identity */}
            <div className="ep-card">
              <div className="ep-section-header">
                <span className="ep-section-title text-green-800 font-bold">General & Identity</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="ep-label">Company / Project Name</label>
                    <input className="ep-input" value={form.companyName} onChange={(e) => handleChange("companyName", e.target.value)} />
                  </div>
                  <div>
                    <label className="ep-label">Location (จังหวัด)</label>
                    <input className="ep-input" value={form.location} onChange={(e) => handleChange("location", e.target.value)} placeholder="เช่น กรุงเทพฯ" />
                  </div>
                </div>
                <div className="w-full">
                  <label className="ep-label">Address</label>
                  <input
                    className="ep-input"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="88 หมู่ 5 ต."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="ep-label">Type</label>
                    <select className="ep-select" value={form.projectType} onChange={(e) => handleChange("projectType", e.target.value)}>
                      <option>PVS ขาย PM (EPC)</option>
                      <option>EPC</option>
                      <option>PPA</option>
                    </select>
                  </div>
                  <div>
                    <label className="ep-label">EPC/PPA Number</label>
                    <input className="ep-input" value={form.epcPpa} onChange={(e) => handleChange("epcPpa", e.target.value)} placeholder="-" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="ep-label">Free O&M</label>
                    <input className="ep-input" value={form.freeOM} onChange={(e) => handleChange("freeOM", e.target.value)} placeholder="เช่น 2 ปี" />
                  </div>
                  <div>
                    <label className="ep-label">Warranty Output (%)</label>
                    <input className="ep-input" value={form.warrantyOutput} onChange={(e) => handleChange("warrantyOutput", e.target.value)} placeholder="85" />
                  </div>
                  <div>
                    <label className="ep-label">COD Date</label>
                    <input className="ep-input" type="date" value={form.codDate} onChange={(e) => handleChange("codDate", e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="ep-card">
              <div className="ep-section-header">
                <span className="ep-section-title text-green-800 font-bold">Technical Specifications</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="ep-label">Solar Panel</label>
                    <input className="ep-input" value={form.solarPanel} onChange={(e) => handleChange("solarPanel", e.target.value)} placeholder="-" />
                  </div>
                  <div>
                    <label className="ep-label">Panel Brand</label>
                    <input className="ep-input" value={form.panelBrand} onChange={(e) => handleChange("panelBrand", e.target.value)} placeholder="-" />
                  </div>
                  <div>
                    <label className="ep-label">ขนาดแผง (W)</label>
                    <input className="ep-input" type="number" value={form.panelSize} onChange={(e) => handleChange("panelSize", e.target.value)} placeholder="-" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="ep-label">ผู้รับเหมาติดตั้ง</label>
                    <input className="ep-input" value={form.contractor} onChange={(e) => handleChange("contractor", e.target.value)} placeholder="-" />
                  </div>
                  <div>
                    <label className="ep-label">เงื่อนไขงาน</label>
                    <input className="ep-input" value={form.workCondition} onChange={(e) => handleChange("workCondition", e.target.value)} placeholder="-" />
                  </div>
                </div>
                <div>
                  <label className="ep-label">Remark / หมายเหตุ</label>
                  <textarea className="ep-textarea" rows={2} value={form.remark} onChange={(e) => handleChange("remark", e.target.value)} placeholder="ระบุรายละเอียดเพิ่มเติม..."></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="ep-card">
              <div className="ep-section-header">
                <span className="ep-section-title text-green-800 font-bold">Status & Team</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="ep-label">Project Status</label>
                  <select className="ep-select" value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="ep-label">Sale</label>
                  <input className="ep-input" value={form.saleName} onChange={(e) => handleChange("saleName", e.target.value)} placeholder="-" />
                </div>
                <div>
                  <label className="ep-label">Site Engineer</label>
                  <input className="ep-input" value={form.siteEngineer} onChange={(e) => handleChange("siteEngineer", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Contact Detail */}
            <div className="ep-card">
              <div className="ep-section-header">
                <span className="ep-section-title text-green-800 font-bold">Contact Detail</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="ep-label">Contact E-mail</label>
                  <input className="ep-input" type="email" value={form.customerEmail} onChange={(e) => handleChange("customerEmail", e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="ep-label">Tel.</label>
                  <input className="ep-input" type="tel" value={form.tel} onChange={(e) => handleChange("tel", e.target.value)} placeholder="+66..." />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
      {/* Plant Image */}
      <div className="ep-card">
        <div className="ep-section-header">
          <span className="ep-section-title text-green-800 font-bold">Plant Image</span>
        </div>
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 hover:bg-gray-50 transition-all">
          {imagePreview || currentImageUrl ? (
            <div className="relative w-full">
              <img
                src={imagePreview ?? currentImageUrl!}
                alt="Plant"
                className="rounded-lg w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer py-4">
              <Upload className="text-gray-400 mb-2" size={32} />
              <span className="text-sm text-gray-500">Click to upload plant photo</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-start mb-8">
        <div className="flex gap-3">
          <button onClick={() => navigate("/client-data")} className="px-5 py-2 border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 bg-white">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-[#166534] text-white rounded-xl text-sm font-medium hover:bg-[#14532d] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}