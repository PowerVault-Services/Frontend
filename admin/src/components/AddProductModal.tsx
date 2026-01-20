import TextInputFilter from "./TextInputFilter";
import { X } from "lucide-react";

interface AddProductModalProps {
    open: boolean;
    onClose: () => void;
    onNext: () => void;
}

export default function AddProductModal({
    open,
    onClose,
    onNext,
}: AddProductModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[1054px] h-[331px] rounded-2xl bg-white px-6 py-[47px] shadow-xl">

                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition"
                >
                    <X size={24} />
                </button>
                
                {/* ---------- Title ---------- */}
                <h1 className="text-center font-semibold text-green-800">
                    เพิ่มสินค้าใหม่
                </h1>

                {/* ---------- Form ---------- */}
                <div className="grid grid-cols-2">
                    <TextInputFilter
                        label="รหัสสินค้า"
                        placeholder="Select"
                        value=""
                        onChange={() => { }}
                    />

                    <TextInputFilter
                        label="หมวดหมู่"
                        placeholder="Select"
                        value=""
                        onChange={() => { }}
                    />

                    <TextInputFilter
                        label="ชื่อสินค้า"
                        placeholder="Select"
                        value=""
                        onChange={() => { }}
                    />

                    <TextInputFilter
                        label="หน่วยนับ"
                        placeholder="Select"
                        value=""
                        onChange={() => { }}
                    />
                </div>

                {/* ---------- Footer ---------- */}
                <div className="mt-10 flex gap-6">
                    <button
                        onClick={onClose}
                        className="w-1/2 rounded-full border border-green-700 py-3 text-green-700 hover:bg-green-50 transition"
                    >
                        ยกเลิก
                    </button>

                    <button
                        onClick={onNext}
                        className="w-1/2 rounded-full bg-green-700 py-3 text-white hover:bg-green-800 transition"
                    >
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
    );
}
