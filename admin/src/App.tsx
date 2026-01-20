import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import JobLayout from "./layouts/JobLayout";

import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import ProtectedRoute from "./routes/ProtectedRoute";

import HomeMonitor from "./pages/monitor/HomeMonitor";
import AlarmMonitor from "./pages/monitor/AlarmMonitor";

import HomeCleaning from "./pages/cleaning/HomeCleaning";
import NewCleaningStep1 from "./pages/cleaning/NewCleaningStep1";
import NewCleaningStep2 from "./pages/cleaning/NewCleaningStep2";
import NewCleaningStep3_01 from "./pages/cleaning/NewCleaningStep3_01";
import NewCleaningStep3_02 from "./pages/cleaning/NewCleaningStep3_02";
import NewCleaningStep4 from "./pages/cleaning/NewCleaningStep4";
import NewCleaningStep5 from "./pages/cleaning/NewCleaningStep5";

import HomeInspection from "./pages/inspection/HomeInspection";
import NewInspectionStep1 from "./pages/inspection/NewInspectionStep1";
import NewInspectionStep2 from "./pages/inspection/NewInspectionStep2";
import NewInspectionStep3 from "./pages/inspection/NewInspectionStep3";

import HomeService from "./pages/service/HomeService";
import NewServiceStep1 from "./pages/service/NewServiceStep1";
import NewServiceStep2 from "./pages/service/NewServiceStep2";
import NewServiceStep3 from "./pages/service/NewServiceStep3";
import NewServiceStep4 from "./pages/service/NewServiceStep4";
import NewServiceStep5 from "./pages/service/NewServiceStep5";

import HomeClientData from "./pages/clientdata/HomeClientData";
import ClientDataDetail from "./pages/clientdata/ClientDataDetail";
import ProjectJobPage from "./pages/clientdata/ProjectJobPage";

function App() {
  return (
    <Routes>
      {/* ---------- Public ---------- */}
      <Route path="/login" element={<Login />} />

      {/* ---------- Protected ---------- */}
      <Route element={<ProtectedRoute />}>
        {/* ---------- Main Layout ---------- */}
        <Route element={<MainLayout />}>
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
              <Route path="step3_01" element={<NewCleaningStep3_01 />} />
              <Route path="step3_02" element={<NewCleaningStep3_02 />} />
              <Route path="step4" element={<NewCleaningStep4 />} />
              <Route path="step5" element={<NewCleaningStep5 />} />
            </Route>
          </Route>

          {/* Inspection */}
          <Route path="/inspection">
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeInspection />} />
            <Route path="new">
              <Route path="step1" element={<NewInspectionStep1 />} />
              <Route path="step2" element={<NewInspectionStep2 />} />
              <Route path="step3" element={<NewInspectionStep3 />} />
            </Route>
          </Route>

          {/* Service */}
          <Route path="/service">
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomeService />} />
            <Route path="new">
              <Route path="step1" element={<NewServiceStep1 />} />
              <Route path="step2" element={<NewServiceStep2 />} />
              <Route path="step3" element={<NewServiceStep3 />} />
              <Route path="step4" element={<NewServiceStep4 />} />
              <Route path="step5" element={<NewServiceStep5 />} />
            </Route>
          </Route>

          {/* Client Data */}
          <Route path="/client-data" element={<HomeClientData />} />
          <Route path="/project/:id" element={<ClientDataDetail />} />
        </Route>

        {/* ---------- Job Layout (อยู่นอก MainLayout) ---------- */}
        <Route path="/project/:projectId/:job" element={<JobLayout />}>
          <Route index element={<ProjectJobPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
