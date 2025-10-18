import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CheckIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  BriefcaseIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const HrDashboard = () => {
  const [selectedPanel, setSelectedPanel] = useState(null); // "attendance", "leaves", "recruitment"
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8080/api/hrs";
  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // ensures JSON body
    },
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, leaveRes, attRes, appRes] = await Promise.all([
        axios.get(`${BASE_URL}/employees`, axiosConfig),
        axios.get(`${BASE_URL}/leaves`, axiosConfig),
        axios.get(`${BASE_URL}/attendance`, axiosConfig),
        axios.get(`${BASE_URL}/recruitments`, axiosConfig),
      ]);
      setEmployees(empRes.data || []);
      setLeaves(leaveRes.data || []);
      setAttendance(attRes.data || []);
      setApplicants(appRes.data || []);
    } catch (err) {
      console.error("Error loading HR dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveStatus = async (id, status) => {
    try {
      await axios.put(
        `${BASE_URL}/leaves/${id}/status`,
        { status },
        axiosConfig
      );
      setLeaves(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
    } catch (err) {
      console.error("Error updating leave status:", err);
      alert("Failed to update leave status");
    }
  };

  const handleMarkAttendance = async (empId, present) => {
    try {
      await axios.post(
        `${BASE_URL}/attendance/${empId}`,
        { present },
        axiosConfig
      );
      fetchData();
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance");
    }
  };

  const handleApplicantStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/recruitments/${id}/status`,
        { status: newStatus },
        axiosConfig
      );
      setApplicants(prev =>
        prev.map(a => (a.id === id ? { ...a, status: response.data.status } : a))
      );
      alert(`Applicant status updated to ${newStatus}!`);
    } catch (err) {
      console.error("Error updating applicant status:", err);
      alert("Failed to update applicant status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  // Attendance grouping
  const attendanceByDate = Array.from(
    attendance
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .reduce((map, record) => {
        const dateKey = new Date(record.date).toLocaleDateString();
        if (!map.has(dateKey)) map.set(dateKey, []);
        map.get(dateKey).push(record);
        return map;
      }, new Map())
  );

  const today = new Date().toDateString();

  // Applicants grouped by job
  const applicantsByJob = applicants.reduce((acc, app) => {
    const job = app.jobTitle || "General Applicants";
    if (!acc[job]) acc[job] = [];
    acc[job].push(app);
    return acc;
  }, {});

  // All possible applicant statuses
  const applicantStatuses = ["APPROVED", "ON_HOLD", "REJECTED", "REVIEWED"];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          HR Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* Panel cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          className={`p-4 rounded-2xl shadow cursor-pointer ${
            selectedPanel === "attendance"
              ? "bg-blue-200"
              : "bg-white dark:bg-gray-800"
          }`}
          onClick={() => setSelectedPanel("attendance")}
        >
          <h2 className="text-gray-500 dark:text-gray-300">Attendance</h2>
          <p className="text-2xl font-bold text-blue-600">{attendance.length}</p>
        </div>

        <div
          className={`p-4 rounded-2xl shadow cursor-pointer ${
            selectedPanel === "leaves"
              ? "bg-yellow-200"
              : "bg-white dark:bg-gray-800"
          }`}
          onClick={() => setSelectedPanel("leaves")}
        >
          <h2 className="text-gray-500 dark:text-gray-300">Leave Requests</h2>
          <p className="text-2xl font-bold text-yellow-500">{leaves.length}</p>
        </div>

        <div
          className={`p-4 rounded-2xl shadow cursor-pointer ${
            selectedPanel === "recruitment"
              ? "bg-green-200"
              : "bg-white dark:bg-gray-800"
          }`}
          onClick={() => setSelectedPanel("recruitment")}
        >
          <h2 className="text-gray-500 dark:text-gray-300">Recruitment</h2>
          <p className="text-2xl font-bold text-green-500">{applicants.length}</p>
        </div>
      </div>

      {/* Attendance panel */}
      {selectedPanel === "attendance" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Attendance Records
          </h2>
          {attendanceByDate.map(([date, records]) => (
            <div key={date} className="mb-6">
              <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{date}</h3>
              <table className="w-full text-left border-collapse mb-2">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <th className="p-2">Employee</th>
                    <th className="p-2">Present</th>
                    <th className="p-2 text-center">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(att => (
                    <tr key={att.id} className="border-t border-gray-300 dark:border-gray-700">
                      <td className="p-2">{att.employee?.firstName} {att.employee?.lastName}</td>
                      <td className="p-2">{att.present ? "Present" : "Absent"}</td>
                      <td className="p-2 text-center">
                        {new Date(att.date).toDateString() === today ? (
                          <span className="text-gray-500 font-semibold">Marked</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Leaves panel */}
      {selectedPanel === "leaves" && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Leave Requests
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <th className="p-2">Employee</th>
                <th className="p-2">Reason</th>
                <th className="p-2">Status</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(l => (
                <tr key={l.id} className="border-t border-gray-300 dark:border-gray-700">
                  <td className="p-2">{l.employee?.firstName} {l.employee?.lastName}</td>
                  <td className="p-2">{l.reason}</td>
                  <td className="p-2">{l.status}</td>
                  <td className="p-2 flex gap-2 justify-center">
                    {!l.status || l.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleLeaveStatus(l.id, "APPROVED")}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleLeaveStatus(l.id, "REJECTED")}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 font-semibold">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recruitment panel */}
      {selectedPanel === "recruitment" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-green-500" />
            Recruitment Management
          </h2>

          {Object.entries(applicantsByJob).map(([jobTitle, jobApplicants]) => (
            <div key={jobTitle} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <UserPlusIcon className="h-5 w-5 text-green-500" />
                {jobTitle}
              </h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Experience</th>
                    <th className="p-2">Resume</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobApplicants.length > 0 ? (
                    jobApplicants.map(a => (
                      <tr key={a.id} className="border-t border-gray-300 dark:border-gray-700">
                        <td className="p-2">{a.firstName} {a.lastName}</td>
                        <td className="p-2">{a.email}</td>
                        <td className="p-2">{a.experience || "N/A"}</td>
                        <td className="p-2">
                          {a.resumeUrl ? (
                            <a
                              href={a.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              View PDF
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="p-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              a.status === "APPROVED"
                                ? "bg-green-500 text-white"
                                : a.status === "REJECTED"
                                ? "bg-red-500 text-white"
                                : a.status === "ON_HOLD"
                                ? "bg-yellow-500 text-white"
                                : a.status === "REVIEWED"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-400 text-white"
                            }`}
                          >
                            {a.status || "PENDING"}
                          </span>
                        </td>
                        <td className="p-2 flex gap-2 justify-center flex-wrap">
                          {applicantStatuses.map(statusOption => (
                            a.status !== statusOption && (
                              <button
                                key={statusOption}
                                onClick={() => handleApplicantStatus(a.id, statusOption)}
                                className={`p-2 rounded-lg text-white text-sm ${
                                  statusOption === "APPROVED"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : statusOption === "REJECTED"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : statusOption === "ON_HOLD"
                                    ? "bg-yellow-500 hover:bg-yellow-600"
                                    : "bg-blue-500 hover:bg-blue-600"
                                }`}
                              >
                                {statusOption}
                              </button>
                            )
                          ))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-gray-500 p-3">
                        No applicants for this role.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HrDashboard;
