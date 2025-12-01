import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import SidebarSubItem from "./SidebarSubItem";
import logo from "../assets/sidebar/logo.jpg";
import menuIcon from "../assets/icons/Hamburger Menu.svg";
import logoutIcon from "../assets/icons/Logout.svg";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const [activeGroup, setActiveGroup] =
    useState<"monitor" | "stock" | null>("monitor");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <>
      {/* overlay ดรอปสีทั้งหน้าจอ ตอนที่เมนูเปิด */}
      {open && (
        <div className="fixed inset-0 bg-black/25 z-10" />
      )}

      {/* 🔹 Panel sidebar เลื่อนเข้า–ออกจอ */}
      <div
        className={`
          fixed left-0 top-0
          h-screen
          z-20
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-[300px]"}
        `}
      >
        <aside
          className="
            h-screen w-[300px]
            flex flex-col
            py-8 px-2.5
            overflow-hidden
            shrink-0 bg-white
          "
        >
          {/* -------- ส่วนบน : โลโก้ + เมนู -------- */}
          <div className="flex flex-col w-full">
            <div className="w-full h-auto">
              <img src={logo} alt="Logo" className="w-[277px] max-w-[277px]" />
            </div>

            <div className="mt-4 flex flex-col w-full">
              <SidebarItem
                title="Monitor"
                isOpen={activeGroup === "monitor"}
                onToggle={() =>
                  setActiveGroup((prev) =>
                    prev === "monitor" ? null : "monitor"
                  )
                }
              >
                <SidebarSubItem label="Home" to="/monitor/home" />
                <SidebarSubItem label="Alarm" to="/monitor/alarm" />
                <SidebarSubItem label="%PR" to="/monitor/pr" />
                <SidebarSubItem label="Report" to="/monitor/report" />
              </SidebarItem>

              <NavLink
                to="/cleaning"
                className={({ isActive }) =>
                  [
                    "flex items-center",
                    "w-[277px] max-w-[277px] h-10 px-2",
                    "border-b border-green-600",
                    "text-base leading-6 tracking-tight",
                    isActive
                      ? "text-green-900 font-medium bg-green-100 rounded-t-sm"
                      : "text-black font-light",
                  ].join(" ")
                }
              >
                Cleaning
              </NavLink>

              <NavLink
                to="/inspection"
                className={({ isActive }) =>
                  [
                    "flex items-center",
                    "w-[277px] max-w-[277px] h-10 px-2",
                    "border-b border-green-600",
                    "text-base leading-6 tracking-tight",
                    isActive
                      ? "text-green-900 font-semibold bg-green-100 rounded-t-sm"
                      : "text-black font-light",
                  ].join(" ")
                }
              >
                Inspection
              </NavLink>

              <NavLink
                to="/service"
                className={({ isActive }) =>
                  [
                    "flex items-center",
                    "w-[277px] max-w-[277px] h-10 px-2",
                    "border-b border-green-600",
                    "text-base leading-6 tracking-tight",
                    isActive
                      ? "text-green-900 font-medium bg-green-100 rounded-t-sm"
                      : "text-black font-light",
                  ].join(" ")
                }
              >
                Service
              </NavLink>

              <NavLink
                to="/client-data"
                className={({ isActive }) =>
                  [
                    "flex items-center",
                    "w-[277px] max-w-[277px] h-10 px-2",
                    "border-b border-green-600",
                    "text-base leading-6 tracking-tight",
                    isActive
                      ? "text-green-900 font-medium bg-green-100 rounded-t-sm"
                      : "text-black font-light",
                  ].join(" ")
                }
              >
                Client Data
              </NavLink>

              <SidebarItem
                title="Stock Devices"
                isOpen={activeGroup === "stock"}
                onToggle={() =>
                  setActiveGroup((prev) => (prev === "stock" ? null : "stock"))
                }
              >
                <SidebarSubItem label="Stock All" to="/stock/all" />
                <SidebarSubItem label="Stock รับเข้า" to="/stock/in" />
                <SidebarSubItem label="Stock จ่ายออก" to="/stock/out" />
              </SidebarItem>
            </div>
          </div>

          {/* -------- ส่วนล่าง : Username + Logout -------- */}
          <div className="mt-auto w-full px-2 flex justify-between items-center">
            <span className="text-black text-base leading-6 tracking-tight font-light">
              Username
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1 hover:opacity-80 transition"
            >
              <img
                src={logoutIcon}
                alt="logouticon"
                className="w-6 h-6 object-contain"
              />
            </button>
          </div>
        </aside>
      </div>

      {/* 🔹 ปุ่ม Toggle แยกออกมา และขยับซ้าย/ขวาตาม open */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`
          sidebar-toggle
          fixed
          top-1/2 -translate-y-1/2
          z-30
          h-[125px] w-9
          bg-green-700 text-white
          flex flex-col items-center justify-between
          py-[35px] px-1.5
          rounded-tr-2xl rounded-br-2xl
          shadow-md
          gap-1
          transition-all duration-300
          ${open ? "left-[300px]" : "left-0"}
        `}
      >
        <span className="text-[16px] font-semibold [writing-mode:vertical-rl] rotate-180 tracking-[1%]">
          เมนู
        </span>
        <div className="flex">
          <img src={menuIcon} alt="menuIcon" className="w-6 h-6" />
        </div>
      </button>
    </>
  );
}
