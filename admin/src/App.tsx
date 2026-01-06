import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomeMonitor from "./pages/monitor/HomeMonitor";
import AlarmMonitor from "./pages/monitor/AlarmMonitor";

import HomeCleaning from "./pages/cleaning/HomeCleaning";
import NewCleaningStep1 from "./pages/cleaning/NewCleaningStep1";
import NewCleaningStep2 from "./pages/cleaning/NewCleaningStep2";

function App() {
  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/login" element={<Login />} />

      {/* ---------- Protected ---------- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout children={undefined} />}>
          <Route path="/" element={<Homepage />} />

          {/* Monitor */}
          <Route path="/monitor">
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeMonitor />} />
            <Route path="alarm" element={<AlarmMonitor />} />
          </Route>

          {/* Cleaning */}
          <Route path="/cleaning">
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeCleaning />} />
            <Route path="new">
              <Route path="step1" element={<NewCleaningStep1 />} />
              <Route path="step2" element={<NewCleaningStep2 />} />
            </Route>
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}

export default App;
