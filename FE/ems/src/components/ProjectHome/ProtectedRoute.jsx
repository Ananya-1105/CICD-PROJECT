import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = localStorage.getItem("token");

  if (!token || !userData) {
    // If no token → send to login
    return <Navigate to="/login" replace />;
  }

  const role = userData.role;

  // Role-based access control
  const path = window.location.pathname;

  if (path.startsWith("/admin") && role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }
  if (path.startsWith("/hr") && role !== "HR") {
    return <Navigate to="/login" replace />;
  }
  if (path.startsWith("/employee") && role !== "EMPLOYEE") {
    return <Navigate to="/login" replace />;
  }

  // If role matches → render child routes
  return <Outlet />;
}
