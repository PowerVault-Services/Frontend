import { useState, useId } from "react";
import UploadIcon from "../assets/icons/Cloud Upload.svg";

interface UploadFileFieldProps {
  label: string;
  accept?: string;
  onChange?: (file: File) => void;
}

export default function UploadFileField({
  label,
  accept = ".pdf,.jpg,.jpeg,.xls,.xlsx",
  onChange,
}: UploadFileFieldProps) {

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const inputId = useId(); // ⭐ unique id

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
        htmlFor={inputId}
        className="flex items-center gap-2 rounded-lg h-[39px] border border-dashed border-green-800 px-4 text-sm text-gray-600 cursor-pointer hover:bg-green-50 transition"
      >

        <img
          src={UploadIcon}
          alt="upload"
          className="h-[18px] w-[18px]"
        />

        <span className="text-[#2979FF] font-normal flex-1 truncate">
          {uploadedFile ? uploadedFile.name : "คลิกเลือกไฟล์เพื่ออัปโหลด"}
        </span>

        <input
          id={inputId}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />

      </label>

    </div>
  );
}