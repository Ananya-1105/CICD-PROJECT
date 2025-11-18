import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

const HrDashboard = () => {
  const navigate = useNavigate();

  // UI state
  const [selectedPanel, setSelectedPanel] = useState("attendance");

  // HR data state
  const [employees, setEmployees] = useState([]); // used for marking attendance
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Recruitment (uses endpoints from code 2, without token)
  const [recruitments, setRecruitments] = useState([]);

  // Loading state (optional)
  const [loading, setLoading] = useState(false);

  // Config for /api/hrs calls (token-based as in code 1)
  const BASE_HR = "http://98.94.241.163:8080/api/hrs";
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ---------------- FETCHERS ----------------
  // We follow code-2 pattern: fetch when panel changes.
  useEffect(() => {
    if (selectedPanel === "attendance") {
      fetchEmployees();
      fetchAttendance();
    } else if (selectedPanel === "leaves") {
      fetchLeaves();
    } else if (selectedPanel === "recruitments") {
      fetchRecruitments(); // uses endpoints from code2
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPanel]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_HR}/employees`, axiosConfig);
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_HR}/attendance`, axiosConfig);
      setAttendance(res.data || []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_HR}/leaves`, axiosConfig);
      setLeaves(res.data || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
    }
  };

  // recruitments use same endpoints & approach as code 2 (no token)
  const fetchRecruitments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://98.94.241.163:8080/api/candidates");
      setRecruitments(res.data || []);
    } catch (err) {
      console.error("Error fetching recruitments:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LEAVE ACTION (from code 1) ----------------
  const handleLeaveDecision = async (id, status) => {
    try {
      await axios.put(
        `${BASE_HR}/leaves/${id}/status?status=${status}`,
        null,
        axiosConfig
      );
      setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      // Optional: show a small confirmation (keeps behaviour similar to code1)
      alert(`Leave ${status} successfully!`);
    } catch (err) {
      console.error("Error updating leave status:", err);
      alert("Failed to update leave status.");
    }
  };

  // ---------------- ATTENDANCE ACTION (from code 1) ----------------
  const handleMarkAttendance = async (empId, present) => {
    try {
      await axios.post(
        `${BASE_HR}/attendance/${empId}?present=${present}`,
        null,
        axiosConfig
      );
      // refresh attendance after marking
      await fetchAttendance();
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance.");
    }
  };

  const isAttendanceMarked = (empId) =>
    attendance.some(
      (a) =>
        a.employee?.id === empId &&
        new Date(a.date).toDateString() === new Date().toDateString()
    );

  // ---------------- RECRUITMENT ACTIONS (from code 2) ----------------
  const handleDecision = async (id, status) => {
    try {
      await axios.patch(
        `http://98.94.241.163:8080/api/candidates/${id}?status=${status}`
      );
      setRecruitments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      alert(`Candidate ${status} successfully!`);
    } catch (err) {
      console.error("Error updating candidate status:", err);
      alert("Failed to update candidate status.");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all candidates?")) return;
    try {
      await axios.delete("http://98.94.241.163:8080/api/candidates/clear");
      setRecruitments([]);
    } catch (err) {
      console.error("Error clearing candidates:", err);
      alert("Failed to clear candidates.");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    // follow code2 behavior: clear storages and navigate
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center bg-indigo-600 text-white px-6 py-4">
          <h1 className="text-2xl font-semibold">HR Dashboard</h1>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-around bg-gray-200 dark:bg-gray-700 p-4">
          <button
            onClick={() => setSelectedPanel("attendance")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedPanel === "attendance"
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setSelectedPanel("leaves")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedPanel === "leaves"
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            Leave Requests
          </button>
          <button
            onClick={() => setSelectedPanel("recruitments")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedPanel === "recruitments"
                ? "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            Recruitments
          </button>
        </div>

        <div className="p-6">
          {/* ---------------- Attendance Panel ---------------- */}
          {selectedPanel === "attendance" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Employee Attendance
              </h2>

              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : employees.length === 0 ? (
                <p className="text-gray-500 text-sm">No employees found.</p>
              ) : (
                <table className="min-w-full text-left text-gray-800 dark:text-gray-200 border">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Department</th>
                      <th className="p-2 border">Position</th>
                      <th className="p-2 border text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((e) => (
                      <tr key={e.id}>
                        <td className="p-2 border">
                          {e.firstName} {e.lastName}
                        </td>
                        <td className="p-2 border text-center">{e.departmentName}</td>
                        <td className="p-2 border text-center">{e.position}</td>
                        <td className="p-2 border text-center">
                          {!isAttendanceMarked(e.id) ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleMarkAttendance(e.id, true)}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleMarkAttendance(e.id, false)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Absent
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 font-semibold">Marked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ---------------- Leave Requests Panel ---------------- */}
          {selectedPanel === "leaves" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Leave Requests
              </h2>

              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : leaves.length === 0 ? (
                <p className="text-gray-500 text-sm">No leave requests found.</p>
              ) : (
                leaves.map((l) => (
                  <div
                    key={l.id}
                    className="bg-gray-50 dark:bg-gray-900 border rounded-xl p-4 mb-4 flex justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {l.employee?.firstName
                          ? `${l.employee?.firstName} ${l.employee?.lastName || ""}`
                          : l.employee?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {l.startDate} → {l.endDate}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{l.reason}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-bold ${
                          l.status === "APPROVED"
                            ? "text-green-600"
                            : l.status === "REJECTED"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {l.status || "PENDING"}
                      </span>

                      {(!l.status || l.status === "PENDING") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLeaveDecision(l.id, "APPROVED")}
                            className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600"
                          >
                            <CheckIcon className="w-4 h-4" /> Approve
                          </button>
                          <button
                            onClick={() => handleLeaveDecision(l.id, "REJECTED")}
                            className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ---------------- Recruitment Panel ---------------- */}
          {selectedPanel === "recruitments" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Recruitments
                </h2>
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Clear All
                </button>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : recruitments.length === 0 ? (
                <p className="text-gray-500 text-sm">No candidates available.</p>
              ) : (
                recruitments.map((c) => (
                  <div
                    key={c.id}
                    className="bg-gray-50 dark:bg-gray-900 border p-4 rounded-xl mb-4 flex justify-between"
                  >
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {c.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">{c.email}</p>
                      {c.resumePath && (
                        <a
                          href={`http://34.204.199.101:8080/files/${c.resumePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Resume
                        </a>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`text-sm font-semibold ${
                          c.status === "Accepted"
                            ? "text-green-600"
                            : c.status === "Rejected"
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {c.status || "Pending"}
                      </span>

                      <div className="flex gap-2 mt-2">
                        {!c.status || c.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleDecision(c.id, "Accepted")}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleDecision(c.id, "Rejected")}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-500 font-semibold">Decision Sent</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
