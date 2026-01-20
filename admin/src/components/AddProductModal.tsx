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
            <div className="relative w-[1102px] rounded-2xl bg-white px-6 py-[47px] shadow-xl">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600"
                >
                    <X size={22} />
                </button>

                <div className="grid grid-rows-1 gap-y-[35px]">
                    <h1 className="text-center font-bold text-green-800">
                        เพิ่มสินค้าใหม่
                    </h1>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                        <TextInputFilter label="รหัสสินค้า" value="" onChange={() => { }} />
                        <TextInputFilter label="หมวดหมู่" value="" onChange={() => { }} />
                        <TextInputFilter label="ชื่อสินค้า" value="" onChange={() => { }} />
                        <TextInputFilter label="หน่วยนับ" value="" onChange={() => { }} />
                    </div>

                    <div className="mt-10 flex gap-2.5">
                        <button
                            onClick={onClose}
                            className="w-1/2 rounded-full border border-green-700 py-3 text-green-700"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={onNext}
                            className="w-1/2 rounded-full bg-green-700 py-3 text-white"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
