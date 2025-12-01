import { useState } from "react";
import searchIcon from "../assets/icons/searchicon.svg";
import ArrowDown from "../assets/icons/arrow-down.svg";
import closeIcon from "../assets/icons/dark-closecirecle.svg";

interface SearchBoxProps {
  title?: string;
  children?: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  defaultOpen?: boolean;
}

export default function SearchBox({
  children,
  onSearch,
  onReset,
  defaultOpen = true,
}: SearchBoxProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      className={`
            w-full
            rounded-3xl
            border-t-3 border-green-600
            bg-white
            shadow-sm
            flex flex-col
            ${open ? "h-auto" : "h-28 justify-center"} `}
    >
      {/* HEADER */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center justify-between
          w-full
          px-[18px] py-3
          rounded-t-3xl
        "
      >
        <div className="flex items-center gap-2.5">
          <img src={searchIcon} alt="search icon" className="w-5 h-5" />
          <h4>Search</h4>
        </div>

        {/* ขวา : ลูกศรขึ้น/ลง */}
        <div
          className={`
            w-6 h-6 flex items-center justify-center
            bg-white
            transition-transform duration-200
            ${open ? "rotate-0" : "rotate-180"}
          `}
        >
          <img src={ArrowDown} alt="arrow" className="w-6 h-6" />
        </div>
      </button>

      {/* BODY */}
      {open && (
        <div
          className="
            flex flex-col
            gap-[11px]
            px-[18px] pt-3 pb-3
          "
        >
          {/* ส่วนฟอร์ม ให้มาจาก props children */}
          {children}

          {/* แถวปุ่มล่างขวา */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onReset}
              className="
                inline-flex items-center justify-center
                h-[31px] w-[95px] px-6 py-2.5 gap-2.5
                rounded-full
                border border-green-600
                bg-white
                text-(--green-900)
                text-sm font-normal
                transition
              "
            >
              <img src={closeIcon} alt="" className="w-[18px] h-[18px] mr-1" />
              reset
            </button>

            <button
              type="button"
              onClick={onSearch}
              className="
                inline-flex items-center justify-center
                h-[31px] w-[95px] px-6 py-2.5 gap-2.5
                rounded-full
                bg-green-500
                text-white text-sm font-normal
                transition
              "
            >
              <img
                src={searchIcon}
                className="w-[18px] h-[18px] invert mr-1"
                alt=""
              />
              search
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
