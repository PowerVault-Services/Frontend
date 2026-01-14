import { useState } from "react";
import UploadIcon from "../assets/icons/Cloud Upload.svg";

interface UploadFileFieldProps {
  label: string;                // หัวข้ออัปโหลด
  accept?: string;              // ประเภทไฟล์
  onChange?: (file: File) => void;
}

export default function UploadFileField({
  label,
  accept = ".pdf,.jpg,.jpeg,.xls,.xlsx",
  onChange,
}: UploadFileFieldProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    onChange?.(file);
  };

  return (
    <div className="mt-[27px] space-y-2">
      {/* Upload label */}
      <label className="text-[16px] font-normal text-black">
        {label}
      </label>

      {/* Upload box */}
      <label
        htmlFor="teamFile"
        className="flex items-center gap-2 rounded-lg h-[39px] border border-dashed border-green-800 px-4 text-sm text-gray-600 cursor-pointer hover:bg-green-50 transition"
      >
        {/* icon */}
        <img
          src={UploadIcon}
          alt="upload"
          className="h-[18px] w-[18px]"
        />

        <span className="text-[#2979FF] font-normal">
          คลิกเลือกไฟล์เพื่ออัปโหลด
        </span>

        <input
          id="teamFile"
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
      </label>

      {/* Selected file name */}
      {uploadedFile && (
        <p className="text-xs text-green-700 truncate">
          ไฟล์ที่เลือก: {uploadedFile.name}
        </p>
      )}
    </div>
  );
}
