import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getProjectDetail,
  updateThailandProject
} from "../../services/client.api";

export default function ProjectEditPage() {
  const navigate = useNavigate();
  const { siteId } = useParams();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    projectName: "",
    status: "ACTIVE",
  });

  /* ================= Load Data ================= */
  const fetchDetail = async () => {
    if (!siteId) return;

    setLoading(true);

    try {
      // res ตัวนี้คือ Type 'ProjectUI' เรียบร้อยแล้วตามที่ประกาศใน API
      const res = await getProjectDetail(Number(siteId));

      // ✅ แก้ไข: ใช้ res ได้เลย ไม่ต้องเข้าถึง .data
      setForm({
        projectName: res?.projectName ?? "",
        status: res?.status ?? "ACTIVE",
      });

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

  /* ================= Handle Change ================= */

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /* ================= Save ================= */

  const handleSave = async () => {
    if (!siteId) return;

    if (!form.projectName.trim()) {
      alert("กรุณากรอก Project Name");
      return;
    }

    setSaving(true);

    try {
      await updateThailandProject(Number(siteId), {
        projectName: form.projectName,
        status: form.status
      });

      alert("บันทึกสำเร็จ");

      // 🔁 กลับหน้า list + refresh
      navigate("/project", { state: { refresh: true } });

    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Edit Project
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow rounded-2xl p-6 flex flex-col gap-4">

          {/* Project Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Project Name *
            </label>
            <input
              value={form.projectName}
              onChange={(e) =>
                handleChange("projectName", e.target.value)
              }
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Status *
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => navigate("/project")}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>

        </div>
      )}
    </div>
  );
}