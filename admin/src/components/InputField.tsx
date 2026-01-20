import React from "react";

interface InputFieldProps {
  label: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  textarea?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function InputField({
  label,
  value,
  placeholder,
  disabled,
  textarea = false,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm text-green-800">{label}</label>

      {textarea ? (
        <textarea
          value={value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          className={`p-4 rounded-sm border
            ${disabled
              ? "text-[14px] bg-[#EDEDED] text-green-500 border-green-200 cursor-not-allowed"
              : "bg-[#EDEDED] border-green-200"
            }`}
        />
      ) : (
        <input
          value={value ?? ""}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          className={`h-10 p-4 rounded-sm border
            ${disabled
              ? "text-[14px] bg-[#EDEDED] text-green-500 border-green-200 cursor-not-allowed"
              : "bg-[#EDEDED] border-green-200"
            }`}
        />
      )}
    </div>
  );
}
