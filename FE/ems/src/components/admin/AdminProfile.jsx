// AdminProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import { FaUserCircle, FaBriefcase, FaAward, FaCheckCircle } from "react-icons/fa";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    // Fetch the logged-in admin details
    const fetchAdmin = async () => {
      try {
        // Assuming backend can identify admin from JWT
        const response = await axios.get("/api/admins/me"); 
        setAdmin(response.data);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdmin();
  }, []);

  if (!admin) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"}`}>
        Loading admin details...
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"} transition-colors duration-500`}>
      <AdminNavbar darkMode={darkMode} toggleTheme={toggleTheme} />

      <main className="flex-1 px-6 py-24 max-w-4xl mx-auto w-full">
        <div className={`p-6 ${darkMode ? "bg-white/10 border border-white/20" : "bg-white border border-gray-200"} rounded-xl shadow-lg flex flex-col gap-6`}>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaUserCircle className="h-8 w-8 text-purple-400" /> Admin Profile
          </h2>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Full Name:</span> {admin.firstName} {admin.lastName}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {admin.email}
            </div>
            <div>
              <span className="font-semibold">Phone:</span> {admin.phone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Position:</span> {admin.position || "Administrator"}
            </div>
          </div>

          {/* Work & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <FaBriefcase className="h-6 w-6 text-yellow-400" />
              <span><strong>Work Experience:</strong> {admin.workExperience || "N/A"} years</span>
            </div>
            <div className="flex items-center gap-2">
              <FaAward className="h-6 w-6 text-green-400" />
              <span><strong>Badges Earned:</strong> {admin.badges || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="h-6 w-6 text-blue-400" />
              <span><strong>Tasks Completed:</strong> {admin.tasksCompleted || 0}</span>
            </div>
          </div>

          {/* Additional info */}
          {admin.department && (
            <div className="mt-4">
              <span className="font-semibold">Department:</span> {admin.department.name}
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => alert("Edit functionality coming soon!")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => alert("Settings functionality coming soon!")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Settings
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
