import { NavLink } from "react-router-dom";

interface SidebarSubItemProps {
  label: string;
  to: string;
}

export default function SidebarSubItem({ label, to }: SidebarSubItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        flex items-center
        h-10 w-[277px] 
        px-2
        rounded-t-sm
        ${isActive ? "bg-green-100 text-green-900 font-medium" : "text-system-black font-light"}
        hover:bg-green-100
      `
      }
    >
      {label}
    </NavLink>
  );
}
