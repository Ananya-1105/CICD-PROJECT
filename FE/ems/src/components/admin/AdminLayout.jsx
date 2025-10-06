import React from "react";
import AdminNavbar from "./AdminNavbar"; // same folder

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <div className="admin-content">
        {children}
      </div>
    </>
  );
}
