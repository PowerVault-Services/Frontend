import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./routes/ProtectedRoute";

// monitor pages
import HomeMonitor from "./pages/monitor/HomeMonitor";

function App() {
  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/login" element={<Login />} />

      {/* ---------- Protected ---------- */}
      <Route element={<ProtectedRoute />}>
        {/* Layout ครอบทุกหน้าที่ล็อกอินแล้ว */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Homepage />} />

          {/* Monitor */}
          <Route path="/monitor">
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeMonitor />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
