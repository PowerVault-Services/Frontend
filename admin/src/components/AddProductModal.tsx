import TextInputFilter from "./TextInputFilter";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getStockMeta, getStockProjects } from "../services/stock.api";
import type { Category, Unit, Product } from "../services/stock.api";
import SelectFilter from "./SelectFilter";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => Promise<void>;
  onSuccess?: () => void;
  mode?: "create" | "stockIn" | "stockOut";
}

type Project = {
  siteId: number;
  name: string;
};

export default function AddProductModal({
  open,
  onClose,
  onSubmit,
  onSuccess,
  mode = "create",
}: AddProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    categoryId: "",
    unitId: "",
    projectId: "",
    productId: "",
    quantity: "",
    receiver: "",  // ✅ ผู้รับสินค้า
    vendor: "",    // ✅ ผู้ขาย
    note: "",      // ✅ หมายเหตุ
  });

  // ✅ reset form เมื่อ modal เปิด
  useEffect(() => {
    if (open) {
      setFormData({
        sku: "",
        name: "",
        categoryId: "",
        unitId: "",
        projectId: "",
        productId: "",
        quantity: "",
        receiver: "",
        vendor: "",
        note: "",
      });
      loadMeta();
    }
  }, [open]);

  const loadMeta = async () => {
    try {
      const [meta, projectsRes] = await Promise.all([
        getStockMeta(false),
        getStockProjects(), // ✅ ดึง projects แยก
      ]);

      setCategories(meta.categories || []);
      setUnits(meta.units || []);
      setProducts(meta.products || []);

      // ✅ map จาก /stock/projects response
      const rawProjects = projectsRes.data || [];
      setProjects(rawProjects.map((p: any) => ({
        siteId: p.siteId,
        name: p.project ?? p.name ?? "-",
      })));
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[800px] rounded-2xl bg-white p-8 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <h1 className="mb-6 text-center text-xl font-bold text-green-800">
          {mode === "create" && "เพิ่มสินค้าใหม่"}
          {mode === "stockIn" && "รับสินค้าเข้า"}
          {mode === "stockOut" && "เบิกสินค้า"}
        </h1>

        <div className="grid grid-cols-2 gap-6">

          {/* ── CREATE mode ── */}
          {mode === "create" && (
            <>
              <TextInputFilter
                label="รหัสสินค้า"
                value={formData.sku}
                onChange={(v) => setFormData({ ...formData, sku: v })}
              />
              <TextInputFilter
                label="ชื่อสินค้า"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-green-800">หมวดหมู่</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="h-[39px] border border-green-200 rounded px-3"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Unit */}
              <div className="flex flex-col gap-1">
                <label className="text-green-800">หน่วยนับ</label>
                <select
                  value={formData.unitId}
                  onChange={(e) =>
                    setFormData({ ...formData, unitId: e.target.value })
                  }
                  className="h-[39px] border border-green-200 rounded px-3"
                >
                  <option value="">เลือกหน่วย</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* ── STOCK IN / OUT mode ── */}
          {mode !== "create" && (
            <>
              {/* ✅ dropdown เลือกสินค้า */}
              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-green-800">สินค้า</label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: e.target.value })
                  }
                  className="h-[39px] border border-green-200 rounded px-3"
                >
                  <option value="">เลือกสินค้า</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.sku} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* จำนวน */}
              <TextInputFilter
                label="จำนวน"
                value={formData.quantity}
                onChange={(v) => setFormData({ ...formData, quantity: v })}
              />

              {/* ใช้กับโครงการ */}
              <SelectFilter
                label="ใช้กับโครงการ"
                value={formData.projectId}
                onChange={(v) => setFormData({ ...formData, projectId: v })}
                options={projects.map((p) => ({
                  value: String(p.siteId),
                  label: p.name,
                }))}
              />

              {/* ✅ stockIn เพิ่ม ผู้รับสินค้า ผู้ขาย หมายเหตุ */}
              {mode === "stockIn" && (
                <>
                  <TextInputFilter
                    label="ผู้รับสินค้า"
                    value={formData.receiver}
                    onChange={(v) => setFormData({ ...formData, receiver: v })}
                  />
                  <TextInputFilter
                    label="ผู้ขาย"
                    value={formData.vendor}
                    onChange={(v) => setFormData({ ...formData, vendor: v })}
                  />
                  <div className="col-span-2">
                    <TextInputFilter
                      label="หมายเหตุ"
                      value={formData.note}
                      onChange={(v) => setFormData({ ...formData, note: v })}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onClose}
            className="w-1/2 rounded-full border border-green-700 py-3 text-green-700"
          >
            ยกเลิก
          </button>

          <button
            onClick={async () => {
              try {
                setLoading(true);
                await onSubmit?.(formData);
                onSuccess?.();
                onClose();
              } catch (err: any) {
                alert(err.message);
              } finally {
                setLoading(false);
              }
            }}
            className="w-1/2 rounded-full bg-green-700 py-3 text-white"
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}