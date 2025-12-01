import React from "react";
import ArrowDown from "../../assets/icons/arrow-down.svg";

interface Option {
  label: string;
  value: string;
}

interface SelectFilterProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  name?: string;
}

export default function SelectFilter({
  label,
  placeholder = "Select",
  value,
  onChange,
  options,
  name,
}: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      <label className="text-[16px] font-medium text-brandGreen-900">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-[44px]
          rounded-[8px]
          border border-brandGreen-300
          bg-white
          px-4 pr-10
          text-[16px]
          text-brandGreen-500
          appearance-none
          focus:outline-none
          focus:ring-1 focus:ring-brandGreen-500
          focus:border-brandGreen-500
          transition
        "
      >
        {/* placeholder */}
        <option value="" disabled hidden>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* ไอคอนลูกศรด้านขวา */}
      <img
        src={ArrowDown}
        alt=""
        className="
          pointer-events-none
          w-4 h-4
          absolute
          right-3
          top-[32px]
        "
      />
    </div>
  );
}
