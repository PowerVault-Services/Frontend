import { useState, useId } from "react";
import UploadIcon from "../assets/icons/Cloud Upload.svg";

interface UploadFileFieldProps {
  label: string;
  accept?: string;
  onChange?: (file: File) => void;
  disabled?: boolean;
  defaultValue?: string; // ✅ เพิ่มเพื่อรับชื่อไฟล์เดิมจาก Database/API
}

export default function UploadFileField({
  label,
  accept = ".pdf,.jpg,.jpeg,.xls,.xlsx",
  onChange,
  disabled,
  defaultValue // ✅ รับค่ามาใช้งาน
}: UploadFileFieldProps) {

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    onChange?.(file);
  };

  return (
    <div className="mt-[27px] space-y-2">
      <label className="text-[16px] font-normal text-black">
        {label}
      </label>

      <label
        htmlFor={disabled ? undefined : inputId} // ✅ ถ้า disabled ไม่ต้องให้คลิกได้
        className={`flex items-center gap-2 rounded-lg h-[39px] border border-dashed border-green-800 px-4 text-sm text-gray-600 transition
          ${disabled ? "bg-gray-100 cursor-not-allowed border-gray-400" : "cursor-pointer hover:bg-green-50"} 
        `}
      >
        <img
          src={UploadIcon}
          alt="upload"
          className={`h-[18px] w-[18px] ${disabled ? "grayscale opacity-50" : ""}`}
        />

        <span className={`font-normal flex-1 truncate ${disabled ? "text-gray-500" : "text-[#2979FF]"}`}>
          {/* ✅ Logic การแสดงผลชื่อไฟล์ */}
          {uploadedFile 
            ? uploadedFile.name 
            : (defaultValue ? defaultValue : "คลิกเลือกไฟล์เพื่ออัปโหลด")
          }
        </span>

        <input
          id={inputId}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
}