import React from "react";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import ProjectHomePage from "./components/ProjectHome/ProjectHomePage";
import LandingPage from "./components/ProjectHome/LandingPage";
import LoginPage from "./components/ProjectHome/LoginPage";
import RegisterPage from "./components/ProjectHome/RegisterPage";
import ManageHr from "./components/admin/ManageHr";
// Protected route wrapper
import ProtectedRoute from "./components/ProjectHome/ProtectedRoute";

// Admin layouts and pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageEmployees from './components/admin/ManageEmployees';
import AdminProfile from './components/admin/AdminProfile'; // <-- new
import EmployeeDashboard from './components/employee/EmployeeDashboard';
// HR and Employee pages

import HrDashboard from "./components/hr/HRDashboard";

export default function AppRoutes() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path='/' element={<ProjectHomePage />} />
          <Route path='/h1' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>

            {/* Admin pages with AdminLayout */}
            <Route path='/admin' element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            } />
            <Route path='/admin/manageemployees' element={
              
                <ManageEmployees />
              
            } />
            <Route path='/admin/managehr' element={
              
                <ManageHr />
             
            } />

            <Route path='/admin/profile' element={
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            } /> {/* <-- added */}

            {/* HR and Employee dashboards */}
            <Route path='/hr' element={<HrDashboard />} />
            <Route path='/employee' element={<EmployeeDashboard />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
