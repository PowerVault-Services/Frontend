import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
