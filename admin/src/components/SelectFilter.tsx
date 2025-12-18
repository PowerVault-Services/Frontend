
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
      <label className="text-[16px] font-normal text-green-900">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full h-[39px]
          rounded-sm
          border border-green-200
          bg-white
          px-4 pr-10
          text-[14px]
          text-green-500
          font-normal
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
    </div>
  );
}
