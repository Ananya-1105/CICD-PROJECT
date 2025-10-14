// AdminProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import {
  FaUserCircle,
  FaBriefcase,
  FaAward,
  FaCheckCircle,
  FaCog,
  FaEdit,
} from "react-icons/fa";

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get("/api/admins/me");
        setAdmin(response.data);
        setEditData(response.data);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };
    fetchAdmin();
  }, []);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put("/api/admins/update", editData);
      setAdmin(response.data);
      setEditModalOpen(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating admin:", error);
      alert("Failed to update profile.");
    }
  };

  if (!admin) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
        }`}
      >
        Loading admin details...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      } transition-colors duration-500`}
    >
      <AdminNavbar darkMode={darkMode} toggleTheme={toggleTheme} />

      <main className="flex-1 px-6 py-24 max-w-4xl mx-auto w-full">
        <div
          className={`p-6 ${
            darkMode
              ? "bg-white/10 border border-white/20"
              : "bg-white border border-gray-200"
          } rounded-xl shadow-lg flex flex-col gap-6`}
        >
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FaUserCircle className="h-8 w-8 text-purple-400" /> Admin Profile
          </h2>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Full Name:</span> {admin.firstName}{" "}
              {admin.lastName}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {admin.email}
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{" "}
              {admin.phone || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Position:</span>{" "}
              {admin.position || "Administrator"}
            </div>
          </div>

          {/* Work & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <FaBriefcase className="h-6 w-6 text-yellow-400" />
              <span>
                <strong>Work Experience:</strong>{" "}
                {admin.workExperience || "N/A"} years
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaAward className="h-6 w-6 text-green-400" />
              <span>
                <strong>Badges Earned:</strong> {admin.badges || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="h-6 w-6 text-blue-400" />
              <span>
                <strong>Tasks Completed:</strong> {admin.tasksCompleted || 0}
              </span>
            </div>
          </div>

          {admin.department && (
            <div className="mt-4">
              <span className="font-semibold">Department:</span>{" "}
              {admin.department.name}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <FaCog /> Settings
            </button>
          </div>
        </div>
      </main>

      {/* ===== Edit Profile Modal ===== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="firstName"
                value={editData.firstName || ""}
                onChange={handleEditChange}
                placeholder="First Name"
                className="p-2 rounded border border-gray-400 bg-transparent"
              />
              <input
                type="text"
                name="lastName"
                value={editData.lastName || ""}
                onChange={handleEditChange}
                placeholder="Last Name"
                className="p-2 rounded border border-gray-400 bg-transparent"
              />
              <input
                type="text"
                name="phone"
                value={editData.phone || ""}
                onChange={handleEditChange}
                placeholder="Phone"
                className="p-2 rounded border border-gray-400 bg-transparent"
              />
              <input
                type="text"
                name="position"
                value={editData.position || ""}
                onChange={handleEditChange}
                placeholder="Position"
                className="p-2 rounded border border-gray-400 bg-transparent"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Settings Modal ===== */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-96 ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h3 className="text-xl font-semibold mb-4">Settings</h3>

            <div className="flex flex-col gap-4">
              <label className="flex items-center justify-between">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={toggleTheme}
                  className="h-5 w-5"
                />
              </label>

              <label className="flex items-center justify-between">
                <span>Notifications</span>
                <input type="checkbox" className="h-5 w-5" />
              </label>

              <label className="flex items-center justify-between">
                <span>Language</span>
                <select
                  className={`rounded p-1 ${
                    darkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Japanese</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
