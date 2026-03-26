import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";


export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-[60px] pt-[63px]">
        <Outlet />
      </main>
    </div>
  );
}