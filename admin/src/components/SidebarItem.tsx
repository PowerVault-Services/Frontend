import ArrowDown from "../assets/icons/arrow-down.svg";

interface SidebarItemProps {
  title: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarItem({
  title,
  children,
  isOpen,
  onToggle,
}: SidebarItemProps) {
  return (
    <div className="w-[277px]">
      {/* HEADER */}
      <button
        type="button"
        onClick={onToggle}
        className={`
          flex items-center justify-between
          w-full h-10 px-2
          rounded-t-sm
          border-b border-green-600
          ${isOpen ? "bg-green-100" : "bg-transparent"}
        `}
      >
        <span
          className={`
            text-base leading-6 tracking-tight
            ${
              isOpen
                ? "text-green-900 font-medium"
                : "text-system-black font-light"
            }
          `}
        >
          {title}
        </span>

        <img
          src={ArrowDown}
          alt="arrow"
          className={`
            w-4 h-4 transition-transform duration-200
            ${isOpen ? "rotate-180" : "rotate-0"}
          `}
        />
      </button>

      {/* SUB MENU */}
      {isOpen && <div className="w-[277px] mt-2">{children}</div>}
    </div>
  );
}
