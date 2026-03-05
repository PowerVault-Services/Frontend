import { useState } from "react";
import UploadIcon from "../assets/icons/Cloud Upload.svg";

interface Props {
  label: string;
  onChange: (file: File | null) => void;
}

export default function UploadImagePreviewField({ label, onChange }: Props) {

  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    onChange(file);
  };

  return (
    <div className="flex flex-col gap-2">

      <label className="text-[16px] font-semibold text-black">
        {label}
      </label>

      <label
        className="
        relative
        flex
        items-center
        justify-center
        border border-dashed border-green-800
        rounded-xl
        h-[220px]
        cursor-pointer
        overflow-hidden
        hover:bg-green-50
        transition
        "
      >

        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="absolute inset-0 w-full h-full object-contain p-2"
          />
        ) : (
          <div className="flex flex-col items-center text-sm text-gray-500">
            <img src={UploadIcon} className="w-7 h-7 mb-2" />
            คลิกเพื่ออัปโหลด
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />

      </label>

    </div>
  );
}