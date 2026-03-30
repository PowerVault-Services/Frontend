import { useState, useEffect } from "react";
import { uploadLayout, getProjectDetail } from "../../../services/client.api";
import Notification from "../../Notification";

interface Props {
  siteId?: number;
  type: "PV_LAYOUT" | "PV_STRING_LAYOUT";
}

export default function LayoutTab({ siteId, type }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ================= Upload ================= */
  const handleUpload = async () => {
    if (!siteId || !file) return;

    setLoading(true);
    setError(null);

    try {
      const res = await uploadLayout(siteId, type, file);

      // ✅ FIX ตรงนี้
      setFileUrl(`${import.meta.env.VITE_API_URL}${res.data.fileUrl}`);

      // ✅ เรียกใช้ State นี้ ข้อความจะถูกส่งไปที่ Notification
      setSuccessMsg("อัปโหลดรูป Layout เรียบร้อยแล้ว");

    } catch (err) {
      console.error(err);
      setError("อัปโหลดไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Load from DB ================= */
  useEffect(() => {
    if (!siteId) return;

    const fetchLayout = async () => {
      try {
        const data = await getProjectDetail(siteId);

        const layouts = data.layouts || [];

        const layout = layouts.find(
          (l: { type: string; fileUrl: string }) => l.type === type
        );

        if (layout?.fileUrl) {
          setFileUrl(`${import.meta.env.VITE_API_URL}${layout.fileUrl}`);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchLayout(); // ✅ ตอนนี้มีแล้ว
  }, [siteId, type]);

  /* ================= Handle File Select ================= */
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("รองรับเฉพาะไฟล์รูปภาพ (jpg, png)");
      return;
    }

    setError(null);
    setFile(file);
  };

  return (
    <div className="p-2">
      <div className="bg-white border rounded-lg w-full min-h-[420px] flex items-center justify-center relative overflow-hidden">

        {/* 🖼 Preview */}
        {fileUrl ? (
          <img
            src={fileUrl}
            alt="layout"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm">
            อัปโหลดรูป Layout
          </div>
        )}
      </div>

      {/* 🔘 Upload UI */}
      <div className="pt-4 absolute flex items-center gap-3">

        <input
          type="file"
          accept="image/*"
          id="layout-upload"
          className="hidden"
          onChange={(e) =>
            handleFileChange(e.target.files?.[0] || null)
          }
        />

        <label
          htmlFor="layout-upload"
          className="px-5 h-10 text-sm rounded-md flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
        >
          เลือกรูป
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="px-5 h-10 text-sm rounded-md flex items-center justify-center bg-green-700 hover:bg-green-800 text-white disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {error && (
          <div className="text-red-500 text-xs">{error}</div>
        )}
      </div>

      {/* ✅ เรียกใช้ Component Notification ตรงนี้ */}
      <Notification
        message={successMsg}
        duration={3000} // โชว์ 3 วินาที (ปรับเปลี่ยนได้)
        onClose={() => setSuccessMsg(null)} // เคลียร์ State หลังจากที่เฟดดับไปแล้ว
      />
    </div>
  );
}